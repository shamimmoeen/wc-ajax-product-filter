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

}
