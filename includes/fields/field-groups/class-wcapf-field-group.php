<?php
/**
 * WCAPF_Field_Group class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields/field-groups
 * @author     wptools.io
 */

/**
 * WCAPF_Field_Group class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Field_Group {

	/**
	 * Gets the group fields.
	 *
	 * @return array
	 */
	public function get_group_fields() {
		$type = $this->group_type();

		return apply_filters( 'wcapf_get_group_field_' . $type, $this->set_group_fields() );
	}

	/**
	 * The extended classes should set the group type.
	 *
	 * @return string
	 */
	abstract protected function group_type();

	/**
	 * The child class must override this method and sets the group fields.
	 *
	 * @return array
	 */
	abstract protected function set_group_fields();

}
