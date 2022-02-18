<?php
/**
 * WCAPF_Field_Attribute class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Attribute class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Attribute extends WCAPF_Field_Taxonomy {

	/**
	 * The field's subfields.
	 *
	 * @return array
	 */
	protected function sub_fields() {
		$fields     = parent::sub_fields();
		$attributes = wc_get_attribute_taxonomy_names();
		$options    = $this->get_taxonomy_options( $attributes );

		return array_merge(
			$fields,
			array(
				array(
					'type'     => 'select',
					'id'       => 'taxonomy',
					'label'    => __( 'Attribute', 'wc-ajax-product-filter' ),
					'name'     => 'taxonomy',
					'position' => 6,
					'options'  => $options,
				),
			)
		);
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
