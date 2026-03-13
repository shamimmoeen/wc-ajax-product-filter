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
	 * Registers the legacy [wcapf_filter] shortcode output.
	 *
	 * This shortcode is kept for backward compatibility and simply
	 * renders the new [wcapf_form] shortcode.
	 *
	 * @since 3.0.0
	 *
	 * @return string
	 */
	public function register_shortcode() {
		// No more wcapf_filter shortcode, renders the form [wcapf_form] instead.
		return do_shortcode( '[wcapf_form]' );
	}
}

add_shortcode( 'wcapf_filter', array( WCAPF_Filter_Shortcode::get_instance(), 'register_shortcode' ) );
