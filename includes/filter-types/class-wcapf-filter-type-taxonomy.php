<?php
/**
 * WCAPF_Filter_Type_Taxonomy class.
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
 * WCAPF_Filter_Type_Taxonomy class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Type_Taxonomy extends WCAPF_Filter_Type {

	/**
	 * Taxonomy
	 *
	 * @var string
	 */
	protected $taxonomy;

	/**
	 * Is Hierarchical
	 *
	 * @var bool
	 */
	protected $hierarchical;

	/**
	 * Sets the properties.
	 *
	 * @return void
	 */
	protected function set_properties() {
		$field = $this->field;

		$this->taxonomy     = $field->taxonomy;
		$this->hierarchical = $field->hierarchical;
	}

	/**
	 * Prepare the terms for the taxonomy.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$default = array(
			'taxonomy'               => $this->taxonomy,
			'hide_empty'             => false,
			'count'                  => true,
			'update_term_meta_cache' => false,
		);

		$args   = apply_filters( 'wcapf_get_terms_args', $default, $this->field );
		$_terms = get_terms( $args );
		$terms  = array();

		// If there was an error fetching the terms, return empty array.
		if ( is_wp_error( $_terms ) ) {
			return $terms;
		}

		foreach ( $_terms as $_term ) {
			/**
			 * The term object.
			 *
			 * @var WP_Term $_term
			 */
			$term_id   = $_term->term_id;
			$count     = $_term->count;
			$parent_id = $_term->parent;
			$name      = $_term->name;
			$slug      = rawurldecode( $_term->slug );

			$_term = array(
				'id'        => $term_id,
				'name'      => $name,
				'slug'      => $slug,
				'count'     => $count,
				'parent_id' => $parent_id,
			);

			$terms[ $term_id ] = $_term;
		}

		$terms = $this->get_updated_terms_count( $terms );
		$terms = $this->filter_by_hide_empty( $terms );
		$terms = apply_filters( 'wcapf_taxonomy_terms', $terms, $this->field );

		// If taxonomy is non-hierarchical then don't need to build the tree.
		if ( ! is_taxonomy_hierarchical( $this->taxonomy ) ) {
			return $terms;
		}

		// If hierarchical display is disabled then don't need to build the tree.
		if ( ! $this->hierarchical ) {
			return $terms;
		}

		return $this->build_tree( $terms );
	}

	/**
	 * Updates the taxonomy term counts based on the current filter.
	 *
	 * @param array $terms List of all terms.
	 *
	 * @return array
	 */
	private function get_updated_terms_count( $terms ) {
		if ( ! $terms ) {
			return array();
		}

		$term_ids      = wp_list_pluck( $terms, 'id' );
		$updated_count = array();

		$attributes = wc_get_attribute_taxonomy_names();
		$taxonomy   = $this->taxonomy;

		if ( in_array( $taxonomy, $attributes, true ) && WCAPF_Helper::filtering_via_lookup_table_is_active() ) {
			$filtered_count = $this->get_filtered_term_product_counts_using_lookup_table( $term_ids );
		} elseif ( is_taxonomy_hierarchical( $taxonomy ) ) {
			$filtered_count = $this->get_hierarchical_term_product_counts( $term_ids );
		} else {
			$filtered_count = $this->get_non_hierarchical_term_product_counts( $term_ids );
		}

		foreach ( $terms as $term_id => $term ) {
			$term['count'] = isset( $filtered_count[ $term_id ] ) ? $filtered_count[ $term_id ] : 0;

			$updated_count[ $term_id ] = $term;
		}

		return $updated_count;
	}

	/**
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param array $term_ids List of all term ids.
	 *
	 * @return array The filtered term product counts.
	 */
	private function get_filtered_term_product_counts_using_lookup_table( $term_ids ) {
		global $wpdb;

		$post_statuses  = WCAPF_Helper::filterable_post_statuses();
		$update_count   = $this->auto_count_enabled();
		$hide_stock_out = WCAPF_Helper::hide_stock_out_items();

		$lookup_table_name = $wpdb->prefix . 'wc_product_attributes_lookup';

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data(
			$lookup_table_name,
			'product_or_parent_id'
		);

		$query = array();
		$join  = '';
		$where = '';

		$query['select'] = 'SELECT COUNT(DISTINCT product_or_parent_id) as term_count, term_id as term_count_id';

		$query['from'] = "FROM $lookup_table_name";

		$join .= "INNER JOIN $wpdb->posts ON $wpdb->posts.ID = $lookup_table_name.product_or_parent_id";
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

		$term_ids_sql = WCAPF_Product_Filter_Utils::get_ids_sql( $term_ids );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table name is internal.
		$where .= $wpdb->prepare( " AND $lookup_table_name.taxonomy = %s", $this->taxonomy );
		$where .= " AND $lookup_table_name.term_id IN $term_ids_sql";

		$where .= $hide_stock_out ? ' AND in_stock = 1' : '';

		if ( $update_count ) {
			$where .= WCAPF_Product_Filter_Utils::get_where_clause( $this->query_type, $this->filter_key );
		}

		$query['where'] = $where;

		$query['group_by'] = "GROUP BY $lookup_table_name.term_id";

		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom counting query.
		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
	}

	/**
	 * Gets hierarchical term product counts.
	 *
	 * @param array $term_ids List of term IDs.
	 *
	 * @return array
	 */
	private function get_hierarchical_term_product_counts( $term_ids ) {
		global $wpdb;

		$post_statuses = WCAPF_Helper::filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		$query  = array();
		$select = '';
		$join   = '';
		$where  = '';

		$select .= "SELECT DISTINCT $wpdb->posts.ID AS product_id, terms.term_id AS term_id";

		$query['select'] = $select;

		$query['from'] = "FROM $wpdb->posts";

		$join .= "INNER JOIN $wpdb->term_relationships AS term_relationships ON $wpdb->posts.ID = term_relationships.object_id";
		$join .= " INNER JOIN $wpdb->term_taxonomy AS term_taxonomy USING(term_taxonomy_id)";
		$join .= " INNER JOIN $wpdb->terms AS terms USING(term_id)";
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

		if ( $update_count ) {
			$where .= WCAPF_Product_Filter_Utils::get_where_clause( $this->query_type, $this->filter_key );
		}

		// Restrict to the current taxonomy to prevent term_id collisions.
		$where .= $wpdb->prepare( ' AND term_taxonomy.taxonomy = %s', $this->taxonomy );

		$query['where'] = $where;

		$sql = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom counting query.
		$results = $wpdb->get_results( $sql, ARRAY_A );

		$term_products = array();

		foreach ( $results as $row ) {
			$term_id    = (int) $row['term_id'];
			$product_id = (int) $row['product_id'];

			if ( ! isset( $term_products[ $term_id ] ) ) {
				$term_products[ $term_id ] = array();
			}

			// Store as array map for efficient de-duplication.
			$term_products[ $term_id ][ $product_id ] = true;
		}

		// Query all terms for this taxonomy to ensure they are all in the final array.
		$_all_terms = get_terms(
			array(
				'taxonomy'   => $this->taxonomy,
				'hide_empty' => false,
				'fields'     => 'ids',
			)
		);

		$hierarchy           = _get_term_hierarchy( $this->taxonomy );
		$aggregated_products = array();
		$final_counts        = array();

		foreach ( $_all_terms as $term_id ) {
			$products = $this->aggregate_term_products( $term_id, $hierarchy, $term_products, $aggregated_products );

			$final_counts[ $term_id ] = count( $products );
		}

		return $final_counts;
	}

	/**
	 * Recursively aggregate term product IDs for exact distinct counting in hierarchical taxonomies.
	 *
	 * @param int   $term_id              The current term ID.
	 * @param array $hierarchy            The taxonomy hierarchy map.
	 * @param array $term_products        The direct term products map.
	 * @param array &$aggregated_products The array storing the final aggregated products.
	 *
	 * @return array The aggregated products map for the term.
	 */
	private function aggregate_term_products( $term_id, $hierarchy, $term_products, &$aggregated_products ) {
		if ( isset( $aggregated_products[ $term_id ] ) ) {
			return $aggregated_products[ $term_id ];
		}

		$products = isset( $term_products[ $term_id ] ) ? $term_products[ $term_id ] : array();

		if ( isset( $hierarchy[ $term_id ] ) ) {
			foreach ( $hierarchy[ $term_id ] as $child_id ) {
				$child_products = $this->aggregate_term_products( $child_id, $hierarchy, $term_products, $aggregated_products );

				// Union the child products.
				foreach ( $child_products as $product_id => $dummy ) {
					$products[ $product_id ] = true;
				}
			}
		}

		$aggregated_products[ $term_id ] = $products;

		return $products;
	}

	/**
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param array $term_ids List of all term ids.
	 *
	 * @return array The filtered term product counts.
	 */
	private function get_non_hierarchical_term_product_counts( $term_ids ) {
		global $wpdb;

		$post_statuses = WCAPF_Helper::filterable_post_statuses();
		$update_count  = $this->auto_count_enabled();

		list( $meta_query_sql, $tax_query_sql, $search_query, $where_sql ) = $this->get_main_query_data();

		$query  = array();
		$select = '';
		$join   = '';
		$where  = '';

		$select .= "SELECT COUNT(DISTINCT $wpdb->posts.ID) ";
		$select .= 'AS term_count, terms.term_id AS term_count_id';

		$query['select'] = $select;

		$query['from'] = "FROM $wpdb->posts";

		$join .= "INNER JOIN $wpdb->term_relationships AS term_relationships ON $wpdb->posts.ID = term_relationships.object_id";
		$join .= " INNER JOIN $wpdb->term_taxonomy AS term_taxonomy USING(term_taxonomy_id)";
		$join .= " INNER JOIN $wpdb->terms AS terms USING(term_id)";
		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		if ( $update_count ) {
			$join .= WCAPF_Product_Filter_Utils::get_join_clause();
		}

		$query['join'] = $join;

		$term_ids_sql = WCAPF_Product_Filter_Utils::get_ids_sql( $term_ids );

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";

		$status_placeholders = implode( ',', array_fill( 0, count( $post_statuses ), '%s' ) );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$where .= $wpdb->prepare( " AND $wpdb->posts.post_status IN ($status_placeholders)", $post_statuses );
		$where .= " AND terms.term_id IN $term_ids_sql";
		$where .= $wpdb->prepare( ' AND term_taxonomy.taxonomy = %s', $this->taxonomy );

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';
		$where .= $where_sql;

		if ( $update_count ) {
			$where .= WCAPF_Product_Filter_Utils::get_where_clause( $this->query_type, $this->filter_key );
		}

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY terms.term_id';

		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom counting query.
		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
	}

	/**
	 * Builds the taxonomy tree.
	 *
	 * @source https://stackoverflow.com/a/8587437
	 *
	 * @param array   $terms     The terms.
	 * @param integer $parent_id The parent identifier.
	 * @param int     $depth     The current depth.
	 *
	 * @return array The taxonomy tree.
	 */
	private function build_tree( $terms, $parent_id = 0, $depth = 0 ) {
		$tree      = array();
		$increment = 0;

		foreach ( $terms as $term_id => $term ) {
			if ( 0 === $increment ) {
				++$depth;
			}

			if ( $term['parent_id'] === $parent_id ) {
				$children = $this->build_tree( $terms, $term_id, $depth );

				if ( $children ) {
					$term['children'] = $children;
				}

				$term['depth'] = $depth;

				$tree[ $term_id ] = $term;
			}

			++$increment;
		}

		return $tree;
	}
}
