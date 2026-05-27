<?php
/**
 * Tests for default-settings seeding on activation/update (WCAPF\Setup).
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * @group setup
 */
class SetupTest extends WP_UnitTestCase {

	public function test_activation_flag_seeds_all_defaults() {
		delete_option( 'wcapf_settings' );
		update_option( 'wcapf_set_default_settings', '1' );

		( new \WCAPF\Setup() )->maybe_set_default_settings();

		$this->assertSame( \WCAPF\Defaults::default_settings(), get_option( 'wcapf_settings' ) );
		$this->assertFalse( get_option( 'wcapf_set_default_settings' ) );
	}

	public function test_update_flag_fills_missing_defaults_but_keeps_saved_values() {
		update_option( 'wcapf_settings', array( 'primary_color' => '#abcdef' ) );
		update_option( 'wcapf_update_default_settings', '1' );

		( new \WCAPF\Setup() )->maybe_set_default_settings();

		$settings = get_option( 'wcapf_settings' );

		// Saved value preserved (stored values win over defaults).
		$this->assertSame( '#abcdef', $settings['primary_color'] );
		// A default key the saved array lacked is now present.
		$this->assertArrayHasKey( 'filter_relationships', $settings );
		$this->assertFalse( get_option( 'wcapf_update_default_settings' ) );
	}

	public function test_no_flag_leaves_settings_untouched() {
		update_option( 'wcapf_settings', array( 'primary_color' => '#abcdef' ) );

		( new \WCAPF\Setup() )->maybe_set_default_settings();

		$this->assertSame( array( 'primary_color' => '#abcdef' ), get_option( 'wcapf_settings' ) );
	}
}
