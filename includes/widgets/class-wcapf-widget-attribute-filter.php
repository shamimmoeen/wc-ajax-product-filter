<?php

/**
 * WC Ajax Product Filter by Attribute
 */
class WCAPF_Attribute_Filter_Widget extends WCAPF_Widget_Taxonomy {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter woocommerce products by attribute.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-attribute-filter', // Base ID
			__( 'WC Ajax Product Filter by Attribute', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	/**
	 * @return array
	 */
	protected function widget_fields() {
		$fields     = parent::widget_fields();
		$attributes = wc_get_attribute_taxonomy_names();
		$options    = $this->get_select_options( $attributes );

		return array_merge( $fields, array(
			array(
				'type'     => 'select',
				'id'       => 'taxonomy',
				'label'    => __( 'Taxonomy', 'wc-ajax-product-filter' ),
				'name'     => 'taxonomy',
				'position' => 6,
				'options'  => $options,
			),
		) );
	}

	/**
	 * Gets the taxonomy from widget settings.
	 *
	 * @return string
	 */
	protected function get_taxonomy() {
		$instances = $this->get_settings();
		$instance  = isset( $instances[ $this->number ] ) ? $instances[ $this->number ] : array();

		return isset( $instance['taxonomy'] ) ? sanitize_text_field( $instance['taxonomy'] ) : '';
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_attribute_filter_widget() {
	register_widget( 'WCAPF_Attribute_Filter_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_attribute_filter_widget' );
