<?php
/**
 * Setup WC Ajax Product Filter.
 *
 * @since   3.0.0
 * @package WC_Ajax_Product_Filter
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter main class.
 *
 * @author Mainul Hassan Main
 * @since  3.0.0
 */
class WCAPF {

	/**
	 * Unique identifier for the plugin.
	 *
	 * The variable name is used as the text domain when internationalizing
	 * strings of text.
	 *
	 * @var string
	 */
	public $plugin_slug;

	/**
	 * Plugin version, used for cache-busting of style and script file
	 * references.
	 *
	 * @var string
	 */
	public $plugin_version;

	/**
	 * Check requirements, if requirements fail show notice.
	 */
	public function check_requirements() {
		$notice              = '';
		$required_plugins    = array();
		$required_wc_version = '3.4.5';

		if ( ! class_exists( 'WooCommerce' ) ) {
			$required_plugins[] = '<a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a>';
		}

		if ( $required_plugins ) {
			$notice = sprintf(
				/* translators: %s: required plugins */
				esc_html__( 'WC Ajax Product Filter requires you to install %s.', 'wc-ajax-product-filter' ),
				implode( ', ', $required_plugins )
			);
		} elseif ( version_compare( WC_VERSION, $required_wc_version, '<' ) ) {
			$notice = sprintf(
				/* translators: %s: minimum woocommerce version */
				esc_html__( 'WC Ajax Product Filter requires WooCommerce %1$s (you are using %2$s).', 'wc-ajax-product-filter' ),
				$required_wc_version,
				WC_VERSION
			);
		}

		if ( ! $notice ) {
			return;
		}

		echo '<div class="notice notice-warning"><p>' . wp_kses_post( $notice ) . '</p></div>';
	}

	/**
	 * Defines constants if not already defined.
	 *
	 * @param string      $name   The name.
	 * @param string|bool $value  The value.
	 */
	public function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			define( 'WCAPF_' . $name, $value );
		}
	}

	/**
	 * Define constants.
	 */
	public function define_constants() {
		$this->define( 'PATH', $this->get_plugin_path() );
		$this->define( 'URL', $this->get_plugin_url() );
		$this->define( 'CACHE_TIME', 60 * 60 * 12 );
	}

	/**
	 * Loads the required files.
	 */
	public function includes() {
		require_once WCAPF_PATH . 'includes/class-wcapf-admin.php';
		require_once WCAPF_PATH . 'includes/class-wcapf-product-filter.php';
		require_once WCAPF_PATH . 'includes/class-wcapf-list-walker.php';

		// require_once WCAPF_PATH . 'includes/widgets/class-wcapf-widget-active-filters.php';
		// require_once WCAPF_PATH . 'includes/widgets/class-wcapf-widget-attribute-filter.php';
		require_once WCAPF_PATH . 'includes/widgets/class-wcapf-widget-category-filter.php';
		// require_once WCAPF_PATH . 'includes/widgets/class-wcapf-widget-price-filter.php';
		// require_once WCAPF_PATH . 'includes/widgets/class-wcapf-widget-tag-filter.php';
	}

	/**
	 * Hook into actions and filters.
	 */
	public function init_hooks() {
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
		add_action( 'admin_notices', array( $this, 'check_requirements' ) );
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been ran previously
		if ( null === $instance ) {
			$instance = new WCAPF();
			$instance->run();
		}

		return $instance;
	}

	/**
	 * Loads the plugin's translated strings.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( WCAPF_SLUG, false, $this->get_plugin_path() . 'languages' );
	}

	/**
	 * Gets the plugin slug.
	 *
	 * @return string  The plugin slug.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}

	/**
	 * Gets the plugin version.
	 *
	 * @return string  The plugin version.
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}

	/**
	 * Gets the plugin path.
	 *
	 * @return string  The plugin path.
	 */
	public function get_plugin_path() {
		return plugin_dir_path( WCAPF_PLUGIN_FILE );
	}

	/**
	 * Gets the plugin url.
	 *
	 * @return string  The plugin url.
	 */
	public function get_plugin_url() {
		return plugin_dir_url( WCAPF_PLUGIN_FILE );
	}

	/**
	 * Runs the class.
	 */
	public function run() {
		$this->plugin_slug    = WCAPF_SLUG;
		$this->plugin_version = WCAPF_VERSION;

		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

}
