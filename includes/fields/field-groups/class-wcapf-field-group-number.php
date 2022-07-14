<?php
/**
 * WCAPF_Field_Group_Number class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields/field-groups
 * @author     wptools.io
 */

/**
 * WCAPF_Field_Group_Number class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Group_Number extends WCAPF_Field_Group {

	protected function set_group_fields() {
		return array_merge(
			$this->display_type_group(),
			$this->ui_option_group(),
			$this->ui_option_first_row_group(),
			$this->ui_option_second_row_group(),
			$this->ui_option_third_row_group()
		);
	}

	private function display_type_group() {
		return array(
			array(
				'name'     => 'number_display_type',
				'class'    => 'separator-top',
				'position' => 25,
				'columns'  => array(
					array(
						array(
							'type'     => 'select',
							'id'       => 'number_display_type',
							'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
							'name'     => 'number_display_type',
							'options'  => array(
								'range_slider' => __( 'Range - Slider', 'wc-ajax-product-filter' ),
								'range_number' => __( 'Range - Number', 'wc-ajax-product-filter' ),
							),
							'position' => 15,
						),
						array(
							'type'     => 'radio',
							'id'       => 'number_range_slider_display_values_as',
							'label'    => __( 'Display values as', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_slider_display_values_as',
							'options'  => array(
								'plain_text'  => __( 'Plain Text', 'wc-ajax-product-filter' ),
								'input_field' => __( 'Input Field', 'wc-ajax-product-filter' ),
							),
							'default'  => 'plain_text',
							'position' => 20,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'align_values_at_the_end',
							'label'    => __( 'Align values left and right', 'wc-ajax-product-filter' ),
							'name'     => 'align_values_at_the_end',
							'default'  => '1',
							'position' => 25,
						),
					),
				),
			)
		);
	}

	private function ui_option_group() {
		return array(
			array(
				'name'     => 'number_ui_options',
				'heading'  => __( 'UI Options', 'wc-ajax-product-filter' ),
				'class'    => 'separator-top number-automatic-options',
				'position' => 30,
			),
		);
	}

	private function ui_option_first_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-first',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-ui-option-row-first',
				'position'  => 35,
				'columns'   => array(
					array(
						array(
							'type'     => 'text',
							'id'       => 'min_value',
							'label'    => __( 'Min Value', 'wc-ajax-product-filter' ),
							'name'     => 'min_value',
							'default'  => '0',
							'position' => 15,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'min_value_auto_detect',
							'label'    => __( 'Auto Detect', 'wc-ajax-product-filter' ),
							'name'     => 'min_value_auto_detect',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'max_value',
							'label'    => __( 'Max Value', 'wc-ajax-product-filter' ),
							'name'     => 'max_value',
							'default'  => '1000',
							'position' => 15,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'max_value_auto_detect',
							'label'    => __( 'Auto Detect', 'wc-ajax-product-filter' ),
							'name'     => 'max_value_auto_detect',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'step',
							'label'    => __( 'Step', 'wc-ajax-product-filter' ),
							'name'     => 'step',
							'default'  => '10',
							'position' => 15,
						),
					),
				),
			),
		);
	}

	private function ui_option_second_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-second',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-ui-option-row-second',
				'position'  => 40,
				'columns'   => array(
					array(
						array(
							'type'     => 'text',
							'id'       => 'value_prefix',
							'label'    => __( 'Value Prefix', 'wc-ajax-product-filter' ),
							'name'     => 'value_prefix',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'value_postfix',
							'label'    => __( 'Value Postfix', 'wc-ajax-product-filter' ),
							'name'     => 'value_postfix',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'values_separator',
							'label'    => __( 'Values Separator', 'wc-ajax-product-filter' ),
							'name'     => 'values_separator',
							'default'  => '-',
							'position' => 15,
						),
					),
				),
			),
		);
	}

	private function ui_option_third_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-third',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-decimal-fields number-ui-option-row-third',
				'position'  => 45,
				'columns'   => array(
					array(
						array(
							'type'     => 'text',
							'id'       => 'decimal_places',
							'label'    => __( 'Decimal Places', 'wc-ajax-product-filter' ),
							'name'     => 'decimal_places',
							'default'  => '0',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'thousand_separator',
							'label'    => __( 'Thousand Separator', 'wc-ajax-product-filter' ),
							'name'     => 'thousand_separator',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'text',
							'id'       => 'decimal_separator',
							'label'    => __( 'Decimal Separator', 'wc-ajax-product-filter' ),
							'name'     => 'decimal_separator',
							'default'  => '.',
							'position' => 15,
						),
					),
				),
			),
		);
	}

	/**
	 * The field group type.
	 *
	 * @return string
	 */
	protected function group_type() {
		return 'number';
	}

}
