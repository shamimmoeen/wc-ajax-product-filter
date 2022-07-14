<?php
/**
 * WCAPF_Field_Price class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
 */

/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Price extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$number_field_group = new WCAPF_Field_Group_Number();

		return $number_field_group->get_group_fields();
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'price';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );
		$display_type   = $field_instance->display_type;

		$walker = new WCAPF_Walker( $field_instance );

		$range_number_filters = WCAPF_Helper::range_number_filter_types();

		$classes = array();

		if ( in_array( $display_type, $range_number_filters ) ) {
			$classes[] = 'wcapf-number-range-filter';
		} else {
			$classes[] = 'wcapf-nav-filter';
		}

		$items = apply_filters( 'wcapf_price_filter_items', array(), $field_instance );

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance, $items );

		if ( in_array( $display_type, $range_number_filters ) ) {
			$this->render_range_number_filter( $field_instance, $items );
		} else {
			echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		}

		$this->after_filter_form( $field_instance );
	}

}
