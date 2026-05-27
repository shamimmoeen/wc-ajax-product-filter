<?php
/**
 * The post-meta filter element.
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
 * Filters products by a custom field (post meta) value, lists the distinct
 * values as options and counts the products of each.
 */
class PostMeta extends AbstractFilter implements Filterable {

	/**
	 * The meta key to filter on.
	 *
	 * @var string
	 */
	protected $meta_key;

	/**
	 * Constructor.
	 *
	 * @param array $entry The stored filter entry.
	 */
	public function __construct( array $entry ) {
		parent::__construct( $entry );

		$this->meta_key = $this->field->meta_key;
	}

	/**
	 * Builds the chosen-filter data for the active selection.
	 *
	 * @return array
	 */
	public function clauses(): array {
		global $wpdb;

		$filter_key = $this->filter_key;
		$query_type = $this->query_type;
		$filter_id  = $this->field->filter_id;

		$active_filters = array();

		$filter_values = $this->query_builder->get_chosen_filter_values( $this->selected_value() );

		$clauses          = array();
		$or_filter_values = array();

		$join = $this->get_post_meta_join_clause( $filter_values );

		$value_alias = $this->query_builder->get_table_join_alias( $filter_key ) . '.meta_value';

		foreach ( $filter_values as $index => $meta_value ) {
			if ( $this->field->get_sub_field_value( 'show_in_active_filters' ) ) {
				$active_filters[ $meta_value ] = $meta_value;
			}

			if ( 'or' === $query_type ) {
				$or_filter_values[] = $meta_value;
			} else {
				$join_alias = $this->query_builder->get_table_join_alias_for_query_type_and( $index, $filter_key );

				$value_alias = "$join_alias.meta_value";

				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$clauses[] = $wpdb->prepare( "$value_alias = %s", $meta_value );
			}
		}

		$where = $this->get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses );

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
	 * Builds the JOIN clause for the post meta filter.
	 *
	 * @param array $filter_values The filter values.
	 *
	 * @return string
	 */
	protected function get_post_meta_join_clause( $filter_values ) {
		global $wpdb;

		$query_type = $this->query_type;
		$filter_key = $this->filter_key;
		$meta_key   = $this->meta_key;

		$join = '';

		if ( 'and' === $query_type ) {
			foreach ( $filter_values as $index => $meta_value ) {
				$join_alias = $this->query_builder->get_table_join_alias_for_query_type_and( $index, $filter_key );

				$join .= " LEFT JOIN $wpdb->postmeta AS $join_alias ON ($wpdb->posts.ID = $join_alias.post_id";
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$join .= $wpdb->prepare( " AND $join_alias.meta_key = %s)", $meta_key );
			}
		} else {
			$join_alias = $this->query_builder->get_table_join_alias( $filter_key );

			$join .= " LEFT JOIN $wpdb->postmeta AS $join_alias ON ($wpdb->posts.ID = $join_alias.post_id";
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$join .= $wpdb->prepare( " AND $join_alias.meta_key = %s)", $meta_key );
		}

		return $join;
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
	 * Prepares the post-meta option items (distinct values with counts).
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$meta_values = $this->get_text_automatic_values();
		$meta_values = $this->get_updated_meta_values_count( $meta_values );
		$meta_values = $this->filter_by_hide_empty( $meta_values );

		return apply_filters( 'wcapf_post_meta_text_items', $meta_values, $this->field );
	}

	/**
	 * Gets the distinct meta values as items.
	 *
	 * @return array
	 */
	protected function get_text_automatic_values() {
		$meta_values = array();

		$_meta_values = $this->get_meta_values();

		foreach ( $_meta_values as $value ) {
			$meta_value    = $value['meta_value'];
			$product_count = $value['meta_count'];

			$meta_values[ $meta_value ] = array(
				'id'    => $meta_value,
				'name'  => $meta_value,
				'count' => $product_count,
			);
		}

		return $meta_values;
	}

	/**
	 * Queries the distinct meta values for the meta key.
	 *
	 * @return array
	 */
	protected function get_meta_values() {
		$query = $this->get_sql_query();

		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom counting query.
		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Builds the SQL query for post-meta value counts.
	 *
	 * @param string $filter_type The filter type.
	 *
	 * @return string
	 */
	private function get_sql_query( $filter_type = 'non-filtered' ) {
		global $wpdb;

		$post_statuses = wcapf()->data->filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		$query = array();
		$join  = '';
		$where = '';

		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS meta_count, metas.meta_value";
		$query['from']   = "FROM $wpdb->posts";

		$join .= "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		if ( 'filtered' === $filter_type && $update_count ) {
			$join .= $this->query_builder->get_join_clause();
		}

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";

		$status_placeholders = implode( ',', array_fill( 0, count( $post_statuses ), '%s' ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$where .= $wpdb->prepare( " AND $wpdb->posts.post_status IN ($status_placeholders)", $post_statuses );
		$where .= $wpdb->prepare( ' AND metas.meta_key = %s', $this->meta_key );
		$where .= " AND metas.meta_value <> ''";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';
		$where .= $where_sql;

		if ( 'non-filtered' === $filter_type ) {
			$limit_options = $this->field->get_sub_field_value( 'limit_options' );

			if ( 'include' === $limit_options ) {
				$include_ids          = $this->field->get_sub_field_value( 'limit_values_by_id' );
				$include_ids          = explode( ',', $include_ids );
				$include_placeholders = implode( ',', array_fill( 0, count( $include_ids ), '%s' ) );

				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
				$where .= $wpdb->prepare( " AND metas.meta_value IN ($include_placeholders)", $include_ids );
			} elseif ( 'exclude' === $limit_options ) {
				$exclude_ids          = $this->field->get_sub_field_value( 'exclude_values_id' );
				$exclude_ids          = explode( ',', $exclude_ids );
				$exclude_placeholders = implode( ',', array_fill( 0, count( $exclude_ids ), '%s' ) );

				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
				$where .= $wpdb->prepare( " AND metas.meta_value NOT IN ($exclude_placeholders)", $exclude_ids );
			}
		}

		if ( 'filtered' === $filter_type && $update_count ) {
			$where .= $this->query_builder->get_where_clause( $this->query_type, $this->filter_key );
		}

		$query['where']    = $where;
		$query['group_by'] = 'GROUP BY metas.meta_value';

		return implode( ' ', $query );
	}

	/**
	 * Updates the item counts based on the current filter.
	 *
	 * @param array $meta_values List of all meta values.
	 *
	 * @return array
	 */
	protected function get_updated_meta_values_count( $meta_values ) {
		if ( empty( $meta_values ) ) {
			return array();
		}

		$filtered_count = $this->get_filtered_meta_product_counts();
		$updated_count  = array();

		foreach ( $meta_values as $meta_value => $data ) {
			$data['count'] = isset( $filtered_count[ $meta_value ] ) ? $filtered_count[ $meta_value ] : 0;

			$updated_count[ $meta_value ] = $data;
		}

		return $updated_count;
	}

	/**
	 * Gets the filtered product counts keyed by meta value.
	 *
	 * @return array
	 */
	protected function get_filtered_meta_product_counts() {
		$query = $this->get_sql_query( 'filtered' );

		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom counting query.
		$results = $wpdb->get_results( $query, ARRAY_A );

		return wp_list_pluck( $results, 'meta_count', 'meta_value' );
	}
}
