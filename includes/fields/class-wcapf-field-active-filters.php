<?php
/**
 * WCAPF_Field_Active_Filters class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       Mainul Hassan Main
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
							'type'     => 'text',
							'id'       => 'clear_all_btn_title',
							'label'    => __( 'Clear All button title', 'wc-ajax-product-filter' ),
							'name'     => 'clear_all_btn_title',
							'default'  => __( 'Clear All', 'wc-ajax-product-filter' ),
							'position' => 20,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'show_if_empty',
							'label'    => __( 'Show if no filter is applied', 'wc-ajax-product-filter' ),
							'name'     => 'show_if_empty',
							'position' => 25,
						),
						array(
							'type'     => 'text',
							'id'       => 'empty_filter_message',
							'label'    => __( 'Empty filter message', 'wc-ajax-product-filter' ),
							'name'     => 'empty_filter_message',
							'default'  => __( 'No filter is applied.', 'wc-ajax-product-filter' ),
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
		$clear_btn_title      = $this->get_sub_field_value( 'clear_all_btn_title' );
		$show_if_empty        = $this->get_sub_field_value( 'show_if_empty' );
		$empty_filter_message = $this->get_sub_field_value( 'empty_filter_message' );

		$classes = array( 'wcapf-nav-filter' );

		$all_filters = WCAPF_Helper::get_active_filters_data();

		if ( ! $show_if_empty && ! $all_filters ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance );

		WCAPF_Template_Loader::get_instance()->load(
			'public/field-active-filters',
			array(
				'layout'               => $layout,
				'all_filters'          => $all_filters,
				'clear_btn_title'      => $clear_btn_title,
				'empty_filter_message' => $empty_filter_message,
			)
		);

		$this->after_filter_form( $field_instance );
	}

}
