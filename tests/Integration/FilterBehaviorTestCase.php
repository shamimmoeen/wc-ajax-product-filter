<?php
/**
 * Base test case for filter-behavior integration tests.
 *
 * The concrete tests assert what a configured filter PRODUCES (the filter-type
 * output), never the hook callbacks or `apply_filters('wcapf_*')` directly, so
 * they stay valid whether the limit/sort/hierarchy logic lives in the Hooks\*
 * consumers or is later moved into the filter-type classes.
 *
 * This base is the single place that names the not-yet-namespaced
 * \WCAPF_Filter_Type_* classes, so a future rename of those touches one file.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared fixtures and pipeline calls for filter-behavior tests.
 */
abstract class FilterBehaviorTestCase extends WP_UnitTestCase {

	/**
	 * Builds a configured field instance from a flat field-data array.
	 *
	 * @param array $config Field data (type, taxonomy, get_options, limit_options, include_terms, ...).
	 *
	 * @return \WCAPF\FormFilter
	 */
	protected function make_field( array $config ): \WCAPF\FormFilter {
		return new \WCAPF\FormFilter( $config );
	}

	/**
	 * Prepared items for a taxonomy field (also used for rating, which reuses the taxonomy type).
	 *
	 * @param \WCAPF\FormFilter $field The field instance.
	 *
	 * @return array
	 */
	protected function taxonomy_items( \WCAPF\FormFilter $field ): array {
		return ( new \WCAPF_Filter_Type_Taxonomy( $field ) )->get_items();
	}

	/**
	 * Prepared items for a post-author field.
	 *
	 * @param \WCAPF\FormFilter $field The field instance.
	 *
	 * @return array
	 */
	protected function post_author_items( \WCAPF\FormFilter $field ): array {
		return ( new \WCAPF_Filter_Type_Post_Author( $field ) )->get_items();
	}

	/**
	 * Creates a published product.
	 *
	 * @param array $args Optional post-array overrides (e.g. post_author).
	 *
	 * @return int Product ID.
	 */
	protected function make_product( array $args = array() ): int {
		return $this->factory()->post->create(
			array_merge(
				array(
					'post_type'   => 'product',
					'post_status' => 'publish',
					'post_title'  => 'Product',
				),
				$args
			)
		);
	}

	/**
	 * Creates a published WooCommerce simple product (price/sale/featured/category),
	 * so the product lookup table and visibility terms are populated.
	 *
	 * @param array $args Optional: name, regular_price, sale_price, featured, category_ids.
	 *
	 * @return int Product ID.
	 */
	protected function make_wc_product( array $args = array() ): int {
		$product = new \WC_Product_Simple();
		$product->set_name( isset( $args['name'] ) ? $args['name'] : 'Product' );
		$product->set_status( 'publish' );

		if ( isset( $args['regular_price'] ) ) {
			$product->set_regular_price( (string) $args['regular_price'] );
		}

		if ( isset( $args['sale_price'] ) ) {
			$product->set_sale_price( (string) $args['sale_price'] );
		}

		if ( ! empty( $args['featured'] ) ) {
			$product->set_featured( true );
		}

		if ( ! empty( $args['category_ids'] ) ) {
			$product->set_category_ids( $args['category_ids'] );
		}

		return $product->save();
	}

	/**
	 * Creates the single published wcapf-form (with child wcapf-filter posts) the
	 * way the plugin stores them, so the engine picks it up as the relevant form.
	 *
	 * Each $filters entry: array( 'key' => ..., 'type' => ..., 'field' => array(...), 'title' => ... ).
	 *
	 * @param array $filters Filter specs.
	 *
	 * @return int Form ID.
	 */
	protected function make_form( array $filters ): int {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
				'post_title'  => 'Test Form',
			)
		);
		$this->store_serialized_content( $form_id, array() );

		$menu_order = 0;

		foreach ( $filters as $filter ) {
			$field              = isset( $filter['field'] ) ? $filter['field'] : array();
			$field['type']      = $filter['type'];
			$field['field_key'] = $filter['key'];

			$filter_id = $this->factory()->post->create(
				array(
					'post_type'    => 'wcapf-filter',
					'post_status'  => 'publish',
					'post_parent'  => $form_id,
					'post_title'   => isset( $filter['title'] ) ? $filter['title'] : 'Filter',
					'post_name'    => $filter['key'],
					'post_excerpt' => $filter['type'],
					'menu_order'   => $menu_order++,
				)
			);
			$this->store_serialized_content( $filter_id, $field );
		}

		return $form_id;
	}

	/**
	 * Writes serialized data straight to post_content, bypassing the kses content
	 * filters that would corrupt serialized strings. Matches the stored row shape.
	 *
	 * @param int   $post_id Post ID.
	 * @param array $data    Data to serialize.
	 *
	 * @return void
	 */
	private function store_serialized_content( int $post_id, array $data ): void {
		global $wpdb;

		$wpdb->update( $wpdb->posts, array( 'post_content' => maybe_serialize( $data ) ), array( 'ID' => $post_id ) );
		clean_post_cache( $post_id );
	}

	/**
	 * Simulates a shopper's filter selection in the request (query string + $_GET).
	 *
	 * @param array $params Filter key => raw URL value (e.g. "12,15").
	 *
	 * @return void
	 */
	protected function set_selection( array $params ): void {
		$_SERVER['QUERY_STRING'] = http_build_query( $params );
		$_GET                    = $params;
	}

	/**
	 * Runs the product query with the active filters applied and returns the
	 * matching product IDs.
	 *
	 * This is the single place that drives the result-set engine, so a future
	 * rename/rewrite of the engine touches one method.
	 *
	 * @return int[] Sorted, de-duplicated product IDs.
	 */
	protected function matching_product_ids(): array {
		$filter = new \WCAPF\ProductFilter();

		$GLOBALS['wcapf_chosen_filters'] = $filter->get_chosen_filters();

		$clauses = static function ( array $args ) use ( $filter ): array {
			$args['join']  .= $filter->get_full_join_clause();
			$args['where'] .= $filter->get_full_where_clause();

			return $args;
		};

		add_filter( 'posts_clauses', $clauses, 5 );

		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'no_found_rows'  => true,
		);

		// The keyword filter feeds the search term into the main query, not the
		// join/where clauses — mirror Shop::set_query so keyword tests work too.
		$keyword = wcapf()->active_filters->applied_keyword();

		if ( $keyword ) {
			$args['s'] = $keyword;
		}

		$query = new \WP_Query( $args );

		remove_filter( 'posts_clauses', $clauses, 5 );

		$ids = array_values( array_unique( array_map( 'intval', $query->posts ) ) );
		sort( $ids );

		return $ids;
	}

	/**
	 * Resets request state and the chosen-filters cache between tests.
	 */
	public function tear_down() {
		$_GET                    = array();
		$_SERVER['QUERY_STRING'] = '';

		unset( $GLOBALS['wcapf_chosen_filters'], $GLOBALS['wcapf'], $GLOBALS['wcapf_form'] );

		parent::tear_down();
	}
}
