<?php
/**
 * Plugin setup — seeds and refreshes default settings.
 *
 * Activation sets the `wcapf_set_default_settings` flag and a plugin update sets
 * `wcapf_update_default_settings`; this applies them on the next request. Kept
 * separate from V4Migration because it is a permanent install/update concern,
 * whereas the v3 → v4 migration is one-shot and eventually removed.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

namespace WCAPF;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Applies default settings flagged by activation or update.
 */
class Setup {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Priority 21 so it runs after V4Migration (priority 20): on a v3 → v4
		// update the migrated values are in place before defaults are merged.
		add_action( 'init', array( $this, 'maybe_set_default_settings' ), 21 );
	}

	/**
	 * Merges default settings into the stored options when activation or an update
	 * flagged it. Stored values win over defaults, so only missing keys are filled.
	 *
	 * @return void
	 */
	public function maybe_set_default_settings(): void {
		$should_apply = get_option( 'wcapf_set_default_settings' ) || get_option( 'wcapf_update_default_settings' );

		if ( ! $should_apply ) {
			return;
		}

		$option_key        = 'wcapf_settings';
		$default_settings  = Defaults::default_settings();
		$existing_settings = get_option( $option_key, array() );

		update_option( $option_key, array_merge( $default_settings, $existing_settings ) );

		delete_option( 'wcapf_set_default_settings' );
		delete_option( 'wcapf_update_default_settings' );
	}
}
