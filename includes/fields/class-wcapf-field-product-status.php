<?php
/**
 * WCAPF_Field_Product_Status class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Product_Status class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Product_Status extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$text_field_group = new WCAPF_Field_Group_Text();

		return array_merge(
			$text_field_group->get_group_fields(),
			$this->option_group()
		);
	}

	private function option_group() {
		return array(
			array(
				'name'     => 'product_status_options_group',
				'class'    => 'separator-top product-status-options-group',
				'position' => 30,
				'columns'  => array(
					array(
						array(
							'type'     => 'hidden',
							'id'       => 'product_status_options',
							'name'     => 'product_status_options',
							'position' => 20,
						),
						array(
							'type'     => 'html',
							'name'     => 'product_status_options_markup',
							// TODO: Might need to change
							'template' => 'admin/field-templates/product-status-options',
							'position' => 30,
						),
					),
				),
			),
		);
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'product-status';
	}

	protected function render_filter_form() {
		// TODO: Implement render_filter_form() method.
	}

}
