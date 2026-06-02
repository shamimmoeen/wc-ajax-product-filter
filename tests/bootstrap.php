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

/*
 * WooCommerce disables internal static caches (e.g. product-visibility term IDs)
 * when this class exists — its own comment notes the static "doesn't work well
 * with unit tests". Define a stub so those caches don't go stale across the
 * per-test transaction rollbacks that renumber terms.
 */
if ( ! class_exists( 'WC_Unit_Tests_Bootstrap' ) ) {
	class WC_Unit_Tests_Bootstrap {} // phpcs:ignore
}

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

/**
 * Creates WooCommerce's custom tables (e.g. wc_product_meta_lookup) and default
 * data in the test database so price, stock, and visibility queries work.
 *
 * Hooked to `setup_theme`, which fires before `init`, so WooCommerce's own init
 * callbacks (webhook lookup, attribute taxonomies) don't query these tables
 * before they exist on a freshly created test database. Mirrors WooCommerce
 * core's test bootstrap, which installs WC on the same hook.
 */
function _wcapf_install_woocommerce() {
	WC_Install::install();
}

tests_add_filter( 'setup_theme', '_wcapf_install_woocommerce' );

require "{$_tests_dir}/includes/bootstrap.php";

// Preload the abstract test case so test files don't need per-file
// require_once for it — matches wp-phpunit's own bootstrap pattern.
require_once __DIR__ . '/Integration/Filter/BehaviorTestCase.php';
