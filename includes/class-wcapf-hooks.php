<?php
/**
 * WC Ajax Product Filter hooks class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Hooks class.
 *
 * @since 3.0.0
 */
class WCAPF_Hooks {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

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
	private function init_hooks() {
		add_action( 'woocommerce_before_shop_loop', array( $this, 'insert_before_shop_loop' ), 0 );
		add_action( 'woocommerce_after_shop_loop', array( $this, 'insert_after_shop_loop' ), 200 );
		add_action( 'woocommerce_before_template_part', array( $this, 'insert_before_no_products' ), 0 );
		add_action( 'woocommerce_after_template_part', array( $this, 'insert_after_no_products' ), 200 );
		add_action( 'woocommerce_update_product', array( $this, 'delete_transients' ) );
		add_action( 'storefront_before_content', array( $this, 'show_query' ), 80 );
	}

	// TODO: Remove this.
	public function show_query() {
		$args = array(
			'paginate' => true,
			'page'     => 1,
			'limit'    => 50,
		);

		// TODO: Check if the filter query also work with other wp queries.
		$results = wc_get_products( $args );

		// global $wpdb;

		// echo '<pre>';
		// print_r( $wpdb->last_query );
		// echo '</pre>';

		// echo '<pre>';
		// print_r( WCAPF_Helper::get_chosen_filters());
		// echo '</pre>';

		// global $wp_query;

		// echo '<pre>';
		// print_r( $wp_query->request );
		// echo '</pre>';
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name.
	 */
	public function insert_after_no_products( $template_name ) {
		if ( 'loop/no-products-found.php' === $template_name ) {
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
	 * @param string $template_name The template name.
	 */
	public function insert_before_no_products( $template_name ) {
		if ( 'loop/no-products-found.php' === $template_name ) {
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
	 * Delete transients when product gets updated.
	 *
	 * @param int $post_id The post id.
	 *
	 * TODO: Remove this.
	 */
	public function delete_transients( $post_id ) {
		if ( ! $post_id ) {
			return;
		}

		delete_transient( 'wcapf_term_product_counts_product_cat' );
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Hooks', 'instance' ) );
