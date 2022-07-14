<?php
/**
 * WCAPF_Field_Active_Filters class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
 */

/**
 * WCAPF_Field_Active_Filters class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Active_Filters extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		return array(
			array(
				'name'     => 'active_filters_group',
				'position' => 20,
				'columns'  => array(
					array(
						array(
							'type'     => 'radio',
							'id'       => 'active_filters_layout',
							'label'    => __( 'Layout', 'wc-ajax-product-filter' ),
							'name'     => 'active_filters_layout',
							'options'  => array(
								'simple'   => __( 'Simple', 'wc-ajax-product-filter' ),
								'extended' => __( 'Extended (group by filter)', 'wc-ajax-product-filter' ),
							),
							'default'  => 'simple',
							'position' => 15,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'enable_clear_all_button',
							'label'    => __( 'Enable button to clear all filters', 'wc-ajax-product-filter' ),
							'name'     => 'enable_clear_all_button',
							'default'  => '1',
							'position' => 20,
						),
						array(
							'type'     => 'column-start',
							'id'       => 'clear_all_button_fields_start',
							'name'     => 'clear_all_button_fields_start',
							'classes'  => 'clear-all-button-fields-start',
							'position' => 25,
						),
						array(
							'type'     => 'text',
							'id'       => 'clear_all_button_label',
							'label'    => __( 'Clear All button label', 'wc-ajax-product-filter' ),
							'name'     => 'clear_all_button_label',
							'default'  => __( 'Clear All', 'wc-ajax-product-filter' ),
							'position' => 30,
						),
						array(
							'type'     => 'column-end',
							'id'       => 'clear_all_button_fields_end',
							'name'     => 'clear_all_button_fields_end',
							'position' => 40,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'show_if_empty',
							'label'    => __( 'Show if no filter is applied', 'wc-ajax-product-filter' ),
							'name'     => 'show_if_empty',
							'position' => 45,
						),
						array(
							'type'     => 'text',
							'id'       => 'empty_filter_message',
							'label'    => __( 'Empty filter message', 'wc-ajax-product-filter' ),
							'name'     => 'empty_filter_message',
							'default'  => __( 'No filter is applied.', 'wc-ajax-product-filter' ),
							'position' => 50,
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
		return 'active-filters';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$layout               = $this->get_sub_field_value( 'active_filters_layout' );
		$clear_all_btn_label  = $this->get_sub_field_value( 'clear_all_button_label' );
		$show_if_empty        = $this->get_sub_field_value( 'show_if_empty' );
		$empty_filter_message = $this->get_sub_field_value( 'empty_filter_message' );

		$classes = array( 'wcapf-nav-filter' );

		if ( 'simple' === $layout ) {
			$all_filters = WCAPF_Helper::get_active_filters_data( true );
		} else {
			$all_filters = WCAPF_Helper::get_active_filters_data();
		}

		if ( ! $show_if_empty && ! $all_filters ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance, $all_filters );

		WCAPF_Template_Loader::get_instance()->load(
			'public/field-active-filters',
			array(
				'field_instance'       => $field_instance,
				'layout'               => $layout,
				'all_filters'          => $all_filters,
				'clear_all_btn_label'  => $clear_all_btn_label,
				'empty_filter_message' => $empty_filter_message,
			)
		);

		$this->after_filter_form( $field_instance );
	}

}
