<?php
/**
 * Pins the admin-ajax form lifecycle handlers in \WCAPF\Ajax: create / read /
 * update / delete forms + filters and save settings. Asserts the response
 * shapes the React admin reads, plus the sanitization branches where past
 * regressions hid (parent_term wipe, manual-options shape, author_roles
 * pluck). These same assertions re-run against the REST routes in commit 2.
 *
 * @package wc-ajax-product-filter
 */

class AjaxFormsTest extends WP_Ajax_UnitTestCase {

	private int $admin_id;

	public function set_up() {
		parent::set_up();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $this->admin_id );

		if ( ! taxonomy_exists( 'pa_color' ) ) {
			register_taxonomy( 'pa_color', array( 'product' ), array( 'hierarchical' => false ) );
		}
	}

	private function with_nonce( array $params ): array {
		$params['nonce'] = wp_create_nonce( 'wcapf-nonce' );

		return $params;
	}

	private function last_json(): array {
		return json_decode( $this->_last_response, true );
	}

	private function call_handler( string $action, array $get = array(), array $post = array() ): array {
		$_GET  = $this->with_nonce( $get );
		$_POST = $this->with_nonce( $post );

		$this->_last_response = '';

		try {
			$this->_handleAjax( $action );
		} catch ( WPAjaxDieContinueException $e ) {
			return $this->last_json();
		}

		$this->fail( "Handler $action did not call wp_send_json_*" );
	}

	private function do_rest( string $method, string $route, array $params = array() ): \WP_REST_Response {
		$request = new \WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return rest_do_request( $request );
	}

	public function test_create_sample_form_seeds_sample_filters_and_returns_form_data(): void {
		$response = $this->call_handler( 'wcapf_create_sample_form', array(), array() );

		$this->assertTrue( $response['success'] );
		$this->assertArrayHasKey( 'id', $response['data'] );
		$this->assertArrayHasKey( 'title', $response['data'] );

		$form_id = $response['data']['id'];
		$this->assertSame( 'wcapf-form', get_post_type( $form_id ) );

		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
				'nopaging'    => true,
			)
		);
		$this->assertNotEmpty( $filters, 'Sample form should seed sample filters.' );
		$this->assertCount(
			count( \WCAPF\Defaults::get_sample_filters() ),
			$filters,
			'All sample filter rows should be persisted.'
		);
	}

	public function test_add_form_creates_empty_form_with_given_title(): void {
		$response = $this->call_handler(
			'wcapf_add_form',
			array(),
			array(
				'form_title'    => 'My new form',
				'form_settings' => wp_json_encode( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$this->assertTrue( $response['success'] );
		$this->assertSame( 'My new form', $response['data']['title'] );

		$form_id = $response['data']['id'];
		$this->assertSame( 'wcapf-form', get_post_type( $form_id ) );

		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'nopaging'    => true,
			)
		);
		$this->assertSame( array(), $filters, 'add_form must NOT seed sample filters.' );
	}

	public function test_get_form_data_returns_the_documented_react_shape(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_title'   => 'A form',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$response = $this->call_handler( 'wcapf_get_form_data', array( 'post_id' => $form_id ) );

		$this->assertTrue( $response['success'] );
		$this->assertSame(
			array( 'post_id', 'post_title', 'filter_keys', 'form_filters', 'form_settings' ),
			array_keys( $response['data'] ),
			'Response keys must match the React admin contract.'
		);
		$this->assertSame( $form_id, $response['data']['post_id'] );
		$this->assertSame( 'A form', $response['data']['post_title'] );
		$this->assertSame( array(), $response['data']['form_filters'] );
	}

	public function test_get_form_data_parses_parent_term_into_value_label_shape(): void {
		$term    = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Furniture',
			)
		);
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);
		$this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-filter',
				'post_parent'  => $form_id,
				'post_status'  => 'publish',
				'post_excerpt' => 'taxonomy>product_cat',
				'post_content' => maybe_serialize(
					array(
						'type'        => 'taxonomy',
						'taxonomy'    => 'product_cat',
						'parent_term' => $term,
					)
				),
			)
		);

		$response = $this->call_handler( 'wcapf_get_form_data', array( 'post_id' => $form_id ) );

		$this->assertCount( 1, $response['data']['form_filters'] );
		$this->assertSame(
			array(
				'value' => $term,
				'label' => 'Furniture',
			),
			$response['data']['form_filters'][0]['parent_term'],
			'parent_term scalar must be parsed into {value,label} for the React UI.'
		);
	}

	public function test_get_form_data_parses_include_terms_into_value_label_array(): void {
		$term_a  = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Chairs',
			)
		);
		$term_b  = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Tables',
			)
		);
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);
		$this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-filter',
				'post_parent'  => $form_id,
				'post_status'  => 'publish',
				'post_excerpt' => 'taxonomy>product_cat',
				'post_content' => maybe_serialize(
					array(
						'type'          => 'taxonomy',
						'taxonomy'      => 'product_cat',
						'include_terms' => array( $term_a, $term_b ),
					)
				),
			)
		);

		$response = $this->call_handler( 'wcapf_get_form_data', array( 'post_id' => $form_id ) );

		$include = $response['data']['form_filters'][0]['include_terms'];
		$this->assertCount( 2, $include );
		$this->assertSame(
			array( 'value' => $term_a, 'label' => 'Chairs' ),
			$include[0]
		);
		$this->assertSame(
			array( 'value' => $term_b, 'label' => 'Tables' ),
			$include[1]
		);
	}

	public function test_save_form_round_trip_persists_parent_term_id_from_value_label_shape(): void {
		$term    = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Lamps',
			)
		);
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);

		// React sends parent_term as the {value,label} shape (the AsyncPaginate
		// selected option). sanitize_filter_data plucks `value` to persist the
		// bare id. Sending a bare scalar is the migration shape and would be
		// silently dropped — that gating is covered by V4MigrationTest.
		$filters = array(
			array(
				'type'        => 'taxonomy',
				'taxonomy'    => 'product_cat',
				'field_key'   => 'cat_filter',
				'title'       => 'Categories',
				'parent_term' => array( 'value' => $term, 'label' => 'Lamps' ),
			),
		);

		$response = $this->call_handler(
			'wcapf_save_form',
			array(),
			array(
				'form_id'       => $form_id,
				'form_title'    => 'After save',
				'form_filters'  => wp_json_encode( $filters ),
				'form_settings' => wp_json_encode( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$this->assertTrue( $response['success'], 'save_form should succeed.' );

		$saved = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
				'nopaging'    => true,
			)
		);
		$this->assertCount( 1, $saved );
		$stored = maybe_unserialize( $saved[0]->post_content );
		$this->assertSame( $term, (int) $stored['parent_term'], 'parent_term id must be plucked from the React {value,label} shape.' );
	}

	public function test_delete_form_cascades_to_child_filters(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);
		$child_a = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);
		$child_b = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);
		$sibling = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => 0,
				'post_status' => 'publish',
			)
		);

		$response = $this->call_handler( 'wcapf_delete_form', array(), array( 'post_id' => $form_id ) );

		$this->assertTrue( $response['success'] );
		$this->assertNull( get_post( $form_id ) );
		$this->assertNull( get_post( $child_a ) );
		$this->assertNull( get_post( $child_b ) );
		$this->assertNotNull( get_post( $sibling ), 'Unrelated filter posts must NOT be deleted.' );
	}

	public function test_delete_filter_deletes_only_the_given_filter(): void {
		$form_id  = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
			)
		);
		$victim   = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);
		$survivor = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);

		$response = $this->call_handler( 'wcapf_delete_filter', array( 'post_id' => $victim ) );

		$this->assertTrue( $response['success'] );
		$this->assertNull( get_post( $victim ) );
		$this->assertNotNull( get_post( $survivor ), 'Sibling filter must survive.' );
		$this->assertNotNull( get_post( $form_id ), 'Parent form must survive.' );
	}

	public function test_save_settings_plucks_author_roles_value_field(): void {
		$response = $this->call_handler(
			'wcapf_save_settings',
			array(),
			array(
				'settings' => wp_json_encode(
					array(
						'author_roles' => array(
							array( 'label' => 'Administrator', 'value' => 'administrator' ),
							array( 'label' => 'Editor', 'value' => 'editor' ),
						),
					)
				),
			)
		);

		$this->assertTrue( $response['success'] );

		$stored = get_option( wcapf()->settings->option_key() );
		$this->assertSame(
			array( 'administrator', 'editor' ),
			$stored['author_roles'],
			'author_roles must be reduced to a bare list of role slugs.'
		);
	}

	public function test_save_settings_returns_settings_in_react_shape(): void {
		update_option(
			wcapf()->settings->option_key(),
			array( 'author_roles' => array( 'administrator' ) )
		);

		$response = $this->call_handler(
			'wcapf_save_settings',
			array(),
			array( 'settings' => wp_json_encode( array() ) )
		);

		$this->assertTrue( $response['success'] );
		$this->assertArrayHasKey( 'settings', $response['data'] );
		$this->assertArrayHasKey( 'global_filter_keys', $response['data'] );
	}

	// REST mirrors — same fixtures, REST routes return the data unwrapped (no
	// {success, data} envelope). When all admin-ajax handlers are deleted in
	// Phase 0d, these REST assertions stay and the AJAX ones above drop.

	public function test_create_sample_form_via_rest(): void {
		$response = $this->do_rest( 'POST', '/wcapf/v1/forms', array( 'template' => 'sample' ) );

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'id', $data );
		$this->assertSame( 'wcapf-form', get_post_type( $data['id'] ) );

		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $data['id'],
				'post_status' => 'publish',
				'nopaging'    => true,
			)
		);
		$this->assertCount( count( \WCAPF\Defaults::get_sample_filters() ), $filters );
	}

	public function test_add_form_via_rest(): void {
		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/forms',
			array(
				'form_title'    => 'My new form',
				'form_settings' => wp_json_encode( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertSame( 'My new form', $data['title'] );

		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $data['id'],
				'nopaging'    => true,
			)
		);
		$this->assertSame( array(), $filters );
	}

	public function test_get_form_data_via_rest_returns_documented_shape(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_title'   => 'REST form',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$response = $this->do_rest( 'GET', "/wcapf/v1/forms/$form_id" );

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertSame(
			array( 'post_id', 'post_title', 'filter_keys', 'form_filters', 'form_settings' ),
			array_keys( $data )
		);
		$this->assertSame( $form_id, $data['post_id'] );
		$this->assertSame( 'REST form', $data['post_title'] );
	}

	public function test_get_form_data_via_rest_parses_parent_term(): void {
		$term    = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Furniture' )
		);
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);
		$this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-filter',
				'post_parent'  => $form_id,
				'post_status'  => 'publish',
				'post_excerpt' => 'taxonomy>product_cat',
				'post_content' => maybe_serialize(
					array( 'type' => 'taxonomy', 'taxonomy' => 'product_cat', 'parent_term' => $term )
				),
			)
		);

		$response = $this->do_rest( 'GET', "/wcapf/v1/forms/$form_id" );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame(
			array( 'value' => $term, 'label' => 'Furniture' ),
			$response->get_data()['form_filters'][0]['parent_term']
		);
	}

	public function test_get_form_data_via_rest_404_on_unknown_id(): void {
		$response = $this->do_rest( 'GET', '/wcapf/v1/forms/999999' );

		$this->assertSame( 404, $response->get_status() );
	}

	public function test_save_form_via_rest_round_trips_parent_term(): void {
		$term    = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Lamps' )
		);
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$response = $this->do_rest(
			'POST',
			"/wcapf/v1/forms/$form_id",
			array(
				'form_title'    => 'After save',
				'form_filters'  => wp_json_encode(
					array(
						array(
							'type'        => 'taxonomy',
							'taxonomy'    => 'product_cat',
							'field_key'   => 'cat_filter',
							'title'       => 'Categories',
							'parent_term' => array( 'value' => $term, 'label' => 'Lamps' ),
						),
					)
				),
				'form_settings' => wp_json_encode( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$saved = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
				'nopaging'    => true,
			)
		);
		$this->assertCount( 1, $saved );
		$stored = maybe_unserialize( $saved[0]->post_content );
		$this->assertSame( $term, (int) $stored['parent_term'] );
	}

	public function test_delete_form_via_rest_cascades(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);
		$child   = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);

		$response = $this->do_rest( 'DELETE', "/wcapf/v1/forms/$form_id" );

		$this->assertSame( 200, $response->get_status() );
		$this->assertNull( get_post( $form_id ) );
		$this->assertNull( get_post( $child ) );
	}

	public function test_delete_filter_via_rest_isolated(): void {
		$form_id = $this->factory()->post->create(
			array( 'post_type' => 'wcapf-form', 'post_status' => 'publish' )
		);
		$victim   = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);
		$survivor = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-filter',
				'post_parent' => $form_id,
				'post_status' => 'publish',
			)
		);

		$response = $this->do_rest( 'DELETE', "/wcapf/v1/filters/$victim" );

		$this->assertSame( 200, $response->get_status() );
		$this->assertNull( get_post( $victim ) );
		$this->assertNotNull( get_post( $survivor ) );
		$this->assertNotNull( get_post( $form_id ) );
	}

	public function test_save_settings_via_rest_plucks_author_roles(): void {
		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/settings',
			array(
				'settings' => wp_json_encode(
					array(
						'author_roles' => array(
							array( 'label' => 'Administrator', 'value' => 'administrator' ),
							array( 'label' => 'Editor', 'value' => 'editor' ),
						),
					)
				),
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$stored = get_option( wcapf()->settings->option_key() );
		$this->assertSame( array( 'administrator', 'editor' ), $stored['author_roles'] );
	}
}
