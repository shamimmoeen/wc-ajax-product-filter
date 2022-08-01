<?php
/**
 * Setup WC Ajax Product Filter.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WC Ajax Product Filter main class.
 *
 * @since  3.0.0
 * @author wptools.io
 */
class WCAPF {

	/**
	 * The constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'admin_notices', array( $this, 'show_admin_notice' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
		add_action( 'woocommerce_loaded', array( $this, 'load_dependencies' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'load_frontend_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_backend_scripts' ) );
	}

	/**
	 * Check requirements, if requirements fail show notice.
	 */
	public function show_admin_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$notice = $this->wc_required_notice();

		if ( ! $notice ) {
			return;
		}

		echo '<div class="notice notice-error"><p>' . wp_kses_post( $notice ) . '</p></div>';
	}

	/**
	 * Checks if woocommerce plugin is activated and the version of the woocommerce plugin fulfil our required version.
	 *
	 * @return string
	 * @noinspection HtmlUnknownTarget
	 */
	private function wc_required_notice() {
		$message             = '';
		$required_plugins    = array();
		$required_wc_version = '3.6';
		$current_wc_version  = defined( 'WC_VERSION' ) ? WC_VERSION : '';

		if ( ! class_exists( 'WooCommerce' ) ) {
			$required_plugins[] = sprintf(
				'<a href="%1$s" target="_blank">WooCommerce</a>',
				'https://wordpress.org/plugins/woocommerce/'
			);
		}

		if ( $required_plugins ) {
			$message = sprintf(
				/* translators: our plugin, required plugins */
				__( '%1$s requires you to install %2$s.', 'wc-ajax-product-filter' ),
				'<strong>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</strong>',
				implode( ', ', $required_plugins )
			);
		} elseif ( version_compare( $current_wc_version, $required_wc_version, '<' ) ) {
			$message = sprintf(
				/* translators: our plugin, minimum woocommerce version, current woocommerce version */
				__(
					'%1$s requires WooCommerce %2$s (you are using %3$s).',
					'wc-ajax-product-filter'
				),
				'<strong>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</strong>',
				$required_wc_version,
				$current_wc_version
			);
		}

		return $message;
	}

	/**
	 * Loads the plugin's translated strings.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( WCAPF_SLUG, false, WCAPF_PLUGIN_DIR . 'languages' );
	}

	/**
	 * Loads the required files.
	 */
	public function load_dependencies() {
		if ( ! $this->wc_loaded() ) {
			return;
		}

		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-helper.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-template-loader.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-admin.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-settings-page.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-hooks.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-product-filter-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-product-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-walker.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-field-instance.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-post-type.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter-meta-box.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-product-status.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/fields/field-groups/class-wcapf-field-group.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/field-groups/class-wcapf-field-group-text.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/field-groups/class-wcapf-field-group-number.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-active-filters.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-category.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-tag.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-attribute.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-price.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-rating.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-product-status.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-reset-button.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-price-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-rating-filter.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter-widget.php';
	}

	/**
	 * Checks if woocommerce plugin is loaded.
	 *
	 * @return bool
	 */
	private function wc_loaded() {
		return ! $this->wc_required_notice();
	}

	/**
	 * Loads the frontend scripts.
	 */
	public function load_frontend_scripts() {
		if ( ! $this->wc_loaded() ) {
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
			$this->get_js_params()
		);
	}

	/**
	 * Frontend js params.
	 *
	 * @return array
	 */
	private function get_js_params() {
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
					'imageClass'     => 'wcapf-loading-overlay-img'
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

	/**
	 * Loads the backend scripts.
	 */
	public function load_backend_scripts() {
		if ( ! $this->wc_loaded() ) {
			return;
		}

		global $typenow;

		if ( 'wcapf-filter' !== $typenow ) {
			return;
		}

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.css'
			: '.css';

		wp_enqueue_style(
			'wc-ajax-product-filter-admin-styles',
			WCAPF_PLUGIN_URL . 'admin/css/wc-ajax-product-filter-admin-styles' . $ext,
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/admin/css/wc-ajax-product-filter-admin-styles' . $ext )
		);

		wp_enqueue_style( 'wcapf-remodal', WCAPF_PLUGIN_URL . 'admin/lib/remodal/remodal.css' );
		wp_enqueue_style( 'wcapf-remodal-theme', WCAPF_PLUGIN_URL . 'admin/lib/remodal/remodal-default-theme.css' );

		wp_enqueue_script(
			'wcapf-remodal',
			WCAPF_PLUGIN_URL . 'admin/lib/remodal/remodal.min.js',
			array( 'jquery' ),
			false,
			true
		);

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.js'
			: '.js';

		$main_admin_script_deps = array(
			'jquery',
			'wp-util',
			'jquery-serialize-object',
			'jquery-ui-draggable',
			'jquery-ui-droppable',
			'jquery-ui-sortable',
			'wcapf-remodal',
		);

		$admin_scripts = apply_filters( 'wcapf_admin_scripts_before_main_script', array() );

		if ( $admin_scripts ) {
			foreach ( $admin_scripts as $script ) {
				$handle = isset( $script['handle'] ) ? $script['handle'] : '';
				$src    = isset( $script['src'] ) ? $script['src'] : '';
				$deps   = isset( $script['deps'] ) ? $script['deps'] : array();
				$path   = isset( $script['path'] ) ? $script['path'] : '';
				$footer = isset( $script['in_footer'] ) ? $script['in_footer'] : true;

				if ( $handle && $src ) {
					$main_admin_script_deps[] = $handle;

					wp_enqueue_script( $handle, $src, $deps, filemtime( $path ), $footer );
				}
			}
		}

		wp_enqueue_script(
			'wc-ajax-product-filter-admin-scripts',
			WCAPF_PLUGIN_URL . 'admin/js/wc-ajax-product-filter-admin-scripts' . $ext,
			$main_admin_script_deps,
			filemtime( WCAPF_PLUGIN_DIR . '/admin/js/wc-ajax-product-filter-admin-scripts' . $ext ),
			true
		);

		wp_localize_script(
			'wc-ajax-product-filter-admin-scripts',
			'wcapf_admin_params',
			$this->admin_js_params()
		);

		wp_enqueue_media();
	}

	/**
	 * Admin js params.
	 *
	 * @return array
	 */
	private function admin_js_params() {
		$params = array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		);

		return apply_filters( 'wcapf_admin_js_params', $params );
	}

}
