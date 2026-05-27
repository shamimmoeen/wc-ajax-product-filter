<?php
/**
 * The product-status filter element.
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
 * Filters products by their featured / on-sale status, and counts the products
 * matching each configured status option.
 */
class ProductStatus extends AbstractFilter implements Filterable {

	/**
	 * Builds the chosen-filter data for the active selection.
	 *
	 * @return array
	 */
	public function clauses(): array {
		global $wpdb;

		$query_type = $this->query_type;
		$filter_id  = $this->field->filter_id;

		$active_filters = array();

		$filter_values = $this->query_builder->get_chosen_filter_values( $this->selected_value() );

		$join   = '';
		$wheres = array();

		foreach ( $filter_values as $value ) {
			$condition = '';

			if ( 'featured' === $value ) {
				$featured_products = $this->query_builder->get_featured_product_ids_sql();

				$condition = "$wpdb->posts.ID IN $featured_products";
			} elseif ( 'on_sale' === $value ) {
				$on_sale_products = $this->query_builder->get_product_ids_on_sale_sql();

				$condition = "$wpdb->posts.ID IN $on_sale_products";
			}

			if ( $condition ) {
				$wheres[] = $condition;
			}
		}

		if ( $wheres ) {
			$separator = 'or' === $query_type ? ' OR ' : ' AND ';

			$sql = implode( $separator, $wheres );

			if ( 1 < count( $wheres ) ) {
				$where = '( ' . $sql . ' )';
			} else {
				$where = $sql;
			}
		} else {
			$where = '1=0';
		}

		if ( $this->field->get_sub_field_value( 'show_in_active_filters' ) ) {
			$active_filters = $this->active_filter_labels( $filter_values );
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
	 * The option items to render for this filter.
	 *
	 * @return array
	 */
	public function items(): array {
		return apply_filters( 'wcapf_filter_items', $this->prepare_items(), $this->field );
	}

	/**
	 * Maps the selected statuses to their configured option labels.
	 *
	 * @param array $filter_values The selected filter values.
	 *
	 * @return array
	 */
	protected function active_filter_labels( $filter_values ) {
		$options = wp_list_pluck( $this->field->manual_options, 'label', 'value' );

		$filter_data = array();

		foreach ( $filter_values as $filter_value ) {
			$filter_data[ $filter_value ] = ! empty( $options[ $filter_value ] ) ? $options[ $filter_value ] : $filter_value;
		}

		return $filter_data;
	}

	/**
	 * Prepares the product-status option items with their product counts.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$items = $this->prepare_manual_options( $this->field->manual_options );
		$items = $this->get_filtered_product_counts( $items );
		$items = $this->filter_by_hide_empty( $items );

		return apply_filters( 'wcapf_product_status_items', $items, $this->field );
	}

	/**
	 * Counts the products matching each status item, scoped to the viewed products.
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

			$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS count";
			$query['from']   = "FROM $wpdb->posts";

			$join .= $meta_query_sql['join'];
			$join .= $tax_query_sql['join'];

			if ( $update_count ) {
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

			if ( 'featured' === $id ) {
				$featured_products = $this->query_builder->get_featured_product_ids_sql();

				$where .= " AND $wpdb->posts.ID IN $featured_products";
			} elseif ( 'on_sale' === $id ) {
				$on_sale_products = $this->query_builder->get_product_ids_on_sale_sql();

				$where .= " AND $wpdb->posts.ID IN $on_sale_products";
			}

			if ( $update_count ) {
				$where .= $this->query_builder->get_where_clause( $this->query_type, $this->filter_key );
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
