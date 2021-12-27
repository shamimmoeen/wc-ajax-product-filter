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

		$search_results = $this->product_ids_for_keyword();
		$tax_results    = $this->filtered_product_ids_for_terms();

		// When both search and tax results found
		if ( count( $search_results ) > 0 && count( $tax_results ) > 0 ) {
			$post__in = array_intersect( $search_results, $tax_results );
		} elseif ( count( $search_results ) > 0 && count( $tax_results ) === 0 ) { // When only search results found
			$post__in = $search_results;
		} else {
			$post__in = $tax_results;
		}

		$query->set( 'meta_query', $this->build_meta_query() );
		$query->set( 'post__in', $post__in );

		return $query;
	}

	/**
	 * Retrieve Product ids for keyword.
	 *
	 * TODO: Move to pro version.
	 *
	 * @return array
	 */
	private function product_ids_for_keyword() {
		if ( isset( $_GET['keyword'] ) && ! empty( $_GET['keyword'] ) ) {
			$keyword = $_GET['keyword'];

			$args = array(
				's'           => $keyword,
				'post_type'   => 'product',
				'post_status' => 'publish',
				'numberposts' => -1,
				'fields'      => 'ids',
			);

			$results   = get_posts( $args );
			$results[] = 0;
		} else {
			$results = array();
		}

		return $results;
	}

	/**
	 * Filtered product ids for terms.
	 *
	 * @return array
	 */
	private function filtered_product_ids_for_terms() {
		$chosen_filters = $this->get_chosen_filters();
		$chosen_terms   = $chosen_filters['taxonomy'];
		$results        = array();

		// 99% copy of WC_Query
		if ( count( $chosen_terms ) > 0 ) {
			$matched_products = array(
				'and' => array(),
				'or'  => array(),
			);

			$filtered_attribute = array(
				'and' => false,
				'or'  => false,
			);

			foreach ( $chosen_terms as $attribute => $data ) {
				$matched_products_from_attribute = array();
				$filtered                        = false;

				if ( count( $data['terms'] ) > 0 ) {
					foreach ( $data['terms'] as $value ) {
						$posts = get_posts(
							array(
								'post_type'     => 'product',
								'numberposts'   => -1,
								'post_status'   => 'publish',
								'fields'        => 'ids',
								'no_found_rows' => true,
								'tax_query'     => array(
									array(
										'taxonomy' => $attribute,
										'terms'    => $value,
										'field'    => 'term_id',
									),
								),
							)
						);

						if ( ! is_wp_error( $posts ) ) {
							if ( count( $matched_products_from_attribute ) > 0 || $filtered ) {
								$matched_products_from_attribute = ( 'or' === $data['query_type'] )
									? array_merge( $posts, $matched_products_from_attribute )
									: array_intersect( $posts, $matched_products_from_attribute );
							} else {
								$matched_products_from_attribute = $posts;
							}

							$filtered = true;
						}
					}
				}

				if (
					count( $matched_products[ $data['query_type'] ] ) > 0
					|| true === $filtered_attribute[ $data['query_type'] ]
				) {
					$matched_products[ $data['query_type'] ] = ( 'or' === $data['query_type'] )
						? array_merge( $matched_products_from_attribute, $matched_products[ $data['query_type'] ] ) :
						array_intersect( $matched_products_from_attribute, $matched_products[ $data['query_type'] ] );
				} else {
					$matched_products[ $data['query_type'] ] = $matched_products_from_attribute;
				}

				$filtered_attribute[ $data['query_type'] ] = true;
			}

			// combine our 'AND' and 'OR' result sets
			if ( $filtered_attribute['and'] && $filtered_attribute['or'] ) {
				$results = array_intersect( $matched_products['and'], $matched_products['or'] );
			} else {
				$results = array_merge( $matched_products['and'], $matched_products['or'] );
			}

			$results[] = 0;
		}

		return $results;
	}

	/**
	 * Gets the chosen filters from url.
	 *
	 * @return array
	 */
	public function get_chosen_filters() {
		// parse url
		$url = $_SERVER['QUERY_STRING'];
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

		// min-price
		if ( isset( $_GET['min-price'] ) ) {
			$chosen['min_price'] = $_GET['min-price'];
		}

		// max-price
		if ( isset( $_GET['max-price'] ) ) {
			$chosen['max_price'] = $_GET['max-price'];
		}

		// taxonomies
		$taxonomy_filter_keys = WCAPF_Product_Filter_Utils::get_taxonomy_filter_keys();

		foreach ( $taxonomy_filter_keys as $taxonomy => $keys ) {
			$result = $this->get_chosen_term( $taxonomy, $keys, $query );

			if ( $result ) {
				$taxonomies[ $taxonomy ] = $result;
			}
		}

		// post metas
		$price_filter_keys = WCAPF_Product_Filter_Utils::get_price_filter_keys();

		foreach ( $price_filter_keys as $meta_key => $keys ) {
			$result = $this->get_chosen_post_meta( $keys, $query );

			if ( $result ) {
				$post_metas[ $meta_key ] = $result;
			}
		}

		// TODO: Rating, s.

		$chosen['taxonomy']  = $taxonomies;
		$chosen['post_meta'] = $post_metas;

		return apply_filters( 'wcapf_chosen_filters', $chosen );
	}

	/**
	 * Gets the chosen term.
	 *
	 * @param string $taxonomy The taxonomy.
	 * @param array  $keys     The filter keys.
	 * @param array  $query    The query.
	 *
	 * @return array
	 */
	private function get_chosen_term( $taxonomy, $keys, $query ) {
		$active_filters = array();

		$filter_values = $this->get_chosen_filter_values( $keys, $query );

		if ( ! $filter_values ) {
			return array();
		}

		list( $terms, $query_key, $query_type ) = $filter_values;

		foreach ( $terms as $term_id ) {
			$term_data = get_term( $term_id, $taxonomy );

			if ( $term_data ) {
				$active_filters['term'][ $query_key ][ $term_id ] = $term_data->name;
			}
		}

		return array(
			'terms'          => $terms,
			'query_type'     => $query_type,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Gets the chosen filter values.
	 *
	 * @param array $keys  The filter keys.
	 * @param array $query The url query.
	 *
	 * @return array
	 */
	private function get_chosen_filter_values( $keys, $query ) {
		$and_query_key   = $keys['and'];
		$or_query_key    = $keys['or'];
		$value_separator = ','; // TODO: Use a filter.

		$values     = '';
		$query_key  = '';
		$query_type = '';

		if ( isset( $query[ $and_query_key ] ) ) {
			$query_key  = $and_query_key;
			$values     = $query[ $and_query_key ];
			$query_type = 'and';
		} elseif ( isset( $query[ $or_query_key ] ) ) {
			$query_key  = $or_query_key;
			$values     = $query[ $or_query_key ];
			$query_type = 'or';
		}

		// Check if we have any string(including 0) in the url.
		if ( ! strlen( $values ) ) {
			return array();
		}

		$filter_values = explode( $value_separator, $values );

		return array( $filter_values, $query_key, $query_type );
	}

	/**
	 * Gets the chosen post meta.
	 *
	 * @param array $keys  The filter keys.
	 * @param array $query The query.
	 *
	 * @return array
	 */
	private function get_chosen_post_meta( $keys, $query ) {
		$active_filters = array();

		$filter_values = $this->get_chosen_filter_values( $keys, $query );

		if ( ! $filter_values ) {
			return array();
		}

		list( $meta_values, $query_key, $query_type ) = $filter_values;

		foreach ( $meta_values as $meta_value ) {
			$active_filters['post_meta'][ $query_key ][ $meta_value ] = $meta_value;
		}

		return array(
			'values'         => $meta_values,
			'query_type'     => $query_type,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Builds the meta query that should be set to the main query.
	 *
	 * @return array
	 */
	private function build_meta_query() {
		$chosen_filters = $this->get_chosen_filters();
		$chosen_metas   = $chosen_filters['post_meta'];
		$meta_query     = array();

		foreach ( $chosen_metas as $meta_key => $filter_data ) {
			$values = $filter_data['values'];

			$_meta_query['relation'] = $filter_data['query_type'];

			foreach ( $values as $value ) {
				$_meta_query[] = array(
					'key'   => $meta_key,
					'value' => $value,
				);
			}

			$meta_query[] = $_meta_query;
		}

		return $meta_query;
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Product_Filter', 'instance' ) );
