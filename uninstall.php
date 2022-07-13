<?php
/**
 * Uninstalling WC Ajax Product Filter deletes the plugin settings, filter post types.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes
 * @author       wptools.io
 *
 * @noinspection SqlNoDataSourceInspection
 * @noinspection SqlDialectInspection
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$option_key = 'wcapf_settings';
$settings   = get_option( $option_key );

if ( ! $settings['remove_data'] ) {
	return;
}

global $wpdb;

// Delete the plugin settings.
delete_option( $option_key );

// Delete posts + data.
$wpdb->query( "DELETE FROM $wpdb->posts WHERE post_type = 'wcapf-filter';" );
$wpdb->query( "DELETE meta FROM $wpdb->postmeta meta LEFT JOIN $wpdb->posts posts ON posts.ID = meta.post_id WHERE posts.ID IS NULL;" );
