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

		$instance = $this->get_instance();
		$form_id  = 1;

		$display_type       = $this->get_sub_field_value( 'display_type' );
		$all_items_label    = $this->get_sub_field_value( 'all_items_label' );
		$query_type         = $this->get_sub_field_value( 'query_type' );
		$enable_multiple    = boolval( $this->get_sub_field_value( 'enable_multiple_filter' ) );
		$use_chosen         = boolval( $this->get_sub_field_value( 'use_chosen' ) );
		$no_results_message = $this->get_sub_field_value( 'chosen_no_results_message' );
		$show_count         = boolval( $this->get_sub_field_value( 'show_count' ) );
		$hierarchical       = boolval( $this->get_sub_field_value( 'hierarchical' ) );
		$show_children_only = boolval( $this->get_sub_field_value( 'show_children_only' ) ); // todo: remove
		$hide_empty         = boolval( $this->get_sub_field_value( 'hide_empty' ) );
		$inline_display     = boolval( $this->get_sub_field_value( 'inline_display' ) );
		$position           = $this->get_sub_field_value( 'position' );

		$enable_hierarchy_accordion = boolval( $this->get_sub_field_value( 'enable_hierarchy_accordion' ) );
		$custom_appearance_options  = $this->get_sub_field_value( 'custom_appearance_options' );

		switch ( $display_type ) {
			case 'multiselect':
			case 'checkbox':
				$enable_multiple = true;
				break;

			case 'select':
			case 'radio':
				$enable_multiple = false;
				$query_type      = 'or';
				break;
		}

		$enable_multiple = apply_filters( 'wcapf_field_taxonomy_enable_multiple', $enable_multiple, $instance );
		$query_type      = apply_filters( 'wcapf_field_taxonomy_query_type', $query_type, $instance );

		$filter_key  = $this->get_filter_key();
		$filter_type = 'taxonomy';
		$taxonomy    = $this->taxonomy();

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

		if ( 'radio' === $display_type || 'select' === $display_type || ( 'multi-select' === $display_type && $use_chosen ) ) {
			if ( ! $all_items_label ) {
				switch ( $this->type() ) {
					case 'category':
						$all_items_label = __( 'All categories', 'wc-ajax-product-filter' );
						break;

					case 'tag':
						$all_items_label = __( 'All tags', 'wc-ajax-product-filter' );
						break;
				}
			}

			if ( 'multi-select' !== $display_type ) {
				$all_items = array(
					0 => array(
						'id'        => '',
						'name'      => $all_items_label,
						'count'     => '-1',
						'parent_id' => 0,
						'depth'     => 0,
					)
				);

				$items = array_merge( $all_items, $items );
			}
		}

		$walker                             = new WCAPF_Walker();
		$walker->display_type               = $display_type;
		$walker->all_items_label            = $all_items_label;
		$walker->use_chosen                 = $use_chosen;
		$walker->no_results_message         = $no_results_message;
		$walker->hierarchical               = $hierarchical;
		$walker->enable_multiple            = $enable_multiple;
		$walker->query_type                 = $query_type;
		$walker->show_count                 = $show_count;
		$walker->inline_display             = $inline_display;
		$walker->filter_key                 = $filter_key;
		$walker->filter_type                = $filter_type;
		$walker->form_id                    = $form_id;
		$walker->position                   = $position;
		$walker->enable_hierarchy_accordion = $enable_hierarchy_accordion;
		$walker->custom_appearance_options  = $custom_appearance_options;

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

		$query_type      = $this->get_sub_field_value( 'query_type' );
		$display_type    = $this->get_sub_field_value( 'display_type' );
		$enable_multiple = $this->get_sub_field_value( 'enable_multiple_filter' );

		if ( 'radio' === $display_type || 'select' === $display_type ) {
			$query_type = 'or';
		} elseif ( ! $enable_multiple ) {
			$query_type = 'or';
		}

		$taxonomy = $this->taxonomy();

		return isset( $filter_keys[ $taxonomy ] ) ? $filter_keys[ $taxonomy ][ $query_type ] : '';
	}

}
