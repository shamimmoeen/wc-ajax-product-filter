<?php
/**
 * WCAPF_Filter_Type_Product_Status class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/filter-types
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Filter_Type_Product_Status class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Type_Product_Status extends WCAPF_Filter_Type {

	/**
	 * Sets the filter properties from the field instance.
	 */
	protected function set_properties() {
	}

	/**
	 * Prepares the product status filter items.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$manual_options = $this->field->manual_options;

		$_items = $this->prepare_manual_options( $manual_options );
		$items  = $this->get_filtered_product_counts( $_items );
		$items  = $this->filter_by_hide_empty( $items );

		return apply_filters( 'wcapf_product_status_items', $items, $this->field );
	}

	/**
	 * Gets filtered product counts for each product status item.
	 *
	 * @param array $items The product status filter items.
	 *
	 * @return array
	 */
	protected function get_filtered_product_counts( $items ) {
		global $wpdb;

		$post_statuses = wcapf()->data->filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		foreach ( $items as $item ) {
			$id = $item['id'];

			$query = array();
			$join  = '';
			$where = '';

			$select = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS count";

			$query['select'] = $select;
			$query['from']   = "FROM $wpdb->posts";

			$join .= $meta_query_sql['join'];
			$join .= $tax_query_sql['join'];

			if ( $update_count ) {
				$join .= WCAPF_Product_Filter_Utils::get_join_clause();
			}

			$query['join'] = $join;

			$where .= "WHERE $wpdb->posts.post_type IN ('product')";

			$status_placeholders = implode( ',', array_fill( 0, count( $post_statuses ), '%s' ) );

			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
			$where .= $wpdb->prepare( " AND $wpdb->posts.post_status IN ($status_placeholders)", $post_statuses );

			$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
			$where .= $search_query ? ' AND ' . $search_query : '';
			$where .= $where_sql;

			if ( 'featured' === $id ) {
				$featured_products = WCAPF_Product_Filter_Utils::get_featured_product_ids_sql();

				$where .= " AND $wpdb->posts.ID IN $featured_products";
			} elseif ( 'on_sale' === $id ) {
				$on_sale_products = WCAPF_Product_Filter_Utils::get_product_ids_on_sale_sql();

				$where .= " AND $wpdb->posts.ID IN $on_sale_products";
			}

			if ( $update_count ) {
				$where .= WCAPF_Product_Filter_Utils::get_where_clause( $this->query_type, $this->filter_key );
			}

			$query['where'] = $where;

			$sql = implode( ' ', $query );

			// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom counting query.
			$count = $wpdb->get_var( $sql );

			$items[ $id ]['count'] = $count;
		}

		return $items;
	}
}
