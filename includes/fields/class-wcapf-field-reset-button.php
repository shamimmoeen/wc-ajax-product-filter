<?php
/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
 */

/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Reset_Button extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		return array(
			array(
				'name'     => 'reset_button_group',
				'position' => 20,
				'columns'  => array(
					array(
						array(
							'type'     => 'text',
							'id'       => 'reset_button_label',
							'label'    => __( 'Button label', 'wc-ajax-product-filter' ),
							'name'     => 'reset_button_label',
							'default'  => __( 'Reset', 'wc-ajax-product-filter' ),
							'position' => 20,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'show_if_empty',
							'label'    => __( 'Show if no filter is applied', 'wc-ajax-product-filter' ),
							'name'     => 'show_if_empty',
							'position' => 25,
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
		return 'reset-button';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$button_label  = $this->get_sub_field_value( 'reset_button_label' );
		$show_if_empty = $this->get_sub_field_value( 'show_if_empty' );

		$classes = array( 'wcapf-nav-filter' );

		$all_filters = WCAPF_Helper::get_active_filters_data();

		if ( ! $show_if_empty && ! $all_filters ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance );
		WCAPF_Template_Loader::get_instance()->load(
			'public/field-reset-filters',
			array( 'button_label' => $button_label )
		);
		$this->after_filter_form( $field_instance );
	}

}
