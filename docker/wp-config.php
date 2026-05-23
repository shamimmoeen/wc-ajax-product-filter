<?php
/**
 * WordPress configuration for the WCAPF Docker dev environment.
 *
 * Reads database connection from environment variables set by docker-compose.
 * Salts are intentionally predictable for local dev. Do not reuse in production.
 */

// Database.
define( 'DB_NAME', getenv( 'WORDPRESS_DB_NAME' ) ?: 'wcapf' );
define( 'DB_USER', getenv( 'WORDPRESS_DB_USER' ) ?: 'wcapf' );
define( 'DB_PASSWORD', getenv( 'WORDPRESS_DB_PASSWORD' ) ?: 'wcapf' );
define( 'DB_HOST', getenv( 'WORDPRESS_DB_HOST' ) ?: 'database' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wp_';

// Salts. Predictable values for dev; never use in production.
define( 'AUTH_KEY',         'wcapf-dev-auth-key' );
define( 'SECURE_AUTH_KEY',  'wcapf-dev-secure-auth-key' );
define( 'LOGGED_IN_KEY',    'wcapf-dev-logged-in-key' );
define( 'NONCE_KEY',        'wcapf-dev-nonce-key' );
define( 'AUTH_SALT',        'wcapf-dev-auth-salt' );
define( 'SECURE_AUTH_SALT', 'wcapf-dev-secure-auth-salt' );
define( 'LOGGED_IN_SALT',   'wcapf-dev-logged-in-salt' );
define( 'NONCE_SALT',       'wcapf-dev-nonce-salt' );

// Debug — toggled by WP_DEBUG in .env (set to 0 to disable everything).
// https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
$wcapf_dev_debug = (bool) ( getenv( 'WORDPRESS_DEBUG' ) ?: '1' );

define( 'WP_DEBUG', $wcapf_dev_debug );

if ( $wcapf_dev_debug ) {
	define( 'WP_DEBUG_LOG', true );
	define( 'WP_DEBUG_DISPLAY', false );
	@ini_set( 'display_errors', 0 );
	define( 'SCRIPT_DEBUG', true );
	define( 'SAVEQUERIES', true );
}

// Disable auto-updates in dev.
define( 'WP_AUTO_UPDATE_CORE', false );
define( 'AUTOMATIC_UPDATER_DISABLED', true );

// Allow direct filesystem ops (no FTP prompt).
define( 'FS_METHOD', 'direct' );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
