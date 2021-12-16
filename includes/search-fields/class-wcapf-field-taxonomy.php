<?php
/**
 * WCAPF_Field_Taxonomy class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/search-fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Taxonomy class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Field_Taxonomy extends WCAPF_Field {

	/**
	 * The field's subfields.
	 *
	 * @return array|array[]
	 */
	protected function sub_fields() {
		$fields = array(
			array(
				'type'     => 'text',
				'id'       => 'title',
				'label'    => __( 'Title', 'wc-ajax-product-filter' ),
				'name'     => 'title',
				'position' => 5,
			),
			array(
				'type'     => 'select',
				'id'       => 'display_type',
				'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
				'name'     => 'display_type',
				'options'  => array(
					'list'     => __( 'List', 'wc-ajax-product-filter' ),
					'dropdown' => __( 'Dropdown', 'wc-ajax-product-filter' ),
				),
				'position' => 10,
			),
			array(
				'type'     => 'select',
				'id'       => 'query_type',
				'label'    => __( 'Query Type', 'wc-ajax-product-filter' ),
				'name'     => 'query_type',
				'options'  => array(
					'and' => __( 'AND', 'wc-ajax-product-filter' ),
					'or'  => __( 'OR', 'wc-ajax-product-filter' ),
				),
				'position' => 15,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'enable_multiple',
				'label'    => __( 'Enable multiple filter', 'wc-ajax-product-filter' ),
				'name'     => 'enable_multiple',
				'position' => 20,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'show_count',
				'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
				'name'     => 'show_count',
				'position' => 25,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'hide_empty',
				'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
				'name'     => 'hide_empty',
				'position' => 40,
			),
		);

		if ( $this->is_hierarchical() ) {
			$fields = array_merge(
				$fields,
				array(
					array(
						'type'     => 'checkbox',
						'id'       => 'hierarchical',
						'label'    => __( 'Show hierarchy', 'wc-ajax-product-filter' ),
						'name'     => 'hierarchical',
						'position' => 30,
					),
					array(
						'type'     => 'checkbox',
						'id'       => 'show_children_only',
						'label'    => __( 'Only show children of the current', 'wc-ajax-product-filter' ),
						'name'     => 'show_children_only',
						'position' => 35,
					),
				)
			);
		}

		return $fields;
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

		$walker = new WCAPF_Taxonomy_Walker();

		$walker->taxonomy        = $taxonomy;
		$walker->display_type    = $display_type;
		$walker->query_type      = $query_type;
		$walker->enable_multiple = $enable_multiple;
		$walker->show_count      = $show_count;
		$walker->hide_empty      = $hide_empty;
		$walker->filter_key      = $filter_key;

		if ( is_taxonomy_hierarchical( $taxonomy ) ) {
			$walker->hierarchical       = $hierarchical;
			$walker->show_children_only = $show_children_only;
		} else {
			$walker->hierarchical       = false;
			$walker->show_children_only = false;
		}

		$taxonomy = new WCAPF_Taxonomy( $walker );
		$terms    = $taxonomy->get_terms();

		if ( $terms ) {
			echo $walker->build_menu( $terms ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Get the field's filter key.
	 *
	 * @return string
	 */
	protected function get_filter_key() {
		$utils       = new WCAPF_Utils(); // TODO: Maybe move to the helper class.
		$filter_keys = $utils->get_taxonomy_filter_keys();

		$query_type = $this->get_sub_field_value( 'query_type' );
		$taxonomy   = $this->taxonomy();

		return isset( $filter_keys[ $taxonomy ] ) ? $filter_keys[ $taxonomy ][ $query_type ] : '';
	}

}
