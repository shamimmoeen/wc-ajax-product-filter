<?php
/**
 * WCAPF_Custom_Taxonomy_Filter_Widget class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Custom_Taxonomy_Filter_Widget class.
 *
 * TODO: Move to pro version.
 *
 * @since 1.0.0
 */
class WCAPF_Custom_Taxonomy_Filter_Widget extends WCAPF_Widget_Taxonomy {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter products by custom taxonomy.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-custom-taxonomy-filter', // Base ID
			__( 'WC Ajax Product Filter by Custom Taxonomy', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	/**
	 * @return array
	 */
	protected function widget_fields() {
		$fields     = parent::widget_fields();
		$taxonomies = get_object_taxonomies( 'product' );
		$excluded   = array_merge( wc_get_attribute_taxonomy_names(), array( 'product_cat', 'product_tag', ) );
		$allowed    = array_diff( $taxonomies, $excluded );
		$options    = $this->get_taxonomy_options( $allowed );

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
function wcapf_register_custom_taxonomy_filter_widget() {
	register_widget( 'WCAPF_Custom_Taxonomy_Filter_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_custom_taxonomy_filter_widget' );
