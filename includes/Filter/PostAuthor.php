<?php
/**
 * The post-author filter element.
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
 * Filters products by their author (post_author), lists the authors as options
 * and counts the products of each.
 */
class PostAuthor extends AbstractFilter implements Filterable {

	/**
	 * The post property to filter on.
	 *
	 * @var string
	 */
	protected $post_property;

	/**
	 * Constructor.
	 *
	 * @param array $entry The stored filter entry.
	 */
	public function __construct( array $entry ) {
		parent::__construct( $entry );

		$this->post_property = $this->field->post_property;
	}

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

		$join             = '';
		$clauses          = array();
		$or_filter_values = array();

		$alias       = $this->query_builder->get_table_join_alias( $this->property() );
		$value_alias = "$wpdb->posts.$alias";

		$property_values = $this->query_builder->get_chosen_filter_values( $this->selected_value() );

		foreach ( $property_values as $value ) {
			if ( $this->field->get_sub_field_value( 'show_in_active_filters' ) ) {
				$active_filters[ $value ] = $this->get_label_for_post_author( $value );
			}

			if ( 'or' === $query_type ) {
				$or_filter_values[] = $value;
			} else {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$clauses[] = $wpdb->prepare( "$value_alias = %s", $value );
			}
		}

		$where = $this->get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses );

		return array(
			'query_type'     => $query_type,
			'values'         => $property_values,
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
	 * The validated post property to filter on.
	 *
	 * @return string
	 */
	protected function property() {
		$allowed = array( 'post_author' );

		return in_array( $this->post_property, $allowed, true ) ? $this->post_property : 'post_author';
	}

	/**
	 * Resolves a post-author value to its display label.
	 *
	 * @param string $value The selected author value.
	 *
	 * @return string
	 */
	protected function get_label_for_post_author( $value ) {
		$users = get_users(
			array(
				'fields'  => array( 'ID', 'display_name' ),
				'include' => array( $value ),
				'number'  => 1,
			)
		);

		if ( empty( $users ) ) {
			return $value; // Fall back to raw value.
		}

		/**
		 * The user object.
		 *
		 * @var \WP_User $user
		 */
		$user = $users[0];

		return $user->display_name;
	}

	/**
	 * Prepares the post-author option items with their product counts.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$args = array(
			'fields' => array( 'ID', 'display_name' ),
			'number' => 99, // We are limiting the maximum number of users considering larger sites.
		);

		$args   = apply_filters( 'wcapf_get_post_author_args', $args, $this->field );
		$_users = get_users( $args );
		$users  = array();

		foreach ( $_users as $user ) {
			/**
			 * The user object.
			 *
			 * @var \WP_User $user
			 */
			$users[ $user->ID ] = array(
				'id'    => $user->ID,
				'name'  => $user->display_name,
				'count' => 0,
			);
		}

		$items = $this->get_filtered_product_counts( $users );
		$items = $this->filter_by_hide_empty( $items );

		return apply_filters( 'wcapf_post_author_items', $items, $this->field );
	}

	/**
	 * Counts the products per author, scoped to the viewed products.
	 *
	 * @param array $items The filter items keyed by author ID.
	 *
	 * @return array
	 */
	protected function get_filtered_product_counts( $items ) {
		global $wpdb;

		$post_statuses = wcapf()->data->filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		$property = $this->property();

		$query = array();
		$join  = '';
		$where = '';

		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS count, $wpdb->posts.$property AS author_id";
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

		if ( $update_count ) {
			$where .= $this->query_builder->get_where_clause( $this->query_type, $this->filter_key );
		}

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY author_id';

		$sql = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, PluginCheck.Security.DirectDB.UnescapedDBParameter -- Custom counting query.
		$filtered_count = $wpdb->get_results( $sql, ARRAY_A );
		$filtered_count = wp_list_pluck( $filtered_count, 'count', 'author_id' );

		return $this->sync_items_count( $items, $filtered_count );
	}
}
