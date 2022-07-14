<?php
/**
 * WCAPF_Field_Product_Status class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
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
		$text_field_group->set_advanced_appearance_supported();

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
							'type'     => 'hidden_manual_options',
							'table'    => '.product-status-options-table',
							'tmpl'     => 'wcapf-product-status-option',
							'id'       => 'product_status_options',
							'name'     => 'product_status_options',
							'position' => 20,
						),
						array(
							'type'     => 'html',
							'name'     => 'product_status_options_markup',
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
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$walker = new WCAPF_Walker( $field_instance );

		$filter = new WCAPF_Filter_Type_Product_Status( $field_instance );
		$items  = $filter->get_items();

		$classes = array( 'wcapf-nav-filter' );

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance, $items );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_filter_form( $field_instance );
	}

}
