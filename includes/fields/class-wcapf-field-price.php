<?php
/**
 * WCAPF_Field_Price class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Price extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$number_field_group = new WCAPF_Field_Group_Number();

		return $number_field_group->get_group_fields();
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'price';
	}

	/**
	 * TODO: Complete this.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		// TODO: Maybe show the preview in the backend also.
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );
		$display_type   = $field_instance->display_type;

		$non_menu_filters = array( 'range_slider', 'range_number' );

		$classes = array( 'wcapf-number-range-filter' );

		$this->before_filter_form( $classes );

		if ( in_array( $display_type, $non_menu_filters ) ) {
			$this->render_non_menu_filter_field( $field_instance );
		}

		$this->after_filter_form();
	}

}
