<?php
/**
 * The product filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Product_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Product_Filter {

	public function get_full_join_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$joins        = $post_clauses['joins'];

		$full_join = implode( ' ', $joins );

		return $full_join ? ' ' . $full_join : '';
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
	 * Gets the chosen filters from url. Avoid calling this method using this class instance,
	 * rather use the helper class instance.
	 *
	 * @return array
	 *
	 * @see WCAPF_Helper::get_chosen_filters()
	 */
	public function get_chosen_filters() {
		// parse url
		$url = $_SERVER['QUERY_STRING'];
		parse_str( $url, $query );

		$chosen     = array();
		$taxonomies = array();
		$attributes = array();
		$price      = array();
		$statuses   = array();

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
			} elseif ( 'product-status' === $filter_type ) {
				$statuses[ $filter_key ] = $this->set_filter_by_product_status_data( $filter_values, $field_instance );

				$already_filtered[] = $filter_key;
			}
		}

		$chosen['taxonomy']  = $taxonomies;
		$chosen['attribute'] = $attributes;
		$chosen['price']     = $price;

		$chosen['product-status'] = $statuses;

		$chosen = $this->set_default_sorting_data( $chosen );

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

			$args = apply_filters( 'wcapf_filters_data_query_args', $args );

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
		$filter_id  = $field_instance->filter_id;

		$join = '';

		$utils = new WCAPF_Product_Filter_Utils;

		$filter_values = $utils::get_chosen_filter_values( $filter_value );

		$term_ids = $this->get_chosen_term_ids( $filter_values, $field_instance );

		$lookup_table_name = $wpdb->prefix . 'wc_product_attributes_lookup';

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

		if ( 'or' === $query_type ) {
			if ( $term_ids ) {
				$ids = $utils::get_ids_sql( $term_ids );

				$where = "
					$clause_root
					SELECT product_or_parent_id
					FROM $lookup_table_name lt
					WHERE term_id IN $ids
					$in_stock_clause
					$clause_end
				";
			} else {
				$where = '1=0';
			}
		} else {
			$clauses = array();

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

		$active_filters = $this->active_terms_filter_data( $filter_values, $field_instance );

		return array(
			'taxonomy'       => $taxonomy,
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
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
		$filter_id  = $field_instance->filter_id;

		$utils = new WCAPF_Product_Filter_Utils;

		$filter_values = $utils::get_chosen_filter_values( $filter_value );

		$term_ids   = $this->get_chosen_term_ids( $filter_values, $field_instance );
		$_terms_ids = $term_ids;

		$is_hierarchical = is_taxonomy_hierarchical( $taxonomy );

		$join = '';

		if ( 'or' === $query_type ) {
			$join .= "LEFT JOIN $wpdb->term_relationships AS $filter_key ON $wpdb->posts.ID = $filter_key.object_id";
		} else {
			foreach ( $term_ids as $index => $value ) {
				$join_alias = $utils::get_table_join_alias_for_query_type_and( $index, $filter_key );

				$join .= " LEFT JOIN $wpdb->term_relationships AS $join_alias ON $wpdb->posts.ID = $join_alias.object_id";
			}
		}

		if ( 'or' === $query_type ) {
			if ( $is_hierarchical ) {
				$with_children = array();

				foreach ( $term_ids as $term_id ) {
					$term_children = get_term_children( $term_id, $taxonomy );
					$with_children = array_merge( $with_children, $term_children );
				}

				$term_ids = array_merge( $term_ids, $with_children );
			}

			if ( $term_ids ) {
				$ids   = $utils::get_ids_sql( $term_ids );
				$where = "$filter_key.term_taxonomy_id IN $ids";
			} else {
				$where = '1=0';
			}
		} else {
			$clauses = array();

			foreach ( $term_ids as $index => $term_id ) {
				if ( $is_hierarchical ) {
					$with_children = get_term_children( $term_id, $taxonomy );

					$and_term_id = array_merge( array( $term_id ), $with_children );
				} else {
					$and_term_id = array( $term_id );
				}

				$id_sql = $utils::get_ids_sql( $and_term_id );

				$join_alias = $utils::get_table_join_alias_for_query_type_and( $index, $filter_key );

				$clauses[] = "$join_alias.term_taxonomy_id IN $id_sql";
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

		$active_ancestors = array();

		if ( $is_hierarchical ) {
			$active_ancestors = $this->get_ancestors_of_active_terms( $_terms_ids, $field_instance );
		}

		$active_filters = $this->active_terms_filter_data( $filter_values, $field_instance );

		return array(
			'taxonomy'         => $taxonomy,
			'query_type'       => $query_type,
			'values'           => $filter_values,
			'active_ancestors' => $active_ancestors,
			'join'             => $join,
			'where'            => $where,
			'filter_id'        => $filter_id,
			'active_filters'   => $active_filters,
		);
	}

	/**
	 * @param array                $filter_values  The filter values.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	private function get_chosen_term_ids( $filter_values, $field_instance ) {
		/**
		 * The hook to change the values for the rating filter.
		 */
		return apply_filters( 'wcapf_taxonomy_filter_values', $filter_values, $field_instance );
	}

	/**
	 * @param array                $term_ids       The term ids.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	private function get_ancestors_of_active_terms( $term_ids, $field_instance ) {
		$taxonomy = $field_instance->taxonomy;

		$active_ancestors = array();

		foreach ( $term_ids as $term_id ) {
			$ancestors        = get_ancestors( $term_id, $taxonomy );
			$active_ancestors = array_merge( $ancestors, $active_ancestors );
		}

		return apply_filters( 'wcapf_ancestors_of_active_terms', $active_ancestors, $field_instance );
	}

	/**
	 * @param array                $filter_values  The filter values.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	private function active_terms_filter_data( $filter_values, $field_instance ) {
		$taxonomy = $field_instance->taxonomy;

		$term_ids = array_map( 'absint', $filter_values );

		$filter_data = get_terms(
			array(
				'taxonomy'         => $taxonomy,
				'hide_empty'       => false,
				'term_taxonomy_id' => $term_ids,
				'fields'           => 'id=>name',
			)
		);

		/**
		 * The hook to change the filter data for the rating filter.
		 */
		return apply_filters( 'wcapf_active_taxonomy_filter_data', $filter_data, $field_instance, $filter_values );
	}

	/**
	 * @param string               $filter_value   The filter value.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_price_filter_data( $filter_value, $field_instance ) {
		$query_type = $field_instance->query_type;
		$filter_id  = $field_instance->filter_id;

		$active_filters = array();

		$utils = new WCAPF_Product_Filter_Utils;

		list( 'join' => $join, 'alias' => $alias ) = $utils::get_lookup_table_data();

		$_filter_values = $utils::get_chosen_filter_values( $filter_value );
		$_filter_values = $_filter_values ? $_filter_values[0] : array(); // Pick the first range only.

		$separator = WCAPF_Helper::range_values_separator();

		$filter_values = explode( $separator, $_filter_values );

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		list( 'min' => $min, 'max' => $max ) = $utils::get_min_max_price_according_to_tax(
			$filter_values[0],
			$filter_values[1]
		);

		$where = "NOT ($max < $alias.min_price OR $min > $alias.max_price)";

		$range_id = implode( $separator, $filter_values );

		$active_filters[ $range_id ] = $utils::get_label_for_number_range( $field_instance, $range_id );

		return array(
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * @param string               $filter_value   The filter value.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_filter_by_product_status_data( $filter_value, $field_instance ) {
		$query_type = $field_instance->query_type;
		$filter_id  = $field_instance->filter_id;

		$utils = new WCAPF_Product_Filter_Utils;

		$filter_values = $utils::get_chosen_filter_values( $filter_value );

		global $wpdb;

		$join   = '';
		$wheres = array();

		foreach ( $filter_values as $value ) {
			$condition = '';

			if ( 'featured' === $value ) {
				$featured_products = $utils::get_featured_product_ids_sql();

				$condition = "$wpdb->posts.ID IN $featured_products";
			} elseif ( 'on_sale' === $value ) {
				$on_sale_products = $utils::get_product_ids_on_sale_sql();

				$condition = "$wpdb->posts.ID IN $on_sale_products";
			}

			$condition = apply_filters( 'wcapf_filter_condition_for_product_status', $condition, $value, $field_instance );

			if ( $condition ) {
				$wheres[] = $condition;
			}
		}

		if ( $wheres ) {
			if ( 'or' === $query_type ) {
				$separator = ' OR ';
			} else {
				$separator = ' AND ';
			}

			$sql = implode( $separator, $wheres );

			if ( 1 < count( $wheres ) ) {
				$where = '( ' . $sql . ' )';
			} else {
				$where = $sql;
			}
		} else {
			$where = '1=0';
		}

		$active_filters = $this->active_product_status_filter_data( $filter_values, $field_instance );

		return array(
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * @param array                $filter_values  The filter values.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	private function active_product_status_filter_data( $filter_values, $field_instance ) {
		$manual_options = $field_instance->manual_options;
		$filter_data    = array();

		foreach ( $filter_values as $filter_value ) {
			$label = '';

			foreach ( $manual_options as $manual_option ) {
				if ( $filter_value === $manual_option['value'] ) {
					$label = $manual_option['label'];
					break;
				}
			}

			$filter_data[ $filter_value ] = $label ?: $filter_value;
		}

		return apply_filters( 'wcapf_active_product_status_filter_data', $filter_data, $field_instance );
	}

	/**
	 * Sets data for the default sorting.
	 *
	 * @param array $chosen The chosen filters array.
	 *
	 * @return array
	 */
	private function set_default_sorting_data( $chosen ) {
		$settings = WCAPF_Helper::get_settings();

		$enable_in_active_filters = isset( $settings['show_sorting_data_in_active_filters'] )
			? $settings['show_sorting_data_in_active_filters']
			: '';

		if ( ! $enable_in_active_filters ) {
			return $chosen;
		}

		if ( isset( $_GET['orderby'] ) ) {
			$values = WCAPF_Product_Filter_Utils::get_chosen_filter_values( sanitize_key( $_GET['orderby'] ) );

			$active_filters = array();

			$label = apply_filters(
				'wcapf_active_filter_label_for_default_sorting',
				__( 'Sort By: ', 'wc-ajax-product-filter' )
			);

			foreach ( $values as $value ) {
				$active_filters[ $value ] = $label . $value;
			}

			$data = array(
				'values'         => $values,
				'filter_key'     => 'orderby',
				'active_filters' => $active_filters,
			);

			$chosen['filters_data']['orderby'] = $data;
		}

		return $chosen;
	}

	public function get_full_where_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$wheres       = $post_clauses['wheres'];
		$query_type   = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

}

/**
 * @param array    $args     The query clauses.
 * @param WP_Query $wp_query Query instance.
 */
function wcapf_posts_clauses( $args, $wp_query ) {
	if ( ! $wp_query->is_main_query() ) {
		return $args;
	}

	$filter = new WCAPF_Product_Filter();

	$args['join']  .= $filter->get_full_join_clause();
	$args['where'] .= $filter->get_full_where_clause();

	/**
	 * The filter to apply the sort-by filter.
	 */
	return apply_filters( 'wcapf_sql_clauses', $args );
}

/**
 * Query the products, applying sorting/ordering etc. This applies to the
 * main WordPress loop.
 *
 * @param WP_Query $q Query instance.
 *
 * @return void
 */
function wcapf_set_product_query( $q ) {
	if ( ! is_shop() && ! is_product_taxonomy() ) {
		return;
	}

	$filter = new WCAPF_Product_Filter();

	$chosen_filters = $filter->get_chosen_filters();

	$GLOBALS['wcapf_chosen_filters'] = $chosen_filters;

	/**
	 * We must hook the filter early to avoid the sorting issues.
	 */
	add_filter( 'posts_clauses', 'wcapf_posts_clauses', 5, 2 );

	/**
	 * The filter to apply the per-page filter.
	 */
	do_action( 'wcapf_filter_products_query', $q );
}

add_action( 'woocommerce_product_query', 'wcapf_set_product_query' );
