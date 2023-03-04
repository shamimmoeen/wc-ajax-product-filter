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
		add_action( 'woocommerce_before_shop_loop', array( $this, 'active_filters_before_shop_loop' ), - 10 );
		add_action( 'woocommerce_before_template_part', array( $this, 'active_filters_before_no_products' ), - 10 );
		add_filter( 'wcapf_form_filter_data', array( $this, 'set_form_filters_data' ) );
	}

	/**
	 *
	 * TODO: Remove from production build.
	 *
	 * @return void
	 */
	public function content_top() {
		global $wp_query, $wcapf_filter_keys, $wp;

		return;

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
		if ( ! $this->should_we_proceed() ) {
			return $classes;
		}

		$improve_scrollbar  = WCAPF_Helper::wcapf_option( 'improve_scrollbar' );
		$remove_focus_style = WCAPF_Helper::wcapf_option( 'remove_focus_style' );
		$use_wait_cursor    = WCAPF_Helper::wcapf_option( 'wait_cursor' );
		$label_size         = WCAPF_Helper::wcapf_option( 'label_size' );

		if ( $improve_scrollbar ) {
			$classes[] = 'wcapf-pretty-scroll';
		}

		if ( ! $remove_focus_style ) {
			$classes[] = 'wcapf-use-focus';
		}

		if ( $use_wait_cursor ) {
			$classes[] = 'wcapf-use-wait-cursor';
		}

		if ( 'fixed' === $label_size ) {
			$classes[] = 'wcapf-label-size-fixed';
		}

		return $classes;
	}

	private function should_we_proceed() {
		return WCAPF_Helper::found_wcapf();
	}

	/**
	 * Suppress canonical redirect.
	 *
	 * @param bool $redirect
	 *
	 * @return bool
	 */
	public function suppress_canonical_redirect( $redirect ) {
		if ( ! $this->should_we_proceed() ) {
			return $redirect;
		}

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
		if ( ! $this->should_we_proceed() ) {
			return $link;
		}

		if ( is_paged() ) {
			$link = str_replace( 'page/1/', '', $link );
		}

		return str_replace( '%2C', ',', $link );
	}

	/**
	 * HTML wrapper to insert before the shop loop.
	 */
	public function insert_before_shop_loop() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		echo '<div class="' . esc_attr( WCAPF_Helper::shop_loop_container_identifier() ) . '">';
	}

	/**
	 * HTML wrapper to insert after the shop loop.
	 */
	public function insert_after_shop_loop() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		echo '</div>';
	}

	/**
	 * HTML wrapper to insert before the not found product loops.
	 *
	 * @param string $template_name The template name.
	 */
	public function insert_before_no_products( $template_name ) {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		if ( 'loop/no-products-found.php' === $template_name ) {
			echo '<div class="' . esc_attr( WCAPF_Helper::shop_loop_container_identifier() ) . '">';
		}
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name.
	 */
	public function insert_after_no_products( $template_name ) {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		if ( 'loop/no-products-found.php' === $template_name ) {
			echo '</div>';
		}
	}

	/**
	 * Renders the active filters before shop loop.
	 *
	 * @since 4.0.0
	 */
	public function active_filters_before_shop_loop() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$this->render_active_filters();
	}

	/**
	 * Renders the active filters before shop loop.
	 *
	 * @since 4.0.0
	 */
	private function render_active_filters() {
		if ( ! empty( WCAPF_Helper::wcapf_option( 'active_filters_on_top' ) ) ) {
			WCAPF_Template_Loader::get_instance()->load(
				'active-filters',
				array(
					'location'            => 'before-products',
					'clear_all_btn_label' => WCAPF_Helper::clear_all_button_label(),
				)
			);
		}
	}

	/**
	 * Renders the active filters before no products found template.
	 *
	 * @since 4.0.0
	 */
	public function active_filters_before_no_products( $template_name ) {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		if ( 'loop/no-products-found.php' === $template_name ) {
			$this->render_active_filters();
		}
	}

	/**
	 * Sets the filters data according to the form and wcapf settings.
	 *
	 * @param array $data The filter data.
	 *
	 * @since 4.0.0
	 *
	 * @return array The filter data that will be merged with filter settings.
	 */
	public function set_form_filters_data( $data ) {
		$empty_options = array( 'show', 'remove' );
		$remove_empty  = WCAPF_Helper::wcapf_option( 'remove_empty' );

		if ( ! in_array( $remove_empty, $empty_options ) ) {
			$remove_empty = 'show';
		}

		return wp_parse_args(
			array(
				'hide_empty'    => $remove_empty,
				'update_count'  => ! empty( WCAPF_Helper::wcapf_option( 'update_count' ) ),
				'use_chosen'    => ! empty( WCAPF_Helper::wcapf_option( 'use_chosen' ) ),
				'use_term_slug' => ! empty( WCAPF_Helper::wcapf_option( 'use_term_slug' ) ),
			),
			$data
		);
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Hooks', 'instance' ) );
