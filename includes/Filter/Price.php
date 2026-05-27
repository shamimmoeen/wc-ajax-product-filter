<?php
/**
 * The price filter element.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Filter
 * @author     Mainul Hassan
 */

namespace WCAPF\Filter;

use WCAPF\Element\Filterable;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filters products by a price range against the WooCommerce price lookup table,
 * and reports the available min/max price for the slider.
 */
class Price extends AbstractFilter implements Filterable {

	/**
	 * Builds the chosen-filter data for the active price range.
	 *
	 * @return array
	 */
	public function clauses(): array {
		$query_type = $this->query_type;
		$filter_id  = $this->field->filter_id;

		$active_filters = array();

		list( 'join' => $join, 'alias' => $alias ) = $this->query_builder->get_lookup_table_data();

		$_filter_values = $this->query_builder->get_chosen_filter_values( $this->selected_value() );
		$_filter_values = $_filter_values ? $_filter_values[0] : array(); // Pick the first range only.

		$separator = wcapf()->data->range_values_separator();

		$filter_values = explode( $separator, $_filter_values );

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		list( 'min' => $min, 'max' => $max ) = $this->query_builder->get_min_max_price_according_to_tax(
			$filter_values[0],
			$filter_values[1]
		);

		$where = "NOT ($max < $alias.min_price OR $min > $alias.max_price)";

		if ( $this->field->get_sub_field_value( 'show_in_active_filters' ) ) {
			$range_id = implode( $separator, $filter_values );

			$active_filters[ $range_id ] = $this->get_label_for_number_range( $range_id );
		}

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
	 * The option items to render for this filter — the available price range.
	 *
	 * @return array
	 */
	public function items(): array {
		return apply_filters( 'wcapf_filter_items', $this->prepare_items(), $this->field );
	}

	/**
	 * Prepares the price filter items (the min/max range).
	 *
	 * @return array
	 */
	protected function prepare_items() {
		return $this->get_range();
	}

	/**
	 * Gets the available minimum and maximum price, scoped to the viewed products.
	 *
	 * @return array
	 */
	protected function get_range() {
		global $wpdb;

		$post_statuses  = wcapf()->data->filterable_post_statuses();
		$hide_stock_out = wcapf()->settings->hide_stock_out_items();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		$lookup_table_name = $wpdb->prefix . 'wc_product_meta_lookup';

		$join  = '';
		$where = '';
		$query = array();

		$query['select'] = 'SELECT MIN( price_table.min_price ) AS min_price, MAX( price_table.max_price ) AS max_price';
		$query['from']   = "FROM $wpdb->posts";

		$join .= " LEFT JOIN $lookup_table_name AS price_table ON $wpdb->posts.ID = price_table.product_id";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$update_range = 'and' === wcapf()->settings->field_relations();
		$update_range = apply_filters( 'wcapf_update_range_min_max', $update_range, $this->field );

		if ( $update_range ) {
			$join .= $this->query_builder->get_join_clause();
		}

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";

		$status_placeholders = implode( ',', array_fill( 0, count( $post_statuses ), '%s' ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$where .= $wpdb->prepare( " AND $wpdb->posts.post_status IN ($status_placeholders)", $post_statuses );

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';
		$where .= $where_sql;

		$where .= $hide_stock_out ? " AND price_table.stock_status = 'instock'" : '';

		if ( $update_range ) {
			$where .= $this->query_builder->get_where_clauses_by_other_filters( $this->filter_key );
		}

		$query['where'] = $where;

		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom counting query.
		$results = $wpdb->get_row( $query, ARRAY_A );

		$min = isset( $results['min_price'] ) ? (float) $results['min_price'] : 0;
		$max = isset( $results['max_price'] ) ? (float) $results['max_price'] : 0;

		// Check to see if we should add taxes to the prices if store are excl tax but display incl.
		$tax_display_mode = get_option( 'woocommerce_tax_display_shop' );

		if ( wc_tax_enabled() && ! wc_prices_include_tax() && 'incl' === $tax_display_mode ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			$tax_class = apply_filters( 'woocommerce_price_filter_widget_tax_class', '' ); // Uses standard tax class.
			$tax_rates = \WC_Tax::get_rates( $tax_class );

			if ( $tax_rates ) {
				$min += \WC_Tax::get_tax_total( \WC_Tax::calc_exclusive_tax( $min, $tax_rates ) );
				$max += \WC_Tax::get_tax_total( \WC_Tax::calc_exclusive_tax( $max, $tax_rates ) );
			}
		}

		return compact( 'min', 'max' );
	}
}
