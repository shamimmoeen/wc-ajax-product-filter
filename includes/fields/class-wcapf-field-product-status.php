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
