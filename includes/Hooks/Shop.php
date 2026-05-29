<?php
/**
 * Shop-loop integration hooks.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Hooks
 * @author     Mainul Hassan
 */

namespace WCAPF\Hooks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wires WCAPF into the WooCommerce shop loop: the product query, loop markup wrappers,
 * the AJAX loader, body classes, and canonical/pagination tweaks.
 */
class Shop {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'body_class', array( $this, 'add_body_classes' ) );
		add_action( 'wp_footer', array( $this, 'insert_loader' ) );
		add_filter( 'redirect_canonical', array( $this, 'suppress_canonical_redirect' ) );
		add_filter( 'paginate_links', array( $this, 'modify_paginated_link' ) );
		add_filter( 'woocommerce_redirect_single_search_result', array( $this, 'single_search_redirect' ) );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'insert_before_shop_loop' ), 0 );
		add_action( 'woocommerce_after_shop_loop', array( $this, 'insert_after_shop_loop' ), 200 );
		add_action( 'woocommerce_before_template_part', array( $this, 'insert_before_no_products' ), 0 );
		add_action( 'woocommerce_after_template_part', array( $this, 'insert_after_no_products' ), 200 );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'active_filters_before_shop_loop' ), -10 );
		add_action( 'woocommerce_before_template_part', array( $this, 'active_filters_before_no_products' ), -10 );
		add_filter( 'wcapf_form_filter_data', array( $this, 'set_form_filter_data' ) );
		add_action( 'woocommerce_product_query', array( $this, 'set_query' ) );
	}

	/**
	 * Adds the classes into the body element.
	 *
	 * @param array $classes The classes.
	 *
	 * @return array
	 */
	public function add_body_classes( array $classes ): array {
		if ( ! $this->should_we_proceed() ) {
			return $classes;
		}

		$improve_scrollbar   = wcapf()->settings->get( 'improve_scrollbar' );
		$improve_text_inputs = wcapf()->settings->get( 'improve_input_type_text_number' );
		$remove_focus_style  = wcapf()->settings->get( 'remove_focus_style' );
		$use_wait_cursor     = wcapf()->settings->get( 'wait_cursor' );

		if ( $improve_scrollbar ) {
			$classes[] = 'wcapf-pretty-scroll';
		}

		if ( $improve_text_inputs ) {
			$classes[] = 'wcapf-pretty-text-inputs';
		}

		if ( ! $remove_focus_style ) {
			$classes[] = 'wcapf-use-focus';
		}

		if ( $use_wait_cursor ) {
			$classes[] = 'wcapf-use-wait-cursor';
		}

		return $classes;
	}

	/**
	 * Determines if we proceed or not.
	 *
	 * @return bool
	 */
	private function should_we_proceed(): bool {
		return wcapf()->compat->found_wcapf();
	}

	/**
	 * Insert the loader.
	 *
	 * @return void
	 */
	public function insert_loader(): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$loading_animation = wcapf()->settings->get( 'loading_animation', 'overlay-with-icon' );

		echo '<div class="wcapf-loader">';

		if ( 'overlay-with-icon' === $loading_animation ) {
			$allowed_loaders = array(
				'Dual-Ring',
				'Eclipse',
				'Gear',
				'Reload',
				'Ripple',
				'Rolling',
				'Spin',
				'Spinner',
			);

			$loading_image = wcapf()->settings->get( 'loading_icon', 'Dual-Ring' );

			if ( ! in_array( $loading_image, $allowed_loaders, true ) ) {
				$loading_image = 'Dual-Ring';
			}

			$image_file = WCAPF_PLUGIN_DIR . '/public/loaders/' . $loading_image . '.svg';
			$image_size = wcapf()->settings->get( 'loading_image_size', '60' ) . 'px';

			// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Reading trusted local SVG bundled with the plugin.
			$image = file_get_contents( $image_file );

			echo '<div class="wcapf-loader-image" style="width: ' . esc_attr( $image_size ) . '">';
			echo $image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo '</div>';
		}

		echo '</div>';
	}

	/**
	 * Return false to cancel the redirect.
	 *
	 * @param string $redirect The redirect url.
	 *
	 * @return string|bool
	 */
	public function suppress_canonical_redirect( $redirect ) {
		if ( ! $this->should_we_proceed() ) {
			return $redirect;
		}

		return false;
	}

	/**
	 * Remove the paginated part for the first page only.
	 *
	 * @param string $link The paginated link URL.
	 *
	 * @source https://weusewp.com/tutorial/pagination-remove-page-1/
	 *
	 * @return string
	 */
	public function modify_paginated_link( string $link ): string {
		if ( ! $this->should_we_proceed() ) {
			return $link;
		}

		if ( is_paged() ) {
			$link = str_replace( 'page/1/', '', $link );
		}

		return str_replace( '%2C', ',', $link );
	}

	/**
	 * Prevent redirecting to the product page if a single result is found while filtering on the search page.
	 *
	 * @param bool $redirect Whether to redirect to the single search result.
	 *
	 * @return bool
	 */
	public function single_search_redirect( $redirect ) {
		if ( ! $this->should_we_proceed() ) {
			return $redirect;
		}

		return false;
	}

	/**
	 * HTML wrapper to insert before the shop loop.
	 *
	 * @return void
	 */
	public function insert_before_shop_loop(): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		echo '<div class="' . esc_attr( wcapf()->data->shop_loop_container_identifier() ) . '">';
	}

	/**
	 * HTML wrapper to insert after the shop loop.
	 *
	 * @return void
	 */
	public function insert_after_shop_loop(): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		echo '</div>';
	}

	/**
	 * HTML wrapper to insert before the not found product loops.
	 *
	 * @param string $template_name The template name.
	 *
	 * @return void
	 */
	public function insert_before_no_products( string $template_name ): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		if ( 'loop/no-products-found.php' === $template_name ) {
			echo '<div class="' . esc_attr( wcapf()->data->shop_loop_container_identifier() ) . '">';
		}
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name.
	 *
	 * @return void
	 */
	public function insert_after_no_products( string $template_name ): void {
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
	 * @return void
	 */
	public function active_filters_before_shop_loop(): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$this->render_active_filters();
	}

	/**
	 * Renders the active filters before shop loop.
	 *
	 * @return void
	 */
	private function render_active_filters(): void {
		if ( ! empty( wcapf()->settings->get( 'active_filters_on_top' ) ) ) {
			$active_filters_on_top_args = apply_filters(
				'wcapf_active_filters_on_top_args',
				array(
					'clear_all_btn_label'  => wcapf()->settings->clear_all_button_label(),
					'clear_all_btn_layout' => 'inline',
				)
			);

			// Use a stable ID so the element can be reliably matched during AJAX updates.
			$active_filters_on_top_args['unique_id'] = 'on-top';

			$args = wcapf()->active_filters->prepare_args( $active_filters_on_top_args );

			echo '<div class="wcapf-active-filters-before-shop-loop">';
			wcapf()->template->load( 'active-filters', $args );
			echo '</div>';
		}
	}

	/**
	 * Renders the active filters before no products found template.
	 *
	 * @param string $template_name The template name.
	 *
	 * @return void
	 */
	public function active_filters_before_no_products( string $template_name ): void {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		if ( 'loop/no-products-found.php' === $template_name ) {
			$this->render_active_filters();
		}
	}

	/**
	 * Sets the filter data according to the form and wcapf settings.
	 *
	 * @param array $data The filter data.
	 *
	 * @return array The filter data that will be merged with filter settings.
	 */
	public function set_form_filter_data( array $data ): array {
		$empty_options = array( 'show', 'remove' );
		$remove_empty  = wcapf()->settings->get( 'remove_empty' );

		if ( ! in_array( $remove_empty, $empty_options, true ) ) {
			$remove_empty = 'show';
		}

		return wp_parse_args(
			array(
				'hide_empty'    => $remove_empty,
				'update_count'  => ! empty( wcapf()->settings->get( 'update_count' ) ),
				'use_combobox'  => ! empty( wcapf()->settings->get( 'use_combobox' ) ),
				'use_term_slug' => ! empty( wcapf()->settings->get( 'use_term_slug' ) ),
			),
			$data
		);
	}

	/**
	 * Query the products, applying the filters. This applies to the main WordPress loop.
	 *
	 * @param \WP_Query $q Query instance.
	 *
	 * @return void
	 */
	public function set_query( \WP_Query $q ): void {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		$filter = new \WCAPF\ProductFilter();

		global $wcapf_chosen_filters;

		$chosen_filters = $filter->get_chosen_filters();

		$wcapf_chosen_filters = $chosen_filters;

		/**
		 * We must hook the filter early to avoid the sorting issues.
		 */
		add_filter( 'posts_clauses', array( $this, 'posts_clauses' ), 5, 2 );

		/**
		 * Apply the keyword filter.
		 */
		if ( $q->is_main_query() ) {
			$keyword = wcapf()->active_filters->applied_keyword();

			if ( $keyword ) {
				$q->set( 's', $keyword );

				// Prevent native WP/WooCommerce search form widgets from being pre-filled with the WCAPF keyword.
				add_filter( 'get_search_query', '__return_empty_string' );
			}
		}
	}

	/**
	 * Filters the main query SQL clauses for product filtering.
	 *
	 * @param array     $args     The query clauses.
	 * @param \WP_Query $wp_query Query instance.
	 *
	 * @return array The modified query clauses.
	 */
	public function posts_clauses( array $args, \WP_Query $wp_query ): array {
		if ( ! $wp_query->is_main_query() ) {
			return $args;
		}

		$filter = new \WCAPF\ProductFilter();

		$args['join']  .= $filter->get_full_join_clause();
		$args['where'] .= $filter->get_full_where_clause();

		return $args;
	}
}
