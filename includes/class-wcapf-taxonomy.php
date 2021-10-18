<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Taxonomy class.
 *
 * @since 3.0.0
 */
class WCAPF_Taxonomy {

	/**
	 * The walker class instance.
	 *
	 * @var WCAPF_Taxonomy_Walker
	 */
	public $walker;

	/**
	 * Constructor.
	 *
	 * @param $walker WCAPF_Taxonomy_Walker
	 */
	public function __construct( $walker ) {
		$this->walker = $walker;
	}

	/**
	 * Gets the taxonomy terms.
	 *
	 * @return array
	 */
	public function get_terms() {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return array();
		}

		$walker     = $this->get_walker();
		$taxonomy   = $walker->taxonomy;
		$query_type = $walker->query_type;

		$args = array(
			'taxonomy'               => $taxonomy,
			'hide_empty'             => false,
			'count'                  => true,
			'update_term_meta_cache' => false,
		);

		// TODO: Use a filter to alter the arguments

		$_terms = get_terms( $args );
		$terms  = array();

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

			// TODO: Use a filter to alter the term data

			$terms[ $term_id ] = $_term;
		}

		if ( 'or' === $query_type ) {
			$terms = $this->filter_by_hide_empty( $terms );
			$terms = $this->filter_by_child_only( $terms );

			// TODO: Use a filter to alter the "or terms"

			return $this->build_tree( $terms );
		}

		// taxonomy hierarchical
		// query_type = AND
		// show count
		// hide empty

		$terms = $this->get_updated_terms_count( $terms );
		$terms = $this->filter_by_hide_empty( $terms );
		$terms = $this->filter_by_child_only( $terms );

		// TODO: Use a filter to alter the "and terms"

		return $this->build_tree( $terms );
	}

	/**
	 * Gets the walker class instance.
	 *
	 * @return WCAPF_Taxonomy_Walker
	 */
	public function get_walker() {
		return $this->walker;
	}

	/**
	 * @param array $terms
	 *
	 * @return array
	 */
	private function filter_by_hide_empty( $terms ) {
		$walker     = $this->get_walker();
		$hide_empty = $walker->hide_empty;

		if ( $hide_empty ) {
			$terms_with_count = array();

			foreach ( $terms as $em_term ) {
				$em_term_id = $em_term['id'];
				if ( $em_term['count'] ) {
					$terms_with_count[ $em_term_id ] = $em_term;
				}
			}

			$terms = $terms_with_count;
		}

		return $terms;
	}

	/**
	 * @param array $terms
	 *
	 * @return array
	 */
	private function filter_by_child_only( $terms ) {
		$walker     = $this->get_walker();
		$child_only = $walker->show_children_only;

		if ( $child_only ) {
			$child_only_filtered = array();
			$allowed             = $this->get_child_only_term_ids( $walker, $terms );

			foreach ( $terms as $oc_term ) {
				$oc_term_id = $oc_term['id'];

				if ( in_array( $oc_term_id, $allowed ) ) {
					$child_only_filtered[ $oc_term_id ] = $oc_term;
				}
			}

			$terms = $child_only_filtered;
		}

		return $terms;
	}

	/**
	 * @param WCAPF_Taxonomy_Walker $walker
	 * @param array                 $terms
	 */
	private function get_child_only_term_ids( $walker, $terms ) {
		$taxonomy = $walker->taxonomy;

		$active_filters    = $walker->get_active_filters(); // value
		$ancestors         = array();
		$children          = array();
		$first_level_terms = array();

		foreach ( $active_filters as $term_id ) {
			$ancestors = array_unique( array_merge( $ancestors, get_ancestors( $term_id, $taxonomy ) ) );
		}

		foreach ( $terms as $term ) {
			if ( in_array( $term['parent_id'], $active_filters ) ) {
				$children = array_unique( array_merge( $children, array( $term['id'] ) ) );
			}

			if ( $term['parent_id'] === 0 ) {
				$first_level_terms = array_unique( array_merge( $first_level_terms, array( $term['id'] ) ) );
			}
		}

		return array_unique( array_merge( $first_level_terms, $ancestors, $children, $active_filters ) );
	}

	/**
	 * Builds the taxonomy tree.
	 *
	 * @param array   $terms     The terms
	 * @param integer $parent_id The parent identifier
	 *
	 * @return     array    The taxonomy tree
	 */
	private function build_tree( $terms, $parent_id = 0, $depth = 0 ) {
		$tree      = array();
		$increment = 0;

		foreach ( $terms as $term ) {
			if ( $term['parent_id'] == $parent_id ) {
				$children = $this->build_tree( $terms, $term['id'], $depth );

				if ( $children ) {
					$term['children'] = $children;
				}

				$term['depth'] = $depth;

				$tree[ $term['id'] ] = $term;
			}

			if ( 0 === $increment ) {
				$depth ++;
			}

			$increment ++;
		}

		return $tree;
	}

	/**
	 * Updates the terms count based on the current filter.
	 *
	 * @param array $terms List of all terms
	 *
	 * @return array
	 */
	private function get_updated_terms_count( $terms ) {
		$term_ids            = wp_list_pluck( $terms, 'id' );
		$active_terms        = $this->get_filtered_term_product_counts( $term_ids );
		$updated_terms_count = array();

		foreach ( $terms as $term_id => $term ) {
			$term['count'] = isset( $active_terms[ $term_id ] ) ? $active_terms[ $term_id ] : 0;

			$updated_terms_count[ $term_id ] = $term;
		}

		$walker   = $this->get_walker();
		$taxonomy = $walker->taxonomy;

		// The pad count logic should only run for hierarchical taxonomies like product categories.
		if ( ! is_taxonomy_hierarchical( $taxonomy ) ) {
			return $updated_terms_count;
		}

		/**
		 * pad count logic starts
		 *
		 * @see _pad_term_counts
		 */

		// Touch every ancestor's lookup row for each post in each term.
		foreach ( $term_ids as $term_id ) {
			$child     = $term_id;
			$ancestors = array();

			while ( ! empty( $updated_terms_count[ $child ] ) && $parent = $updated_terms_count[ $child ]['parent_id'] ) {
				$ancestors[] = $child;

				if ( ! empty( $active_terms[ $term_id ] ) ) {
					if ( is_array( $active_terms[ $term_id ] ) ) {
						foreach ( $active_terms[ $term_id ] as $parent_child_term_id => $parent_child_term_count ) {
							$active_terms[ $parent ][ $parent_child_term_id ] = $parent_child_term_count;
						}
					} else {
						$active_terms[ $parent ][ $term_id ] = $active_terms[ $term_id ];
					}
				}

				$child = $parent;

				if ( in_array( $parent, $ancestors, true ) ) {
					break;
				}
			}
		}

		// Transfer the touched cells.
		foreach ( $active_terms as $id => $count ) {
			if ( isset( $updated_terms_count[ $id ] ) ) {
				if ( is_array( $count ) ) {
					$count = array_sum( $count );
				}

				$updated_terms_count[ $id ]['count'] = $count;
			}
		}

		return $updated_terms_count;
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

		$main_query = WC_Query::get_main_query();
		$tax_query  = WC_Query::get_main_tax_query();
		$meta_query = WC_Query::get_main_meta_query();

		$meta_query     = new WP_Meta_Query( $meta_query );
		$tax_query      = new WP_Tax_Query( $tax_query );
		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );
		$post__in       = $main_query->query_vars['post__in'];

		// Generate query.
		$query           = array();
		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS term_count, terms.term_id AS term_count_id, terms.name";
		$query['from']   = "FROM $wpdb->posts";
		$query['join']   = "
			INNER JOIN $wpdb->term_relationships AS term_relationships ON $wpdb->posts.ID = term_relationships.object_id
			INNER JOIN $wpdb->term_taxonomy AS term_taxonomy USING(term_taxonomy_id)
			INNER JOIN $wpdb->terms AS terms USING(term_id)
			" . $tax_query_sql['join'] . $meta_query_sql['join'];

		$query['where'] = "
			WHERE $wpdb->posts.post_type IN ('product')
			AND $wpdb->posts.post_status = 'publish'"
		                  . $tax_query_sql['where'] . $meta_query_sql['where'] .
		                  'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';

		if ( $post__in ) {
			$post_in        = implode( ',', $post__in );
			$query['where'] .= " AND $wpdb->posts.ID IN ( $post_in )";
		}

		$search = WC_Query::get_main_search_query_sql();

		if ( $search ) {
			$query['where'] .= ' AND ' . $search;
		}

		$query['group_by'] = 'GROUP BY terms.term_id';

		$query = apply_filters( 'wcapf_get_filtered_term_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
	}

}
