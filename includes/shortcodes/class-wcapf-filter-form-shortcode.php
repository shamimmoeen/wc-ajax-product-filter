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

		$enable_visibility_rules = isset( $form_data['enable_visibility_rules'] )
			? $form_data['enable_visibility_rules']
			: '';

		$visibility_rules = isset( $form_data['visibility_rules'] ) ? $form_data['visibility_rules'] : array();

		// Apply the visibility rules.
		if ( $enable_visibility_rules && ! WCAPF_Visibility_Rules::meet_rules( $visibility_rules ) ) {
			return '';
		}

		$reset_filter_visibility_rules = isset( $form_data['reset_filter_visibility_rules'] )
			? $form_data['reset_filter_visibility_rules']
			: '';

		$show_title              = isset( $form_data['show_title'] ) ? $form_data['show_title'] : '';
		$enable_accordion        = isset( $form_data['enable_accordion'] ) ? $form_data['enable_accordion'] : '';
		$accordion_default_state = isset( $form_data['accordion_default_state'] ) ? $form_data['accordion_default_state'] : '';
		$show_clear_button       = isset( $form_data['show_clear_button'] ) ? $form_data['show_clear_button'] : '';

		ob_start();

		echo '<div class="wcapf-filter-form preset-2 form-' . $id . '">';

		echo '<h3 style="margin-bottom: 1.5em;">Filter by</h3>';

		foreach ( $filter_ids as $filter_id ) {
			$field_data = get_post_meta( $filter_id, '_field_data', true );

			$field_type  = isset( $field_data['type'] ) ? $field_data['type'] : '';
			$field_class = WCAPF_Helper::get_field_class_name_by_type( $field_type );

			if ( ! $field_class ) {
				continue;
			}

			$field_data['form_id'] = $id;

			if ( $reset_filter_visibility_rules ) {
				$field_data['enable_visibility_rules'] = '';
				$field_data['visibility_rules']        = array();
			}

			if ( 'do_not_override' !== $show_title ) {
				$field_data['show_title'] = 'yes' === $show_title ? '1' : '';
			}

			if ( 'do_not_override' !== $enable_accordion ) {
				$field_data['enable_accordion'] = 'yes' === $enable_accordion ? '1' : '';

				if ( 'do_not_override' !== $accordion_default_state ) {
					$field_data['accordion_default_state'] = $accordion_default_state;
				}
			}

			if ( 'do_not_override' !== $show_clear_button ) {
				$field_data['show_clear_button'] = 'yes' === $show_clear_button ? '1' : '';
			}

			$field = WCAPF_Helper::get_field_instance( $field_type, $field_data );
			$field->filter_form();
		}

		echo '<button type="button" class="button">Apply Filters</button>';

		echo '</div>';

		return ob_get_clean();
	}

}

add_shortcode( 'wcapf_filter_form', array( WCAPF_Filter_Form_Shortcode::get_instance(), 'register_shortcode' ) );
