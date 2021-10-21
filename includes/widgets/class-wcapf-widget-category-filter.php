<?php
/**
 * Category filter widget.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter by Category class.
 *
 * @since 1.0.0
 */
class WCAPF_Widget_Category_Filter extends WCAPF_Widget_Taxonomy {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter products by category.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-category-filter', // Base ID
			__( 'WC Ajax Product Filter by Category', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	protected function get_filter_key() {
		return 'product-cat';
	}

	protected function get_taxonomy() {
		return 'product_cat';
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_category_filter_widget() {
	register_widget( 'WCAPF_Widget_Category_Filter' );
}

add_action( 'widgets_init', 'wcapf_register_category_filter_widget' );
