<?php
/**
 * WCAPF_Field_Custom_Taxonomy class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage search-fields
 */

/**
 * WCAPF_Field_Custom_Taxonomy class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Custom_Taxonomy extends WCAPF_Field_Taxonomy {

	/**
	 * The field's subfields.
	 *
	 * @return array
	 */
	public function sub_fields() {
		$fields     = parent::sub_fields();
		$taxonomies = get_object_taxonomies( 'product' );
		$excluded   = array_merge( wc_get_attribute_taxonomy_names(), array( 'product_cat', 'product_tag' ) );
		$allowed    = array_diff( $taxonomies, $excluded );
		$options    = $this->get_taxonomy_options( $allowed );

		return array_merge(
			$fields,
			array(
				array(
					'type'     => 'select',
					'id'       => 'taxonomy',
					'label'    => __( 'Taxonomy', 'wc-ajax-product-filter' ),
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
		return 'custom-taxonomy';
	}

}
