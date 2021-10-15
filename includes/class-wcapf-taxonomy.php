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
		$walker     = $this->get_walker();
		$taxonomy   = $walker->taxonomy;
		$query_type = $walker->query_type;
		$hide_empty = $walker->hide_empty;

		$args = array( 'taxonomy' => $taxonomy );

		if ( ! $hide_empty ) {
			$args['hide_empty'] = false;
		}

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

			$terms[ $term_id ] = $_term;
		}

		// TODO: Only show children

		if ( 'or' === $query_type ) {
			return $this->build_tree( $terms );
		}

		// taxonomy hierarchical
		// query_type = AND
		// show count
		// update count
		// hide empty

		$active_terms          = $this->get_filtered_term_product_counts( $_terms );
		$active_term_ids       = array_keys( $active_terms );
		$active_term_ancestors = array();

		foreach ( $active_term_ids as $active_term_id ) {
			$term_ancestors        = get_ancestors( $active_term_id, $taxonomy );
			$active_term_ancestors = array_unique( array_merge( $active_term_ancestors, $term_ancestors ) );
		}

		$active_terms_with_ancestors = array_merge( $active_term_ids, $active_term_ancestors );
		$updated_terms_count         = array();

		foreach ( $terms as $term_id => $term ) {
			if ( $walker->hide_empty && ! in_array( $term_id, $active_terms_with_ancestors ) ) {
				continue;
			}

			$term['count'] = isset( $active_terms[ $term_id ] ) ? $active_terms[ $term_id ] : 0;

			$updated_terms_count[ $term_id ] = $term;
		}

		$and_tree = $this->build_tree( $updated_terms_count );

		return $this->count_parent_term_items( $and_tree );
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
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param array $terms List of WP_Term instances and their children
	 *
	 * @return array The filtered term product counts.
	 */
	private function get_filtered_term_product_counts( $terms ) {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return array();
		}

		global $wpdb;

		$term_ids   = wp_list_pluck( $terms, 'term_id' );
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

	/**
	 * Counts products of the ancestors.
	 *
	 * @param array $tree The terms tree.
	 *
	 * @return array
	 */
	private function count_parent_term_items( $tree ) {
		$array_iterator     = new RecursiveArrayIterator( $tree );
		$recursive_iterator = new RecursiveIteratorIterator( $array_iterator, RecursiveIteratorIterator::CHILD_FIRST );

		foreach ( $recursive_iterator as $value ) {
			if ( is_array( $value ) && array_key_exists( 'children', $value ) ) {
				$array_with_children       = $value;
				$array_with_children_count = $array_with_children['count'];

				foreach ( $array_with_children['children'] as $children ) {
					$array_with_children_count = $array_with_children_count + $children['count'];
				}

				$array_with_children['count'] = $array_with_children_count;
				$current_depth                = $recursive_iterator->getDepth();

				for ( $sub_depth = $current_depth; $sub_depth >= 0; $sub_depth -- ) {
					// Get the current level iterator
					$sub_iterator = $recursive_iterator->getSubIterator( $sub_depth );

					// If we are on the level we want to change, use the replacements
					// ($array_with_children) otherwise set the key to the parent
					// iterators value
					if ( $sub_depth === $current_depth ) {
						$value = $array_with_children;
					} else {
						$value = $recursive_iterator->getSubIterator( ( $sub_depth + 1 ) )->getArrayCopy();
					}

					$sub_iterator->offsetSet( $sub_iterator->key(), $value );
				}
			}
		}

		return $recursive_iterator->getArrayCopy();
	}

}
