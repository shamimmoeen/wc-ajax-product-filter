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
	public function init_hooks() {
		add_action( 'admin_notices', array( $this, 'show_admin_notice' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
		add_action( 'woocommerce_loaded', array( $this, 'load_dependencies' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'load_frontend_scripts' ) );
	}

	/**
	 * Check requirements, if requirements fail show notice.
	 */
	public function show_admin_notice() {
		$notice = $this->wc_required_notice();

		if ( ! $notice ) {
			return;
		}

		echo '<div class="notice notice-warning"><p>' . wp_kses_post( $notice ) . '</p></div>';
	}

	/**
	 * Checks if woocommerce plugin is activated and the version of the woocommerce plugin fulfil our required version.
	 *
	 * @return string
	 */
	private function wc_required_notice() {
		$message             = '';
		$required_plugins    = array();
		$required_wc_version = '3.4.5';
		$current_wc_version  = defined( 'WC_VERSION' ) ? WC_VERSION : '';

		if ( ! class_exists( 'WooCommerce' ) ) {
			$required_plugins[] = '<a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a>';
		}

		if ( $required_plugins ) {
			$message = sprintf(
				/* translators: %s: required plugins */
				__( '<b>WC Ajax Product Filter</b> requires you to install %s.', 'wc-ajax-product-filter' ),
				implode( ', ', $required_plugins )
			);
		} elseif ( version_compare( $current_wc_version, $required_wc_version, '<' ) ) {
			$message = sprintf(
				/* translators: %s: minimum woocommerce version */
				__( '<b>WC Ajax Product Filter</b> requires WooCommerce %1$s (you are using %2$s).', 'wc-ajax-product-filter' ),
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
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-taxonomy-walker.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-hooks.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-utils.php';

		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-active-filters.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-attribute-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-category-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-tag-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-custom-taxonomy-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-price-filter.php';
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

		wp_enqueue_style( 'wcapf-styles', WCAPF_PLUGIN_URL . 'assets/css/wcapf-styles.css', array(), filemtime( WCAPF_PLUGIN_DIR . '/assets/css/wcapf-styles.css' ) );
		wp_enqueue_style( 'wcapf-fontawesome-icons', WCAPF_PLUGIN_URL . 'assets/css/font-awesome.min.css', array(), filemtime( WCAPF_PLUGIN_DIR . '/assets/css/font-awesome.min.css' ) );

		wp_enqueue_script( 'wcapf-ui-slider', WCAPF_PLUGIN_URL . 'assets/js/nouislider.min.js', array( 'jquery' ), filemtime( WCAPF_PLUGIN_DIR . '/assets/js/nouislider.min.js' ), true );
		wp_enqueue_script( 'wcapf-price-filter', WCAPF_PLUGIN_URL . 'assets/js/price-filter.js', array( 'jquery' ), filemtime( WCAPF_PLUGIN_DIR . '/assets/js/price-filter.js' ), true );
		wp_enqueue_script( 'wcapf-scripts', WCAPF_PLUGIN_URL . 'assets/js/scripts.js', array( 'jquery' ), filemtime( WCAPF_PLUGIN_DIR . '/assets/js/scripts.js' ), true );

		wp_localize_script( 'wcapf-scripts', 'wcapf_params', $this->default_settings() );
	}

	/**
	 * The default settings.
	 *
	 * @return string[]
	 */
	public function default_settings() {
		return array(
			'shop_loop_container'  => '.wcapf-before-products',
			'not_found_container'  => '.wcapf-before-products',
			'pagination_container' => '.woocommerce-pagination',
			'overlay_bg_color'     => '#fff',
			'sorting_control'      => '1',
			'scroll_to_top'        => '1',
			'scroll_to_top_offset' => '100',
			'custom_scripts'       => '',
		);
	}

}
