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
		$hide_empty = $walker->hide_empty;
		$child_only = $walker->show_children_only;

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

		if ( 'or' === $query_type ) {
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

			return $this->build_tree( $terms );
		}

		// taxonomy hierarchical
		// query_type = AND
		// show count
		// hide empty

		$results               = $this->get_filtered_term_product_counts( $_terms );
		$active_terms          = wp_list_pluck( $results, 'term_count', 'term_count_id' );
		$active_term_ids       = array_keys( $active_terms );
		$active_term_ancestors = array();

		// echo '<pre>';
		// print_r( $active_terms );
		// echo '</pre>';

		// echo count( $active_term_ids );
		// echo '<br>';
		//
		// // add missing parent items
		// $added = $this->prepare_to_make_tree( $active_term_ids, $active_terms, $terms );
		//
		// echo '<br>';
		// echo '<br>';
		// echo '<pre>';
		// print_r( $added );
		// echo '</pre>';

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

		// start

		$term_ids = array_keys( $updated_terms_count );

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

		// echo '<pre>';
		// print_r( $active_terms );
		// echo '</pre>';

		// Transfer the touched cells.
		foreach ( $active_terms as $id => $count ) {
			if ( isset( $updated_terms_count[ $id ] ) ) {
				if ( is_array( $count ) ) {
					$count = array_sum( $count );
				}

				$updated_terms_count[ $id ]['count'] = $count;
			}
		}

		// echo '<pre>';
		// print_r( $updated_terms_count[ 304 ] );
		// echo '</pre>';

		// end

		// echo '<pre>';
		// print_r( $updated_terms_count );
		// echo '</pre>';

		// foreach ( $active_terms as $active_term_id => $active_term_count ) {
		// 	$last_level_term = $terms[ $active_term_id ];
		// 	$last_parent_level_term_id = $last_level_term['parent_id'];
		// }

		// foreach ( $results as $result ) {
		// 	echo '<pre>';
		// 	print_r( $result );
		// 	echo '</pre>';
		// }

		// if ( $child_only ) {
		// 	$allowed             = $this->get_child_only_term_ids( $walker, $terms );
		// 	$child_only_filtered = array();
		//
		// 	foreach ( $updated_terms_count as $oc_term ) {
		// 		$oc_term_id = $oc_term['id'];
		//
		// 		if ( in_array( $oc_term_id, $allowed ) ) {
		// 			$child_only_filtered[ $oc_term_id ] = $oc_term;
		// 		}
		// 	}
		//
		// 	$updated_terms_count = $child_only_filtered;
		// }

		$and_tree = $this->build_tree( $updated_terms_count );

		return $and_tree;

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

		return $results;

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

	public function prepare_to_make_tree( $term_ids, $term_items, $terms ) {
		$new_array    = array();
		$parent_terms = array();

		foreach ( $term_ids as $term_id ) {
			$term      = $terms[ $term_id ];
			$term_id   = $term['id'];
			$count     = $term['count'];
			$parent_id = $term['parent_id'];
			$name      = $term['name'];

			$_term = array(
				'id'        => $term_id,
				'name'      => $name,
				'count'     => $count,
				'parent_id' => $parent_id,
			);

			$new_array[ $term_id ] = $_term;

			// count parent term
			if ( $parent_id ) {
				$parent_terms[ $parent_id ][] = $count;
			}
		}

		if ( $parent_terms ) {
			echo '<pre>';
			print_r( $parent_terms );
			echo '</pre>';
			$new_array = $new_array + $this->hello( $parent_terms, $terms );
		}

		return $new_array;
	}

	private function hello( $term_ids, $terms ) {
		$parent_terms = array();
		$new_array    = array();

		foreach ( $term_ids as $term_id => $counts ) {
			$term      = $terms[ $term_id ];
			$term_id   = $term['id'];
			$count     = array_sum( $counts );
			$parent_id = $term['parent_id'];
			$name      = $term['name'];

			$_term = array(
				'id'        => $term_id,
				'name'      => $name,
				'count'     => $count,
				'parent_id' => $parent_id,
			);

			$new_array[ $term_id ] = $_term;

			// count parent term
			if ( $parent_id ) {
				$parent_terms[ $parent_id ][] = $count;
			}
		}

		if ( $parent_terms ) {
			$new_array = $new_array + $this->hello( $parent_terms, $terms );
		}

		return $new_array;
	}

	private function build_tree_for_child_only( $tree, $first_level_terms, $ancestors, $children, $active_filters ) {
		// echo '<pre>';
		// print_r( $allowed_terms );
		// echo '</pre>';
		$sorted_tree = array();

		$allowed_terms = array_unique( array_merge( $first_level_terms, $ancestors, $children, $active_filters ) );

		echo '<pre>';
		print_r( $allowed_terms );
		echo '</pre>';

		foreach ( $tree as $item ) {
			$term_id = $item['id'];

			if ( in_array( $term_id, $allowed_terms ) ) {
				$allowed_keys = array_keys( $item );
				$_item        = array();

				foreach ( $allowed_keys as $allowed_key ) {
					if ( 'children' !== $allowed_key ) {
						$_item[ $allowed_key ] = $item[ $allowed_key ];
					}
				}

				$children = isset( $item['children'] ) ? $item['children'] : array();

				if ( $children ) {
					$_children = array();

					foreach ( $children as $_child_item ) {
						if ( in_array( $_child_item['id'], $allowed_terms ) ) {
							echo '<pre>';
							print_r( $_child_item );
							echo '</pre>';
							$_children[] = $_child_item;
							// $_item['children'] = $_child_item;
						}
					}

					if ( $_children ) {
						$_item['children'] = $_children;
					}

					$_children = $this->include_children( $children );
				}

				$sorted_tree[ $term_id ] = $_item;
			}
		}

		// echo '<pre>';
		// print_r( $sorted_tree );
		// echo '</pre>';

		return $sorted_tree;
	}

	private function include_children( $children, $old_array = array() ) {

	}

}
