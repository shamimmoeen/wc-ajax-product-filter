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
	 * Query type
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * Is Hierarchical
	 *
	 * @var bool
	 */
	protected $hierarchical;

	/**
	 * Show children only
	 *
	 * @var bool
	 */
	protected $show_children_only;

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
		$this->taxonomy   = isset( $field_data['taxonomy'] ) ? $field_data['taxonomy'] : '';
		$this->query_type = isset( $field_data['query_type'] ) ? $field_data['query_type'] : '';
		$this->filter_key = isset( $field_data['filter_key'] ) ? $field_data['filter_key'] : '';

		$this->hierarchical = false;

		if ( isset( $field_data['hierarchical'] ) ) {
			if ( $field_data['hierarchical'] ) {
				$this->hierarchical = true;
			}
		}

		$this->show_children_only = false;

		if ( isset( $field_data['show_children_only'] ) ) {
			if ( $field_data['show_children_only'] ) {
				$this->show_children_only = true;
			}
		}

		$this->hide_empty = false;

		if ( isset( $field_data['hide_empty'] ) ) {
			if ( $field_data['hide_empty'] ) {
				$this->hide_empty = true;
			}
		}
	}

	/**
	 * Prepare the terms for the taxonomy.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$args = array(
			'taxonomy'               => $this->taxonomy,
			'hide_empty'             => false,
			'count'                  => true,
			'update_term_meta_cache' => false,
		);

		// TODO: Use a filter to alter the arguments

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

			// TODO: Use a filter to alter the term data

			$terms[ $term_id ] = $_term;
		}

		// if ( 'or' === $this->query_type ) {
		// 	$terms = $this->filter_by_hide_empty( $terms );
		// 	$terms = $this->filter_by_child_only( $terms );
		//
		// 	// TODO: Use a filter to alter the "or terms"
		//
		// 	return $this->build_tree( $terms );
		// }

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

		$term_ids            = wp_list_pluck( $terms, 'id' );
		$active_terms        = $this->get_filtered_term_product_counts( $term_ids );
		$updated_terms_count = array();

		foreach ( $terms as $term_id => $term ) {
			$term['count'] = isset( $active_terms[ $term_id ] ) ? $active_terms[ $term_id ] : 0;

			$updated_terms_count[ $term_id ] = $term;
		}

		// The pad count logic should only run for hierarchical taxonomies like product categories.
		if ( ! is_taxonomy_hierarchical( $this->taxonomy ) ) {
			return $updated_terms_count;
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
			while ( ! empty( $updated_terms_count[ $child ] ) && $parent = $updated_terms_count[ $child ]['parent_id'] ) {
				$ancestors[] = $child;

				if ( ! empty( $active_terms[ $term_id ] ) ) {
					if ( is_array( $active_terms[ $term_id ] ) ) {
						foreach ( $active_terms[ $term_id ] as $parent_child_term_id => $parent_child_term_count ) {
							$active_terms[ $parent ][ $parent_child_term_id ] = $parent_child_term_count;
						}
					} else {
						if ( isset( $active_terms[ $parent ] ) && ! is_array( $active_terms[ $parent ] ) ) {
							$active_terms[ $parent ] = array( $active_terms[ $parent ] );
						}

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

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		// Generate query.
		$query = array();

		$select = "SELECT COUNT(DISTINCT $wpdb->posts.ID) ";

		$select .= 'AS term_count, terms.term_id AS term_count_id';

		$query['select'] = $select;

		$query['from'] = "FROM $wpdb->posts";
		$query['join'] = "
			INNER JOIN $wpdb->term_relationships AS term_relationships ON $wpdb->posts.ID = term_relationships.object_id
			INNER JOIN $wpdb->term_taxonomy AS term_taxonomy USING(term_taxonomy_id)
			INNER JOIN $wpdb->terms AS terms USING(term_id)
			" . $tax_query_sql['join'] . $meta_query_sql['join'];

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= 'AND terms.term_id IN (' . implode( ',', array_map( 'absint', $term_ids ) ) . ')';
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
				$filtered_product_ids = $this->get_self_filtered_product_ids();

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

		$query['group_by'] = 'GROUP BY terms.term_id';

		$query = apply_filters( 'wcapf_get_filtered_term_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'absint', wp_list_pluck( $results, 'term_count', 'term_count_id' ) );
	}

	/**
	 * Filters the terms having the children only.
	 *
	 * @param array $terms The terms.
	 *
	 * @return array
	 */
	private function filter_by_child_only( $terms ) {
		if ( $this->show_children_only ) {
			$child_only_filtered = array();
			$allowed             = $this->get_child_only_term_ids( $terms );

			foreach ( $terms as $oc_term ) {
				$oc_term_id = $oc_term['id'];

				// phpcs:ignore WordPress.PHP.StrictInArray.MissingTrueStrict
				if ( in_array( $oc_term_id, $allowed ) ) {
					$child_only_filtered[ $oc_term_id ] = $oc_term;
				}
			}

			$terms = $child_only_filtered;
		}

		return $terms;
	}

	/**
	 * Gets the child terms for the filtered parent terms.
	 *
	 * @param array $terms The terms.
	 */
	private function get_child_only_term_ids( $terms ) {
		$walker             = new WCAPF_Walker();
		$walker->filter_key = $this->filter_key;

		$active_filters    = $walker->get_active_filters(); // values only
		$ancestors         = array();
		$children          = array();
		$first_level_terms = array();

		foreach ( $active_filters as $term_id ) {
			$ancestors = array_unique( array_merge( $ancestors, get_ancestors( $term_id, $this->taxonomy ) ) );
		}

		foreach ( $terms as $term ) {
			// phpcs:ignore WordPress.PHP.StrictInArray.MissingTrueStrict
			if ( in_array( $term['parent_id'], $active_filters ) ) {
				$children = array_unique( array_merge( $children, array( $term['id'] ) ) );
			}

			if ( 0 === $term['parent_id'] ) {
				$first_level_terms = array_unique( array_merge( $first_level_terms, array( $term['id'] ) ) );
			}
		}

		return array_unique( array_merge( $first_level_terms, $ancestors, $children, $active_filters ) );
	}

	/**
	 * Builds the taxonomy tree.
	 *
	 * TODO: We should build the tree when taxonomy is hierarchical and hierarchical is activated in widget settings.
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
			// phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
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

}
