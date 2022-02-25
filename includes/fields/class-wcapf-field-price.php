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

	protected function sub_fields() {
		$sub_fields   = array();
		$group_fields = $this->group_fields();

		foreach ( $group_fields as $group_field ) {
			$columns = isset( $group_field['columns'] ) ? $group_field['columns'] : array();

			foreach ( $columns as $column ) {
				foreach ( $column as $column_field ) {
					$sub_fields[] = $column_field;
				}
			}
		}

		return $sub_fields;
	}

	protected function group_fields() {
		return array_merge(
			$this->fields_title_group(),
			$this->fields_display_type_group(),
			$this->fields_get_option_group(),
			$this->fields_number_manual_options_group(),
			$this->fields_ui_option_group(),
			$this->fields_ui_option_first_row_group(),
			$this->fields_ui_option_second_row_group(),
			$this->fields_ui_option_third_row_group()
		);
	}

	private function fields_title_group() {
		return array(
			array(
				'name'     => 'title',
				'position' => 5,
				'columns'  => array(
					array(
						array(
							'type'     => 'text',
							'id'       => 'title',
							'label'    => __( 'Title', 'wc-ajax-product-filter' ),
							'name'     => 'title',
							'position' => 5,
						),
					),
				),
			),
		);
	}

	private function fields_display_type_group() {
		return array(
			array(
				'name'     => 'display_type',
				'class'    => 'separator-top',
				'position' => 5,
				'columns'  => array(
					array(
						array(
							'type'     => 'select',
							'id'       => 'number_display_type',
							'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
							'name'     => 'number_display_type',
							'options'  => array(
								'range_slider'      => __( 'Range - Slider', 'wc-ajax-product-filter' ),
								'range_number'      => __( 'Range - Number', 'wc-ajax-product-filter' ),
								'range_checkbox'    => __( 'Range - Checkbox', 'wc-ajax-product-filter' ),
								'range_radio'       => __( 'Range - Radio', 'wc-ajax-product-filter' ),
								'range_select'      => __( 'Range - Select', 'wc-ajax-product-filter' ),
								'range_multiselect' => __( 'Range - Multi select', 'wc-ajax-product-filter' ),
							),
							'position' => 15,
						),
						array(
							'type'     => 'radio',
							'id'       => 'number_range_slider_display_values_as',
							'label'    => __( 'Display values as', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_slider_display_values_as',
							'options'  => array(
								'input_field' => __( 'Input Field', 'wc-ajax-product-filter' ),
								'plain_text'  => __( 'Plain Text', 'wc-ajax-product-filter' ),
							),
							'default'  => 'input_field',
							'position' => 15,
						),
						array(
							'type'     => 'radio',
							'id'       => 'number_range_checkbox_query_type',
							'label'    => __( 'Query Type', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_checkbox_query_type',
							'options'  => array(
								'and' => __( 'AND', 'wc-ajax-product-filter' ),
								'or'  => __( 'OR', 'wc-ajax-product-filter' ),
							),
							'default'  => 'and',
							'position' => 15,
						),
						array(
							'type'     => 'text',
							'id'       => 'number_range_select_all_items_label',
							'label'    => __( 'Change All Items Label', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_select_all_items_label',
							'position' => 15,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'number_range_use_chosen',
							'label'    => __( 'Use jQuery Chosen Library', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_use_chosen',
							'position' => 15,
						),
						array(
							'type'     => 'text',
							'id'       => 'number_range_chosen_no_results_message',
							'label'    => __( 'No results message', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_chosen_no_results_message',
							'position' => 15,
						),
					),
					array(
						array(
							'type'     => 'checkbox',
							'id'       => 'number_range_show_count',
							'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_show_count',
							'position' => 20,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'number_range_hide_empty',
							'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
							'name'     => 'number_range_hide_empty',
							'position' => 20,
						),
					),
				),
			),
		);
	}

	private function fields_get_option_group() {
		return array(
			array(
				'name'     => 'options',
				'heading'  => __( 'Options', 'wc-ajax-product-filter' ),
				'class'    => 'separator-top get-options',
				'position' => 5,
				'columns'  => array(
					array(
						array(
							'type'     => 'radio',
							'id'       => 'number_get_options',
							'label'    => __( 'Get options', 'wc-ajax-product-filter' ),
							'name'     => 'number_get_options',
							'options'  => array(
								'automatically' => __( 'Automatically', 'wc-ajax-product-filter' ),
								'manual_entry'  => __( 'Manual Entry', 'wc-ajax-product-filter' ),
							),
							'default'  => 'manual_entry',
							'position' => 25,
						),
						array(
							'type'     => 'hidden',
							'id'       => 'number_manual_options',
							'name'     => 'number_manual_options',
							'position' => 26,
						),
					),
				),
			),
		);
	}

	private function fields_number_manual_options_group() {
		return array(
			array(
				'name'     => 'manual-options',
				'class'    => 'get-options',
				'position' => 5,
				'columns'  => array(
					array(
						array(
							'type'     => 'html',
							'name'     => 'number_manual_options',
							// TODO: Might need to change
							'template' => 'admin/field-templates/input-type-number-manual-options',
							'position' => 25,
						),
					),
				),
			),
		);
	}

	private function fields_ui_option_group() {
		return array(
			array(
				'name'     => 'ui-options',
				'heading'  => __( 'UI Options', 'wc-ajax-product-filter' ),
				'class'    => 'separator-top number-automatic-options',
				'position' => 5,
			),
		);
	}

	private function fields_ui_option_first_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-first',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-ui-option-row-first',
				'position'  => 5,
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

	private function fields_ui_option_second_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-second',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-ui-option-row-second',
				'position'  => 5,
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

	private function fields_ui_option_third_row_group() {
		return array(
			array(
				'name'      => 'number-ui-option-row-third',
				'class'     => 'number-automatic-options',
				'row_class' => 'ui-options-row number-decimal-fields number-ui-option-row-third',
				'position'  => 5,
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

	protected function render_field() {
		$groups = wp_list_sort( $this->group_fields(), 'position' );

		$instance    = $this->get_instance();
		$field_index = $this->get_field_index();
		$type        = $this->type();

		$field_name_prefix = 'wcapf-fields[' . $type . '][' . $field_index . ']';

		echo '<div class="wcapf-form-field wcapf-form-field-' . esc_attr( $type ) . '">';

		// TODO: Add hook.
		do_action( 'wcapf_before_render_field_subfields', $type, $instance );

		if ( $groups ) {

			foreach ( $groups as $group ) {
				$group_name    = isset( $group['name'] ) ? $group['name'] : '';
				$group_heading = isset( $group['heading'] ) ? $group['heading'] : '';
				$group_class   = isset( $group['class'] ) ? $group['class'] : '';
				$row_class     = isset( $group['row_class'] ) ? $group['row_class'] : '';
				$group_columns = isset( $group['columns'] ) ? $group['columns'] : array();
				$group_classes = 'column-start column-group-' . $group_name;

				$group_classes .= $group_class ? ' ' . $group_class : '';

				echo '<div class="' . esc_attr( $group_classes ) . '">';

				if ( $group_heading ) {
					echo '<h4 class="no-top-margin">' . esc_html( $group_heading ) . '</h4>';
				}

				if ( $group_columns ) {
					$row_classes = 'column-start row';

					$row_classes .= $row_class ? ' ' . $row_class : '';

					echo '<div class="' . $row_classes . '">';

					// TODO: Add hook.
					do_action( 'wcapf_before_render_field_row', $type, $instance );

					foreach ( $group_columns as $columns ) {
						$columns = wp_list_sort( $columns, 'position' );

						echo '<div class="column-start column">';
						$this->render_sub_fields( $columns, $field_index, $instance, $field_name_prefix );
						echo '</div>';
					}

					// TODO: Add hook.
					do_action( 'wcapf_after_render_field_row', $type, $instance );

					echo '</div>';
				}

				echo '</div>';
			}

		} else {
			echo '<p class="wcapf-form-field-no-settings">';
			esc_html_e( 'No settings are required.', 'wc-ajax-product-filter' );
			echo '</p>';
		}

		// TODO: Add hook.
		do_action( 'wcapf_after_render_field_subfields', $type, $instance );

		$this->get_field_position_input( $field_name_prefix );

		echo '</div>';
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'price';
	}

	protected function render_filter_form() {
		echo 'render the price filter';
	}

}
