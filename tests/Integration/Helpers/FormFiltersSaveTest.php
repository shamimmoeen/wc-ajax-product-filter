<?php
/**
 * FormFilters::save error-path tests.
 *
 * Pins the no-exit contract: when validation fails, save() returns
 * [[], $errors] instead of calling wp_send_json_error and terminating the
 * request. A future REST controller (or any non-Ajax caller) relies on this
 * contract — if someone re-introduces wp_send_json_error, the test process
 * itself terminates and PHPUnit reports a hard failure.
 *
 * @package wc-ajax-product-filter
 */

class FormFiltersSaveTest extends WP_UnitTestCase {

	private int $form_id;

	public function set_up() {
		parent::set_up();

		$this->form_id = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
				'post_title'  => 'Test form',
			)
		);
	}

	public function test_save_returns_errors_when_filter_key_conflicts_with_post_type() {
		$filters = array(
			array(
				'type'      => 'taxonomy',
				'taxonomy'  => 'product_cat',
				'field_key' => 'post', // collides with the built-in 'post' post type.
				'title'     => 'Categories',
			),
		);

		list( $saved, $errors ) = wcapf()->form_filters->save( $filters, $this->form_id );

		$this->assertSame( array(), $saved, 'No filters should be persisted when validation fails.' );
		$this->assertCount( 1, $errors );
		$this->assertSame( 'post', $errors[0]['field_key'] );
	}

	public function test_save_returns_errors_when_filter_key_is_reserved_search_key() {
		$filters = array(
			array(
				'type'      => 'taxonomy',
				'taxonomy'  => 'product_cat',
				'field_key' => 's', // reserved by core search.
				'title'     => 'Search',
			),
		);

		list( $saved, $errors ) = wcapf()->form_filters->save( $filters, $this->form_id );

		$this->assertSame( array(), $saved );
		$this->assertCount( 1, $errors );
		$this->assertSame( 's', $errors[0]['field_key'] );
	}
}
