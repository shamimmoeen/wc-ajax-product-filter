<?php
/**
 * PHPUnit bootstrap.
 *
 * Loads the WP test suite (via composer wp-phpunit) and manually loads WooCommerce
 * and WCAPF on muplugins_loaded so they're available in tests.
 *
 * @package WC_Ajax_Product_Filter
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

$_tests_dir = dirname( __DIR__ ) . '/vendor/wp-phpunit/wp-phpunit';

if ( ! file_exists( "{$_tests_dir}/includes/functions.php" ) ) {
	fwrite( STDERR, "Could not find {$_tests_dir}/includes/functions.php. Have you run composer install?\n" );
	exit( 1 );
}

// Tell wp-phpunit where to find our test config.
define( 'WP_TESTS_CONFIG_FILE_PATH', __DIR__ . '/wp-tests-config.php' );

require_once "{$_tests_dir}/includes/functions.php";

/**
 * Loads WooCommerce, then WCAPF, before WP is fully booted.
 */
function _wcapf_manually_load_plugins() {
	require_once dirname( __DIR__ ) . '/vendor/wpackagist-plugin/woocommerce/woocommerce.php';
	require_once dirname( __DIR__ ) . '/wc-ajax-product-filter.php';
}

tests_add_filter( 'muplugins_loaded', '_wcapf_manually_load_plugins' );

require "{$_tests_dir}/includes/bootstrap.php";
