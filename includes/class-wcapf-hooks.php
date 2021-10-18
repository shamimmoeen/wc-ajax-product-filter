<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter hooks class.
 *
 * @since  3.0.0
 * @author Mainul Hassan Main
 */
class WCAPF_Hooks {

	private $parent_terms_count = array();

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Hooks
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Hooks();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	public function init_hooks() {
		add_action( 'woocommerce_before_shop_loop', array( $this, 'insert_before_shop_loop' ), 0 );
		add_action( 'woocommerce_after_shop_loop', array( $this, 'insert_after_shop_loop' ), 200 );
		add_action( 'woocommerce_before_template_part', array( $this, 'insert_before_no_products' ), 0 );
		add_action( 'woocommerce_after_template_part', array( $this, 'insert_after_no_products' ), 200 );
		add_action( 'woocommerce_update_product', array( $this, 'delete_transients' ) );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'show_query_2' ), 80 );
	}

	public function show_query_2() {
		// $taxonomy = 'product_cat';
		// $args = array( 'taxonomy' => $taxonomy );
		//
		// $_terms = get_terms( $args );
		//
		// echo '<pre>';
		// print_r( $_terms );
		// echo '</pre>';
	}

	public function show_query() {
		$terms = array(
			421 => array(
				'id'        => 421,
				'name'      => 'Powdered Drink Mixes',
				'count'     => 9,
				'parent_id' => 420,
			),
			426 => array(
				'id'        => 426,
				'name'      => 'Tea & Coffee',
				'count'     => 15,
				'parent_id' => 420,
			),
			307 => array(
				'id'        => 307,
				'name'      => 'Baby Food',
				'count'     => 1,
				'parent_id' => 304,
			),
			420 => array(
				'id'        => 420,
				'name'      => 'Beverages',
				'count'     => 0,
				'parent_id' => 304,
			),
			304 => array(
				'id'        => 304,
				'name'      => 'Daily Needs',
				'count'     => 0,
				'parent_id' => 0,
			),
		);

		$active_terms = array( 421 => 9, 426 => 15, 307 => 1 );

		$parent_terms = array();

		foreach ( array_keys( $active_terms ) as $active_term ) {
			$term      = $terms[ $active_term ];
			$count     = $active_terms[ $active_term ];
			$parent_id = $term['parent_id'];

			if ( $parent_id ) {
				$parent_term  = $terms[ $parent_id ];
				$this->sum_parent_count( $parent_term, $active_term, $count, $terms );
			}
		}

		$tax_obj = get_taxonomy( 'product_cat' );
		$object_types = esc_sql( $tax_obj->object_type );

		echo '<pre>';
		print_r( $object_types );
		echo '</pre>';

		echo 'parent terms';
		echo '<pre>';
		print_r( $this->parent_terms_count );
		echo '</pre>';

		echo '<pre>';
		print_r( $active_terms );
		echo '</pre>';

		echo '<pre>';
		print_r( $terms );
		echo '</pre>';

		// global $wp_query;
		//
		// echo '<pre>';
		// print_r( $wp_query->query_vars );
		// echo '</pre>';
	}

	private function _pad_count( $terms, $taxonomy ) {
		global $wpdb;

		$term_items  = array(); // the count
		$terms_by_id = array(); // the terms array
		$term_ids    = array(); // all the term ids

		foreach ( (array) $terms as $key => $term ) {
			$terms_by_id[ $term->term_id ]       = & $terms[ $key ];
			$term_ids[ $term->term_taxonomy_id ] = $term->term_id;
		}

		// Get the object and term IDs and stick them in a lookup table.
		$tax_obj      = get_taxonomy( $taxonomy );
		$object_types = esc_sql( $tax_obj->object_type );
		$results      = $wpdb->get_results( "SELECT object_id, term_taxonomy_id FROM $wpdb->term_relationships INNER JOIN $wpdb->posts ON object_id = ID WHERE term_taxonomy_id IN (" . implode( ',', array_keys( $term_ids ) ) . ") AND post_type IN ('" . implode( "', '", $object_types ) . "') AND post_status = 'publish'" );

		foreach ( $results as $row ) {
			$id = $term_ids[ $row->term_taxonomy_id ];

			$term_items[ $id ][ $row->object_id ] = isset( $term_items[ $id ][ $row->object_id ] ) ? ++$term_items[ $id ][ $row->object_id ] : 1;
		}

		// Touch every ancestor's lookup row for each post in each term.
		foreach ( $term_ids as $term_id ) {
			$child     = $term_id;
			$ancestors = array();
			while ( ! empty( $terms_by_id[ $child ] ) && $parent = $terms_by_id[ $child ]->parent ) {
				$ancestors[] = $child;

				if ( ! empty( $term_items[ $term_id ] ) ) {
					foreach ( $term_items[ $term_id ] as $item_id => $touches ) {
						$term_items[ $parent ][ $item_id ] = isset( $term_items[ $parent ][ $item_id ] ) ? ++$term_items[ $parent ][ $item_id ] : 1;
					}
				}

				$child = $parent;

				if ( in_array( $parent, $ancestors, true ) ) {
					break;
				}
			}
		}

		// Transfer the touched cells.
		foreach ( (array) $term_items as $id => $items ) {
			if ( isset( $terms_by_id[ $id ] ) ) {
				$terms_by_id[ $id ]->count = count( $items );
			}
		}
	}

	private function sum_parent_count( $parent_term, $term_id, $count, $terms ) {
		$parent_term_id = $parent_term['id'];

		$this->parent_terms_count[ $parent_term_id ][ $term_id ] = $count;

		$parent_parent_term_id = isset( $parent_term['parent_id'] ) ? $parent_term['parent_id'] : 0;

		if ( $parent_parent_term_id ) {
			$parent_parent_term = $terms[ $parent_parent_term_id ];
			$this->sum_parent_count( $parent_parent_term, $parent_term_id, $count, $terms );
		}
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name
	 */
	public function insert_after_no_products( $template_name ) {
		if ( $template_name == 'loop/no-products-found.php' ) {
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
	 * @param string $template_name The template name
	 */
	public function insert_before_no_products( $template_name ) {
		if ( $template_name == 'loop/no-products-found.php' ) {
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
	 * TODO: Delete transients when product gets updated.
	 *
	 * @param $post_id
	 */
	public function delete_transients( $post_id ) {
		delete_transient( 'wcapf_term_product_counts_product_cat' );
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Hooks', 'instance' ) );
