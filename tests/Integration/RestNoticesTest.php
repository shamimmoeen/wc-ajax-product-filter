<?php
/**
 * Pins the wcapf/v1 notice-dismiss routes: per-type user_meta writes for the
 * review notice (/wcapf/v1/notices/review/dismiss) and the post-meta delete
 * for the v4 review-filters notice
 * (/wcapf/v1/notices/v4-review-filters/dismiss).
 *
 * @package wc-ajax-product-filter
 */

class RestNoticesTest extends WP_UnitTestCase {

	private int $admin_id;

	public function set_up() {
		parent::set_up();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $this->admin_id );
	}

	private function do_rest( string $method, string $route, array $params = array() ): \WP_REST_Response {
		$request = new \WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return rest_do_request( $request );
	}

	public function test_dismiss_review_milestone_writes_flag_and_timestamp(): void {
		$before = time();

		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/notices/review/dismiss',
			array( 'type' => 'milestone-achieved' )
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame(
			'1',
			get_user_meta( $this->admin_id, 'wcapf_review_notice_for_milestone_achieved_dismissed', true )
		);
		$this->assertGreaterThanOrEqual(
			$before,
			(int) get_user_meta( $this->admin_id, 'wcapf_review_notice_for_milestone_achieved_dismissed_at', true )
		);
	}

	public function test_dismiss_review_permanently_dismiss_time_since_writes_hide_flag(): void {
		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/notices/review/dismiss',
			array( 'type' => 'permanently-dismiss-time-since' )
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame(
			'1',
			get_user_meta( $this->admin_id, 'wcapf_review_notice_time_since_hide_permanently', true )
		);
	}

	public function test_dismiss_review_postpone_time_since_writes_timestamp(): void {
		$before = time();

		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/notices/review/dismiss',
			array( 'type' => 'postpone-time-since' )
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertGreaterThanOrEqual(
			$before,
			(int) get_user_meta( $this->admin_id, 'wcapf_review_notice_time_since_dismissed_at', true )
		);
	}

	public function test_dismiss_review_rejects_missing_type(): void {
		$response = $this->do_rest( 'POST', '/wcapf/v1/notices/review/dismiss' );

		$this->assertSame( 400, $response->get_status() );
	}

	public function test_dismiss_v4_review_filters_clears_post_meta(): void {
		$form_id = $this->factory()->post->create(
			array( 'post_type' => 'wcapf-form', 'post_status' => 'publish' )
		);
		update_post_meta( $form_id, '_wcapf_v4_needs_review', '1' );

		$response = $this->do_rest(
			'POST',
			'/wcapf/v1/notices/v4-review-filters/dismiss',
			array( 'form_id' => $form_id )
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( '', get_post_meta( $form_id, '_wcapf_v4_needs_review', true ) );
	}
}
