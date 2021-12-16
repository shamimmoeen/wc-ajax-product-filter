<?php
/**
 * The product filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter {

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Filter();
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
		 */
		if ( ! is_main_query() && ! is_post_type_archive( 'product' ) && ! is_tax( get_object_taxonomies( 'product' ) ) ) {
			return $query;
		}

		$search_results = $this->product_ids_for_keyword();
		$tax_results    = $this->filtered_product_ids_for_terms();

		// When both search and tax results found
		if ( sizeof( $search_results ) > 0 && sizeof( $tax_results ) > 0 ) {
			$post__in = array_intersect( $search_results, $tax_results );
		} // When only search results found
		elseif ( sizeof( $search_results ) > 0 && sizeof( $tax_results ) === 0 ) {
			$post__in = $search_results;
		} else {
			$post__in = $tax_results;
		}

		$query->set( 'meta_query', $this->query_for_meta() );
		$query->set( 'post__in', $post__in );

		return $query;
	}

	/**
	 * Retrieve Product ids for keyword.
	 *
	 * @return array
	 */
	public function product_ids_for_keyword() {
		if ( isset( $_GET['keyword'] ) && ! empty( $_GET['keyword'] ) ) {
			$keyword = $_GET['keyword'];

			$args = array(
				's'           => $keyword,
				'post_type'   => 'product',
				'post_status' => 'publish',
				'numberposts' => - 1,
				'fields'      => 'ids'
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
	public function filtered_product_ids_for_terms() {
		$chosen_filters = $this->get_chosen_filters();
		$chosen_filters = $chosen_filters['chosen'];
		$results        = array();

		// 99% copy of WC_Query
		if ( sizeof( $chosen_filters ) > 0 ) {
			$matched_products = array(
				'and' => array(),
				'or'  => array(),
			);

			$filtered_attribute = array(
				'and' => false,
				'or'  => false,
			);

			foreach ( $chosen_filters as $attribute => $data ) {
				$matched_products_from_attribute = array();
				$filtered                        = false;

				if ( sizeof( $data['terms'] ) > 0 ) {
					foreach ( $data['terms'] as $value ) {
						$posts = get_posts(
							array(
								'post_type'     => 'product',
								'numberposts'   => - 1,
								'post_status'   => 'publish',
								'fields'        => 'ids',
								'no_found_rows' => true,
								'tax_query'     => array(
									array(
										'taxonomy' => $attribute,
										'terms'    => $value,
										'field'    => 'term_id'
									)
								)
							)
						);

						if ( ! is_wp_error( $posts ) ) {
							if ( sizeof( $matched_products_from_attribute ) > 0 || $filtered ) {
								$matched_products_from_attribute = ( $data['query_type'] === 'or' ) ? array_merge( $posts, $matched_products_from_attribute ) : array_intersect( $posts, $matched_products_from_attribute );
							} else {
								$matched_products_from_attribute = $posts;
							}

							$filtered = true;
						}
					}
				}

				if ( sizeof( $matched_products[ $data['query_type'] ] ) > 0 || $filtered_attribute[ $data['query_type'] ] === true ) {
					$matched_products[ $data['query_type'] ] = ( $data['query_type'] === 'or' ) ? array_merge( $matched_products_from_attribute, $matched_products[ $data['query_type'] ] ) : array_intersect( $matched_products_from_attribute, $matched_products[ $data['query_type'] ] );
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
	 * Get chosen filters.
	 *
	 * @return array
	 */
	public function get_chosen_filters() {
		// parse url
		$url = $_SERVER['QUERY_STRING'];
		parse_str( $url, $query );

		$chosen         = array();
		$term_ancestors = array();
		$active_filters = array();

		// keyword
		if ( isset( $_GET['keyword'] ) ) {
			$keyword                   = ( ! empty( $_GET['keyword'] ) ) ? $_GET['keyword'] : '';
			$active_filters['keyword'] = $keyword;
		}

		// orderby
		if ( isset( $_GET['orderby'] ) ) {
			$orderby                   = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : '';
			$active_filters['orderby'] = $orderby;
		}

		$utils = new WCAPF_Utils();

		$taxonomy_filter_keys = $utils->get_taxonomy_filter_keys();

		foreach ( $taxonomy_filter_keys as $taxonomy => $keys ) {
			$result = $this->get_chosen_terms( $taxonomy, $keys, $query );

			if ( $result ) {
				$chosen[ $taxonomy ] = $result;
			}
		}

		// min-price
		if ( isset( $_GET['min-price'] ) ) {
			$active_filters['min_price'] = $_GET['min-price'];
		}

		// max-price
		if ( isset( $_GET['max-price'] ) ) {
			$active_filters['max_price'] = $_GET['max-price'];
		}

		return array(
			'chosen'         => $chosen,
			'term_ancestors' => $term_ancestors,
			'active_filters' => $active_filters
		);
	}

	private function get_chosen_terms( $taxonomy, $keys, $query ) {
		$taxonomy_and_query_key = $keys['and'];
		$taxonomy_or_query_key  = $keys['or'];
		$value_separator        = ','; // TODO: Use a filter

		$values         = '';
		$query_key      = '';
		$query_type     = '';
		$active_filters = array();

		if ( isset( $query[ $taxonomy_and_query_key ] ) ) {
			$query_key  = $taxonomy_and_query_key;
			$values     = $query[ $taxonomy_and_query_key ];
			$query_type = 'and';
		} elseif ( isset( $query[ $taxonomy_or_query_key ] ) ) {
			$query_key  = $taxonomy_or_query_key;
			$values     = $query[ $taxonomy_or_query_key ];
			$query_type = 'or';
		}

		if ( ! $values ) {
			return array();
		}

		$terms = explode( $value_separator, $values );

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
	 * Query for meta that should be set to the main query.
	 *
	 * @return array
	 */
	public function query_for_meta() {
		$meta_query = array();

		// rating filter
		if ( isset( $_GET['min_rating'] ) ) {
			$meta_query[] = array(
				'key'           => '_wc_average_rating',
				'value'         => isset( $_GET['min_rating'] ) ? floatval( $_GET['min_rating'] ) : 0,
				'compare'       => '>=',
				'type'          => 'DECIMAL',
				'rating_filter' => true,
			);
		}

		// price range for all published products
		$unfiltered_price_range = $this->getPriceRange( false );

		if ( isset( $_GET['min-price'] ) || isset( $_GET['max-price'] ) ) {
			if ( sizeof( $unfiltered_price_range ) === 2 ) {
				$min = ( ! empty( $_GET['min-price'] ) ) ? (int) $_GET['min-price'] : '';
				$max = ( ! empty( $_GET['max-price'] ) ) ? (int) $_GET['max-price'] : '';

				$min = ( ! empty( $min ) ) ? $min : (int) $unfiltered_price_range[0];
				$max = ( ! empty( $max ) ) ? $max : (int) $unfiltered_price_range[1];

				// if tax enabled
				if ( wc_tax_enabled() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) && ! wc_prices_include_tax() ) {
					$tax_classes = array_merge( array( '' ), WC_Tax::get_tax_classes() );

					foreach ( $tax_classes as $tax_class ) {
						$tax_rates = WC_Tax::get_rates( $tax_class );
						$class_min = $min - WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $min, $tax_rates ) );
						$class_max = $max - WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $max, $tax_rates ) );

						$min = $max = false;

						if ( $min === false || $min > (int) $class_min ) {
							$min = floor( $class_min );
						}

						if ( $max === false || $max < (int) $class_max ) {
							$max = ceil( $class_max );
						}
					}
				}

				// if WooCommerce Currency Switcher plugin is activated
				if ( class_exists( 'WOOCS' ) ) {
					$woocs           = new WOOCS();
					$chosen_currency = $woocs->get_woocommerce_currency();
					$currencies      = $woocs->get_currencies();

					if ( sizeof( $currencies ) > 0 ) {
						foreach ( $currencies as $currency ) {
							if ( $currency['name'] == $chosen_currency ) {
								$rate = $currency['rate'];
							}
						}

						$min = floor( $min / $rate );
						$max = ceil( $max / $rate );
					}
				}

				$meta_query[] = array(
					'key'          => '_price',
					'value'        => array( $min, $max ),
					'type'         => 'numeric',
					'compare'      => 'BETWEEN',
					'price_filter' => true,
				);
			}
		}

		return $meta_query;
	}

	/**
	 * Get Price Range for given product ids.
	 * If filtered is true then return price range for filtered products,
	 * otherwise return price range for all products.
	 *
	 * @param boolean $filtered
	 *
	 * @return array
	 */
	public function getPriceRange( $filtered = true ) {
		if ( $filtered === true ) {
			$price_range = $this->filtered_products_price_range();
		} else {
			$price_range = $this->unfiltered_products_price_range();
		}

		if ( sizeof( $price_range ) > 2 ) {
			$min = $max = false;

			foreach ( $price_range as $price ) {
				if ( $min === false || $min > (int) $price ) {
					$min = floor( $price );
				}

				if ( $max === false || $max < (int) $price ) {
					$max = ceil( $price );
				}
			}

			// if tax enabled and shop page shows price including tax
			if ( wc_tax_enabled() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) && ! wc_prices_include_tax() ) {
				$tax_classes = array_merge( array( '' ), WC_Tax::get_tax_classes() );

				foreach ( $tax_classes as $tax_class ) {
					$tax_rates = WC_Tax::get_rates( $tax_class );
					$class_min = $min + WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $min, $tax_rates ) );
					$class_max = $max + WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $max, $tax_rates ) );

					$min = $max = false;

					if ( $min === false || $min > (int) $class_min ) {
						$min = floor( $class_min );
					}

					if ( $max === false || $max < (int) $class_max ) {
						$max = ceil( $class_max );
					}
				}
			}

			// if WooCommerce Currency Switcher plugin is activated
			if ( class_exists( 'WOOCS' ) ) {
				$woocs           = new WOOCS();
				$chosen_currency = $woocs->get_woocommerce_currency();
				$currencies      = $woocs->get_currencies();

				if ( sizeof( $currencies ) > 0 ) {
					foreach ( $currencies as $currency ) {
						if ( $currency['name'] == $chosen_currency ) {
							$rate = $currency['rate'];
						}
					}

					$min = floor( $min * $rate );
					$max = ceil( $max * $rate );
				}
			}

			if ( $min == $max ) {
				// empty array
				return array();
			} else {
				// array with min and max values
				return array( $min, $max );
			}
		} else {
			// empty array
			return array();
		}
	}

	/**
	 * Find price range for filtered products.
	 *
	 * @return array
	 */
	public function filtered_products_price_range() {
		$products = $this->filtered_product_ids();

		if ( sizeof( $products ) < 1 ) {
			return array();
		}

		return $this->find_price_range( $products );
	}

	/**
	 * Get filtered product ids.
	 *
	 * @return array
	 */
	public function filtered_product_ids() {
		global $wp_query;
		$current_query = $wp_query;

		if ( ! is_object( $current_query ) && ! is_main_query() && ! is_post_type_archive( 'product' ) && ! is_tax( get_object_taxonomies( 'product' ) ) ) {
			return array();
		}

		$modified_query = $current_query->query;
		unset( $modified_query['paged'] );
		$meta_query = ( key_exists( 'meta_query', $current_query->query_vars ) ) ? $current_query->query_vars['meta_query'] : array();
		$tax_query  = ( key_exists( 'tax_query', $current_query->query_vars ) ) ? $current_query->query_vars['tax_query'] : array();
		$post__in   = ( key_exists( 'post__in', $current_query->query_vars ) ) ? $current_query->query_vars['post__in'] : array();

		return get_posts(
			array_merge(
				$modified_query,
				array(
					'post_type'              => 'product',
					'numberposts'            => - 1,
					'post_status'            => 'publish',
					'post__in'               => $post__in,
					'meta_query'             => $meta_query,
					'tax_query'              => $tax_query,
					'fields'                 => 'ids',
					'no_found_rows'          => true,
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
					'pagename'               => '',
				)
			)
		);
	}

	/**
	 * Find Prices for given products.
	 *
	 * @param array $products
	 *
	 * @return array
	 */
	public function find_price_range( $products ) {
		$price_range = array();

		foreach ( $products as $id ) {
			$meta_value = get_post_meta( $id, '_price', true );

			if ( $meta_value ) {
				$price_range[] = $meta_value;
			}

			// for child posts
			$product_variation = get_children(
				array(
					'post_type'   => 'product_variation',
					'post_parent' => $id,
					'numberposts' => - 1
				)
			);

			if ( sizeof( $product_variation ) > 0 ) {
				foreach ( $product_variation as $variation ) {
					$meta_value = get_post_meta( $variation->ID, '_price', true );
					if ( $meta_value ) {
						$price_range[] = $meta_value;
					}
				}
			}
		}

		return array_unique( $price_range );
	}

	/**
	 * Find price range for unfiltered products.
	 *
	 * @return array
	 */
	public function unfiltered_products_price_range() {
		$products = $this->unfiltered_product_ids();

		if ( sizeof( $products ) < 1 ) {
			return array();
		}

		// get unfiltered products price range using transients
		$transient_name = 'wcapf_unfiltered_product_price_range';

		if ( false === ( $unfiltered_products_price_range = get_transient( $transient_name ) ) ) {
			$unfiltered_products_price_range = $this->find_price_range( $products );
			set_transient( $transient_name, $unfiltered_products_price_range, WCAPF_CACHE_TIME );
		}

		return $unfiltered_products_price_range;
	}

	/**
	 * Get the unfiltered product ids.
	 *
	 * TODO: Maybe rename to all_product_ids
	 *
	 * @return array
	 */
	public function unfiltered_product_ids() {
		$args = array(
			'post_type'   => 'product',
			'post_status' => 'publish',
			'numberposts' => - 1,
			'fields'      => 'ids'
		);

		// get unfiltered products using transients
		$transient_name = 'wcapf_unfiltered_product_ids';

		if ( false === ( $unfiltered_product_ids = get_transient( $transient_name ) ) ) {
			$unfiltered_product_ids = get_posts( $args );
			set_transient( $transient_name, $unfiltered_product_ids, WCAPF_CACHE_TIME );
		}

		return $unfiltered_product_ids;
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Filter', 'instance' ) );
