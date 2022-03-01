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
		echo 'render the price filter';
	}

}
