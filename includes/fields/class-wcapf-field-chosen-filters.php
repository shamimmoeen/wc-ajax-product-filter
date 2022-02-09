<?php
/**
 * WCAPF_Field_Chosen_Filters class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Chosen_Filters class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Chosen_Filters extends WCAPF_Field {

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
		return 'chosen-filters';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		// TODO: Maybe redundant
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		$classes = array( 'wcapf-ajax-term-filter' );

		$this->before_filter_form( $classes );
		WCAPF_Template_Loader::get_instance()->load( 'public/field-chosen-filters' );
		$this->after_filter_form();
	}

}
