<?php
/**
 * Uninstalling WC Ajax Product Filter deletes the plugin settings, filter post types.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$settings = WCAPF_Helper::get_settings();

if ( ! $settings['remove_data'] ) {
	return;
}

// Delete the plugin settings.
delete_option( WCAPF_Helper::settings_option_key() );

// Delete posts + data.
$wpdb->query( "DELETE FROM $wpdb->posts WHERE post_type = 'wcapf-filter';" );
$wpdb->query( "DELETE meta FROM $wpdb->postmeta meta LEFT JOIN $wpdb->posts posts ON posts.ID = meta.post_id WHERE posts.ID IS NULL;" );
