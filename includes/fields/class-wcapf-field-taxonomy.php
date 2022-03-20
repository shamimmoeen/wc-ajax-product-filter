<?php
/**
 * WCAPF_Field_Taxonomy class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Taxonomy class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Field_Taxonomy extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$text_field_group = new WCAPF_Field_Group_Text();

		if ( $this->is_hierarchical() ) {
			$text_field_group->set_hierarchical();
		}

		if ( 'product_cat' === $this->taxonomy() ) {
			$text_field_group->set_taxonomy_has_image();
		}

		$text_field_group->set_advanced_appearance_supported();

		return $text_field_group->get_group_fields();
	}

	/**
	 * Checks if the taxonomy is hierarchical.
	 *
	 * @return bool
	 */
	private function is_hierarchical() {
		return is_taxonomy_hierarchical( $this->taxonomy() );
	}

	/**
	 * Abstract method to set the taxonomy.
	 *
	 * @return string
	 */
	abstract protected function taxonomy();

	/**
	 * Gets an array of taxonomy name and label, name => label.
	 *
	 * @param array $taxonomies The taxonomies array.
	 *
	 * @return array
	 */
	protected function get_taxonomy_options( $taxonomies ) {
		$options = array( '' => __( '-- Choose --', 'wc-ajax-product-filter' ) );

		foreach ( $taxonomies as $_taxonomy ) {
			$name                  = get_taxonomy( $_taxonomy )->labels->name;
			$taxonomy_label        = $name . ' (' . $_taxonomy . ')';
			$options[ $_taxonomy ] = $taxonomy_label;
		}

		return $options;
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

		$query_type         = $this->get_sub_field_value( 'query_type' );
		$enable_multiple    = $this->get_sub_field_value( 'enable_multiple' );
		$show_count         = $this->get_sub_field_value( 'show_count' );
		$hierarchical       = $this->get_sub_field_value( 'hierarchical' );
		$show_children_only = $this->get_sub_field_value( 'show_children_only' );
		$hide_empty         = $this->get_sub_field_value( 'hide_empty' );
		$display_type       = $this->get_sub_field_value( 'display_type' );

		$filter_key = $this->get_filter_key();
		$taxonomy   = $this->taxonomy();

		$field_filter_data = array(
			'taxonomy'           => $taxonomy,
			'query_type'         => $query_type,
			'hierarchical'       => $hierarchical,
			'show_children_only' => $show_children_only,
			'hide_empty'         => $hide_empty,
			'filter_key'         => $filter_key,
		);

		$filter = new WCAPF_Filter_Type_Taxonomy( $field_filter_data );
		$items  = $filter->get_items();

		$walker                  = new WCAPF_Walker();
		$walker->display_type    = $display_type;
		$walker->hierarchical    = $hierarchical;
		$walker->enable_multiple = $enable_multiple;
		$walker->query_type      = $query_type;
		$walker->show_count      = $show_count;
		$walker->filter_key      = $filter_key;

		$classes = array( 'wcapf-ajax-term-filter' );

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped // todo
		$this->after_filter_form();
	}

	/**
	 * Get the field's filter key.
	 *
	 * @return string
	 */
	protected function get_filter_key() {
		// TODO: Maybe move to the helper class.
		$filter_keys = WCAPF_Product_Filter_Utils::get_taxonomy_filter_keys();

		$query_type = $this->get_sub_field_value( 'query_type' );
		$taxonomy   = $this->taxonomy();

		return isset( $filter_keys[ $taxonomy ] ) ? $filter_keys[ $taxonomy ][ $query_type ] : '';
	}

}
