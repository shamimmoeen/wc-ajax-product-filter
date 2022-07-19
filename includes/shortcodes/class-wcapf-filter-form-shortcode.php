<?php
/**
 * WC Ajax Product Filter Form shortcode.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Form_Shortcode class.
 *
 * @since 3.1.0
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

	public function register_shortcode( $attrs ) {
		$attrs = shortcode_atts( array(
			'id' => '',
		), $attrs );

		$id   = $attrs['id'];
		$post = get_post( $id );

		if ( 'wcapf-form' !== $post->post_type ) {
			return '';
		}

		if ( 'publish' !== $post->post_status ) {
			return '';
		}

		$form_data  = get_post_meta( $id, '_form_data', true );
		$filter_ids = isset( $form_data['filter_ids'] ) ? $form_data['filter_ids'] : array();

		if ( ! $filter_ids ) {
			return '';
		}

		ob_start();

		echo '<div class="wcapf-filter-form preset-2 form-' . $id . '">';

		foreach ( $filter_ids as $filter_id ) {
			$field_data = get_post_meta( $filter_id, '_field_data', true );

			$field_type  = isset( $field_data['type'] ) ? $field_data['type'] : '';
			$field_class = WCAPF_Helper::get_field_class_name_by_type( $field_type );

			if ( ! $field_class ) {
				continue;
			}

			$field_data['form_id'] = $id;

			$field = WCAPF_Helper::get_field_instance( $field_type, $field_data );
			$field->filter_form();
		}

		echo '</div>';

		return ob_get_clean();
	}

}

add_shortcode( 'wcapf_filter_form', array( WCAPF_Filter_Form_Shortcode::get_instance(), 'register_shortcode' ) );
