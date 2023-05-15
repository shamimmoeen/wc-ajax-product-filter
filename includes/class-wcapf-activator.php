<?php
/**
 * Fired during plugin activation.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * This class defines all code necessary to run during the plugin's activation.
 */
class WCAPF_Activator {

	/**
	 * @since 4.0.0
	 */
	public static function activate() {
		$settings_option_key   = 'wcapf_settings';
		$db_version_option_key = 'wcapf_db_version';

		// Loads the required files.
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-helper.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-api-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-api-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-form-filters-utils.php';
		require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-v4-migration.php';

		// If any records for v3 exist, we'll do the migration.
		if ( get_option( $settings_option_key ) && ! get_option( $db_version_option_key ) ) {
			WCAPF_V4_Migration()->try_to_run_v4_migration();

			return;
		}

		// Initialize the default settings.
		$default_settings  = WCAPF_V4_Migration()->default_settings();
		$existing_settings = get_option( $settings_option_key, array() );

		update_option( $settings_option_key, array_merge( $default_settings, $existing_settings ) );

		// Update the db version.
		update_option( $db_version_option_key, WCAPF_VERSION );
	}

}
