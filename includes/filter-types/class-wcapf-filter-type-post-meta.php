<?php
/**
 * WCAPF_Filter_Type_Post_Meta class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter_Type_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Type_Post_Meta extends WCAPF_Filter_Type {

	/**
	 * Post meta
	 *
	 * @var string
	 */
	protected $post_meta;

	/**
	 * Post meta value type
	 *
	 * @var string
	 */
	protected $value_type;

	/**
	 * Query type
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * Hide empty
	 *
	 * @var bool
	 */
	protected $hide_empty;

	/**
	 * Filter key
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * The way to get the options
	 *
	 * @var string
	 */
	protected $get_options;

	/**
	 * The constructor.
	 *
	 * @param array $field_data The field data.
	 */
	public function __construct( $field_data ) {
		$this->set_properties( $field_data );
	}

	/**
	 * Sets the properties.
	 *
	 * @param array $field_data The field data.
	 *
	 * @return void
	 */
	private function set_properties( $field_data ) {
		$this->post_meta   = isset( $field_data['post_meta'] ) ? $field_data['post_meta'] : '';
		$this->value_type  = isset( $field_data['value_type'] ) ? $field_data['value_type'] : '';
		$this->query_type  = isset( $field_data['query_type'] ) ? $field_data['query_type'] : '';
		$this->filter_key  = isset( $field_data['filter_key'] ) ? $field_data['filter_key'] : '';
		$this->get_options = isset( $field_data['get_options'] ) ? $field_data['get_options'] : '';

		$this->hide_empty = false;

		if ( isset( $field_data['hide_empty'] ) ) {
			if ( $field_data['hide_empty'] ) {
				$this->hide_empty = true;
			}
		}
	}

	/**
	 * Prepare the meta values for the post meta.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$_meta_values = $this->get_meta_values();
		$meta_values  = array();

		// Parse the array.
		foreach ( $_meta_values as $value ) {
			$meta_value    = $value['meta_value'];
			$product_count = $value['meta_count'];

			$_meta_value = array(
				'id'    => $meta_value,
				'name'  => $meta_value,
				'count' => $product_count,
			);

			// TODO: Use a filter to alter the term data
			$meta_values[ $meta_value ] = $_meta_value;
		}

		$meta_values = $this->get_updated_meta_values_count( $meta_values );

		// TODO: Use a filter to alter the "and terms"
		return $this->filter_by_hide_empty( $meta_values );
	}

	/**
	 * Gets the meta values for the meta key.
	 *
	 * @source https://stackoverflow.com/a/54017483
	 * @source https://stackoverflow.com/a/10633985
	 *
	 * @return array
	 * @noinspection SqlNoDataSourceInspection
	 */
	private function get_meta_values() {
		global $wpdb;

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		// Generate query.
		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS meta_count, metas.meta_value";
		$query['from']   = "FROM $wpdb->posts";

		$join = "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= " AND metas.meta_key = '$this->post_meta'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];

		// TODO: Include the search clause.

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Updates the terms count based on the current filter.
	 *
	 * @param array $meta_values List of all meta values.
	 *
	 * @return array
	 */
	private function get_updated_meta_values_count( $meta_values ) {
		if ( ! $meta_values ) {
			return array();
		}

		$meta_value_ids            = wp_list_pluck( $meta_values, 'id' );
		$active_meta_values        = $this->get_filtered_meta_product_counts( $meta_value_ids );
		$updated_meta_values_count = array();

		foreach ( $meta_values as $meta_value => $data ) {
			$data['count'] = isset( $active_meta_values[ $meta_value ] ) ? $active_meta_values[ $meta_value ] : 0;

			$updated_meta_values_count[ $meta_value ] = $data;
		}

		return $updated_meta_values_count;
	}

	/**
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param array $meta_values List of all meta values for the meta key.
	 *
	 * @return array The filtered term product counts.
	 */
	private function get_filtered_meta_product_counts( $meta_values ) {
		global $wpdb;

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		// Generate query.
		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS meta_count, metas.meta_value";
		$query['from']   = "FROM $wpdb->posts";

		$join = "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= 'AND metas.meta_value IN (' . implode( ',', $meta_values ) . ')';
		$where .= " AND metas.meta_key = '$this->post_meta'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];

		$main_query_type = WCAPF_Product_Filter::instance()->get_field_relations();
		$main_query      = WC_Query::get_main_query();
		$post__in        = isset( $main_query->query_vars['post__in'] ) ? $main_query->query_vars['post__in'] : array();

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				if ( $post__in ) {
					$post_in = implode( ',', $post__in );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				$filtered_product_ids = $this->get_product_ids_by_other_filters();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$filtered_product_ids = $this->get_excluded_filtered_product_ids();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				// No where clause required.
			}
		}

		// TODO: Include search clause.

		// $where .= $this->get_common_where_clauses();

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_filtered_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $query, ARRAY_A );

		return wp_list_pluck( $results, 'meta_count', 'meta_value' );
	}

}
