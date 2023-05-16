<?php
/**
 * Uninstalling WCAPF - WooCommerce Ajax Product Filter deletes the plugin settings, forms and filters.
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

// Delete records from the options table.
delete_option( $option_key );
delete_option( 'wcapf_filter_keys_order' );
delete_option( 'wcapf_db_version' );
delete_option( 'wcapf_v4_migration_notice_status' );
delete_option( 'wcapf_migrated_filters_form_id' );

// Delete transients.
delete_transient( 'wcapf_v4_migration_status' );

// Delete posts + data.
$wpdb->query( "DELETE FROM $wpdb->posts WHERE post_type IN ('wcapf-form', 'wcapf-filter');" );
$wpdb->query( "DELETE meta FROM $wpdb->postmeta meta LEFT JOIN $wpdb->posts posts ON posts.ID = meta.post_id WHERE posts.ID IS NULL;" );
