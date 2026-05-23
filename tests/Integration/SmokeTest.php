<?php
/**
 * Smoke test — verifies the test environment loads WP, WC, and WCAPF correctly.
 * This is the canary; if it fails, none of the other tests will run.
 *
 * @package WC_Ajax_Product_Filter
 */

class SmokeTest extends WP_UnitTestCase {

	public function test_wordpress_is_loaded() {
		$this->assertTrue( defined( 'ABSPATH' ) );
		$this->assertNotEmpty( get_bloginfo( 'version' ) );
	}

	public function test_woocommerce_is_loaded() {
		$this->assertTrue( class_exists( 'WooCommerce' ) );
		$this->assertTrue( defined( 'WC_VERSION' ) );
	}

	public function test_wcapf_is_loaded() {
		$this->assertTrue( defined( 'WCAPF_VERSION' ) );
		$this->assertTrue( function_exists( 'wcapf' ) );
	}

	public function test_plugin_singleton_accessor_works() {
		$this->assertInstanceOf( \WCAPF\Plugin::class, wcapf() );
	}
}
