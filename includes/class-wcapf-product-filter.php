<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
	exit;
}

/**
 * WCAPF_Product_Filter class.
 *
 * @since      3.0.0
 */
class WCAPF_Product_Filter
{
	/**
	 * Builds the taxonomy tree.
	 *
	 * @param      array    $terms      The terms
	 * @param      integer  $parent_id  The parent identifier
	 *
	 * @return     array    The taxonomy tree
	 */
	public function build_tree($terms, $parent_id = 0) {
	    $tree = array();

	    foreach ($terms as $term) {
	        if ($term['parent_id'] == $parent_id) {
	            $children = $this->build_tree($terms, $term['id']);

	            if ($children) {
	                $term['children'] = $children;
	            }

	            $tree[$term['id']] = $term;
	        }
	    }

	    return $tree;
	}

	public function count_parent_term_items($tree) {
		$array_iterator = new RecursiveArrayIterator($tree);
		$recursive_iterator = new RecursiveIteratorIterator($array_iterator, RecursiveIteratorIterator::CHILD_FIRST);

		foreach ($recursive_iterator as $key => $value) {
			if (is_array($value) && array_key_exists('children', $value)) {
				$array_with_children = $value;
				$array_with_children_count = $array_with_children['count'];

				foreach ($array_with_children['children'] as $children) {
					$array_with_children_count = $array_with_children_count + $children['count'];
				}

				$array_with_children['count'] = $array_with_children_count;
				$current_depth = $recursive_iterator->getDepth();

				for ($sub_depth = $current_depth; $sub_depth >= 0; $sub_depth--) {
					// Get the current level iterator
					$sub_iterator = $recursive_iterator->getSubIterator($sub_depth);

					// If we are on the level we want to change, use the replacements
					// ($array_with_children) other wise set the key to the parent
					// iterators value
					if ($sub_depth === $current_depth) {
						$value = $array_with_children;
					} else {
						$value = $recursive_iterator->getSubIterator(($sub_depth + 1))->getArrayCopy();
					}

					$sub_iterator->offsetSet($sub_iterator->key(), $value);
				}
			}
		}

		return $recursive_iterator->getArrayCopy();
	}

	/**
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param      array   $terms       List of WP_Term instances and their
	 *                                  children
	 * @param      string  $taxonomy    The taxonomy
	 * @param      string  $query_type  The query type
	 *
	 * @return     array   The filtered term product counts.
	 */
	public function get_filtered_term_product_counts($terms, $taxonomy, $query_type) {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		// if ( ! wc()->query->get_main_query()->post_count ) {
		// 	return;
		// }

		global $wpdb;

		$term_ids = wp_list_pluck($terms, 'term_id');
		$tax_query = WC_Query::get_main_tax_query();
		$meta_query = WC_Query::get_main_meta_query();
		$query_type = strtolower($query_type);

		if ($query_type === 'or') {
			foreach ($tax_query as $key => $query) {
				if (is_array($query) && $taxonomy === $query['taxonomy']) {
					unset($tax_query[$key]);
				}
			}
		}

		$meta_query = new WP_Meta_Query($meta_query);
		$tax_query = new WP_Tax_Query($tax_query);
		$meta_query_sql = $meta_query->get_sql('post', $wpdb->posts, 'ID');
		$tax_query_sql = $tax_query->get_sql($wpdb->posts, 'ID');

		// Generate query.
		$query = array();
		$query['select'] = "SELECT COUNT(DISTINCT {$wpdb->posts}.ID) AS term_count, terms.term_id AS term_count_id";
		$query['from'] = "FROM {$wpdb->posts}";
		$query['join'] = "
			INNER JOIN {$wpdb->term_relationships} AS term_relationships ON {$wpdb->posts}.ID = term_relationships.object_id
			INNER JOIN {$wpdb->term_taxonomy} AS term_taxonomy USING(term_taxonomy_id)
			INNER JOIN {$wpdb->terms} AS terms USING(term_id)
			" . $tax_query_sql['join'] . $meta_query_sql['join'];

		$query['where'] = "
			WHERE {$wpdb->posts}.post_type IN ('product')
			AND {$wpdb->posts}.post_status = 'publish'"
			. $tax_query_sql['where'] . $meta_query_sql['where'] .
			'AND terms.term_id IN (' . implode(',', array_map('absint', $term_ids)) . ')';

		$search = WC_Query::get_main_search_query_sql();

		if ($search) {
			$query['where'] .= ' AND ' . $search;
		}

		$query['group_by'] = 'GROUP BY terms.term_id';

		$query = apply_filters('wcapf_get_filtered_term_product_counts_query', $query);
		$query = implode(' ', $query);

		// We have a query - let's see if cached results of this query already exist.
		$query_hash = md5($query);

		// Maybe store a transient of the count values.
		$cache = apply_filters('wcapf_term_product_counts_maybe_cache', true);

		if ($cache === true) {
			$cached_counts = (array)get_transient('wcapf_term_product_counts_' . $taxonomy);
		} else {
			$cached_counts = array();
		}

		if (!isset($cached_counts[$query_hash])) {
			$results = $wpdb->get_results($query, ARRAY_A);
			$counts = array_map('absint', wp_list_pluck($results, 'term_count', 'term_count_id'));


			if (is_taxonomy_hierarchical($taxonomy)) {
				foreach ($terms as $term) {
					$terms[$term->term_id] = $term;
				}

				$taxonomy_tree = $this->build_tree($this->prepare_to_make_tree(array_keys($counts), $counts, $terms));

				return $taxonomy_tree;

				return $this->count_parent_term_items($taxonomy_tree);
			}

			$cached_counts[$query_hash] = $counts;

			if ($cache === true) {
				set_transient('wcapf_term_product_counts_' . $taxonomy, $cached_counts, DAY_IN_SECONDS);
			}
		}

		return array_map('absint', (array)$cached_counts[$query_hash]);
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param      string  $template_name  The template name
	 */
	public function insert_after_no_products($template_name) {
		if ($template_name == 'loop/no-products-found.php') {
			echo '</div>';
		}
	}
	/**
	 * HTML wrapper to insert after the shop loop.
	 */
	public function insert_after_shop_loop() {
		echo '</div>';
	}

	/**
	 * HTML wrapper to insert before the not found product loops.
	 *
	 * @param      string  $template_name  The template name
	 */
	public function insert_before_no_products($template_name) {
		if ($template_name == 'loop/no-products-found.php') {
			echo '<div class="wcapf-before-products">';
		}
	}

	/**
	 * HTML wrapper to insert before the shop loop.
	 */
	public function insert_before_shop_loop() {
		echo '<div class="wcapf-before-products">';
	}

	/**
	 * Loads the required files.
	 */
	public function includes() {
		require_once WCAPF_PATH . 'includes/wcapf-functions.php';
	}

	/**
	 * Hook into actions and filters.
	 */
	public function init_hooks() {
		add_action('woocommerce_before_shop_loop', array($this, 'insert_before_shop_loop'), 0);
		add_action('woocommerce_after_shop_loop', array($this, 'insert_after_shop_loop'), 200);
		add_action('woocommerce_before_template_part', array($this, 'insert_before_no_products'), 0);
		add_action('woocommerce_after_template_part', array($this, 'insert_after_no_products'), 200);
		add_action('woocommerce_product_query', array($this, 'set_filter'));
		add_action('wp_enqueue_scripts', array($this, 'load_frontend_scripts'));
		add_action('woocommerce_update_product', array($this, 'update_product'));
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return     WCAPF_Product_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been ran previously
		if (null === $instance) {
			$instance = new WCAPF_Product_Filter();
			$instance->run();
		}

		return $instance;
	}

	/**
	 * Loads frontend scripts.
	 */
	public function load_frontend_scripts() {}

	/**
	 * Add the missing parent terms to build taxonomy tree.
	 *
	 * @param      array  $term_ids    The term ids
	 * @param      array  $term_items  The term ids and counts
	 * @param      array  $terms       List of WP_Term instances and their
	 *                                 children
	 * @param      array  $new_array   The new array to hold the terms
	 *
	 * @return     array  All terms including parent terms
	 */
	public function prepare_to_make_tree($term_ids, $term_items, $terms, $new_array = array()) {
		foreach ($term_ids as $term_id) {
			$term_data = $terms[$term_id];
			$parent_id = $term_data->parent;

			$term = array(
				'id'        => $term_id,
				'name'      => $term_data->name,
				'count'     => isset($term_items[$term_id]) ? $term_items[$term_id] : 0,
				'parent_id' => $parent_id,
			);

			$new_array[$term_id] = $term;

			if ($parent_id > 0 && !array_key_exists($parent_id, $new_array)) {
				$new_array = $new_array + $this->prepare_to_make_tree(array($parent_id), $term_items, $terms, $new_array);
			}
		}

		return $new_array;
	}

	/**
	 * Runs the class.
	 */
	public function run() {
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Query the products, applying sorting/ordering etc. This applies to the
	 * main WordPress loop.
	 *
	 * @param      WP_Query  $query  Query instance.
	 *
	 * @return     WP_Query  Return modified query instance.
	 */
	public function set_filter($query) {
		/**
		 * Don't proceed if we are not in main query or this is not product archive page.
		 */
		if (!is_main_query() && !is_post_type_archive('product') && !is_tax(get_object_taxonomies('product'))) {
			return;
		}

		$tax_query = array();

		if (isset($_GET['cata'])) {
			$cata = array_map('absint', $_GET['cata']);

			$tax_query[] = array(
				'taxonomy'         => 'product_cat',
				'field'            => 'term_id',
				'terms'            => $cata,
				'operator'         => 'IN',
				'include_children' => 1,
			);
		}

		$query->set('tax_query', $tax_query);

		// echo '<pre>';
		// print_r($query);
		// echo '</pre>';

		return $query;
	}

	public function update_product($product_id) {
		delete_transient('wcapf_term_product_counts_product_cat');
	}
}

add_action('plugins_loaded', array('WCAPF_Product_Filter', 'instance'));
