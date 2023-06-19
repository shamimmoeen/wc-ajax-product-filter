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
	 * Required WordPress version.
	 *
	 * @var string
	 */
	private $required_wp_version = '6.0';

	/**
	 * Required WooCommerce version.
	 *
	 * @var string
	 */
	private $required_wc_version = '6.6';

	/**
	 * Required PHP version.
	 *
	 * @var string
	 */
	private $required_php_version = '7.2';

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

		$notices = $this->check_requirements();

		if ( ! empty( $notices ) ) {
			// Get the first notice.
			$notice = array_shift( $notices );
			echo '<div class="notice notice-error"><p>' . wp_kses_post( $notice ) . '</p></div>';
		}
	}

	/**
	 * Check if the requirements are met.
	 *
	 * @return array Array of admin notices for failed requirements.
	 */
	private function check_requirements() {
		$notices     = array();
		$wc_version  = defined( 'WC_VERSION' ) ? WC_VERSION : '';
		$wp_version  = get_bloginfo( 'version' );
		$php_version = PHP_VERSION;

		if ( ! class_exists( 'WooCommerce' ) ) {
			$notices[] = __( 'WCAPF - WooCommerce Ajax Product Filter requires WooCommerce. The plugin is currently NOT RUNNING.', 'wc-ajax-product-filter' );
		} elseif ( version_compare( $wc_version, $this->required_wc_version, '<' ) ) {
			$notices[] = sprintf(
				__( 'WCAPF - WooCommerce Ajax Product Filter requires WooCommerce version %s or higher. The plugin is currently NOT RUNNING (you are currently using WooCommerce %s).', 'wc-ajax-product-filter' ),
				$this->required_wc_version,
				$wc_version
			);
		}

		if ( version_compare( $wp_version, $this->required_wp_version, '<' ) ) {
			$notices[] = sprintf(
				__( 'WCAPF - WooCommerce Ajax Product Filter requires WordPress version %s or higher. The plugin is currently NOT RUNNING (you are currently using WordPress %s).', 'wc-ajax-product-filter' ),
				$this->required_wp_version,
				$wp_version
			);
		}

		if ( version_compare( $php_version, $this->required_php_version, '<' ) ) {
			$notices[] = sprintf(
				__( 'WCAPF - WooCommerce Ajax Product Filter requires PHP version %s or higher. The plugin is currently NOT RUNNING (you are currently using PHP %s).', 'wc-ajax-product-filter' ),
				$this->required_php_version,
				$php_version
			);
		}

		return $notices;
	}

	/**
	 * Loads the plugin's translated strings.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'wc-ajax-product-filter', false, WCAPF_PLUGIN_DIR . 'languages' );
	}

	/**
	 * Loads the required files if requirements are met.
	 */
	public function load_dependencies() {
		$met_requirements = empty( $this->check_requirements() );

		if ( ! $met_requirements ) {
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

}
