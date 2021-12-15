<?php
/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/search-fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Reset_Button extends WCAPF_Field {

	/**
	 * The field's subfields.
	 *
	 * @return array|array[]
	 */
	protected function sub_fields() {
		return array(
			array(
				'type'     => 'text',
				'id'       => 'title',
				'label'    => __( 'Title', 'wc-ajax-product-filter' ),
				'name'     => 'title',
				'position' => 5,
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

}
