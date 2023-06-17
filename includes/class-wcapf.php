<?php
/**
 * Setup WCAPF - WooCommerce Ajax Product Filter.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF - WooCommerce Ajax Product Filter main class.
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
		$required_wc_version = '7.3';
		$current_wc_version  = defined( 'WC_VERSION' ) ? WC_VERSION : '';

		if ( ! class_exists( 'WooCommerce' ) ) {
			$message = 'Please activate the <b>WooCommerce</b> plugin to use the <b>WCAPF - WooCommerce Ajax Product Filter</b>.';
		} elseif ( version_compare( $current_wc_version, $required_wc_version, '<' ) ) {
			$message = sprintf(
				'Please update your <b>WooCommerce</b> to %s or higher to use <b>WCAPF - WooCommerce Ajax Product Filter</b> plugin (you are currently using %s).',
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
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-default-data.php';
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

		// Migration dependencies.
		require_once WCAPF_PLUGIN_DIR . '/includes/migration/class-wcapf-v4-migration.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/migration/class-wcapf-v4-migration-hooks.php';

		// Loads the shortcodes.
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-active-filters-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-form-shortcode.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-reset-button-shortcode.php';

		// Loads the widgets.
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-filter-widget.php';

		// Loads the compatibility fixes.
		require_once WCAPF_PLUGIN_DIR . '/includes/wcapf-compatibility-fixes.php';

		/**
		 * Register a hook to load any other dependencies after the plugin files are loaded.
		 *
		 * @since 4.0.0
		 */
		do_action( 'wcapf_loaded' );
	}

	/**
	 * Checks if woocommerce plugin is loaded.
	 *
	 * @return bool
	 */
	private function wc_loaded() {
		return ! $this->wc_required_notice();
	}

}
