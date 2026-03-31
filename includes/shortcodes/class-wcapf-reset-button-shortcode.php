<?php
/**
 * Reset button shortcode.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

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
	 * Renders the reset button shortcode output.
	 *
	 * @param array $attrs Shortcode attributes.
	 *
	 * @return string
	 */
	public function shortcode_output( $attrs = array() ) {
		$a = shortcode_atts(
			array(
				'id'          => '',
				'btn_label'   => WCAPF_Helper::reset_button_label(),
				'show_always' => '',
			),
			$attrs
		);

		if ( $a['id'] ) {
			$a['unique_id'] = $a['id'];
		}

		$args = WCAPF_Helper::prepare_reset_button_args( $a );

		return WCAPF_Template_Loader::get_instance()->load( 'reset-button', $args, false );
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
}

add_shortcode( 'wcapf_reset_button', array( WCAPF_Reset_Button_Shortcode::get_instance(), 'shortcode_output' ) );
