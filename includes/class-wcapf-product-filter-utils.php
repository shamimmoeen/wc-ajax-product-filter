<?php
/**
 * The product filter utility class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
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
	 * @param string $meta_key  The meta key.
	 * @param string $data_type The mysql data type.
	 *
	 * @return string
	 */
	public static function get_min_value( $meta_key, $data_type ) {
		global $wpdb;

		$query = self::meta_value_min_max_sql_query( $meta_key, $data_type );

		return $wpdb->get_var( $query );
	}

	private static function meta_value_min_max_sql_query( $meta_key, $data_type, $min = true ) {
		global $wpdb;

		$helper = new WCAPF_Helper;

		$post_statuses = $helper::filterable_post_statuses();

		list( $meta_query_sql, $tax_query_sql, $search_query ) = $helper::get_main_query_data();

		$query  = array();
		$select = '';
		$join   = '';
		$where  = '';

		if ( $min ) {
			$select .= "SELECT MIN( CAST( $wpdb->postmeta.meta_value AS $data_type ) )";
		} else {
			$select .= "SELECT MAX( CAST( $wpdb->postmeta.meta_value AS $data_type ) )";
		}

		$query['select'] = $select;

		$query['from'] = "FROM $wpdb->postmeta";

		$join .= "INNER JOIN $wpdb->posts ON $wpdb->postmeta.post_id = $wpdb->posts.ID";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		// TODO: Add 'product_variation' post type.
		$where .= "WHERE $wpdb->posts.post_type IN ('product', 'product_variation')";
		$where .= " AND $wpdb->posts.post_status IN ('" . implode( "','", $post_statuses ) . "')";
		$where .= " AND $wpdb->postmeta.meta_key='$meta_key'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';

		// The where clause for auto updatable min, max value according to the applied filters will go here.

		$query['where'] = $where;

		$query = apply_filters( 'wcapf_meta_value_min_max_sql_query', $query, $meta_key, $min );

		return implode( ' ', $query );
	}

	/**
	 * @param string $meta_key  The meta key.
	 * @param string $data_type The mysql data type.
	 *
	 * @return string
	 */
	public static function get_max_value( $meta_key, $data_type ) {
		global $wpdb;

		$query = self::meta_value_min_max_sql_query( $meta_key, $data_type, false );

		return $wpdb->get_var( $query );
	}

	/**
	 * Gets the meta key for price filter.
	 *
	 * @return string
	 */
	public static function get_meta_key_for_price_filter() {
		$helper = new WCAPF_Helper;

		$prices_with_tax_generated = '1' === get_option( $helper::product_prices_generated_option_key() );

		$store_is_in_tax_incl_or_excl_mode = $helper::store_is_in_tax_inclusive_mode()
		                                     || $helper::store_is_in_tax_exclusive_mode();

		if ( $prices_with_tax_generated && $store_is_in_tax_incl_or_excl_mode ) {
			$meta_key = $helper::meta_key_for_price_with_tax();
		} else {
			$meta_key = '_price';
		}

		return $meta_key;
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
	 * @param array $attribute_terms The array of term ids of attribute.
	 *
	 * @return string
	 * @noinspection SqlNoDataSourceInspection
	 */
	public static function get_products_not_in_where_clause( $attribute_terms ) {
		if ( ! $attribute_terms ) {
			return ' 1=1';
		}

		return ' 1=1';

		$term_ids_to_filter_by = '(' . implode( ',', array_map( 'absint', $attribute_terms ) ) . ')';

		global $wpdb;

		$lookup_table_name = $wpdb->prefix . 'wc_product_attributes_lookup';

		$query = "
			SELECT DISTINCT product_or_parent_id
			FROM $lookup_table_name
			WHERE `is_variation_attribute` = 1
			AND `in_stock` = 0
			AND `term_id` in $term_ids_to_filter_by
			GROUP BY product_id
			HAVING COUNT(product_id)=1
			UNION
			SELECT product_or_parent_id
			FROM $lookup_table_name
			WHERE `is_variation_attribute` = 0
			AND `in_stock` = 0
			AND `term_id` in $term_ids_to_filter_by
		";

		// TODO: Cache the results.
		$results = $wpdb->get_results( $query, ARRAY_A );

		$products__not_in = wp_list_pluck( $results, 'product_or_parent_id' );

		if ( $products__not_in ) {
			$product_not_ids_sql = '(' . implode( ',', array_map( 'absint', $products__not_in ) ) . ')';;

			$sql = "$wpdb->posts.ID NOT IN $product_not_ids_sql";
		} else {
			$sql = ' 1=1';
		}

		return $sql;
	}

}
