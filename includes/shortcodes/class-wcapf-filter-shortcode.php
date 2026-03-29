<?php
/**
 * WCAPF – Ajax Product Filter for WooCommerce shortcode.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Filter_Shortcode class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Shortcode {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Filter_Shortcode();
		}

		return $instance;
	}

	/**
	 * Renders the legacy [wcapf_filter] shortcode.
	 *
	 * Deprecated in favour of [wcapf_form]. Kept for backward compatibility.
	 *
	 * @since      3.0.0
	 * @deprecated 4.4.0 Use [wcapf_form] instead.
	 *
	 * @return string
	 */
	public function register_shortcode() {
		_deprecated_function( '[wcapf_filter] shortcode', '4.4.0', '[wcapf_form]' );
		return do_shortcode( '[wcapf_form]' );
	}
}

add_shortcode( 'wcapf_filter', array( WCAPF_Filter_Shortcode::get_instance(), 'register_shortcode' ) );
