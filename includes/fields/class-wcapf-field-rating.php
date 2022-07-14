<?php
/**
 * WCAPF_Field_Rating class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
 */

/**
 * WCAPF_Field_Rating class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Rating extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$text_field_group = new WCAPF_Field_Group_Text();

		return $text_field_group->get_group_fields();
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'rating';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$walker = new WCAPF_Walker( $field_instance );

		if ( WCAPF_Helper::found_pro_version() ) {
			$_items = array();
		} else {
			$filter = new WCAPF_Filter_Type_Taxonomy( $field_instance );
			$_items = $filter->get_items();
		}

		$items = apply_filters( 'wcapf_rating_filter_items', $_items, $field_instance );

		$classes = array( 'wcapf-nav-filter' );

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance, $items );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_filter_form( $field_instance );
	}

}
