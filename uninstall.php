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

// Don't proceed if pro version activated.
if ( function_exists( 'wcapf_fs' ) ) {
	return;
}

$option_key = 'wcapf_settings';
$settings   = get_option( $option_key );

if ( ! $settings['remove_data'] ) {
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
$wpdb->query( "DELETE FROM $wpdb->posts WHERE post_type IN ('wcapf-form', 'wcapf-filter');" );
$wpdb->query( "DELETE meta FROM $wpdb->postmeta meta LEFT JOIN $wpdb->posts posts ON posts.ID = meta.post_id WHERE posts.ID IS NULL;" );

// Delete review notice related records from the user meta table.
$meta_keys = array(
	'wcapf_form_updates_count',
	'wcapf_review_notice_for_milestone_achieved_dismissed',
	'wcapf_review_notice_for_milestone_achieved_dismissed_at',
	'wcapf_review_notice_time_since_hide_permanently',
	'wcapf_review_notice_time_since_dismissed_at',
);

$meta_keys_string = '(' . implode( ', ', array_map( function ( $key ) {
		return "'$key'";
	}, $meta_keys ) ) . ')';

$wpdb->query( "DELETE FROM $wpdb->usermeta WHERE meta_key IN $meta_keys_string;" );
