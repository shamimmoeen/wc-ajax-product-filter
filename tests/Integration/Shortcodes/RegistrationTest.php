<?php
/**
 * Shortcode registration tests.
 *
 * Pins the four shortcodes the plugin registers, including the deprecated
 * [wcapf_filter] alias that defers to [wcapf_form] and emits a deprecation
 * notice — customer content stored with the old tag must keep rendering after
 * the v3 rewrite.
 *
 * @package wc-ajax-product-filter
 */

class ShortcodesRegistrationTest extends WP_UnitTestCase {

	public function test_canonical_form_shortcode_is_registered() {
		if ( class_exists( \WCAPF\Pro\Shortcodes\Form::class ) ) {
			// Pro replaces the tag's callback on wcapf_loaded — the class
			// assertion belongs in the pro test, not here.
			$this->markTestSkipped( 'Pro overrides the wcapf_form callback; see ShortcodeRegistrationProTest.' );
		}

		$this->assert_shortcode_registered( 'wcapf_form', \WCAPF\Shortcodes\Form::class );
	}

	public function test_active_filters_shortcode_is_registered() {
		$this->assert_shortcode_registered( 'wcapf_active_filters', \WCAPF\Shortcodes\ActiveFilters::class );
	}

	public function test_reset_button_shortcode_is_registered() {
		$this->assert_shortcode_registered( 'wcapf_reset_button', \WCAPF\Shortcodes\ResetButton::class );
	}

	public function test_deprecated_filter_shortcode_stays_registered_for_backward_compat() {
		// Customer content stored with [wcapf_filter] must still render after the
		// rewrite — keeping the tag registered is the whole point of LegacyFilter.
		$this->assert_shortcode_registered( 'wcapf_filter', \WCAPF\Shortcodes\LegacyFilter::class );
	}

	public function test_deprecated_filter_shortcode_emits_deprecation_notice() {
		$this->setExpectedDeprecated( '[wcapf_filter] shortcode' );

		do_shortcode( '[wcapf_filter]' );
	}

	private function assert_shortcode_registered( string $tag, string $expected_class ): void {
		global $shortcode_tags;

		$this->assertTrue(
			shortcode_exists( $tag ),
			"Shortcode '[$tag]' is not registered."
		);

		$callback = $shortcode_tags[ $tag ];

		$this->assertIsArray( $callback );
		$this->assertInstanceOf( $expected_class, $callback[0] );
	}
}
