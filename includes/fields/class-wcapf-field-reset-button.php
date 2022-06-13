<?php
/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       Mainul Hassan Main
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
							'id'       => 'btn_title',
							'label'    => __( 'Button title', 'wc-ajax-product-filter' ),
							'name'     => 'btn_title',
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

	protected function render_filter_form() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$btn_title     = $this->get_sub_field_value( 'btn_title' );
		$show_if_empty = $this->get_sub_field_value( 'show_if_empty' );

		$classes = array( 'wcapf-nav-filter' );

		$all_filters = WCAPF_Helper::get_active_filters_data();

		if ( ! $show_if_empty && ! $all_filters ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance );
		WCAPF_Template_Loader::get_instance()->load(
			'public/field-reset-filters',
			array( 'btn_title' => $btn_title )
		);
		$this->after_filter_form( $field_instance );
	}
}
