<?php
/**
 * Configuration for the WP test suite (wp-phpunit).
 *
 * Loaded by tests/bootstrap.php via WP_TESTS_CONFIG_FILE_PATH. Points at the
 * `wcapf_test` database that docker/db-init/01-create-test-db.sql creates on
 * first MariaDB boot.
 */

define( 'DB_NAME', getenv( 'WORDPRESS_TEST_DB_NAME' ) ?: 'wcapf_test' );
define( 'DB_USER', getenv( 'WORDPRESS_DB_USER' ) ?: 'wcapf' );
define( 'DB_PASSWORD', getenv( 'WORDPRESS_DB_PASSWORD' ) ?: 'wcapf' );
define( 'DB_HOST', getenv( 'WORDPRESS_DB_HOST' ) ?: 'database' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wptests_';

define( 'WP_TESTS_DOMAIN', 'example.test' );
define( 'WP_TESTS_EMAIL', 'admin@example.test' );
define( 'WP_TESTS_TITLE', 'WCAPF Test Site' );
define( 'WP_PHP_BINARY', 'php' );
define( 'WPLANG', '' );

// Tell wp-phpunit where to find Yoast PHPUnit polyfills.
define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', dirname( __DIR__ ) . '/vendor/yoast/phpunit-polyfills' );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__ ) . '/vendor/wordpress/wordpress/' );
}
