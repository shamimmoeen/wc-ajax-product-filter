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
	 * @param string $filter_key The filter key.
	 * @param array  $query      The url query.
	 *
	 * @return array
	 */
	public static function get_chosen_filter_values_refactored( $filter_key, $query ) {
		$value_separator = ',';

		$values = '';

		if ( isset( $query[ $filter_key ] ) ) {
			$values = $query[ $filter_key ];
		}

		// Check if we have any string(including 0) in the url.
		if ( ! strlen( $values ) ) {
			return array();
		}

		return explode( $value_separator, $values );
	}

	/**
	 * Combine the values of an associative array.
	 *
	 * @param string $query_type The query type.
	 * @param array  $values     The associative array of values.
	 *
	 * @return array
	 */
	public static function combine_values( $query_type, $values ) {
		$combined = array();

		if ( ! $values ) {
			return $combined;
		}

		if ( 2 > count( $values ) ) {
			return reset( $values );
		}

		if ( 'or' === $query_type ) {
			$combined = call_user_func_array( 'array_merge', $values );
		} else {
			$combined = call_user_func_array( 'array_intersect', $values );
		}

		return $combined;
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
			$select .= "SELECT MIN( CAST( $wpdb->postmeta.meta_value as $data_type ) )";
		} else {
			$select .= "SELECT MAX( CAST( $wpdb->postmeta.meta_value as $data_type ) )";
		}

		$query['select'] = $select;

		$query['from'] = "FROM $wpdb->postmeta";

		$join .= "INNER JOIN $wpdb->posts ON $wpdb->postmeta.post_id = $wpdb->posts.ID";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";
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

}
