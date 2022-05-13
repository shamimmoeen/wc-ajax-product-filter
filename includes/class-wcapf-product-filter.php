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

	public function get_full_join_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$joins        = $post_clauses['joins'];

		return implode( ' ', $joins );
	}

	/**
	 * Gets the full join n where clauses for the main filter.
	 *
	 * @return array
	 */
	public function get_full_join_n_where_clauses() {
		$joins  = array();
		$wheres = array();

		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $filters ) {
				$join  = $filters['join'];
				$where = $filters['where'];

				$joins[]  = $join;
				$wheres[] = $where;
			}
		}

		return compact( 'joins', 'wheres' );
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
		$attributes = array();
		$price      = array();

		$filters_data = $this->filters_data( $query );

		$range_display_types = WCAPF_Helper::range_number_filter_types();

		$already_filtered = array();

		foreach ( $filters_data as $filter_key => $_filter_data ) {
			$field_instance = new WCAPF_Field_Instance( $_filter_data );
			$filter_type    = $field_instance->filter_type;
			$field_type     = $field_instance->type;
			$display_type   = $field_instance->display_type;
			$filter_values  = $query[ $filter_key ];

			if ( 'taxonomy' === $filter_type ) {
				if ( 'attribute' === $field_type ) {
					$attributes[ $filter_key ] = $this->set_attribute_filter_data( $filter_values, $field_instance );
				} else {
					$taxonomies[ $filter_key ] = $this->set_taxonomy_filter_data( $filter_values, $field_instance );
				}

				$already_filtered[] = $filter_key;
			} elseif ( 'price' === $field_type && in_array( $display_type, $range_display_types ) ) {
				$price[ $filter_key ] = $this->set_price_filter_data( $filter_values, $field_instance );

				$already_filtered[] = $filter_key;
			}
		}

		// TODO: Rating, Product Property, Product Status, Sort by, Per Page.

		$chosen['taxonomy']  = $taxonomies;
		$chosen['attribute'] = $attributes;
		$chosen['price']     = $price;

		$remaining_filters = array();

		foreach ( array_keys( $filters_data ) as $_filter_key ) {
			if ( in_array( $_filter_key, $already_filtered ) ) {
				continue;
			}

			$remaining_filters[ $_filter_key ] = $filters_data[ $_filter_key ];
		}

		return apply_filters( 'wcapf_chosen_filters', $chosen, $remaining_filters, $query );
	}

	/**
	 * @param array $query The key, values array from the $_GET variable.
	 *
	 * @return array
	 */
	protected function filters_data( $query ) {
		$filters_data = array();

		if ( $query ) {
			$filter_keys = array_keys( $query );
			$filter_keys = array_map( 'sanitize_title', $filter_keys );

			$args = array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
				'meta_query'  => array(
					array(
						'key'   => '_filter_key',
						'value' => $filter_keys,
					),
				),
			);

			$args = apply_filters( 'wcapf_filters_query_args', $args );

			$filters = get_posts( $args );

			if ( $filters ) {
				foreach ( $filters as $filter_id ) {
					$field_data = get_post_meta( $filter_id, '_field_data', true );
					$field_key  = isset( $field_data['field_key'] ) ? $field_data['field_key'] : '';

					if ( ! $field_key ) {
						continue;
					}

					$filters_data[ $field_key ] = $field_data;
				}
			}
		}

		return apply_filters( 'wcapf_filters_data', $filters_data );
	}

	/**
	 * @param string               $filter_value   The filter value.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_attribute_filter_data( $filter_value, $field_instance ) {
		$use_attribute_table = WCAPF_Helper::filtering_via_lookup_table_is_active();

		if ( ! $use_attribute_table ) {
			return $this->set_taxonomy_filter_data( $filter_value, $field_instance );
		}

		global $wpdb;

		$query_type = $field_instance->query_type;
		$taxonomy   = $field_instance->taxonomy;

		$join = '';

		$term_ids = WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );

		$lookup_table_name = $wpdb->prefix . 'wc_product_attributes_lookup';

		$clauses = array();

		// The extra derived table ("SELECT product_or_parent_id FROM") is needed for performance
		// (causes the filtering subquery to be executed only once).
		$clause_root = "$wpdb->posts.ID IN ( SELECT product_or_parent_id FROM (";
		$clause_end  = ') AS temp)';

		$hide_stock_out_items = WCAPF_Helper::hide_stock_out_items();

		if ( $hide_stock_out_items ) {
			$in_stock_clause = ' AND in_stock = 1';
		} else {
			$in_stock_clause = '';
		}

		foreach ( $term_ids as $term_id ) {
			$clauses[] = "
				$clause_root
				SELECT product_or_parent_id
				FROM $lookup_table_name lt
				WHERE term_id = $term_id
				$in_stock_clause
				$clause_end
			";
		}

		if ( $clauses ) {
			if ( 'or' === $query_type ) {
				$sql = implode( ' OR ', $clauses );
			} else {
				$sql = implode( ' AND ', $clauses );
			}

			if ( 1 > count( $clauses ) ) {
				$where = '( ' . $sql . ' )';
			} else {
				$where = $sql;
			}
		} else {
			$where = '1=0';
		}

		return array(
			'taxonomy'   => $taxonomy,
			'query_type' => $query_type,
			'values'     => $term_ids,
			'join'       => $join,
			'where'      => $where,
		);
	}

	/**
	 * @param string               $filter_value   The filter value.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_taxonomy_filter_data( $filter_value, $field_instance ) {
		global $wpdb;

		$filter_key = $field_instance->filter_key;
		$query_type = $field_instance->query_type;
		$taxonomy   = $field_instance->taxonomy;

		$term_ids = WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );

		$is_hierarchical  = is_taxonomy_hierarchical( $taxonomy );
		$include_children = apply_filters( 'wcapf_taxonomy_include_children', true, $field_instance );

		$join = "LEFT JOIN $wpdb->term_relationships AS $filter_key ON $wpdb->posts.ID = $filter_key.object_id";

		if ( 'or' === $query_type ) {
			if ( $is_hierarchical && $include_children ) {
				$with_children = array();

				foreach ( $term_ids as $term_id ) {
					$term_children = get_term_children( $term_id, $taxonomy );
					$with_children = array_merge( $with_children, $term_children );
				}

				$term_ids = array_merge( $term_ids, $with_children );
			}

			if ( $term_ids ) {
				$ids   = $this->get_term_ids_sql( $term_ids );
				$where = "$filter_key.term_taxonomy_id IN $ids";
			} else {
				$where = '1=0';
			}
		} else {
			$clauses = array();

			foreach ( $term_ids as $term_id ) {
				if ( $is_hierarchical && $include_children ) {
					$with_children = get_term_children( $term_id, $taxonomy );

					$and_term_id = array_merge( array( $term_id ), $with_children );
				} else {
					$and_term_id = array( $term_id );
				}

				$id_sql    = $this->get_term_ids_sql( $and_term_id );
				$clauses[] = "$filter_key.term_taxonomy_id IN $id_sql";
			}

			if ( $clauses ) {
				$sql = implode( ' AND ', $clauses );

				if ( 1 < count( $clauses ) ) {
					$where = '( ' . $sql . ' )';
				} else {
					$where = $sql;
				}
			} else {
				$where = '1=0';
			}
		}

		return array(
			'taxonomy'   => $taxonomy,
			'query_type' => $query_type,
			'values'     => $term_ids,
			'join'       => $join,
			'where'      => $where,
		);
	}

	/**
	 * Formats a list of term ids as "(id,id,id)".
	 *
	 * @param array $term_ids The list of terms to format.
	 *
	 * @return string The formatted list.
	 */
	protected function get_term_ids_sql( $term_ids ) {
		return '(' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';
	}

	/**
	 * @param string               $filter_value   The filter value.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_price_filter_data( $filter_value, $field_instance ) {
		global $wpdb;

		$filter_key = $field_instance->filter_key;
		$query_type = $field_instance->query_type;

		$lookup_table_name = $wpdb->prefix . 'wc_product_meta_lookup';

		$join = "LEFT JOIN $lookup_table_name AS $filter_key ON $wpdb->posts.ID = $filter_key.product_id";

		$_filter_values = WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );
		$_filter_values = $_filter_values ? $_filter_values[0] : array(); // Pick the first range only.

		$filter_values = $_filter_values ? explode( '+', $_filter_values ) : array();

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		list( 'min' => $min, 'max' => $max ) = WCAPF_Product_Filter_Utils::get_min_max_price_according_to_tax(
			$filter_values[0],
			$filter_values[1]
		);

		$where = "($min <= $filter_key.min_price AND $max >= $filter_key.max_price)";

		return array(
			'query_type' => $query_type,
			'values'     => $filter_values,
			'join'       => $join,
			'where'      => $where,
		);
	}

	public function get_full_where_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$wheres       = $post_clauses['wheres'];
		$query_type   = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

}

/**
 * @param WP_Query $wp_query Query instance.
 */
function wcapf_posts_clauses( $args, $wp_query ) {
	if ( ! $wp_query->is_main_query() ) {
		return $args;
	}

	$filter = new WCAPF_Product_Filter();

	$chosen_filters = $filter->get_chosen_filters();

	$GLOBALS['wcapf_chosen_filters'] = $chosen_filters;

	$args['join']  .= $filter->get_full_join_clause();
	$args['where'] .= $filter->get_full_where_clause();

	return $args;
}

/**
 * Query the products, applying sorting/ordering etc. This applies to the
 * main WordPress loop.
 *
 * @return void
 */
function wcapf_set_product_query_refactored() {
	if ( ! is_shop() && ! is_product_taxonomy() ) {
		return;
	}

	// echo '<pre>';
	// print_r( $q );
	// echo '</pre>';

	add_filter( 'posts_clauses', 'wcapf_posts_clauses', 10, 2 );
}

add_action( 'woocommerce_product_query', 'wcapf_set_product_query_refactored' );
