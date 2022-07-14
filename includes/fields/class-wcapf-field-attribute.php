<?php
/**
 * WCAPF_Field_Attribute class.
 *
 * @since        3.0.0
 * @package      wc-ajax-product-filter
 * @subpackage   wc-ajax-product-filter/includes/fields
 * @author       wptools.io
 * @noinspection PhpUnused
 */

/**
 * WCAPF_Field_Attribute class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Attribute extends WCAPF_Field_Taxonomy {

	/**
	 * Extend the title group by adding the attribute select field.
	 *
	 * @return array[]
	 */
	protected function title_group_columns() {
		$_group_columns = parent::title_group_columns();

		$attributes = wc_get_attribute_taxonomy_names();
		$options    = $this->get_taxonomy_options( $attributes );

		$_group_columns[] = array(
			'type'     => 'select',
			'id'       => 'taxonomy',
			'label'    => __( 'Attribute', 'wc-ajax-product-filter' ),
			'name'     => 'taxonomy',
			'position' => 10,
			'options'  => $options,
		);

		return $_group_columns;
	}

	/**
	 * The taxonomy.
	 *
	 * @return string
	 */
	protected function taxonomy() {
		$instance = $this->get_instance();

		return isset( $instance['taxonomy'] ) ? sanitize_text_field( $instance['taxonomy'] ) : '';
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'attribute';
	}

}
