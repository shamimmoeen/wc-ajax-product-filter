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

		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-admin.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-api-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-field-instance.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-form.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-form-filters-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-frontend-scripts.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-helper.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-post-type.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-product-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-product-filter-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-template-loader.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-url-builder.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-v4-migration.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-walker.php';

		// Loads the filter types.
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-post-author.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-post-meta.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-price.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-product-status.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-taxonomy.php';

		// Loads the hooks.
		require_once WCAPF_PLUGIN_DIR . '/includes/hooks/class-wcapf-api.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/hooks/class-wcapf-hooks.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/hooks/class-wcapf-post-author-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/hooks/class-wcapf-rating-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/hooks/class-wcapf-taxonomy-filter.php';

		// Loads the shortcodes.
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-active-filters-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-form-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-reset-button-shortcode.php';

		// Loads the widgets.
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-filter-widget.php';
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
	 * Loads the backend scripts.
	 *
	 * TODO: Remove this.
	 */
	public function load_backend_scripts() {
		if ( ! $this->wc_loaded() ) {
			return;
		}

		global $typenow;

		if ( 'wcapf-filter' !== $typenow && 'wcapf-form' !== $typenow ) {
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
