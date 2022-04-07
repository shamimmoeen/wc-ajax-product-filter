<?php
/**
 * The product filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

// phpcs:disable WordPress.Security.NonceVerification.Recommended

/**
 * WCAPF_Product_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Product_Filter {

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Product_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Product_Filter();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	public function init_hooks() {
		add_action( 'woocommerce_product_query', array( $this, 'set_filter' ) );
	}

	/**
	 * Query the products, applying sorting/ordering etc. This applies to the
	 * main WordPress loop.
	 *
	 * @param WP_Query $query Query instance.
	 *
	 * @return WP_Query Return modified query instance.
	 */
	public function set_filter( $query ) {
		/**
		 * Don't proceed if we are not in main query or this is not product archive page.
		 *
		 * TODO: Check it.
		 */
		if (
			! is_main_query()
			&& ! is_post_type_archive( 'product' )
			&& ! is_tax( get_object_taxonomies( 'product' ) )
		) {
			return $query;
		}

		$query->set( 'post__in', $this->get_filtered_product_ids() );

		return $query;
	}

	/**
	 * Gets the filtered product ids.
	 *
	 * @return array
	 */
	private function get_filtered_product_ids() {
		$main_query_type = $this->get_field_relations();

		$chosen_filters     = $this->get_chosen_filters();
		$products_in_fields = array();

		foreach ( $chosen_filters as $fields ) {
			foreach ( $fields as $field ) {
				$products_in_fields[] = $field['product_ids'];
			}
		}

		$filtered_product_ids = WCAPF_Product_Filter_Utils::combine_values( $main_query_type, $products_in_fields );

		return array_unique( $filtered_product_ids );
	}

	/**
	 * Gets the field relations.
	 *
	 * TODO: Get from settings.
	 *
	 * @return string
	 */
	public function get_field_relations() {
		return get_option( 'main_query_type', 'or' );
	}

	/**
	 * Gets the chosen filters from url.
	 *
	 * @return array
	 */
	public function get_chosen_filters() {
		// parse url
		$url = $_SERVER['QUERY_STRING'];
		$url = str_replace( '+', '%2B', $url ); // Preserve '+' to filter by ranges.
		parse_str( $url, $query );

		$chosen     = array();
		$taxonomies = array();
		$post_metas = array();

		// keyword
		if ( isset( $_GET['keyword'] ) ) {
			$keyword = ( ! empty( $_GET['keyword'] ) ) ? $_GET['keyword'] : '';

			$chosen['keyword'] = $keyword;
		}

		// orderby
		if ( isset( $_GET['orderby'] ) ) {
			$orderby = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : '';

			$chosen['orderby'] = $orderby;
		}

		// taxonomies
		$taxonomy_filter_keys = WCAPF_Product_Filter_Utils::get_taxonomy_filter_keys();

		foreach ( $taxonomy_filter_keys as $taxonomy => $keys ) {
			$result = $this->get_chosen_term( $taxonomy, $keys, $query );

			if ( $result ) {
				$taxonomies[ $result['filter_key'] ] = $result;
			}
		}

		// price
		$filter_by_price = $this->get_chosen_price( $query );

		if ( $filter_by_price ) {
			$post_metas['price'] = $filter_by_price;
		}

		// TODO: Rating.
		// TODO: Product Status.

		$chosen['taxonomy']  = $taxonomies;
		$chosen['post-meta'] = $post_metas;

		return apply_filters( 'wcapf_chosen_filters', $chosen, $query );
	}

	/**
	 * Filter data by taxonomy.
	 *
	 * @param string $taxonomy The taxonomy.
	 * @param array  $keys     The filter keys.
	 * @param array  $query    The query.
	 *
	 * @return array
	 */
	private function get_chosen_term( $taxonomy, $keys, $query ) {
		$active_filters    = array();
		$active_ancestors  = array();
		$products_in_terms = array();

		$filter_values = WCAPF_Product_Filter_Utils::get_chosen_filter_values( $keys, $query );

		if ( ! $filter_values ) {
			return array();
		}

		list( $terms, $filter_key, $query_type ) = $filter_values;

		$include_hierarchical_data = false;

		if ( is_taxonomy_hierarchical( $taxonomy ) ) {
			$include_hierarchical_data = true;
		}

		foreach ( $terms as $term_id ) {
			// TODO: Maybe use cache.
			$term_products = get_posts(
				array(
					'post_type'   => 'product',
					'post_status' => 'publish',
					'nopaging'    => true,
					'fields'      => 'ids',
					'tax_query'   => array(
						array(
							'taxonomy'         => $taxonomy,
							'field'            => 'id',
							'terms'            => $term_id,
							'include_children' => true,
						),
					),
				)
			);

			$term_products[] = 0;

			$products_in_terms[ $term_id ] = $term_products;

			// For hierarchical accordion.
			if ( $include_hierarchical_data ) {
				$ancestors        = get_ancestors( $term_id, $taxonomy );
				$active_ancestors = array_merge( $ancestors, $active_ancestors );
			}

			// TODO: Set the data for active filters.
		}

		$product_ids = WCAPF_Product_Filter_Utils::combine_values( $query_type, $products_in_terms );

		return array(
			'taxonomy'          => $taxonomy,
			'filter_key'        => $filter_key,
			'query_type'        => $query_type,
			'values'            => $terms,
			'product_ids'       => $product_ids,
			'products_in_terms' => $products_in_terms,
			'active_filters'    => $active_filters,
			'active_ancestors'  => $active_ancestors,
		);
	}

	/**
	 * Filter data by price.
	 *
	 * @param array $query The query.
	 *
	 * @return array
	 */
	private function get_chosen_price( $query ) {
		$active_filters = array();

		$meta_key      = '_price';
		$filter_key    = 'price';
		$filter_values = array();
		$query_type    = 'between';

		if ( isset( $query[ $filter_key ] ) ) {
			$_filter_values = $query[ $filter_key ];
			$filter_values  = explode( '+', $_filter_values );
		}

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		$min = floatval( $filter_values[0] );
		$max = floatval( $filter_values[1] );

		$type = apply_filters( 'wcapf_price_filter_data_type', 'DECIMAL(10,3)' );

		$args = array(
			'post_type'   => 'product',
			'post_status' => 'publish',
			'nopaging'    => true,
			'fields'      => 'ids',
			'meta_query'  => array(
				array(
					'key'     => $meta_key,
					'value'   => array( $min, $max ),
					'compare' => 'BETWEEN',
					'type'    => $type,
				),
			),
		);

		$ranged_products = get_posts( $args );

		$ranged_products[] = 0;
		$products_in_metas = $ranged_products;
		$product_ids       = $ranged_products;

		// TODO: Set the data for active filters.

		return array(
			'meta'              => $meta_key,
			'filter_key'        => $filter_key,
			'query_type'        => $query_type,
			'values'            => $filter_values,
			'product_ids'       => $product_ids,
			'products_in_metas' => $products_in_metas,
			'active_filters'    => $active_filters,
		);
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Product_Filter', 'instance' ) );
