<?php
/**
 * WC Ajax Product Filter hooks class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/hooks
 * @author     wptools.io
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
		add_action( 'storefront_content_top', array( $this, 'content_top' ) );
		add_filter( 'body_class', array( $this, 'add_body_classes' ) );
		add_filter( 'redirect_canonical', array( $this, 'suppress_canonical_redirect' ) );
		add_action( 'paginate_links', array( $this, 'modify_paginated_links' ) );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'insert_before_shop_loop' ), 0 );
		add_action( 'woocommerce_after_shop_loop', array( $this, 'insert_after_shop_loop' ), 200 );
		add_action( 'woocommerce_before_template_part', array( $this, 'insert_before_no_products' ), 0 );
		add_action( 'woocommerce_after_template_part', array( $this, 'insert_after_no_products' ), 200 );
	}

	public function content_top() {
		global $wp_query, $wcapf_filter_keys, $wp;

		// echo '<pre>';
		// print_r( $wp_query );
		// echo '</pre>';

		// echo '<pre>';
		// print_r( $wcapf_filter_keys );
		// echo '</pre>';

		// $url_builder = new WCAPF_URL_Builder( 'product-cat', true );

		// echo $url_builder->get_filter_url( '16', true );
		// echo '<br/>';
		// echo '<br/>';

		echo '<input type="checkbox" id="show_query" /><label for="show_query">Show Query</label>';

		echo '<div class="query">';
		echo '<pre>';
		print_r( $wp_query->request );
		echo '</pre>';
		echo '</div>';

		echo '<style>.query {display: none} #show_query:checked ~ .query {display: block;}</style>';
	}

	/**
	 * Adds the classes into the body element.
	 *
	 * @param array $classes The classes.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public function add_body_classes( $classes ) {
		// TODO: Maybe we can get the settings from global variables.

		if ( WCAPF_Helper::use_focus_style() ) {
			$classes[] = 'wcapf-use-focus';
		}

		if ( WCAPF_Helper::use_wait_cursor() ) {
			$classes[] = 'wcapf-use-wait-cursor';
		}

		return $classes;
	}

	/**
	 * Suppress canonical redirect.
	 *
	 * TODO: We should conditionally do this.
	 *
	 * @param bool $redirect
	 *
	 * @return false
	 */
	public function suppress_canonical_redirect( $redirect ) {
		return false;
	}

	/**
	 * @param string $link
	 *
	 * @source https://weusewp.com/tutorial/pagination-remove-page-1/
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public function modify_paginated_links( $link ) {
		if ( is_paged() ) {
			$link = str_replace( 'page/1/', '', $link );
		}

		return str_replace( '%2C', ',', $link );
	}

	/**
	 * HTML wrapper to insert before the shop loop.
	 */
	public function insert_before_shop_loop() {
		echo '<div class="wcapf-before-products">';
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
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name.
	 */
	public function insert_after_no_products( $template_name ) {
		if ( 'loop/no-products-found.php' === $template_name ) {
			echo '</div>';
		}
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Hooks', 'instance' ) );
