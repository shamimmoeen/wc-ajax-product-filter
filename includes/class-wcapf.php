<?php
/**
 * Setup WC Ajax Product Filter.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

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
		add_action( 'admin_enqueue_scripts', array( $this, 'load_backend_scripts' ) );
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
	 * @noinspection HtmlUnknownTarget
	 */
	private function wc_required_notice() {
		$message             = '';
		$required_plugins    = array();
		$required_wc_version = '3.4.5';
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
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-hooks.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-filter-form-widget.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-walker.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/filter-types/class-wcapf-filter-type-post-meta.php';

		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-active-filters.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-taxonomy.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-category-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-tag-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-custom-taxonomy-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-attribute-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-price-filter.php';
		// require_once WCAPF_PLUGIN_DIR . '/includes/widgets/class-wcapf-widget-post-meta.php';

		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-category.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-tag.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-attribute.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-custom-taxonomy.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-post-meta.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-submit-button.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/fields/class-wcapf-field-reset-button.php';

		// TODO: Remove this from free version
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-pro.php';
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

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.css'
			: '.css';

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
			'wc-ajax-product-filter-public-scripts',
			WCAPF_PLUGIN_URL . 'public/js/wc-ajax-product-filter-public-scripts' . $ext,
			array( 'jquery', 'wp-util', 'jquery-ui-draggable', 'jquery-ui-droppable', 'jquery-ui-sortable' ),
			filemtime( WCAPF_PLUGIN_DIR . '/public/js/wc-ajax-product-filter-public-scripts' . $ext ),
			true
		);

		wp_enqueue_style(
			'wcapf-styles',
			WCAPF_PLUGIN_URL . 'assets/css/wcapf-styles.css',
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/assets/css/wcapf-styles.css' )
		);

		wp_enqueue_style(
			'wcapf-fontawesome-icons',
			WCAPF_PLUGIN_URL . 'assets/css/font-awesome.min.css',
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/assets/css/font-awesome.min.css' )
		);

		wp_enqueue_script(
			'wcapf-ui-slider',
			WCAPF_PLUGIN_URL . 'assets/js/nouislider.min.js',
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/assets/js/nouislider.min.js' ),
			true
		);

		wp_enqueue_script(
			'wcapf-price-filter',
			WCAPF_PLUGIN_URL . 'assets/js/price-filter.js',
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/assets/js/price-filter.js' ),
			true
		);

		wp_enqueue_script(
			'wcapf-scripts',
			WCAPF_PLUGIN_URL . 'assets/js/scripts.js',
			array( 'jquery' ),
			filemtime( WCAPF_PLUGIN_DIR . '/assets/js/scripts.js' ),
			true
		);

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

	/**
	 * Loads the backend scripts.
	 *
	 * @param string $hook The current admin page.
	 */
	public function load_backend_scripts( $hook ) {
		if ( ! $this->wc_loaded() ) {
			return;
		}

		if ( WCAPF_Helper::settings_page_hook() !== $hook ) {
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

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.js'
			: '.js';

		wp_enqueue_script(
			'wc-ajax-product-filter-admin-scripts',
			WCAPF_PLUGIN_URL . 'admin/js/wc-ajax-product-filter-admin-scripts' . $ext,
			array( 'jquery', 'wp-util', 'jquery-ui-draggable', 'jquery-ui-droppable', 'jquery-ui-sortable' ),
			filemtime( WCAPF_PLUGIN_DIR . '/admin/js/wc-ajax-product-filter-admin-scripts' . $ext ),
			true
		);
	}

}
