<?php
/**
 * WCAPF_Field_Reset_Button class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage search-fields
 */

/**
 * WCAPF_Field_Reset_Button class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Reset_Button extends WCAPF_Field {

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'reset-button';
	}

}
