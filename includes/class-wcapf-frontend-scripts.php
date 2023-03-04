<?php
/**
 * Frontend scripts class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Frontend_Scripts class.
 *
 * @since 4.0.0
 */
class WCAPF_Frontend_Scripts {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Frontend_Scripts
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Frontend_Scripts();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'wp_enqueue_scripts', array( $this, 'load_frontend_scripts' ) );
	}

	/**
	 * Loads the frontend scripts.
	 *
	 * @param bool $for_preview Determines if the scripts should be loaded for preview purposes.
	 *
	 * @return void
	 */
	public static function load_frontend_scripts( $for_preview = false ) {
		if ( ! $for_preview && ! empty( WCAPF_Helper::wcapf_option( 'disable_wcapf' ) ) ) {
			return;
		}

		$load_scripts = apply_filters( 'wcapf_load_scripts_conditionally', false );

		if ( true === $load_scripts && ! $for_preview && ! WCAPF_Helper::found_wcapf() ) {
			return;
		}

		wp_enqueue_style(
			'wcapf-icons',
			WCAPF_PLUGIN_URL . 'public/icons/icons.css',
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/public/icons/icons.css' )
		);

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.css'
			: '.css';

		wp_enqueue_style(
			'wcapf-chosen',
			WCAPF_PLUGIN_URL . 'public/lib/chosen/chosen' . $ext,
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/public/lib/chosen/chosen' . $ext )
		);

		wp_enqueue_style(
			'wcapf-nouislider',
			WCAPF_PLUGIN_URL . 'public/lib/nouislider/nouislider' . $ext,
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/public/lib/nouislider/nouislider' . $ext )
		);

		wp_enqueue_style(
			'wc-ajax-product-filter-public-styles',
			WCAPF_PLUGIN_URL . 'public/css/wc-ajax-product-filter-public-styles' . $ext,
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/public/css/wc-ajax-product-filter-public-styles' . $ext )
		);

		// Add css variables.
		$primary_color      = WCAPF_Helper::wcapf_option( 'primary_color', '#345DBB' );
		$primary_text_color = WCAPF_Helper::wcapf_option( 'primary_text_color', '#ffffff' );
		$star_icon_color    = WCAPF_Helper::wcapf_option( 'star_icon_color', 'rgb(240, 201, 48)' );

		list( $r, $g, $b ) = WCAPF_Helper::get_rgb_from_hex( $primary_color );
		list( $r2, $g2, $b2 ) = WCAPF_Helper::get_rgb_from_hex( $primary_text_color );

		$variables = ":root {
			--wcapf-primary-color-rgb: $r, $g, $b;
			--wcapf-primary-text-color-rgb: $r2, $g2, $b2;
			--wcapf-star-icon-color: $star_icon_color;
		}";

		wp_add_inline_style( 'wc-ajax-product-filter-public-styles', $variables );

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.js'
			: '.js';

		wp_enqueue_script(
			'wcapf-chosen',
			WCAPF_PLUGIN_URL . 'public/lib/chosen/chosen.jquery' . $ext,
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/public/lib/chosen/chosen.jquery' . $ext ),
			true
		);

		wp_enqueue_script(
			'wcapf-nouislider',
			WCAPF_PLUGIN_URL . 'public/lib/nouislider/nouislider' . $ext,
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/public/lib/nouislider/nouislider' . $ext ),
			true
		);

		wp_enqueue_script(
			'wcapf-loadingoverlay',
			WCAPF_PLUGIN_URL . 'public/lib/loadingoverlay/loadingoverlay.min.js',
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/public/lib/loadingoverlay/loadingoverlay.min.js' ),
			true
		);

		if ( WCAPF_Helper::use_tippyjs_for_tooltip() ) {
			wp_enqueue_script(
				'wcapf-popper',
				WCAPF_PLUGIN_URL . 'public/lib/tippyjs/popper.min.js',
				array(),
				false,
				true
			);

			wp_enqueue_script(
				'wcapf-tippy',
				WCAPF_PLUGIN_URL . 'public/lib/tippyjs/tippy-bundle.umd.min.js',
				array(),
				false,
				true
			);
		}

		$deps = array( 'jquery' );

		/**
		 * Required for the scrollTo, slideToggle animations.
		 *
		 * TODO: Maybe use a filter or decision comes from the admin via plugin settings.
		 *
		 * @source https://stackoverflow.com/a/27598883
		 */
		$deps[] = 'jquery-effects-core';

		wp_enqueue_script(
			'wc-ajax-product-filter-public-scripts',
			WCAPF_PLUGIN_URL . 'public/js/wc-ajax-product-filter-public-scripts' . $ext,
			$deps,
			filemtime( WCAPF_PLUGIN_DIR . '/public/js/wc-ajax-product-filter-public-scripts' . $ext ),
			true
		);

		// Load the js variables in the header.
		wp_register_script( 'wcapf-params', false );

		wp_localize_script(
			'wcapf-params',
			'wcapf_params',
			self::get_js_params( $for_preview )
		);

		wp_enqueue_script( 'wcapf-params' );
	}

	/**
	 * Frontend js params.
	 *
	 * @param bool $for_preview
	 *
	 * @return array
	 */
	private static function get_js_params( $for_preview ) {
		$js_data = array(
			'enable_pagination_via_ajax',
			'pagination_container',
			'sorting_control',
			'attach_chosen_on_sorting',
			'loading_animation',
			'scroll_window',
			'scroll_window_for',
			'scroll_window_when',
			'scroll_window_custom_element',
			'scroll_to_top_offset',
			'disable_scroll_animation',
		);

		$shop_loop_identifier = '.' . WCAPF_Helper::shop_loop_container_identifier();

		$settings = array(
			'shop_loop_container' => $shop_loop_identifier,
			'not_found_container' => $shop_loop_identifier,
		);

		foreach ( $js_data as $key ) {
			$settings[ $key ] = WCAPF_Helper::wcapf_option( $key );
		}

		// Prevent attaching combobox on default orderby if combobox is disabled globally.
		if ( empty( $settings['use_chosen'] ) ) {
			$settings['attach_chosen_on_sorting'] = '';
		}

		$chosen_no_results_text   = WCAPF_Helper::no_results_text();
		$chosen_options_none_text = WCAPF_Helper::wcapf_option(
			'chosen_no_options_text',
			__( 'No options to choose', 'wc-ajax-product-filter' )
		);

		$params = array(
			'is_rtl'                                   => is_rtl(),
			'filter_input_delay'                       => 800, // In milliseconds.
			'chosen_display_selected_options'          => false,
			'chosen_no_results_text'                   => $chosen_no_results_text,
			'chosen_options_none_text'                 => $chosen_options_none_text,
			'search_box_in_default_orderby'            => true,
			'preserve_hierarchy_accordion_state'       => true,
			'preserve_soft_limit_state'                => true,
			'enable_animation_for_filter_accordion'    => false,
			'filter_accordion_animation_speed'         => 400,
			'filter_accordion_animation_easing'        => 'swing',
			'enable_animation_for_hierarchy_accordion' => false,
			'hierarchy_accordion_animation_speed'      => 400,
			'hierarchy_accordion_animation_easing'     => 'swing',
			'restore_focus_after_filtering'            => true,
			'loading_overlay_options'                  => self::get_loading_options( $settings ),
			'scroll_to_top_speed'                      => 400,
			'scroll_to_top_easing'                     => 'easeOutQuad',
			'immediate_scroll_on_paginate'             => false,
			'is_mobile'                                => wp_is_mobile(),
			'reload_on_back'                           => true,
			'found_wcapf'                              => WCAPF_Helper::found_wcapf(),
			'update_document_title'                    => true,
			'use_tippyjs'                              => WCAPF_Helper::use_tippyjs_for_tooltip(),
			'for_preview'                              => $for_preview,
		);

		$params = array_merge( $params, $settings );

		return apply_filters( 'wcapf_js_params', $params );
	}

	/**
	 * @param array $settings
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_loading_options( $settings ) {
		$loading_overlay_options = array();

		if ( isset( $settings['loading_animation'] ) ) {
			$loading_animation  = $settings['loading_animation'];
			$loading_image_size = isset( $settings['loading_image_size'] )
				? absint( $settings['loading_image_size'] )
				: 0;

			if ( 'none' === $loading_animation ) {
				$image_src = '';
			} else {
				$image_file = WCAPF_PLUGIN_DIR . '/public/loaders/' . $loading_animation . '.svg';
				$image_src  = WCAPF_PLUGIN_URL . '/public/loaders/' . $loading_animation . '.svg';

				// Default image.
				if ( ! file_exists( $image_file ) ) {
					$image_src = WCAPF_PLUGIN_URL . '/public/loaders/Spinner.svg';
				}
			}

			$image_size = $loading_image_size ? $loading_image_size . 'px' : '60px';

			$loading_overlay_options = array(
				'image'           => $image_src,
				'size'            => $image_size,
				'imageAutoResize' => false,
				'imageAnimation'  => '',
				'imageColor'      => '',
				'imageClass'      => 'wcapf-loading-icon-wrapper',
			);

			if ( apply_filters( 'wcapf_use_colored_loading_animation', true ) ) {
				$loading_overlay_options['imageClass'] = 'wcapf-colored-loading-icon-wrapper';
			}
		}

		return $loading_overlay_options;
	}

}

WCAPF_Frontend_Scripts::instance();
