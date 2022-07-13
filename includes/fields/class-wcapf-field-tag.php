<?php
/**
 * WCAPF_Field_Tag class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
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
