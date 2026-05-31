<?php
/**
 * Pins the two notice-dismiss admin-ajax handlers — the per-type write into
 * user_meta for the review notice (\WCAPF\Admin::dismiss_review_notices) and
 * the post-meta delete for the v4 review-filters notice
 * (\WCAPF\Migration\V4Migration::dismiss_review_filters_notice). Both use
 * their own dedicated nonces (not the generic wcapf-nonce).
 *
 * @package wc-ajax-product-filter
 */

class AjaxNoticesTest extends WP_Ajax_UnitTestCase {

	private int $admin_id;

	public function set_up() {
		parent::set_up();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $this->admin_id );

		// \WCAPF\Admin is gated on is_admin() at plugin boot (false during tests),
		// and even if it was instantiated, WP_UnitTestCase backs up + restores
		// hooks per test — so any add_action() call in __construct gets removed
		// at the end of each test. Re-instantiating here re-registers the
		// dismiss handler for this test.
		wcapf()->admin = new \WCAPF\Admin();
	}

	private function dispatch( string $action, array $post ): array {
		$_POST = $post;
		$_GET  = array();

		$this->_last_response = '';

		try {
			$this->_handleAjax( $action );
		} catch ( WPAjaxDieContinueException $e ) {
			return (array) json_decode( $this->_last_response, true );
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

	public function test_dismiss_review_milestone_writes_dismissed_flag_and_timestamp(): void {
		$before = time();

		$response = $this->dispatch(
			'wcapf_dismiss_review_notices',
			array(
				'nonce' => wp_create_nonce( 'wcapf-dismiss-review-notices-nonce' ),
				'type'  => 'milestone-achieved',
			)
		);

		$this->assertTrue( $response['success'] );
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
		$response = $this->dispatch(
			'wcapf_dismiss_review_notices',
			array(
				'nonce' => wp_create_nonce( 'wcapf-dismiss-review-notices-nonce' ),
				'type'  => 'permanently-dismiss-time-since',
			)
		);

		$this->assertTrue( $response['success'] );
		$this->assertSame(
			'1',
			get_user_meta( $this->admin_id, 'wcapf_review_notice_time_since_hide_permanently', true )
		);
	}

	public function test_dismiss_review_postpone_time_since_writes_timestamp(): void {
		$before = time();

		$response = $this->dispatch(
			'wcapf_dismiss_review_notices',
			array(
				'nonce' => wp_create_nonce( 'wcapf-dismiss-review-notices-nonce' ),
				'type'  => 'postpone-time-since',
			)
		);

		$this->assertTrue( $response['success'] );
		$this->assertGreaterThanOrEqual(
			$before,
			(int) get_user_meta( $this->admin_id, 'wcapf_review_notice_time_since_dismissed_at', true )
		);
	}

	public function test_dismiss_review_rejects_missing_type(): void {
		$response = $this->dispatch(
			'wcapf_dismiss_review_notices',
			array( 'nonce' => wp_create_nonce( 'wcapf-dismiss-review-notices-nonce' ) )
		);

		$this->assertFalse( $response['success'] );
	}

	public function test_dismiss_v4_review_filters_notice_clears_post_meta_for_given_form(): void {
		$form_id = $this->factory()->post->create(
			array(
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
			)
		);
		update_post_meta( $form_id, '_wcapf_v4_needs_review', '1' );

		$response = $this->dispatch(
			'wcapf_dismiss_v4_review_filters_notice',
			array(
				'nonce'   => wp_create_nonce( 'dismiss-v4-review-filters-notice-nonce' ),
				'form_id' => $form_id,
			)
		);

		$this->assertTrue( $response['success'] );
		$this->assertSame( '', get_post_meta( $form_id, '_wcapf_v4_needs_review', true ) );
	}

	// REST mirrors — the dismiss endpoints under /wcapf/v1/notices/. REST uses
	// the standard wp_rest nonce (no per-notice nonces).

	public function test_dismiss_review_via_rest_milestone_writes_flag_and_timestamp(): void {
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

	public function test_dismiss_review_via_rest_permanently_dismiss_time_since(): void {
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

	public function test_dismiss_review_via_rest_postpone_time_since(): void {
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

	public function test_dismiss_review_via_rest_rejects_missing_type(): void {
		$response = $this->do_rest( 'POST', '/wcapf/v1/notices/review/dismiss' );

		$this->assertSame( 400, $response->get_status() );
	}

	public function test_dismiss_v4_review_filters_via_rest(): void {
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
