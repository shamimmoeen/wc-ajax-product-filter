<?php
/**
 * Tag filter widget.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter by Tag
 *
 * @since 1.0.0
 */
class WCAPF_Tag_Filter_Widget extends WCAPF_Widget_Taxonomy {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter products by tag.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-tag-filter', // Base ID
			__( 'WC Ajax Product Filter by Tag', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	protected function get_filter_key() {
		return 'product-tag';
	}

	protected function get_taxonomy() {
		return 'product_tag';
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_tag_filter_widget() {
	register_widget( 'WCAPF_Tag_Filter_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_tag_filter_widget' );
