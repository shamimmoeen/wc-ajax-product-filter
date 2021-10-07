<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Product_Filter class.
 *
 * @since      3.0.0
 */
class WCAPF_Product_Filter {

	/**
	 * Returns an instance of this class.
	 *
	 * @return     WCAPF_Product_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Product_Filter();
			$instance->run();
		}

		return $instance;
	}

	/**
	 * Runs the class.
	 */
	public function run() {
		$this->includes();
		$this->init_hooks();
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
		add_action( 'woocommerce_product_query', array( $this, 'set_filter' ) );
	}

	/**
	 * Query the products, applying sorting/ordering etc. This applies to the
	 * main WordPress loop.
	 *
	 * @param WP_Query $query Query instance.
	 *
	 * @return     WP_Query  Return modified query instance.
	 */
	public function set_filter( $query ) {
		/**
		 * Don't proceed if we are not in main query or this is not product archive page.
		 */
		if ( ! is_main_query() && ! is_post_type_archive( 'product' ) && ! is_tax( get_object_taxonomies( 'product' ) ) ) {
			return $query;
		}

		$tax_query = array();

		if ( isset( $_GET['cata'] ) ) {
			$cata = array_map( 'absint', $_GET['cata'] );

			$tax_query[] = array(
				'taxonomy'         => 'product_cat',
				'field'            => 'term_id',
				'terms'            => $cata,
				'operator'         => 'AND',
				'include_children' => 1,
			);
		}

		$query->set( 'tax_query', $tax_query );

		// echo '<pre>';
		// print_r($query);
		// echo '</pre>';

		// return $query;
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Product_Filter', 'instance' ) );
