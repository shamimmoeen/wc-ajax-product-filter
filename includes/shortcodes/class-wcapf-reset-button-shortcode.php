<?php
/**
 * Reset button shortcode.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     wptools.io
 */

/**
 * WCAPF_Reset_Button_Shortcode class.
 *
 * @since 4.0.0
 */
class WCAPF_Reset_Button_Shortcode {

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
			$instance = new WCAPF_Reset_Button_Shortcode();
		}

		return $instance;
	}

	public function shortcode_output() {
		return 'reset button';
	}

}

add_shortcode( 'wcapf_active_filters', array( WCAPF_Reset_Button_Shortcode::get_instance(), 'shortcode_output' ) );
