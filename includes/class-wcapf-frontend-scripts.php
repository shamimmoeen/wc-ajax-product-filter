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
	 * TODO: Conditionally load the scripts.
	 *
	 * @param bool $for_preview Determines if the scripts should be loaded for preview purposes.
	 *
	 * @return void
	 */
	public static function load_frontend_scripts( $for_preview = false ) {
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
		list( $r, $g, $b ) = WCAPF_Helper::get_primary_color();
		list( $r2, $g2, $b2 ) = WCAPF_Helper::get_primary_accent_color();

		$variables = ":root {
			--wcapf-primary-color-rgb: $r, $g, $b;
			--wcapf-primary-accent-color-rgb: $r2, $g2, $b2;
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

		$deps = array( 'jquery' );

		/**
		 * Required for the scrollTo, slideToggle animations.
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
		$settings = WCAPF_Helper::get_settings();

		// Prevent attaching combobox on default orderby if combobox is disabled globally.
		if ( isset( $settings['use_chosen'] ) && ! $settings['use_chosen'] ) {
			$settings['attach_chosen_on_sorting'] = '';
		}

		$disable_inputs = true;

		if ( isset( $settings['loading_animation'] ) && $settings['loading_animation'] ) {
			$disable_inputs = false;
		}

		$disable_inputs   = apply_filters( 'wcapf_disable_inputs_while_fetching_results', $disable_inputs );
		$history_popstate = apply_filters( 'wcapf_apply_filters_on_browser_history_change', true );

		$loading_overlay_options = array();

		if ( isset( $settings['loading_image'] ) && $settings['loading_image'] ) {
			$image = wp_get_attachment_image_src( $settings['loading_image'], 'full' );

			if ( $image ) {
				$image_src = $image[0];

				$loading_overlay_options = array(
					'image'          => $image_src,
					'imageAnimation' => '',
					'imageClass'     => 'wcapf-loading-overlay-img',
				);
			}
		}

		$params = array(
			'is_rtl'                                   => is_rtl(),
			'filter_input_delay'                       => 800, // In milliseconds.
			'chosen_display_selected_options'          => false,
			'chosen_no_results_text'                   => __( 'No results for:', 'wc-ajax-product-filter' ),
			'chosen_options_none_text'                 => __( 'No options to choose', 'wc-ajax-product-filter' ),
			'chosen_lib_search_threshold'              => 10,
			'preserve_filter_accordion_state'          => true,
			'enable_animation_for_filter_accordion'    => false,
			'filter_accordion_animation_speed'         => 400,
			'filter_accordion_animation_easing'        => 'swing',
			'preserve_hierarchy_accordion_state'       => true,
			'enable_animation_for_hierarchy_accordion' => false,
			'hierarchy_accordion_animation_speed'      => 400,
			'hierarchy_accordion_animation_easing'     => 'swing',
			'restore_focus_after_filtering'            => true,
			'loading_overlay_options'                  => $loading_overlay_options,
			'scroll_to_top_speed'                      => 400,
			'scroll_to_top_easing'                     => 'easeOutQuad',
			'is_mobile'                                => wp_is_mobile(),
			'disable_inputs_while_fetching_results'    => $disable_inputs,
			'apply_filters_on_browser_history_change'  => $history_popstate,
			'for_preview'                              => $for_preview,
		);

		$params = array_merge( $params, $settings );

		return apply_filters( 'wcapf_js_params', $params );
	}

}

WCAPF_Frontend_Scripts::instance();
