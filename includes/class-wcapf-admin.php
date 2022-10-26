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
		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_filter( 'admin_footer_text', array( $this, 'footer_text' ) );
		add_filter( 'in_admin_header', array( $this, 'render_header_navigation' ) );

		$plugin_file = plugin_basename( WCAPF_PLUGIN_FILE );
		add_filter( 'plugin_action_links_' . $plugin_file, array( $this, 'plugin_action_links' ) );

		add_action( 'admin_menu', array( $this, 'register_admin_pages' ) );
		add_action( 'admin_menu', array( $this, 'modify_admin_menu_label' ) );
		add_action( 'in_admin_header', array( $this, 'disable_admin_notices' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_ui_scripts' ) );
		add_action( 'admin_footer-widgets.php', array( $this, 'js_scripts_for_legacy_widget' ) );
	}

	/**
	 * Register the settings page.
	 *
	 * @return void
	 */
	public function register_settings_page() {
		add_submenu_page(
			'edit.php?post_type=wcapf-filter',
			__( 'WC Ajax Product Filter Settings', 'wc-ajax-product-filter' ),
			__( 'Settings', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-settings',
			array( $this, 'settings_page_html' )
		);
	}

	/**
	 * The settings page html markup.
	 *
	 * TODO: Remove this.
	 *
	 * @return void
	 */
	public function settings_page_html() {
		WCAPF_Template_Loader::get_instance()->load( 'admin/settings-page' );
	}

	/**
	 * Change the admin footer text.
	 *
	 * TODO: Remove this.
	 *
	 * @param string $text The default footer text.
	 *
	 * @return string
	 * @noinspection HtmlUnknownTarget
	 */
	public function footer_text( $text ) {
		global $typenow;

		if ( 'wcapf-filter' !== $typenow ) {
			return $text;
		}

		$rating_link = 'https://wordpress.org/plugins/wc-ajax-product-filter/#reviews';

		$give_rating = sprintf(
			'<a href="%1$s" target="_blank">%2$s</a>',
			esc_url( $rating_link ),
			__( 'give a rating', 'wc-ajax-product-filter' )
		);

		$text = sprintf(
			/* translators: plugin name, plugin review page link */
			__( 'Thank you for using %1$s! Would you mind taking a few seconds to give it a 5-star rating on WordPress?, %2$s.', 'wc-ajax-product-filter' ),
			'<b>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</b>',
			$give_rating
		);

		return '<i>' . $text . '</i>';
	}

	/**
	 * Renders the header navigation in admin area.
	 *
	 * TODO: Remove this.
	 *
	 * @return void
	 */
	public function render_header_navigation() {
		global $typenow;

		if ( 'wcapf-filter' !== $typenow && 'wcapf-form' !== $typenow ) {
			return;
		}

		WCAPF_Template_Loader::get_instance()->load( 'admin/header-navigation' );
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
		$settings_page_url = WCAPF_Helper::settings_page_url();

		$new_links = array();

		$new_links[] = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $settings_page_url ),
			__( 'Settings', 'wc-ajax-product-filter' )
		);

		return array_merge( $new_links, $links );
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
			'WCAPF',
			'WCAPF',
			'manage_options',
			'wcapf-filter',
			array( $this, 'render_filter' ),
			'dashicons-filter',
			5 // TODO: Move the menu page to bottom (100).
		);

		add_submenu_page(
			'wcapf-filter',
			__( 'Forms', 'wc-ajax-product-filter' ),
			__( 'Forms', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-form',
			array( $this, 'render_form' )
		);

		add_submenu_page(
			'wcapf-filter',
			__( 'Settings', 'wc-ajax-product-filter' ),
			__( 'Settings', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-new-settings', // TODO: Remove 'new' from slug.
			array( $this, 'render_settings' )
		);
	}

	public function render_filter() {
		if ( isset( $_GET['id'] ) ) {
			$element = '<div id="wcapf-filter-admin-ui"></div>';
		} else {
			$element = '<div id="wcapf-filters-list-admin-ui"></div>';
		}

		echo $element;
	}

	public function render_form() {
		if ( isset( $_GET['id'] ) ) {
			$element = '<div id="wcapf-form-admin-ui"></div>';
		} else {
			$element = '<div id="wcapf-forms-list-admin-ui"></div>';
		}

		echo $element;
	}

	public function render_settings() {
		echo '<div id="wcapf-settings-admin-ui"></div>';
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

		if ( isset( $submenu['wcapf-filter'] ) ) {
			$new_data = $submenu['wcapf-filter'];

			if ( isset( $new_data[0][0] ) ) {
				$new_data[0][0] = __( 'Filters', 'wc-ajax-product-filter' );
			}

			$submenu['wcapf-filter'] = $new_data;
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
			'toplevel_page_wcapf-filter',
			'wcapf_page_wcapf-form',
			'wcapf_page_wcapf-new-settings',
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

		if ( 'toplevel_page_wcapf-filter' === $hook ) {
			// Filters list admin ui scripts.
			if ( ! isset( $_GET['id'] ) ) {
				$this->load_scripts( 'list-filters' );
			} else {
				// Loads the media utils.
				wp_enqueue_media();

				// Loads the wcapf frontend styles for the filter preview.
				WCAPF_Frontend_Scripts::load_frontend_scripts( true );

				/**
				 * Hook to load the pro version scripts.
				 */
				do_action( 'wcapf_load_preview_scripts' );

				// Single filter admin ui scripts.
				$this->load_scripts( 'filter' );
			}
		}

		if ( 'wcapf_page_wcapf-form' === $hook ) {
			// Filter forms list admin ui scripts.
			if ( ! isset( $_GET['id'] ) ) {
				$this->load_scripts( 'list-filter-forms' );
			} else {
				// Loads the media utils.
				wp_enqueue_media();

				// Loads the wcapf frontend styles for the filter preview.
				WCAPF_Frontend_Scripts::load_frontend_scripts( true );

				/**
				 * Hook to load the pro version scripts.
				 */
				do_action( 'wcapf_load_preview_scripts' );

				// Single filter form admin ui scripts.
				$this->load_scripts( 'filter-form' );
			}
		}

		// Settings page admin ui scripts.
		if ( 'wcapf_page_wcapf-new-settings' === $hook ) {
			// Loads the media utils.
			wp_enqueue_media();

			$this->load_scripts( 'settings' );
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
		);

		// TODO: Make it dynamic.
		$params['foundPro'] = true;

		$params['version'] = WCAPF_VERSION;

		$params['max_items_in_custom_appearance_modal'] = 99;
		$params['timeout_for_cleaning_wp_media_frames'] = 300;

		$helper = new WCAPF_Helper();

		$params['filters_page_link']  = $helper::filters_list_page_url();
		$params['forms_page_link']    = $helper::forms_list_page_url();
		$params['settings_page_link'] = $helper::new_settings_page_url();

		$api_utils = new WCAPF_API_Utils();

		if ( 'toplevel_page_wcapf-filter' === $this->current_screen_id() ) {
			$params['filters'] = $api_utils::get_filters();
		}

		$params['widgets_page_link'] = admin_url( 'widgets.php' );

		$params['wcfm_marketplace_found'] = WCAPF_Helper::is_wcfm_marketplace_found();

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
