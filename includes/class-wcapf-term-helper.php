<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter Term Helper class.
 */
class WCAPF_Term_Helper {

	/**
	 * Query type
	 *
	 * @var string
	 */
	public $query_type;

	/**
	 * Builds the taxonomy tree.
	 *
	 * @param array   $terms     The terms
	 * @param integer $parent_id The parent identifier
	 *
	 * @return     array    The taxonomy tree
	 */
	public function build_tree( $terms, $parent_id = 0, $depth = 0 ) {
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

	public function count_parent_term_items( $tree ) {
		$array_iterator     = new RecursiveArrayIterator( $tree );
		$recursive_iterator = new RecursiveIteratorIterator( $array_iterator, RecursiveIteratorIterator::CHILD_FIRST );

		foreach ( $recursive_iterator as $key => $value ) {
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

	public function new_get_filtered_term_product_counts( $terms, $taxonomy, $query_type ) {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return array();
		}

		global $wpdb;

		$term_ids   = wp_list_pluck( $terms, 'term_id' );
		$main_query = WC_Query::get_main_query();
		$tax_query  = WC_Query::get_main_tax_query();
		$meta_query = WC_Query::get_main_meta_query();
		$query_type = strtolower( $query_type );

		if ( $query_type === 'or' ) {
			foreach ( $tax_query as $key => $query ) {
				if ( is_array( $query ) && $taxonomy === $query['taxonomy'] ) {
					unset( $tax_query[ $key ] );
				}
			}
		}

		// echo '<pre>';
		// print_r( $tax_query );
		// echo '</pre>';

		$meta_query     = new WP_Meta_Query( $meta_query );
		$tax_query      = new WP_Tax_Query( $tax_query );
		$meta_query_sql = $meta_query->get_sql( 'post', $wpdb->posts, 'ID' );
		$tax_query_sql  = $tax_query->get_sql( $wpdb->posts, 'ID' );
		$post__in       = $main_query->query_vars['post__in'];

		// Generate query.
		$query           = array();
		$query['select'] = "SELECT COUNT(DISTINCT {$wpdb->posts}.ID) AS term_count, terms.term_id AS term_count_id";
		$query['from']   = "FROM {$wpdb->posts}";
		$query['join']   = "
			INNER JOIN {$wpdb->term_relationships} AS term_relationships ON {$wpdb->posts}.ID = term_relationships.object_id
			INNER JOIN {$wpdb->term_taxonomy} AS term_taxonomy USING(term_taxonomy_id)
			INNER JOIN {$wpdb->terms} AS terms USING(term_id)
			" . $tax_query_sql['join'] . $meta_query_sql['join'];

		$query['where'] = "
			WHERE {$wpdb->posts}.post_type IN ('product')
			AND {$wpdb->posts}.post_status = 'publish'"
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

		$query = apply_filters( 'wcapf_get_filtered_term_product_counts_query', $query );
		$query = implode( ' ', $query );

		// We have a query - let's see if cached results of this query already exist.
		$query_hash = md5( $query );

		// Maybe store a transient of the count values.
		$cache = apply_filters( 'wcapf_term_product_counts_maybe_cache', true );

		if ( $cache === true ) {
			$cached_counts = (array) get_transient( 'wcapf_term_product_counts_' . $taxonomy );
		} else {
			$cached_counts = array();
		}

		$results = $wpdb->get_results( $query, ARRAY_A );
		$counts  = array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
		//
		// echo '<pre>';
		// print_r( $results );
		// echo '</pre>';
	}

}
