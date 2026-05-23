<?php
/**
 * Notices helper.
 *
 * Determines whether each admin notice (review prompts, migration prompts,
 * pro update warnings) should be shown for the current request.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Notices helper.
 */
class Notices {

	/**
	 * Whether the "milestone achieved" review prompt should be shown.
	 *
	 * @return bool
	 */
	public function is_milestone_review_visible(): bool {
		if ( ! $this->is_review_visible() ) {
			return false;
		}

		$user_id  = get_current_user_id();
		$meta_key = 'wcapf_review_notice_for_milestone_achieved_dismissed';

		if ( get_user_meta( $user_id, $meta_key, true ) ) {
			return false;
		}

		$form_updates_count = (int) get_user_meta( $user_id, 'wcapf_form_updates_count', true );

		return $form_updates_count >= 5;
	}

	/**
	 * Shared predicate: are any review notices eligible to show right now?
	 *
	 * Migration / pro-update prompts take priority — when any is active, review
	 * prompts must stay hidden.
	 *
	 * @return bool
	 */
	public function is_review_visible(): bool {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		if ( $this->is_v4_review_filters_visible() ) {
			return false;
		}

		if ( ! empty( $this->pro_update_messages() ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Whether the v4 "review your migrated filters" notice should be shown.
	 *
	 * @return bool
	 */
	public function is_v4_review_filters_visible(): bool {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		global $current_screen;

		$screen_id = $current_screen->id ?? '';

		if ( 'toplevel_page_wcapf' !== $screen_id ) {
			return false;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading query arg only to determine whether the admin notice should be shown.
		$form_id = ! empty( $_GET['id'] ) ? absint( wp_unslash( $_GET['id'] ) ) : 0;

		if ( ! $form_id ) {
			return false;
		}

		return '1' === get_post_meta( $form_id, '_wcapf_v4_needs_review', true );
	}

	/**
	 * Returns pro-update notice messages, or an empty array when no prompt applies.
	 *
	 * TODO: Check this thoroughly.
	 *
	 * @return array<int, string>
	 */
	public function pro_update_messages(): array {
		$notices = array();

		if ( ! current_user_can( 'manage_options' ) ) {
			return $notices;
		}

		if ( ! is_plugin_active( 'wc-ajax-product-filter-pro/wc-ajax-product-filter-pro.php' ) ) {
			return $notices;
		}

		// Pro plugin is active but the version constant is missing — the running pro is too old.
		if ( ! defined( 'WCAPF_PRO_VERSION' ) ) {
			$notices[] = $this->build_pro_update_message( '2.1.0' );

			return $notices;
		}

		// Free 4.0.0 paired with Pro < 2.0.0.
		if ( defined( 'WCAPF_VERSION' ) && version_compare( WCAPF_VERSION, '4.0.0', '=' ) && version_compare( WCAPF_PRO_VERSION, '2.0.0', '<' ) ) {
			$notices[] = $this->build_pro_update_message( '2.0.0' );
		}

		// Free 4.1.0 paired with Pro <= 2.0.0.
		if ( defined( 'WCAPF_VERSION' ) && version_compare( WCAPF_VERSION, '4.1.0', '=' ) && version_compare( WCAPF_PRO_VERSION, '2.0.0', '<=' ) ) {
			$notices[] = $this->build_pro_update_message( '2.1.0' );
		}

		return $notices;
	}

	/**
	 * Builds a single pro-update notice message.
	 *
	 * @param string $required_pro_version The required pro version.
	 *
	 * @return string
	 */
	private function build_pro_update_message( string $required_pro_version ): string {
		$update_plugin_doc_url = add_query_arg(
			array(
				'utm_source'   => 'WP+Admin',
				'utm_medium'   => 'update_pro_notice',
				'utm_campaign' => 'WCAPF+Pro+Update',
			),
			'https://wptools.io/docs/wc-ajax-product-filter/getting-started/update-plugin/'
		);

		if ( defined( 'WCAPF_PRO_VERSION' ) ) {
			$pro_version = WCAPF_PRO_VERSION;
		} else {
			$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/wc-ajax-product-filter-pro/wc-ajax-product-filter-pro.php' );
			$pro_version = $plugin_data['Version'];
		}

		return sprintf(
			/* translators: 1: free plugin version, 2: required Pro version, 3: installed Pro version, 4: update documentation URL. */
			__( 'WCAPF – Ajax Product Filter for WooCommerce version %1$s requires WCAPF – Ajax Product Filter for WooCommerce Pro version %2$s or higher, but you are using %3$s. The Pro version is currently NOT RUNNING. <a href="%4$s" target="_blank">Please proceed with the update</a>.', 'wc-ajax-product-filter' ),
			WCAPF_VERSION,
			$required_pro_version,
			$pro_version,
			esc_url( $update_plugin_doc_url )
		);
	}

	/**
	 * Determines whether the "time since" review prompt should be shown, and which interval label to use.
	 *
	 * @return false|string The interval label (e.g. "1 year") when the prompt should be shown,
	 *                      false when it should not.
	 */
	public function time_since_review_label() {
		if ( ! $this->is_review_visible() ) {
			return false;
		}

		$user_id      = get_current_user_id();
		$current_time = time();

		// Don't reshow within 24 hours of dismissing the milestone notice.
		$meta_key       = 'wcapf_review_notice_for_milestone_achieved_dismissed_at';
		$dismissal_time = get_user_meta( $user_id, $meta_key, true );

		if ( $dismissal_time && ( $current_time - $dismissal_time ) < 24 * 60 * 60 ) {
			return false;
		}

		// User chose to hide this prompt permanently.
		if ( get_user_meta( $user_id, 'wcapf_review_notice_time_since_hide_permanently', true ) ) {
			return false;
		}

		$activation_time = get_option( 'wcapf_activation_time' );

		if ( ! $activation_time ) {
			return false;
		}

		// Intervals to show the review notice (in seconds), with corresponding human-readable strings.
		$intervals = array(
			31536000 => '1 year',
			15552000 => '6 months',
			7776000  => '3 months',
			2592000  => '1 month',
			1209600  => '2 weeks',
			604800   => '1 week',
		);

		$dismissal_key      = 'wcapf_review_notice_time_since_dismissed_at';
		$dismissal_time     = get_user_meta( $user_id, $dismissal_key, true );
		$dismissed_interval = null;

		if ( $dismissal_time ) {
			$elapsed_time = $dismissal_time - $activation_time;

			foreach ( array_keys( $intervals ) as $interval ) {
				if ( $interval >= $elapsed_time ) {
					$dismissed_interval = $interval;
				}
			}
		}

		$timestamp    = null;
		$show         = null;
		$elapsed_time = $current_time - $activation_time;

		foreach ( $intervals as $interval => $human_readable_interval ) {
			if ( $elapsed_time >= $interval ) {
				$timestamp = $interval;
				$show      = $human_readable_interval;

				break;
			}
		}

		if ( $dismissed_interval && $timestamp < $dismissed_interval ) {
			return false;
		}

		return $show;
	}
}
