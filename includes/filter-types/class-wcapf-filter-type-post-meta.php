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
		$this->hide_empty  = isset( $field_data['hide_empty'] );
		$this->filter_key  = isset( $field_data['filter_key'] ) ? $field_data['filter_key'] : '';
		$this->get_options = isset( $field_data['get_options'] ) ? $field_data['get_options'] : '';
	}

	/**
	 * Prepare the meta values for the post meta.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$all_values = $this->get_meta_values();
		$with_count = $this->get_filtered_meta_product_counts( $all_values );

		// echo '<pre>';
		// print_r( $all_values );
		// echo '</pre>';

		return array(
			array(
				'id'   => 'hello',
				'name' => 'Hello',
			),
			array(
				'id'   => 'shamim',
				'name' => 'Aurin',
			),
		);
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

		return $wpdb->get_col(
			$wpdb->prepare(
				"
					SELECT DISTINCT($wpdb->postmeta.meta_value)
			        FROM $wpdb->posts
			        LEFT JOIN $wpdb->postmeta
			        ON $wpdb->posts.ID = $wpdb->postmeta.post_id
			        WHERE $wpdb->posts.post_type = %s
					AND $wpdb->postmeta.meta_key = %s
					ORDER BY $wpdb->postmeta.meta_value * 1
				",
				'product',
				$this->post_meta
			)
		);
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
		$query['join']   = "
			INNER JOIN $wpdb->postmeta AS meta_relationships ON $wpdb->posts.ID = meta_relationships.post_id
			INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id
		";

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= " AND metas.meta_key = '$this->post_meta'";

		// TODO: Filter by given values.
		// $where .= 'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';

		$where .= $this->get_common_where_clauses();

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_get_filtered_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $wpdb->get_results( $query, ARRAY_A );
	}

}
