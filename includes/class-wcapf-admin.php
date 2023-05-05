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

		// Run the v4 migration if required.
		add_action( 'admin_init', array( $this, 'run_v4_migration_from_admin_area' ) );

		// V4 migration notice.
		add_action( 'admin_notices', array( $this, 'show_v4_migration_notice' ) );
		add_action( 'admin_footer', array( $this, 'dismiss_v4_migration_notice_scripts' ) );
		add_action( 'wp_ajax_dismiss_wcapf_v4_migration_notice', array( $this, 'dismiss_v4_migration_notice' ) );

		// Notice to upgrade the pro version to v2.
		add_action( 'admin_notices', array( $this, 'show_v2_pro_version_upgrade_notice' ) );

		// Register tools.
		add_filter( 'woocommerce_debug_tools', array( $this, 'register_tools' ) );
	}

	/**
	 * Adds plugin's action links.
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

		// add_submenu_page(
		// 	'wcapf',
		// 	__( 'WC Ajax Product Filter - SEO Rules', 'wc-ajax-product-filter' ),
		// 	__( 'SEO Rules', 'wc-ajax-product-filter' ),
		// 	'manage_options',
		// 	'wcapf-seo-rules',
		// 	array( $this, 'render_seo_rules' )
		// );

		add_submenu_page(
			'wcapf',
			__( 'WC Ajax Product Filter - Settings', 'wc-ajax-product-filter' ),
			__( 'Settings', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-settings',
			array( $this, 'render_settings' )
		);

		// if ( ! WCAPF_Helper::found_pro_version() ) {
		// 	$label = __( 'Upgrade to PRO', 'wc-ajax-product-filter' );
		//
		// 	add_submenu_page(
		// 		'wcapf',
		// 		__( 'WC Ajax Product Filter - Upgrade to PRO', 'wc-ajax-product-filter' ),
		// 		'<span style="color: limegreen; font-weight: bold">' . $label . '</span>',
		// 		'manage_options',
		// 		'wcapf-upgrade',
		// 		array( $this, 'render_upgrade_page' )
		// 	);
		// }
	}

	public function render_form() {
		if ( isset( $_GET['id'] ) ) {
			$element = '<div id="wcapf-form-admin-ui"></div>';
		} else {
			$element = '<div id="wcapf-forms-list-admin-ui"></div>';
		}

		echo $element;
	}

	// public function render_seo_rules() {
	// 	echo '<div id="wcapf-seo-rules-admin-ui"></div>';
	// }

	public function render_settings() {
		echo '<div id="wcapf-settings-admin-ui"></div>';
	}

	// public function render_upgrade_page() {
	// 	WCAPF_Template_Loader::get_instance()->load( 'admin/upgrade-to-pro' );
	// }

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

			wp_enqueue_script(
				'wc-ajax-product-filter-admin-scripts',
				WCAPF_PLUGIN_URL . 'admin/js/wc-ajax-product-filter-admin-scripts.js',
				array(),
				filemtime( WCAPF_PLUGIN_DIR . '/admin/js/wc-ajax-product-filter-admin-scripts.js' ),
				true
			);
		}

		if ( 'toplevel_page_wcapf' === $hook ) {
			// Forms list admin ui scripts.
			if ( ! isset( $_GET['id'] ) ) {
				$this->load_scripts( 'list-forms' );
			} else {
				// Loads the media utils.
				wp_enqueue_media();

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
			'wp'      => get_bloginfo( 'version' ),
			'dirty'   => false,
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

				$params['filter_types']    = $utils::get_filter_types();
				$params['meta_keys']       = $helper::get_available_meta_keys();
				$params['date_formats']    = $utils::display_date_formats();
				$params['status_options']  = $utils::product_status_options();
				$params['time_periods']    = $utils::time_period_options();
				$params['sort_by_options'] = $utils::sort_by_options();
				$params['meta_types']      = $utils::meta_type_options();
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

			$params['global_filter_keys'] = $utils::get_filter_keys( true );
		}

		$params['widgets_page_link'] = admin_url( 'widgets.php' );

		// v4 migration related data.
		$params['show_v4_migration_notice']   = $this->v4_migration_notice_can_be_shown();
		$params['v4_migrated_form_url']       = $this->get_v4_migrated_form_url();
		$params['v4_migration_doc_url']       = $this->get_v4_migration_doc_url();
		$params['show_pro_v2_upgrade_notice'] = $this->pro_v2_upgrade_notice_can_be_shown();

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
	 * Determines if the v4 migration notice should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	private function v4_migration_notice_can_be_shown() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		if ( '1' !== get_option( 'wcapf_v4_migration_notice_status' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * The form url that is generated by the v4 migration process.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public function get_v4_migrated_form_url() {
		$form_id = get_option( 'wcapf_migrated_filters_form_id' );

		if ( $form_id ) {
			$form_edit_url = WCAPF_Helper::form_edit_url( $form_id );
		} else {
			$form_edit_url = WCAPF_Helper::forms_page_url();
		}

		return $form_edit_url;
	}

	/**
	 *
	 * TODO: Update the v4 migration documentation url.
	 *
	 * @return string
	 */
	public function get_v4_migration_doc_url() {
		return '';
	}

	/**
	 * Determines if the pro v2 upgrade notice should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	private function pro_v2_upgrade_notice_can_be_shown() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		if ( ! is_plugin_active( 'wc-ajax-product-filter-pro/wc-ajax-product-filter-pro.php' ) ) {
			return false;
		}

		if ( defined( 'WCAPF_PRO_VERSION' ) && ! version_compare( WCAPF_PRO_VERSION, '2.0.0', '<' ) ) {
			return false;
		}

		return true;
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
	 * Run the v4 migration if required.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function run_v4_migration_from_admin_area() {
		WCAPF_V4_Migration()->try_to_run_v4_migration();
	}

	/**
	 * Show the v4 migration notice.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function show_v4_migration_notice() {
		if ( ! $this->v4_migration_notice_can_be_shown() ) {
			return;
		}

		$form_url          = $this->get_v4_migrated_form_url();
		$migration_doc_url = $this->get_v4_migration_doc_url();
		?>
		<div class="notice notice-info" id="wcapf-v4-migration-notice">
			<p>
				<strong>WC Ajax Product Filter - V4 Migration Notice</strong>
			</p>
			<p>
				The plugin has been upgraded to v4. We have improved the backend and refactored the codes. As a
				migration process, a form has been created automatically with all the existing filters of your shop. You
				are requested to check the order of filters by visiting the form.
			</p>
			<p>
				<a href="<?php echo esc_url( $form_url ); ?>">Check the order of filters</a>
				|
				<a href="<?php echo esc_url( $migration_doc_url ); ?>" target="_blank">Learn more about upgrade</a>
				|
				<a href="javascript:void(0)" onclick="removeWCAPFMigrationNotice()">I understand, remove
					the notice</a>
			</p>
		</div>
		<?php
	}

	/**
	 * The js script to dismiss the v4 migration notice.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function dismiss_v4_migration_notice_scripts() {
		$nonce = wp_create_nonce( 'dismiss-wcapf-v4-migration-notice-nonce' );
		?>
		<!--suppress ES6ConvertVarToLetConst, JSValidateTypes -->
		<script>
			function removeWCAPFMigrationNotice() {
				var $notice = jQuery( '#wcapf-v4-migration-notice' );

				$notice.fadeOut( 300, function() {
					$notice.remove();
				} );

				var data = {
					action: 'dismiss_wcapf_v4_migration_notice',
					nonce: '<?php echo $nonce; ?>',
				};

				jQuery.post( ajaxurl, data, function( response ) {
					console.log( response );
				} );
			}
		</script>
		<?php
	}

	/**
	 * Dismiss the v4 migration notice via ajax.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function dismiss_v4_migration_notice() {
		check_ajax_referer( 'dismiss-wcapf-v4-migration-notice-nonce', 'nonce' );

		update_option( 'wcapf_v4_migration_notice_status', '2' );

		wp_send_json_success( 'v4 migrate notice dismissed' );
	}

	/**
	 * Show notice to upgrade the pro version to v2.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function show_v2_pro_version_upgrade_notice() {
		if ( ! $this->pro_v2_upgrade_notice_can_be_shown() ) {
			return;
		}
		?>
		<div class="notice notice-info">
			<p>
				<strong>WC Ajax Product Filter Pro - Upgrade Required</strong>
			</p>
			<p>
				Thank you for using the pro version. WC Ajax Product Filter v4 requires you to upgrade WC Ajax Product
				Filter Pro to v2.0.0. Please upgrade.
			</p>
		</div>
		<?php
	}

	/**
	 * Register tools for v4 migration.
	 *
	 * @param array $tools Available tools.
	 *
	 * @since 4.0.0
	 *
	 * @return array Filtered array of tools.
	 */
	public function register_tools( $tools ) {
		$additional_tools = array(
			'run_wcapf_v4_migrate' => array(
				'name'     => _x( 'Run WCAPF V4 Migration', '[ADMIN] WooCommerce Tools tab, name of the tool', 'wc-ajax-product-filter' ),
				'button'   => _x( 'Run', '[ADMIN] WooCommerce Tools tab, button for the tool', 'wc-ajax-product-filter' ),
				'desc'     => _x( 'This will create a form with all existing filters of your shop; you may need to manually set the order of filters by visiting the form.', '[ADMIN] WooCommerce Tools tab, description of the tool', 'wc-ajax-product-filter' ),
				'callback' => array( $this, 'run_v4_migration_from_tools' ),
			),
		);

		return array_merge( $tools, $additional_tools );
	}

	/**
	 * The callback function for v4 migration tool.
	 *
	 * @since 4.0.0
	 *
	 * @return void
	 */
	public function run_v4_migration_from_tools() {
		$return_url = WCAPF_Helper::forms_page_url();

		if ( ! isset( $_REQUEST['_wpnonce'] ) ||
			 ( ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'run_wcapf_v4_migrate' )
			   && ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'debug_action' )
			 )
		) {
			wp_safe_redirect( $return_url );
			die;
		}

		$force_migrate = apply_filters( 'wcapf_run_force_migrate_using_tools', false );

		$run = false;

		if ( $force_migrate ) {
			$run = true;
		} elseif ( ! get_option( 'wcapf_migrated_filters_form_id' ) ) {
			$run = true;
		}

		if ( $run ) {
			WCAPF_V4_Migration()->do_migrate();

			if ( ! get_option( 'wcapf_v4_migration_notice_status' ) ) {
				// Show the v4 migration notice.
				update_option( 'wcapf_v4_migration_notice_status', '1' );
			}

			if ( ! get_option( 'wcapf_db_version' ) ) {
				// Update the db version.
				update_option( 'wcapf_db_version', WCAPF_VERSION );
			}

			if ( $force_migrate ) {
				$message = 'Ran a forced wcapf v4 migration using tools.';
			} else {
				$message = 'Ran a wcapf v4 migration using tools.';
			}

			error_log( $message );
		}

		wp_safe_redirect( $return_url );
		die;
	}

}

if ( is_admin() ) {
	new WCAPF_Admin();
}
