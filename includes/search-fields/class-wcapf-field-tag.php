<?php
/**
 * WCAPF_Field_Tag class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage search-fields
 */

/**
 * WCAPF_Field_Tag class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Tag extends WCAPF_Field_Taxonomy {

	/**
	 * The taxonomy.
	 *
	 * @return string
	 */
	protected function taxonomy() {
		return 'product_tag';
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'tag';
	}

}
