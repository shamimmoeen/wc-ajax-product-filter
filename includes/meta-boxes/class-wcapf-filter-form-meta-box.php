<?php
/**
 * The filter form meta box class.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/meta-boxes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Form_Meta_Box class.
 *
 * @since 3.1.0
 */
class WCAPF_Filter_Form_Meta_Box {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Filter_Form_Meta_Box
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Filter_Form_Meta_Box();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'save_post', array( $this, 'save_form' ) );
		add_action( 'edit_form_advanced', array( $this, 'render_meta_box' ) );
		add_action( 'admin_footer', array( $this, 'render_tmpl_templates' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_filter_form_admin_ui_scripts' ) );
		add_action( 'admin_menu', array( $this, 'register_filter_form_custom_edit_page' ), 5 );
	}

	public function register_filter_form_custom_edit_page() {
		add_submenu_page(
			'edit.php?post_type=wcapf-filter',
			__( 'Filter Forms', 'wc-ajax-product-filter' ),
			__( 'Filter Forms', 'wc-ajax-product-filter' ),
			'manage_options',
			'edit-filter-form',
			array( $this, 'edit_filter_form_page' )
		);
	}

	public function edit_filter_form_page() {
		echo '<div id="wcapf-filter-form-admin-ui"></div>';
	}

	public function enqueue_filter_form_admin_ui_scripts() {
		$screen = get_current_screen();

		if ( 'wcapf-filter_page_edit-filter-form' !== $screen->id ) {
			return;
		}

		$script_asset_path = WCAPF_PLUGIN_DIR . '/build/filter-form.asset.php';

		if ( ! file_exists( $script_asset_path ) ) {
			/** @noinspection PhpMultipleClassDeclarationsInspection */
			throw new Error(
				'You need to run `npm start` or `npm run build` for the filter admin ui'
			);
		}

		$admin_js     = 'build/filter-form.js';
		$script_asset = require( $script_asset_path );

		wp_enqueue_script(
			'wcapf-filter-form-admin-ui-js',
			plugins_url( $admin_js, WCAPF_PLUGIN_FILE ),
			$script_asset['dependencies'],
			$script_asset['version']
		);

		$admin_css = 'build/filter-form.css';

		wp_enqueue_style(
			'wcapf-filter-form-admin-ui-css',
			plugins_url( $admin_css, WCAPF_PLUGIN_FILE ),
			[ 'wp-components' ],
			filemtime( WCAPF_PLUGIN_DIR . '/' . $admin_css )
		);

		$ext = function_exists( 'wp_get_environment_type' ) && 'production' === wp_get_environment_type()
			? '.min.css'
			: '.css';

		wp_enqueue_style(
			'wc-ajax-product-filter-public-styles',
			WCAPF_PLUGIN_URL . 'public/css/wc-ajax-product-filter-public-styles' . $ext,
			array(),
			filemtime( WCAPF_PLUGIN_DIR . '/public/css/wc-ajax-product-filter-public-styles' . $ext )
		);

		// TODO: Move to 'pro'.
		wp_enqueue_style(
			'wc-ajax-product-filter-pro-public-styles',
			WCAPF_PRO_PLUGIN_URL . 'public/css/wc-ajax-product-filter-pro-public-styles' . $ext,
			array( 'wc-ajax-product-filter-public-styles' ),
			filemtime( WCAPF_PRO_PLUGIN_DIR . '/public/css/wc-ajax-product-filter-pro-public-styles' . $ext )
		);
	}

	/**
	 * Saves the form.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function save_form( $post_id ) {
		if ( ! isset( $_POST['wcapf_filter_form_meta_box_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['wcapf_filter_form_meta_box_nonce'], 'save_filter_form_meta_data' ) ) {
			return;
		}

		$filter_ids              = isset( $_POST['filter_id'] ) ? $_POST['filter_id'] : array();
		$show_title              = isset( $_POST['show_title'] ) ? $_POST['show_title'] : '';
		$enable_accordion        = isset( $_POST['enable_accordion'] ) ? $_POST['enable_accordion'] : '';
		$accordion_default_state = isset( $_POST['accordion_default_state'] ) ? $_POST['accordion_default_state'] : '';
		$show_clear_button       = isset( $_POST['show_clear_button'] ) ? $_POST['show_clear_button'] : '';
		$enable_visibility_rules = isset( $_POST['enable_visibility_rules'] ) ? $_POST['enable_visibility_rules'] : '';
		$visibility_rules        = isset( $_POST['visibility_rules'] ) ? $_POST['visibility_rules'] : array();

		$reset_filter_visibility_rules = isset( $_POST['reset_filter_visibility_rules'] )
			? $_POST['reset_filter_visibility_rules']
			: '';

		$decode           = rawurldecode( $visibility_rules );
		$visibility_rules = json_decode( $decode, true );
		$visibility_rules = is_array( $visibility_rules ) ? $visibility_rules : array();

		$parsed_data = array(
			'filter_ids'                    => $filter_ids,
			'show_title'                    => $show_title,
			'enable_accordion'              => $enable_accordion,
			'accordion_default_state'       => $accordion_default_state,
			'show_clear_button'             => $show_clear_button,
			'enable_visibility_rules'       => $enable_visibility_rules,
			'visibility_rules'              => $visibility_rules,
			'reset_filter_visibility_rules' => $reset_filter_visibility_rules,
		);

		$parsed_data = apply_filters( 'wcapf_parse_form_data', $parsed_data, $_POST );

		update_post_meta( $post_id, '_form_data', $parsed_data );
	}

	/**
	 * Renders the meta box.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return void
	 */
	public function render_meta_box( $post ) {
		if ( 'wcapf-form' !== get_post_type() ) {
			return;
		}

		$post_id = $post->ID;

		$form_data  = get_post_meta( $post_id, '_form_data', true );
		$filter_ids = isset( $form_data['filter_ids'] ) ? $form_data['filter_ids'] : array();

		$available_filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
			)
		);

		WCAPF_Template_Loader::get_instance()->load(
			'admin/meta-box/filter-form',
			array(
				'available_filters' => $available_filters,
				'filter_ids'        => $filter_ids,
			)
		);
	}

	/**
	 * Renders the tmpl version of filter form item template.
	 *
	 * @return void
	 */
	public function render_tmpl_templates() {
		if ( 'wcapf-form' === get_post_type() ) {
			echo '<script type="text/html" id="tmpl-wcapf-filter-form-item">';
			echo WCAPF_Template_Loader::get_instance()->load(
				'admin/meta-box/filter-form-item',
				array( 'for_tmpl' => true ),
				false
			);
			echo '</script>';
		}
	}

}

WCAPF_Filter_Form_Meta_Box::instance();
