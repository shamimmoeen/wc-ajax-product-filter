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
 * @since  3.0.0
 * @author Mainul Hassan Main
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
	 * @param string      $name  The name.
	 * @param string|bool $value The value.
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
		require_once WCAPF_PATH . 'includes/class-wcapf-filter.php';
		require_once WCAPF_PATH . 'includes/class-wcapf-list-walker.php';
		require_once WCAPF_PATH . 'includes/class-wcapf-term-helper.php';

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
		add_action( 'wp_enqueue_scripts', array( $this, 'load_frontend_scripts' ) );
	}

	public function default_settings() {
		return array(
			'shop_loop_container'  => '.wcapf-before-products',
			'not_found_container'  => '.wcapf-before-products',
			'pagination_container' => '.woocommerce-pagination',
			'overlay_bg_color'     => '#fff',
			'sorting_control'      => '1',
			'scroll_to_top'        => '1',
			'scroll_to_top_offset' => '100',
			'custom_scripts'       => ''
		);
	}

	public function load_frontend_scripts() {
		wp_enqueue_style( 'wcapf-styles', WCAPF_URL . 'assets/css/wcapf-styles.css', array(), filemtime( WCAPF_PATH . 'assets/css/wcapf-styles.css' ) );
		wp_enqueue_style( 'wcapf-fontawesome-icons', WCAPF_URL . 'assets/css/font-awesome.min.css', array(), filemtime( WCAPF_PATH . 'assets/css/font-awesome.min.css' ) );
		wp_enqueue_script( 'wcapf-ui-slider', WCAPF_URL . 'assets/js/nouislider.min.js', array( 'jquery' ), filemtime( WCAPF_PATH . 'assets/js/nouislider.min.js' ), true );
		wp_enqueue_script( 'wcapf-price-filter', WCAPF_URL . 'assets/js/price-filter.js', array( 'jquery' ), filemtime( WCAPF_PATH . 'assets/js/price-filter.js' ), true );
		wp_enqueue_script( 'wcapf-scripts', WCAPF_URL . 'assets/js/scripts.js', array( 'jquery' ), filemtime( WCAPF_PATH . 'assets/js/scripts.js' ), true );

		wp_localize_script( 'wcapf-scripts', 'wcapf_params', $this->default_settings() );
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
