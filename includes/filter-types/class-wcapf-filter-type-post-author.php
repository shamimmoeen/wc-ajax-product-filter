<?php
/**
 * WCAPF_Filter_Type_Post_Author class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/filter-types
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Type_Post_Author class.
 *
 * @since 4.0.0
 */
class WCAPF_Filter_Type_Post_Author extends WCAPF_Filter_Type {

	/**
	 * Post Property.
	 *
	 * @var string
	 */
	protected $post_property;

	protected function set_properties() {
		$field = $this->field;

		$this->post_property = $field->post_property;
	}

	/**
	 * Prepare the meta values for the post meta.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$_items = array();

		if ( 'automatically' === $this->field->get_options ) {
			$field = $this->field;
			$args  = array();

			$limit_options = $field->get_sub_field_value( 'limit_options' );

			if ( 'include' === $limit_options ) {
				$args['include'] = $field->get_sub_field_value( 'limit_values_by_id' );
			} elseif ( 'exclude' === $limit_options ) {
				$args['exclude'] = $field->get_sub_field_value( 'exclude_values_id' );
			} elseif ( 'user_roles' === $limit_options ) {
				$args['role__in'] = $field->get_sub_field_value( 'include_user_roles' );
			}

			$args = apply_filters( 'wcapf_get_post_author_args', $args );

			$_items = WCAPF_Product_Filter_Utils::get_users( $args );
		}

		$items = $this->get_filtered_product_counts( $_items );
		$items = $this->filter_by_hide_empty( $items );

		return apply_filters( 'wcapf_post_author_items', $items, $this->field );
	}

	private function get_filtered_product_counts( $items ) {
		global $wpdb;

		$query = $this->get_sql_query();

		$filtered_count = $wpdb->get_results( $query, ARRAY_A );
		$filtered_count = wp_list_pluck( $filtered_count, 'count', 'author_id' );

		return $this->get_filtered_ranges_counts( $items, $filtered_count );
	}

	private function get_sql_query() {
		global $wpdb;

		$helper = new WCAPF_Helper();
		$utils  = new WCAPF_Product_Filter_Utils();

		$post_statuses = $helper::filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query ) = $utils::get_main_query_data();

		$query = array();
		$join  = '';
		$where = '';

		$property = $this->post_property;

		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS count, $wpdb->posts.$property AS author_id";;
		$query['from'] = "FROM $wpdb->posts";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		if ( $update_count ) {
			$join .= $utils::get_join_clause();
		}

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";
		$where .= " AND $wpdb->posts.post_status IN ('" . implode( "','", $post_statuses ) . "')";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';

		if ( $update_count ) {
			$where .= $utils::get_where_clause( $this->query_type, $this->filter_key );
		}

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY author_id';

		$query = apply_filters( 'wcapf_post_author_query_sql', $query, $this->field );

		return implode( ' ', $query );
	}

}
