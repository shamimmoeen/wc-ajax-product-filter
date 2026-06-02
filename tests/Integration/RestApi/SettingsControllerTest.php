<?php
/**
 * Pins POST /wcapf/v1/settings — author_roles pluck (the most regression-
 * prone sanitization branch) and the response shape React reads after
 * save.
 *
 * @package wc-ajax-product-filter
 */

class SettingsControllerTest extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
	}

	private function do_rest( string $method, string $route, array $params = array() ): \WP_REST_Response {
		$request = new \WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return rest_do_request( $request );
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
