<?php
/**
 * WCAPF_Walker_Post_Meta class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Walker_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Walker_Post_Meta extends WCAPF_Walker {

	/**
	 * The post meta.
	 *
	 * @var string
	 */
	public $post_meta;

	/**
	 * The type of post meta.
	 *
	 * @var string
	 */
	public $value_type;

	/**
	 * The way of getting the options.
	 *
	 * @var string
	 */
	public $get_options;

}
