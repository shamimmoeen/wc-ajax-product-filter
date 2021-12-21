<?php
/**
 * WCAPF_Filter_Type class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter_Type class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Filter_Type {

	/**
	 * Gets the items.
	 *
	 * @return array
	 */
	public function get_items() {
		return $this->prepare_items();
	}

	/**
	 * Prepare the items.
	 *
	 * @return array
	 */
	abstract protected function prepare_items();

	/**
	 * Gets the query data.
	 *
	 * @return array
	 */
	protected function get_query_data() {
		global $wpdb;

		$tax_query  = WC_Query::get_main_tax_query();
		$meta_query = WC_Query::get_main_meta_query();

		$meta_query     = new WP_Meta_Query( $meta_query );
		$tax_query      = new WP_Tax_Query( $tax_query );
		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );

		return array( $meta_query_sql, $tax_query_sql );
	}

	/**
	 * Gets the common where clauses for the sql query.
	 *
	 * @return string
	 */
	protected function get_common_where_clauses() {
		global $wpdb;

		$main_query = WC_Query::get_main_query();
		$post__in   = $main_query->query_vars['post__in'];
		$where      = '';

		if ( $post__in ) {
			$post_in = implode( ',', $post__in );

			$where .= " AND $wpdb->posts.ID IN ( $post_in )";
		}

		$search = WC_Query::get_main_search_query_sql();

		if ( $search ) {
			$where .= ' AND ' . $search;
		}

		return $where;
	}

}
