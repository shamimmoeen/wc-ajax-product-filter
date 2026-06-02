<?php
/**
 * Pins the `wcapf/v1` REST form lifecycle: create / read / update / delete +
 * the React UI shapes (parse_filter_data branches, parent_term value/label
 * round-trip, delete-form cascade).
 *
 * @package wc-ajax-product-filter
 */

class RestFormsTest extends WP_UnitTestCase {

	private int $admin_id;

	public function set_up() {
		parent::set_up();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $this->admin_id );

		if ( ! taxonomy_exists( 'pa_color' ) ) {
			register_taxonomy( 'pa_color', array( 'product' ), array( 'hierarchical' => false ) );
		}
	}

	private function do_rest( string $method, string $route, array $params = array() ): \WP_REST_Response {
		$request = new \WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return rest_do_request( $request );
	}

	public function test_create_sample_form_seeds_sample_filters(): void {
		$response = $this->do_rest( 'POST', '/wcapf/v1/forms/sample' );

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

	public function test_add_empty_form_with_given_title(): void {
		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/forms',
			array(
				'title'    => 'My new form',
				'settings' => \WCAPF\Defaults::form_default_data(),
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

	public function test_get_form_data_returns_documented_react_shape(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_title'   => 'A form',
				'post_content' => maybe_serialize( \WCAPF\Defaults::form_default_data() ),
			)
		);

		$response = $this->do_rest( 'GET', "/wcapf/v1/forms/$form_id" );

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertSame(
			array( 'id', 'title', 'filter_keys', 'filters', 'settings' ),
			array_keys( $data )
		);
		$this->assertSame( $form_id, $data['id'] );
		$this->assertSame( 'A form', $data['title'] );
		$this->assertSame( array(), $data['filters'] );
	}

	public function test_get_form_data_parses_parent_term_into_value_label(): void {
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
			$response->get_data()['filters'][0]['parent_term']
		);
	}

	public function test_get_form_data_parses_include_terms_into_value_label_array(): void {
		$term_a  = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Chairs' )
		);
		$term_b  = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Tables' )
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

		$response = $this->do_rest( 'GET', "/wcapf/v1/forms/$form_id" );

		$include = $response->get_data()['filters'][0]['include_terms'];
		$this->assertCount( 2, $include );
		$this->assertSame( array( 'value' => $term_a, 'label' => 'Chairs' ), $include[0] );
		$this->assertSame( array( 'value' => $term_b, 'label' => 'Tables' ), $include[1] );
	}

	public function test_get_form_data_404_on_unknown_id(): void {
		$response = $this->do_rest( 'GET', '/wcapf/v1/forms/999999' );

		$this->assertSame( 404, $response->get_status() );
	}

	public function test_save_form_round_trips_parent_term_from_value_label(): void {
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

		// React sends parent_term as the {value,label} shape (AsyncPaginate
		// selected option); sanitize_filter_data plucks `value` to persist the
		// bare id. Sending a bare scalar is the migration shape and would be
		// silently dropped — that gating is covered by V4MigrationTest.
		$response = $this->do_rest(
			'POST',
			"/wcapf/v1/forms/$form_id",
			array(
				'title'    => 'After save',
				'filters'  => array(
					array(
						'type'        => 'taxonomy',
						'taxonomy'    => 'product_cat',
						'field_key'   => 'cat_filter',
						'title'       => 'Categories',
						'parent_term' => array( 'value' => $term, 'label' => 'Lamps' ),
					),
				),
				'settings' => \WCAPF\Defaults::form_default_data(),
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

		$response = $this->do_rest( 'DELETE', "/wcapf/v1/forms/$form_id" );

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertTrue( $data['deleted'] );
		$this->assertSame( $form_id, $data['previous']['id'] );
		$this->assertNull( get_post( $form_id ) );
		$this->assertNull( get_post( $child_a ) );
		$this->assertNull( get_post( $child_b ) );
		$this->assertNotNull( get_post( $sibling ) );
	}

	public function test_delete_filter_deletes_only_the_given_filter(): void {
		$form_id  = $this->factory()->post->create(
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
		$data = $response->get_data();
		$this->assertTrue( $data['deleted'] );
		$this->assertArrayHasKey( 'previous', $data );
		$this->assertNull( get_post( $victim ) );
		$this->assertNotNull( get_post( $survivor ) );
		$this->assertNotNull( get_post( $form_id ) );
	}

	public function test_save_settings_plucks_author_roles_value_field(): void {
		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/settings',
			array(
				'settings' => array(
					'author_roles' => array(
						array( 'label' => 'Administrator', 'value' => 'administrator' ),
						array( 'label' => 'Editor', 'value' => 'editor' ),
					),
				),
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$stored = get_option( wcapf()->settings->option_key() );
		$this->assertSame( array( 'administrator', 'editor' ), $stored['author_roles'] );
	}

	public function test_save_settings_returns_settings_in_react_shape(): void {
		update_option(
			wcapf()->settings->option_key(),
			array( 'author_roles' => array( 'administrator' ) )
		);

		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/settings',
			array( 'settings' => array() )
		);

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'settings', $data );
		$this->assertArrayHasKey( 'global_filter_keys', $data );
	}
}
