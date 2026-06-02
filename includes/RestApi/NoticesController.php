<?php
/**
 * Notice-dismiss routes (the milestone/time-since review notice + the v4
 * filters-review banner). Likely to shrink when the broader notice rework
 * happens — these endpoints may move to cookies or be removed.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/RestApi
 * @author     Mainul Hassan
 */

namespace WCAPF\RestApi;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Routes: POST /notices/review/dismiss, /notices/v4-review-filters/dismiss.
 */
class NoticesController extends Controller {

	/**
	 * Registers the notice routes.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/notices/review/dismiss',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'dismiss_review_notice' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/notices/v4-review-filters/dismiss',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'dismiss_v4_review_filters_notice' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);
	}

	/**
	 * POST /notices/review/dismiss — writes the per-type user_meta flag.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function dismiss_review_notice( WP_REST_Request $request ) {
		$type = sanitize_text_field( (string) $request->get_param( 'type' ) );

		if ( ! $type ) {
			return new WP_Error(
				'wcapf_invalid_notice_type',
				__( 'Invalid type for dismissing the review notices', 'wc-ajax-product-filter' ),
				array( 'status' => 400 )
			);
		}

		$user_id = get_current_user_id();

		if ( 'milestone-achieved' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_for_milestone_achieved_dismissed', '1' );
			update_user_meta( $user_id, 'wcapf_review_notice_for_milestone_achieved_dismissed_at', time() );
		} elseif ( 'permanently-dismiss-time-since' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_time_since_hide_permanently', '1' );
		} elseif ( 'postpone-time-since' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_time_since_dismissed_at', time() );
		}

		return rest_ensure_response( array( 'dismissed' => true ) );
	}

	/**
	 * POST /notices/v4-review-filters/dismiss — clears the per-form review flag.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function dismiss_v4_review_filters_notice( WP_REST_Request $request ): WP_REST_Response {
		$form_id = absint( $request->get_param( 'form_id' ) );

		if ( $form_id ) {
			delete_post_meta( $form_id, '_wcapf_v4_needs_review' );
		}

		return rest_ensure_response( array( 'dismissed' => true ) );
	}
}
