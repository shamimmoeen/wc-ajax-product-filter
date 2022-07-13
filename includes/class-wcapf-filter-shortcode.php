<?php
/**
 * WC Ajax Product Filter shortcode.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

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

	public function register_shortcode( $attrs ) {
		$attrs = shortcode_atts( array(
			'id' => '',
		), $attrs );

		$id   = $attrs['id'];
		$post = get_post( $id );

		if ( 'wcapf-filter' !== $post->post_type ) {
			return '';
		}

		if ( 'publish' !== $post->post_status ) {
			return '';
		}

		$field_data = get_post_meta( $id, '_field_data', true );

		$field_type  = isset( $field_data['type'] ) ? $field_data['type'] : '';
		$field_class = WCAPF_Helper::get_field_class_name_by_type( $field_type );

		if ( ! $field_class ) {
			return '';
		}

		$field = WCAPF_Helper::get_field_instance( $field_type, $field_data );

		ob_start();

		$field->filter_form();

		return ob_get_clean();
	}

}

add_shortcode( 'wcapf_filter', array( WCAPF_Filter_Shortcode::get_instance(), 'register_shortcode' ) );
