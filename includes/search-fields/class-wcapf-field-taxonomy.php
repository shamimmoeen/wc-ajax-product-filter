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

}
