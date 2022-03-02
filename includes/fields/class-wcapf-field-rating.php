<?php
/**
 * WCAPF_Field_Rating class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Rating class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Rating extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$text_field_group = new WCAPF_Field_Group_Text();

		return $text_field_group->get_group_fields();
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'rating';
	}

	protected function render_filter_form() {
		// TODO: Implement render_filter_form() method.
	}

}
