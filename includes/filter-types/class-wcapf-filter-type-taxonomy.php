<?php
/**
 * WCAPF_Filter_Type_Taxonomy class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

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
		$args = apply_filters(
			'wcapf_get_terms_args',
			array(
				'taxonomy'               => $this->taxonomy,
				'hide_empty'             => false,
				'count'                  => true,
				'update_term_meta_cache' => false,
			),
			$this->field
		);

		$_terms = get_terms( $args );
		$terms  = array();

		// If there was an error fetching the terms, return empty array.
		if ( is_wp_error( $_terms ) ) {
			return $terms;
		}

		foreach ( $_terms as $_term ) {
			$term_id   = $_term->term_id;
			$count     = $_term->count;
			$parent_id = $_term->parent;
			$name      = $_term->name;

			$_term = array(
				'id'        => $term_id,
				'name'      => $name,
				'count'     => $count,
				'parent_id' => $parent_id,
			);

			$terms[ $term_id ] = $_term;
		}

		$terms = apply_filters( 'wcapf_taxonomy_terms', $terms, $this->field );
		$terms = $this->get_updated_terms_count( $terms );
		$terms = $this->filter_by_hide_empty( $terms );

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
	 * Updates the terms count based on the current filter.
	 *
	 * @param array $terms List of all terms.
	 *
	 * @return array
	 */
	private function get_updated_terms_count( $terms ) {
		if ( ! $terms ) {
			return array();
		}

		$term_ids       = wp_list_pluck( $terms, 'id' );
		$filtered_count = $this->get_filtered_term_product_counts( $term_ids );
		$updated_count  = array();

		foreach ( $terms as $term_id => $term ) {
			$term['count'] = isset( $filtered_count[ $term_id ] ) ? $filtered_count[ $term_id ] : 0;

			$updated_count[ $term_id ] = $term;
		}

		// The pad count logic should only run for hierarchical taxonomies like product categories.
		if ( ! is_taxonomy_hierarchical( $this->taxonomy ) ) {
			return $updated_count;
		}

		/**
		 * Pad count logic starts.
		 *
		 * @see _pad_term_counts
		 */

		// Touch every ancestor's lookup row for each post in each term.
		foreach ( $term_ids as $term_id ) {
			$child     = $term_id;
			$ancestors = array();

			// phpcs:ignore Generic.Files.LineLength.TooLong, WordPress.CodeAnalysis.AssignmentInCondition.FoundInWhileCondition
			while ( ! empty( $updated_count[ $child ] ) && $parent = $updated_count[ $child ]['parent_id'] ) {
				$ancestors[] = $child;

				if ( ! empty( $filtered_count[ $term_id ] ) ) {
					if ( is_array( $filtered_count[ $term_id ] ) ) {
						foreach ( $filtered_count[ $term_id ] as $parent_child_term_id => $parent_child_term_count ) {
							$filtered_count[ $parent ][ $parent_child_term_id ] = $parent_child_term_count;
						}
					} else {
						if ( isset( $filtered_count[ $parent ] ) && ! is_array( $filtered_count[ $parent ] ) ) {
							$filtered_count[ $parent ] = array( $filtered_count[ $parent ] );
						}

						$filtered_count[ $parent ][ $term_id ] = $filtered_count[ $term_id ];
					}
				}

				$child = $parent;

				if ( in_array( $parent, $ancestors, true ) ) {
					break;
				}
			}
		}

		// Transfer the touched cells.
		foreach ( $filtered_count as $id => $count ) {
			if ( isset( $updated_count[ $id ] ) ) {
				if ( is_array( $count ) ) {
					$count = array_sum( $count );
				}

				$updated_count[ $id ]['count'] = $count;
			}
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
	private function get_filtered_term_product_counts( $term_ids ) {
		global $wpdb;

		list( $meta_query_sql, $tax_query_sql, $search_query ) = $this->get_query_data();

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

		$query['join'] = $join;

		$where .= "WHERE $wpdb->posts.post_type IN ('product')";
		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= 'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];
		$where .= $search_query ? ' AND ' . $search_query : '';

		$where .= $this->get_post_in_clause();

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY terms.term_id';

		$query = apply_filters( 'wcapf_terms_query_sql', $query, $this->field );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
	}

	/**
	 * Builds the taxonomy tree.
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

		foreach ( $terms as $term ) {
			if ( 0 === $increment ) {
				$depth ++;
			}

			// phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
			if ( $term['parent_id'] == $parent_id ) {
				$children = $this->build_tree( $terms, $term['id'], $depth );

				if ( $children ) {
					$term['children'] = $children;
				}

				$term['depth'] = $depth;

				$tree[ $term['id'] ] = $term;
			}

			$increment ++;
		}

		return $tree;
	}

}
