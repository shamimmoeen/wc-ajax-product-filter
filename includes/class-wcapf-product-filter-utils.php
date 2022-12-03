<?php
/**
 * The product filter utility class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Product_Filter_Utils class.
 *
 * @since 3.0.0
 */
class WCAPF_Product_Filter_Utils {

	/**
	 * Gets the chosen filter values.
	 *
	 * @param string $values The filter values.
	 *
	 * @return array
	 */
	public static function get_chosen_filter_values( $values ) {
		$value_separator = ',';

		// Check if we have any string(including 0) in the url.
		if ( ! strlen( $values ) ) {
			return array();
		}

		$values_array = explode( $value_separator, $values );

		return is_array( $values_array ) ? $values_array : array();
	}

	/**
	 * We are using the same join to avoid the sorting issues.
	 *
	 * @return array
	 *
	 * @see wcapf_set_product_query()
	 * @see WC_Query::append_product_sorting_table_join()
	 */
	public static function get_lookup_table_data() {
		global $wpdb;

		$table = $wpdb->prefix . 'wc_product_meta_lookup';
		$alias = 'wc_product_meta_lookup';

		$join = "LEFT JOIN $table AS $alias ON $wpdb->posts.ID = $alias.product_id";

		return compact( 'join', 'alias' );
	}

	/**
	 * When filtering the products by price we set the price according to tax.
	 *
	 * @param string $min
	 * @param string $max
	 *
	 * @return array
	 */
	public static function get_min_max_price_according_to_tax( $min, $max ) {
		$min = floatval( $min );
		$max = floatval( $max );

		/**
		 * Adjust if the store taxes are not displayed how they are stored.
		 * Kicks in when prices excluding tax are displayed including tax.
		 */
		if ( wc_tax_enabled() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) && ! wc_prices_include_tax() ) {
			$tax_class = apply_filters( 'woocommerce_price_filter_widget_tax_class', '' ); // Uses standard tax class.
			$tax_rates = WC_Tax::get_rates( $tax_class );

			if ( $tax_rates ) {
				$min -= WC_Tax::get_tax_total( WC_Tax::calc_inclusive_tax( $min, $tax_rates ) );
				$max -= WC_Tax::get_tax_total( WC_Tax::calc_inclusive_tax( $max, $tax_rates ) );
			}
		}

		return compact( 'min', 'max' );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public static function get_price_range( $field_instance ) {
		global $wpdb;

		$helper = new WCAPF_Helper();

		$post_statuses  = $helper::filterable_post_statuses();
		$hide_stock_out = $helper::hide_stock_out_items();

		list( $meta_query_sql, $tax_query_sql, $search_query ) = self::get_main_query_data();

		$lookup_table_name = $wpdb->prefix . 'wc_product_meta_lookup';

		$join  = '';
		$where = '';
		$query = array();

		$select = 'SELECT MIN( price_table.min_price ) AS min_price, MAX( price_table.max_price ) AS max_price';

		$query['select'] = $select;
		$query['from']   = "FROM $wpdb->posts";

		$join .= " LEFT JOIN $lookup_table_name AS price_table ON $wpdb->posts.ID = price_table.product_id";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";
		$where .= " AND $wpdb->posts.post_status IN ('" . implode( "','", $post_statuses ) . "')";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';

		$where .= $hide_stock_out ? " AND price_table.stock_status = 'instock'" : '';

		$query['where'] = $where;

		$query = apply_filters( 'wcapf_price_min_max_sql_query', $query, $field_instance );
		$query = implode( ' ', $query );

		$results = $wpdb->get_row( $query, ARRAY_A );

		$min = isset( $results['min_price'] ) ? floatval( $results['min_price'] ) : 0;
		$max = isset( $results['max_price'] ) ? floatval( $results['max_price'] ) : 0;

		// Check to see if we should add taxes to the prices if store are excl tax but display incl.
		$tax_display_mode = get_option( 'woocommerce_tax_display_shop' );

		if ( wc_tax_enabled() && ! wc_prices_include_tax() && 'incl' === $tax_display_mode ) {
			$tax_class = apply_filters( 'woocommerce_price_filter_widget_tax_class', '' ); // Uses standard tax class.
			$tax_rates = WC_Tax::get_rates( $tax_class );

			if ( $tax_rates ) {
				$min += WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $min, $tax_rates ) );
				$max += WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $max, $tax_rates ) );
			}
		}

		return compact( 'min', 'max' );
	}

	/**
	 * Gets the main wc query data.
	 *
	 * @param string $primary_table  The primary table name.
	 * @param string $primary_column The primary column name.
	 *
	 * @return array
	 */
	public static function get_main_query_data( $primary_table = '', $primary_column = '' ) {
		global $wpdb;

		if ( ! $primary_table ) {
			$primary_table = $wpdb->posts;
		}

		if ( ! $primary_column ) {
			$primary_column = 'ID';
		}

		if ( is_shop() || is_product_taxonomy() ) {
			$tax_query    = WC_Query::get_main_tax_query();
			$meta_query   = WC_Query::get_main_meta_query();
			$search_query = WC_Query::get_main_search_query_sql();

			$meta_query     = new WP_Meta_Query( $meta_query );
			$tax_query      = new WP_Tax_Query( $tax_query );
			$meta_query_sql = $meta_query->get_sql( 'post', $primary_table, $primary_column );
			$tax_query_sql  = $tax_query->get_sql( $primary_table, $primary_column );
		} else {
			$meta_query_sql = array( 'join' => '', 'where' => '' );
			$tax_query_sql  = array( 'join' => '', 'where' => '' );
			$search_query   = '';
		}

		return array( $meta_query_sql, $tax_query_sql, $search_query );
	}

	/**
	 * @return string
	 */
	public static function get_where_clause( $query_type, $filter_key ) {
		$main_query_type = WCAPF_Helper::get_field_relations();

		// Maybe include post__in, post__not_in and other vars from the main products query.
		$where = '';

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $query_type ) {
				$where = self::get_full_where_clause();
			} elseif ( 'or' === $query_type ) {
				$where = self::get_where_clauses_by_other_filters( $filter_key );
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $query_type ) {
				$where = self::get_self_where_clause( $filter_key );
			} elseif ( 'or' === $query_type ) {
				$where = ' AND 1=1';
			}
		}

		return apply_filters( 'wcapf_filter_where_clause', $where, $query_type, $filter_key );
	}

	/**
	 * @return string
	 */
	public static function get_full_where_clause() {
		$filter = new WCAPF_Product_Filter();

		return $filter->get_full_where_clause();
	}

	/**
	 * @return string
	 */
	public static function get_where_clauses_by_other_filters( $filter_key ) {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		$wheres = array();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $_filter_key => $filter ) {
				if ( $filter_key === $_filter_key ) {
					continue;
				}

				$wheres[] = $filter['where'];
			}
		}

		$query_type = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

	/**
	 * @param array  $wheres
	 * @param string $query_type
	 *
	 * @return string
	 */
	public static function combine_where_clauses( $wheres, $query_type ) {
		if ( 'or' === $query_type ) {
			$separator = ' OR ';
		} else {
			$separator = ' AND ';
		}

		if ( $wheres ) {
			if ( 1 < count( $wheres ) ) {
				$sql = ' AND ( ' . implode( $separator, $wheres ) . ' )';
			} else {
				$sql = ' AND ' . implode( $separator, $wheres );
			}
		} else {
			$sql = '';
		}

		return $sql;
	}

	/**
	 * @return string
	 */
	public static function get_self_where_clause( $filter_key ) {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		$wheres = array();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $_filter_key => $filter ) {
				if ( $filter_key === $_filter_key ) {
					$wheres[] = $filter['where'];
					break;
				}
			}
		}

		$query_type = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

	/**
	 * @return string
	 */
	public static function get_join_clause() {
		$filter = new WCAPF_Product_Filter();

		$join = ' ' . $filter->get_full_join_clause();

		return apply_filters( 'wcapf_filter_join_clause', $join );
	}

	/**
	 * @return string
	 */
	public static function get_featured_product_ids_sql() {
		$ids = wc_get_featured_product_ids();

		$ids = $ids ?: array( 0 );

		return self::get_ids_sql( $ids );
	}

	/**
	 * Formats a list of ids as "(id,id,id)".
	 *
	 * @param array $ids The list of ids to format.
	 *
	 * @return string The formatted list.
	 */
	public static function get_ids_sql( $ids ) {
		return '(' . implode( ',', array_map( 'absint', $ids ) ) . ')';
	}

	/**
	 * @return string
	 */
	public static function get_product_ids_on_sale_sql() {
		$ids = wc_get_product_ids_on_sale();

		$ids = $ids ?: array( 0 );

		return self::get_ids_sql( $ids );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param string               $value          The min, max range using separator.
	 *
	 * @return string
	 */
	public static function get_label_for_number_range( $field_instance, $value ) {
		$separator = WCAPF_Helper::range_values_separator();
		$range     = explode( $separator, $value );

		$range_min = $range[0];
		$range_max = $range[1];

		$value_prefix       = $field_instance->get_sub_field_value( 'value_prefix' );
		$value_postfix      = $field_instance->get_sub_field_value( 'value_postfix' );
		$values_separator   = $field_instance->get_sub_field_value( 'values_separator' );
		$decimal_places     = $field_instance->get_sub_field_value( 'decimal_places' );
		$thousand_separator = $field_instance->get_sub_field_value( 'thousand_separator' );
		$decimal_separator  = $field_instance->get_sub_field_value( 'decimal_separator' );

		$label = sprintf(
			'%1$s%2$s%3$s%4$s%1$s%5$s%3$s',
			$value_prefix,
			number_format( $range_min, $decimal_places, $decimal_separator, $thousand_separator ),
			$value_postfix,
			$values_separator,
			number_format( $range_max, $decimal_places, $decimal_separator, $thousand_separator )
		);

		return apply_filters( 'wcapf_label_for_number_range', $label, $field_instance );
	}

	/**
	 * Create a unique alias when joining on MySQL table.
	 *
	 * @param string $filter_key The filter key.
	 *
	 * @return string
	 */
	public static function get_table_join_alias( $filter_key ) {
		return '`' . $filter_key . '`';
	}

	/**
	 * Create a unique alias when joining on MySQL table.
	 *
	 * @param int    $index      The index number.
	 * @param string $filter_key The filter key.
	 *
	 * @return string
	 */
	public static function get_table_join_alias_for_query_type_and( $index, $filter_key ) {
		$postfix = $index + 1;

		return '`' . $filter_key . $postfix . '`';
	}

	/**
	 * Gets the user roles.
	 *
	 * @since 3.3.0
	 *
	 * @return array
	 */
	public static function get_user_roles() {
		global $wp_roles;

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}

		$all_roles = $wp_roles->get_names();

		return apply_filters( 'wcapf_user_roles', $all_roles );
	}

	/**
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_users( $args = array(), $use_store_name = '' ) {
		$defaults = array( 'fields' => array( 'ID', 'display_name' ) );
		$args     = wp_parse_args( $args, $defaults );
		$users    = get_users( $args );

		$_items = array();

		foreach ( $users as $user ) {
			$user_id = $user->ID;
			$name    = $user->display_name;
			$count   = 0;

			// TODO: Extract to pro.
			if ( $use_store_name ) {
				$meta_key   = self::store_name_meta_key();
				$store_name = get_user_meta( $user_id, $meta_key, true );

				if ( $store_name ) {
					$name = $store_name;
				}
			}

			$_items[ $user_id ] = array(
				'id'    => $user_id,
				'name'  => $name,
				'count' => $count,
			);
		}

		return $_items;
	}

	/**
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function store_name_meta_key() {
		return 'wcfmmp_store_name';
	}

	/**
	 * @param string $query_type
	 * @param array  $or_filter_values
	 * @param string $value_alias
	 * @param array  $clauses
	 *
	 * @return string
	 */
	public static function get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses ) {
		if ( 'or' === $query_type ) {
			if ( $or_filter_values ) {
				$or_clauses = "('" . implode( "','", $or_filter_values ) . "')";

				$where = "$value_alias IN $or_clauses";
			} elseif ( $clauses ) {
				if ( 1 < count( $clauses ) ) {
					$where = '( ' . implode( ' OR ', $clauses ) . ' )';
				} else {
					$where = implode( ' OR ', $clauses );
				}
			} else {
				$where = '1=0';
			}
		} else {
			if ( $clauses ) {
				if ( 1 < count( $clauses ) ) {
					$where = '( ' . implode( ' AND ', $clauses ) . ' )';
				} else {
					$where = implode( ' AND ', $clauses );
				}
			} else {
				$where = '1=0';
			}
		}

		return $where;
	}

}
