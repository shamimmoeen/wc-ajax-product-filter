<?php
/**
 * WCAPF_Post_Meta class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Post_Meta {

	/**
	 * The walker class instance.
	 *
	 * @var WCAPF_Walker_Post_Meta
	 */
	public $walker;

	/**
	 * Constructor.
	 *
	 * @param WCAPF_Walker_Post_Meta $walker The walker class instance.
	 */
	public function __construct( $walker ) {
		$this->walker = $walker;
	}

	/**
	 * Hello World.
	 *
	 * @return string[][]
	 */
	public function get_terms() {
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

		$walker    = $this->get_walker();
		$post_type = 'product';
		$meta_key  = $walker->post_meta;

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
				$post_type,
				$meta_key
			)
		);
	}

	/**
	 * Gets the walker class instance.
	 *
	 * @return WCAPF_Walker_Post_Meta
	 */
	public function get_walker() {
		return $this->walker;
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
		$walker   = $this->get_walker();
		$meta_key = $walker->post_meta;

		global $wpdb;

		$main_query = WC_Query::get_main_query();
		$tax_query  = WC_Query::get_main_tax_query();
		$meta_query = WC_Query::get_main_meta_query();

		$meta_query     = new WP_Meta_Query( $meta_query );
		$tax_query      = new WP_Tax_Query( $tax_query );
		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );
		$post__in       = $main_query->query_vars['post__in'];

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
		$where .= " AND metas.meta_key = '$meta_key'";

		// todo
		// $where .= 'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';

		$query['where'] = $where;

		if ( $post__in ) {
			$post_in = implode( ',', $post__in );

			$query['where'] .= " AND $wpdb->posts.ID IN ( $post_in )";
		}

		$search = WC_Query::get_main_search_query_sql();

		if ( $search ) {
			$query['where'] .= ' AND ' . $search;
		}

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_get_filtered_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $query, ARRAY_A );

		echo '<pre>';
		print_r( $results );
		echo '</pre>';

		return array();
	}

}
