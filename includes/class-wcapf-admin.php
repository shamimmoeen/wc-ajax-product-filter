<?php
/**
 * Main admin class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Admin class.
 *
 * @since 3.0.0
 */
class WCAPF_Admin {

	/**
	 * The constructor.
	 */
	public function __construct() {
		$plugin_file = plugin_basename( WCAPF_PLUGIN_FILE );
		add_filter( 'plugin_action_links_' . $plugin_file, array( $this, 'plugin_action_links' ) );

		add_action( 'admin_menu', array( $this, 'register_admin_pages' ) );
		add_action( 'admin_menu', array( $this, 'modify_admin_menu_label' ) );
		add_action( 'in_admin_header', array( $this, 'disable_admin_notices' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_ui_scripts' ) );
		add_action( 'admin_footer-widgets.php', array( $this, 'js_scripts_for_legacy_widget' ) );
	}

	/**
	 * Adds plugin's action links.
	 *
	 * TODO: Show the upgrade to pro and filters list instead of settings links.
	 *
	 * @param array $links The default links.
	 *
	 * @return array The updated action links.
	 * @noinspection HtmlUnknownTarget
	 */
	public function plugin_action_links( $links ) {
		$forms_page_action_link = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( WCAPF_Helper::forms_page_url() ),
			__( 'Add Filters', 'wc-ajax-product-filter' )
		);

		$settings_page_action_link = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( WCAPF_Helper::settings_page_url() ),
			__( 'Settings', 'wc-ajax-product-filter' )
		);

		$pre_links = array( $forms_page_action_link, $settings_page_action_link );

		if ( ! WCAPF_Helper::found_pro_version() ) {
			$plugin_page_link = add_query_arg(
				array(
					'utm_source'   => 'WCAPF+Free',
					'utm_medium'   => 'inside+plugins+list',
					'utm_campaign' => 'WCAPF+Pro+Upgrade',
				),
				'https://wptools.io/wc-ajax-product-filter/'
			);

			$upgrade_page_action_link = sprintf(
				'<a href="%1$s" style="color: #00a32a; font-weight: bold;" target="_blank" aria-label="%2$s">%2$s</a>',
				$plugin_page_link,
				__( 'Upgrade to PRO', 'wc-ajax-product-filter' )
			);

			$new_links = array_merge( $pre_links, $links, array( $upgrade_page_action_link ) );
		} else {
			$new_links = array_merge( $pre_links, $links );
		}

		return $new_links;
	}

	/**
	 * Registers the custom admin pages.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function register_admin_pages() {
		add_menu_page(
			'WC Ajax Product Filter',
			'WCAPF',
			'manage_options',
			'wcapf',
			array( $this, 'render_form' ),
			'dashicons-filter'
		);

		add_submenu_page(
			'wcapf',
			__( 'WC Ajax Product Filter - SEO Rules', 'wc-ajax-product-filter' ),
			__( 'SEO Rules', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-seo-rules',
			array( $this, 'render_seo_rules' )
		);

		add_submenu_page(
			'wcapf',
			__( 'WC Ajax Product Filter - Settings', 'wc-ajax-product-filter' ),
			__( 'Settings', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-settings',
			array( $this, 'render_settings' )
		);

		if ( ! WCAPF_Helper::found_pro_version() ) {
			$label = __( 'Upgrade to PRO', 'wc-ajax-product-filter' );

			add_submenu_page(
				'wcapf',
				__( 'WC Ajax Product Filter - Upgrade to PRO', 'wc-ajax-product-filter' ),
				'<span style="color: limegreen; font-weight: bold">' . $label . '</span>',
				'manage_options',
				'wcapf-upgrade',
				array( $this, 'render_upgrade_page' )
			);
		}
	}

	public function render_form() {
		if ( isset( $_GET['id'] ) ) {
			$element = '<div id="wcapf-form-admin-ui"></div>';
		} else {
			$element = '<div id="wcapf-forms-list-admin-ui"></div>';
		}

		echo $element;
	}

	public function render_seo_rules() {
		echo '<div id="wcapf-seo-rules-admin-ui"></div>';
	}

	public function render_settings() {
		echo '<div id="wcapf-settings-admin-ui"></div>';
	}

	public function render_upgrade_page() {
		WCAPF_Template_Loader::get_instance()->load( 'admin/upgrade-to-pro' );
	}

	/**
	 * Modify the label of custom admin menu.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function modify_admin_menu_label() {
		global $submenu;

		if ( isset( $submenu['wcapf'] ) ) {
			$new_data = $submenu['wcapf'];

			if ( isset( $new_data[0][0] ) ) {
				$new_data[0][0] = __( 'Forms', 'wc-ajax-product-filter' );
			}

			$submenu['wcapf'] = $new_data;
		}
	}

	/**
	 * Disable admin notices without ours.
	 *
	 * @source https://wordpress.stackexchange.com/a/316152
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function disable_admin_notices() {
		global $current_screen;

		if ( isset( $current_screen->id ) && in_array( $current_screen->id, $this->slugs_of_custom_admin_pages() ) ) {
			remove_all_actions( 'admin_notices' );
		}
	}

	/**
	 * @return string[]
	 */
	private function slugs_of_custom_admin_pages() {
		return array(
			'toplevel_page_wcapf',
			'wcapf_page_wcapf-seo-rules',
			'wcapf_page_wcapf-settings',
		);
	}

	/**
	 * Enqueue the admin ui scripts.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function enqueue_admin_ui_scripts( $hook ) {
		// Load the dependent js variables before loading other scripts.
		if ( in_array( $hook, $this->slugs_of_custom_admin_pages() ) ) {
			wp_register_script( 'wcapf-admin-scripts', false );

			wp_localize_script(
				'wcapf-admin-scripts',
				'wcapf_admin_params',
				$this->admin_js_params()
			);

			wp_enqueue_script( 'wcapf-admin-scripts' );
		}

		if ( 'toplevel_page_wcapf' === $hook ) {
			// Forms list admin ui scripts.
			if ( ! isset( $_GET['id'] ) ) {
				$this->load_scripts( 'list-forms' );
			} else {
				// Loads the media utils.
				wp_enqueue_media();

				// Loads the wcapf frontend styles for the filter preview.
				WCAPF_Frontend_Scripts::load_frontend_scripts( true );

				/**
				 * Hook to load the pro version scripts.
				 */
				do_action( 'wcapf_load_preview_scripts' );

				// Single form admin ui scripts.
				$this->load_scripts( 'form' );

				// Loads the js script that converts our filter key into slug.
				wp_enqueue_script(
					'wcapf-sanitize-title',
					WCAPF_PLUGIN_URL . 'admin/lib/wp-fe-sanitize-title.js'
				);
			}
		}

		// SEO Rules page admin ui scripts.
		if ( 'wcapf_page_wcapf-seo-rules' === $hook ) {
			// Loads the media utils.
			wp_enqueue_media();

			$this->load_scripts( 'seo-rules' );
		}

		// Settings page admin ui scripts.
		if ( 'wcapf_page_wcapf-settings' === $hook ) {
			// Loads the media utils.
			wp_enqueue_media();

			$this->load_scripts( 'settings' );

			// Loads the js script that converts our filter key into slug.
			wp_enqueue_script(
				'wcapf-sanitize-title',
				WCAPF_PLUGIN_URL . 'admin/lib/wp-fe-sanitize-title.js'
			);
		}
	}

	/**
	 * Admin js params.
	 *
	 * @return array
	 */
	private function admin_js_params() {
		$params = array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'version' => WCAPF_VERSION,
		);

		$helper = new WCAPF_Helper();
		$utils  = new WCAPF_API_Utils();

		$params['forms_page_link']     = $helper::forms_page_url();
		$params['seo_rules_page_link'] = $helper::seo_rules_page_url();
		$params['settings_page_link']  = $helper::settings_page_url();
		$params['upgrade_page_link']   = $helper::upgrade_page_url();

		$screen_id  = $this->current_screen_id();
		$user_roles = $utils::user_role_options();

		if ( 'toplevel_page_wcapf' === $screen_id ) {
			if ( ! isset( $_GET['id'] ) ) {
				$params['forms'] = $utils::get_forms();
			} else {
				$settings = $helper::get_settings();

				$params['form_places']     = $utils::get_form_places();
				$params['filter_types']    = $utils::get_filter_types();
				$params['meta_keys']       = $helper::get_available_meta_keys();
				$params['date_formats']    = $utils::display_date_formats();
				$params['status_options']  = $utils::product_status_options();
				$params['time_periods']    = $utils::time_period_options();
				$params['sort_by_options'] = $utils::sort_by_options();
				$params['meta_types']      = $utils::meta_type_options();
				$params['post_statuses']   = $utils::post_statuses();
				$params['user_roles']      = $user_roles;

				$params['author_roles']            = isset( $settings['author_roles'] )
					? $settings['author_roles'] : array();
				$params['multiple_form_locations'] = isset( $settings['multiple_form_locations'] )
					? $settings['multiple_form_locations'] : '';

				$post_id = $_GET['id'];

				$params['form_data'] = array(
					'post_id'    => $post_id,
					'post_title' => get_the_title( $post_id ),
				);
			}
		}

		if ( 'wcapf_page_wcapf-settings' === $screen_id ) {
			$params['user_roles'] = $user_roles;
			$params['settings']   = $utils::get_settings();

			$params['sort_by_form_options'] = $utils::get_sort_by_form_options();
			$params['global_filter_keys']   = $utils::get_filter_keys( true );
		}

		$params['widgets_page_link'] = admin_url( 'widgets.php' );

		$params['wcfm_marketplace_found'] = $helper::is_wcfm_marketplace_found();

		return apply_filters( 'wcapf_admin_js_params', $params );
	}

	/**
	 * Gets the current screen id.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	private function current_screen_id() {
		global $current_screen;

		return isset( $current_screen->id ) ? $current_screen->id : '';
	}

	/**
	 * The helper function to load the js build scripts.
	 *
	 * @param string $file The file name.
	 *
	 * @return void
	 */
	private function load_scripts( $file ) {
		$asset_path = WCAPF_PLUGIN_DIR . '/build/' . $file . '.asset.php';

		if ( ! file_exists( $asset_path ) ) {
			/** @noinspection PhpMultipleClassDeclarationsInspection */
			throw new Error(
				'You need to run `npm start` or `npm run build` for the ' . $file . ' admin ui'
			);
		}

		$asset_file = require( $asset_path );
		$handle     = 'wcapf-' . $file . '-admin';
		$js_file    = 'build/' . $file . '.js';
		$css_file   = 'build/' . $file . '.css';

		// Enqueue CSS dependencies.
		foreach ( $asset_file['dependencies'] as $style ) {
			wp_enqueue_style( $style );
		}

		// Load the js file.
		wp_enqueue_script(
			$handle,
			plugins_url( $js_file, WCAPF_PLUGIN_FILE ),
			$asset_file['dependencies'],
			$asset_file['version']
		);

		// Load the style file.
		wp_enqueue_style(
			$handle,
			plugins_url( $css_file, WCAPF_PLUGIN_FILE ),
			array(),
			$asset_file['version']
		);
	}

	/**
	 * Run the js scripts when the 'widget-added' event is triggered.
	 *
	 * @since 3.1.0
	 *
	 * @return void
	 */
	public function js_scripts_for_legacy_widget() {
		?>
		<!--suppress ES6ConvertVarToLetConst -->
		<script>
			( function( $ ) {
				$( document ).on( 'widget-added', function( e, $control ) {
					$control.find( '.wcapf-widget-dropdown-field' ).on( 'change', function() {
						var $dropdown        = $( this );
						var $selectedOption  = $( this ).find( 'option:selected' );
						var editLink         = $selectedOption.attr( 'data-edit-link' );
						var $editLink        = $dropdown.closest( '.widget-content' ).find( '.edit-link' );
						var $editLinkWrapper = $editLink.parent();

						$( $editLink.attr( 'href', editLink ) );

						if ( ! editLink.length ) {
							$editLinkWrapper.hide();
						} else {
							$editLinkWrapper.show();
						}
					} );
				} );
			} )( jQuery );
		</script>
		<?php
	}

}

if ( is_admin() ) {
	new WCAPF_Admin();
}
