<?php
/**
 * WC Ajax Product Filter Form shortcode.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Form_Shortcode class.
 *
 * @since 4.0.0
 */
class WCAPF_Filter_Form_Shortcode {

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
			$instance = new WCAPF_Filter_Form_Shortcode();
		}

		return $instance;
	}

	public function register_shortcode() {
		$form = new WCAPF_Form();

		// if ( ! $wcapf_form ) {
		// 	return '<p>' . __( 'No form is set for this page. Please set a form for this page.', 'wc-ajax-product-filter' ) . '</p>';
		// }
		//
		// if ( isset( $wcapf_form['rendered'] ) ) {
		// 	return '';
		// }

		ob_start();

		$form->render_form();

		return ob_get_clean();
	}

}

add_shortcode( 'wcapf_form', array( WCAPF_Filter_Form_Shortcode::get_instance(), 'register_shortcode' ) );
