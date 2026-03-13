<?php
/*
 * Plugin Name:       WCAPF – Ajax Product Filter for WooCommerce
 * Plugin URI:        https://wptools.io/wc-ajax-product-filter/
 * Description:       A plugin to filter WooCommerce products using AJAX.
 * Version:           4.3.0
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Author:            Mainul Hassan
 * Author URI:        https://wptools.io/
 * License:           GPL-3.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       wc-ajax-product-filter
 * Domain Path:       /languages
 * Requires Plugins:  woocommerce
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * @since     1.0.0
 * @package   wc-ajax-product-filter
 * @copyright Copyright (c) 2015-2026, Mainul Hassan
 * @author    Mainul Hassan
 * @license   https://www.gnu.org/licenses/gpl-3.0.html
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Defines constant WCAPF_VERSION.
if ( ! defined( 'WCAPF_VERSION' ) ) {
	define( 'WCAPF_VERSION', '4.3.0' );
}

/**
 * Main plugin bootstrap class.
 *
 * Responsible for checking requirements, loading dependencies,
 * and initializing the plugin.
 *
 * @since 4.1.0
 */
final class WCAPF_Plugin {

	/**
	 * Initialize the plugin bootstrap.
	 *
	 * Registers hooks required to verify requirements,
	 * show admin notices, and load plugin dependencies.
	 */
	public function __construct() {
		add_action( 'admin_notices', array( $this, 'show_admin_notice' ) );
		add_action( 'woocommerce_loaded', array( $this, 'load_dependencies' ) );

		register_activation_hook( __FILE__, array( $this, 'activate' ) );
	}

	/**
	 * Check whether WCAPF Pro 2.1 or later is active.
	 *
	 * If a compatible Pro version is detected, the free version should
	 * not continue loading to avoid conflicts.
	 *
	 * @return bool True if the free version should proceed loading, false otherwise.
	 */
	private function should_we_proceed() {
		if ( ! defined( 'WCAPF_PRO_VERSION' ) ) {
			return true;
		}

		if ( version_compare( WCAPF_PRO_VERSION, '2.1', '>=' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Show an admin notice when plugin requirements are not met.
	 *
	 * @return void
	 */
	public function show_admin_notice() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

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
	 * @param string $type Type of messages to return ('notices' or 'messages').
	 *
	 * @return array Array of admin notices or messages for failed requirements.
	 */
	private function check_requirements( $type = 'notices' ) {
		$notices       = array();
		$messages      = array();
		$wc_version    = defined( 'WC_VERSION' ) ? WC_VERSION : '';
		$wp_version    = get_bloginfo( 'version' );
		$php_version   = PHP_VERSION;
		$dashboard_url = get_dashboard_url( get_current_user_id(), 'plugins.php' );

		$required_wp_version  = '6.0';
		$required_wc_version  = '6.6';
		$required_php_version = '7.2';

		if ( ! class_exists( 'WooCommerce' ) ) {
			$notices[] = __( 'WCAPF – Ajax Product Filter for WooCommerce requires WooCommerce. The plugin is currently NOT RUNNING.', 'wc-ajax-product-filter' );

			$messages[] = sprintf(
				/* translators: 1: opening strong tag, 2: closing strong tag with line breaks, 3: opening link tag, 4: closing link tag */
				__( '%1$sWCAPF – Ajax Product Filter for WooCommerce can not be activated. %2$s It requires WooCommerce plugin to be activated. Please activate the WooCommerce plugin first ✌️ %3$s Back %4$s', 'wc-ajax-product-filter' ),
				'<strong>',
				'</strong><br><br>',
				'<br /><br /><a href="' . esc_url( $dashboard_url ) . '" class="button button-primary">',
				'</a>'
			);
		} elseif ( version_compare( $wc_version, $required_wc_version, '<' ) ) {
			$notices[] = sprintf(
				/* translators: 1: required WooCommerce version, 2: current WooCommerce version */
				__( 'WCAPF – Ajax Product Filter for WooCommerce requires WooCommerce version %1$s or higher, but WooCommerce version %2$s is used on the site. The plugin is currently NOT RUNNING.', 'wc-ajax-product-filter' ),
				$required_wc_version,
				$wc_version
			);

			$messages[] = sprintf(
				/* translators: 1: opening strong tag, 2: closing strong tag with line breaks, 3: required WooCommerce version, 4: current WooCommerce version, 5: opening link tag, 6: closing link tag */
				__( '%1$sWCAPF – Ajax Product Filter for WooCommerce can not be activated. %2$s It requires WooCommerce version %3$s or higher, but WooCommerce version %4$s is used on the site. Please upgrade the WooCommerce version first ✌️ %5$s Back %6$s', 'wc-ajax-product-filter' ),
				'<strong>',
				'</strong><br><br>',
				$required_wc_version,
				$wc_version,
				'<br /><br /><a href="' . esc_url( $dashboard_url ) . '" class="button button-primary">',
				'</a>'
			);
		}

		if ( version_compare( $wp_version, $required_wp_version, '<' ) ) {
			$notices[] = sprintf(
				/* translators: 1: required WordPress version, 2: current WordPress version */
				__( 'WCAPF – Ajax Product Filter for WooCommerce requires WordPress version %1$s or higher, but WordPress version %2$s is used on the site. The plugin is currently NOT RUNNING.', 'wc-ajax-product-filter' ),
				$required_wp_version,
				$wp_version
			);

			$messages[] = sprintf(
				/* translators: 1: opening strong tag, 2: closing strong tag with line breaks, 3: required WordPress version, 4: current WordPress version, 5: opening link tag, 6: closing link tag */
				__( '%1$sWCAPF – Ajax Product Filter for WooCommerce can not be activated. %2$s It requires WordPress version %3$s or higher, but WordPress version %4$s is used on the site. Please upgrade the WordPress version first ✌️ %5$s Back %6$s', 'wc-ajax-product-filter' ),
				'<strong>',
				'</strong><br><br>',
				$required_wp_version,
				$wp_version,
				'<br /><br /><a href="' . esc_url( $dashboard_url ) . '" class="button button-primary">',
				'</a>'
			);
		}

		if ( version_compare( $php_version, $required_php_version, '<' ) ) {
			$notices[] = sprintf(
				/* translators: 1: required PHP version, 2: current PHP version */
				__( 'WCAPF – Ajax Product Filter for WooCommerce requires PHP version %1$s or higher, but PHP version %2$s is used on the site. The plugin is currently NOT RUNNING.', 'wc-ajax-product-filter' ),
				$required_php_version,
				$php_version
			);

			$messages[] = sprintf(
				/* translators: 1: opening strong tag, 2: closing strong tag with line breaks, 3: required PHP version, 4: current PHP version, 5: opening link tag, 6: closing link tag */
				__( '%1$sWCAPF – Ajax Product Filter for WooCommerce can not be activated. %2$s It requires PHP version %3$s or higher, but PHP version %4$s is used on the site. Please upgrade the PHP version first ✌️ %5$s Back %6$s', 'wc-ajax-product-filter' ),
				'<strong>',
				'</strong><br><br>',
				$required_php_version,
				$php_version,
				'<br /><br /><a href="' . esc_url( $dashboard_url ) . '" class="button button-primary">',
				'</a>'
			);
		}

		if ( 'notices' === $type ) {
			return $notices;
		}

		return $messages;
	}

	/**
	 * Handle plugin activation.
	 *
	 * Verifies requirements, performs migrations if needed,
	 * updates database version, and initializes default settings.
	 *
	 * @return void
	 */
	public function activate() {
		$failed_requirements = $this->check_requirements( 'messages' );

		if ( $failed_requirements ) {
			// Get the first requirement.
			$requirement = array_shift( $failed_requirements );

			deactivate_plugins( basename( __FILE__ ) );

			wp_die( wp_kses_post( $requirement ) );
		}

		$db_version_option_key  = 'wcapf_db_version';
		$existing_wcapf_version = get_option( $db_version_option_key );

		// If any records for v3 exist, perform migration to v4.
		if ( ! $existing_wcapf_version ) {
			$filters = get_posts(
				array(
					'post_type'   => 'wcapf-filter',
					'post_status' => 'any',
					'fields'      => 'ids',
				)
			);

			// Migrate from v3 to v4.
			if ( $filters ) {
				update_option( 'wcapf_run_migrate', '1' );

				$this->save_activation_time_in_db();

				return;
			}
		}

		if ( ! $existing_wcapf_version ) {
			// Set default settings if no existing version found.
			update_option( 'wcapf_set_default_settings', '1' );
		} elseif ( version_compare( WCAPF_VERSION, $existing_wcapf_version, '>' ) ) {
			// Update default settings if a newer version is detected.
			update_option( 'wcapf_update_default_settings', '1' );
		}

		// Update the db version.
		update_option( $db_version_option_key, WCAPF_VERSION );

		// Clear the forms with locations transients.
		delete_transient( 'wcapf_forms_with_locations' );

		$this->save_activation_time_in_db();
	}

	/**
	 * Save the plugin activation timestamp if it does not already exist.
	 *
	 * Used for review notice timing and internal tracking.
	 *
	 * @return void
	 */
	private function save_activation_time_in_db() {
		$activation_time = get_option( 'wcapf_activation_time' );

		if ( ! $activation_time ) {
			update_option( 'wcapf_activation_time', time() );
		}
	}

	/**
	 * Load plugin dependencies after WooCommerce is initialized.
	 *
	 * Ensures requirements are met, defines constants, and loads
	 * the main dependency bootstrap file.
	 *
	 * @return void
	 */
	public function load_dependencies() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$met_requirements = empty( $this->check_requirements() );

		if ( ! $met_requirements ) {
			return;
		}

		$this->define_constants();

		require_once WCAPF_PLUGIN_DIR . '/includes/wcapf-dependencies.php';

		/**
		 * Register a hook to load any other dependencies after the plugin files are loaded.
		 */
		do_action( 'wcapf_loaded' );
	}

	/**
	 * Define core plugin constants.
	 *
	 * Registers constants used throughout the plugin such as
	 * plugin paths, URLs, and cache lifetime.
	 *
	 * @return void
	 */
	private function define_constants() {
		// Defines constant WCAPF_PLUGIN_FILE
		if ( ! defined( 'WCAPF_PLUGIN_FILE' ) ) {
			define( 'WCAPF_PLUGIN_FILE', __FILE__ );
		}

		// Defines constant WCAPF_PLUGIN_DIR
		if ( ! defined( 'WCAPF_PLUGIN_DIR' ) ) {
			define( 'WCAPF_PLUGIN_DIR', __DIR__ );
		}

		// Defines constant WCAPF_PLUGIN_URL
		if ( ! defined( 'WCAPF_PLUGIN_URL' ) ) {
			define( 'WCAPF_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
		}

		// Defines constant WCAPF_CACHE_TIME
		if ( ! defined( 'WCAPF_CACHE_TIME' ) ) {
			define( 'WCAPF_CACHE_TIME', 60 * 60 * 12 );
		}
	}
}

// Initialize the plugin.
new WCAPF_Plugin();

/**
 * Prevent loading WCAPF Pro v1 as it is not compatible with newer WCAPF versions.
 *
 * @return void
 */
function wcapf_unload_pro_v1() {
	remove_action( 'woocommerce_loaded', 'wcapf_pro_loads_dependencies', 99 );
}

add_action( 'woocommerce_loaded', 'wcapf_unload_pro_v1' );

/**
 * Uninstalling WCAPF – Ajax Product Filter for WooCommerce deletes the plugin settings, forms and filters.
 *
 * @since        4.1.0
 * @package      wc-ajax-product-filter
 * @author       Mainul Hassan
 *
 * @noinspection SqlNoDataSourceInspection
 * @noinspection SqlDialectInspection
 */
function wcapf_uninstall_cleanup() {
	// Do not proceed if the pro version is active.
	if ( function_exists( 'wcapf_fs_uninstall_cleanup' ) ) {
		return;
	}

	$option_key = 'wcapf_settings';
	$settings   = get_option( $option_key );

	if ( ! is_array( $settings ) || empty( $settings['remove_data'] ) ) {
		return;
	}

	global $wpdb;

	// Delete records from the options table.
	delete_option( $option_key );
	delete_option( 'wcapf_run_migrate' );
	delete_option( 'wcapf_set_default_settings' );
	delete_option( 'wcapf_update_default_settings' );
	delete_option( 'wcapf_filter_keys_order' );
	delete_option( 'wcapf_db_version' );
	delete_option( 'wcapf_activation_time' );

	// Delete v4 migration related records from the options table.
	delete_option( 'wcapf_v4_migration_notice_status' );
	delete_option( 'wcapf_migrated_filters_form_id' );

	// Delete transients.
	delete_transient( 'wcapf_v4_migration_status' );

	// Clear the forms with locations transients.
	delete_transient( 'wcapf_forms_with_locations' );

	// Delete posts + data.
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query( "DELETE FROM $wpdb->posts WHERE post_type IN ('wcapf-form', 'wcapf-filter');" );
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query( "DELETE meta FROM $wpdb->postmeta meta LEFT JOIN $wpdb->posts posts ON posts.ID = meta.post_id WHERE posts.ID IS NULL;" );

	// Delete review notice related records from the user meta table.
	$meta_keys = array(
		'wcapf_form_updates_count',
		'wcapf_review_notice_for_milestone_achieved_dismissed',
		'wcapf_review_notice_for_milestone_achieved_dismissed_at',
		'wcapf_review_notice_time_since_hide_permanently',
		'wcapf_review_notice_time_since_dismissed_at',
	);

	$placeholders = implode( ', ', array_fill( 0, count( $meta_keys ), '%s' ) );

	// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
	$query = $wpdb->prepare( "DELETE FROM $wpdb->usermeta WHERE meta_key IN ($placeholders)", $meta_keys );

	// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query( $query );
}

register_uninstall_hook( __FILE__, 'wcapf_uninstall_cleanup' );
