<?php
/**
 * Widget registration tests.
 *
 * Pins the two id_bases the plugin registers — wcapf_form_widget (canonical)
 * and wcapf_filter_widget (deprecated shim) — and the LegacyFilter -> Form
 * inheritance that lets the shim render unchanged. Customer sidebars store
 * the deprecated id_base; silently breaking it is the failure mode these
 * tests guard against.
 *
 * @package wc-ajax-product-filter
 */

class WidgetRegistrationTest extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		if ( ! did_action( 'widgets_init' ) ) {
			do_action( 'widgets_init' );
		}
	}

	public function test_canonical_form_widget_is_registered() {
		$this->assert_widget_id_base_registered( 'wcapf_form_widget' );
	}

	public function test_deprecated_filter_widget_id_base_stays_registered_for_backward_compat() {
		// Customer sidebars store wcapf_filter_widget-N — keeping this id_base
		// registered is the whole point of LegacyFilter.
		$this->assert_widget_id_base_registered( 'wcapf_filter_widget' );
	}

	public function test_deprecated_widget_inherits_the_canonical_widget_class() {
		$legacy = $this->find_widget_by_id_base( 'wcapf_filter_widget' );

		$this->assertInstanceOf( \WCAPF\Widgets\Form::class, $legacy );
	}

	private function assert_widget_id_base_registered( string $id_base ): void {
		$this->assertNotNull(
			$this->find_widget_by_id_base( $id_base ),
			"Widget id_base '$id_base' is not registered."
		);
	}

	private function find_widget_by_id_base( string $id_base ): ?WP_Widget {
		global $wp_widget_factory;

		foreach ( $wp_widget_factory->widgets as $widget ) {
			if ( $widget->id_base === $id_base ) {
				return $widget;
			}
		}

		return null;
	}
}
