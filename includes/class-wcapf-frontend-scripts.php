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

	public static function load_frontend_scripts() {
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

		wp_localize_script(
			'wc-ajax-product-filter-public-scripts',
			'wcapf_params',
			self::get_js_params()
		);
	}

	/**
	 * Frontend js params.
	 *
	 * @return array
	 */
	private static function get_js_params() {
		$settings = WCAPF_Helper::get_settings();

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
			'filter_input_delay'                       => 800, // In milliseconds.
			'chosen_lib_search_threshold'              => 10,
			'preserve_hierarchy_accordion_state'       => true,
			'enable_animation_for_hierarchy_accordion' => true,
			'hierarchy_accordion_animation_speed'      => 400,
			'hierarchy_accordion_animation_easing'     => 'swing',
			'loading_overlay_options'                  => $loading_overlay_options,
			'scroll_to_top_speed'                      => 400,
			'scroll_to_top_easing'                     => 'easeOutQuad',
			'is_mobile'                                => wp_is_mobile(),
			'disable_inputs_while_fetching_results'    => $disable_inputs,
			'apply_filters_on_browser_history_change'  => $history_popstate,
		);

		$params = array_merge( $params, $settings );

		return apply_filters( 'wcapf_js_params', $params );
	}

}

WCAPF_Frontend_Scripts::instance();
