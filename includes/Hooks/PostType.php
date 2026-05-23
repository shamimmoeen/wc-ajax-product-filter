<?php
/**
 * Filter and form custom post-type registration.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Hooks
 * @author     Mainul Hassan
 */

namespace WCAPF\Hooks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the wcapf-filter and wcapf-form custom post types.
 */
class PostType {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	/**
	 * Registers the filter and form custom post types.
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		register_post_type(
			'wcapf-filter',
			array(
				'labels' => array(
					'name'          => _x( 'Filters', 'Post type general name', 'wc-ajax-product-filter' ),
					'singular_name' => _x( 'Filter', 'Post type singular name', 'wc-ajax-product-filter' ),
				),
				'public' => false,
			)
		);

		register_post_type(
			'wcapf-form',
			array(
				'labels' => array(
					'name'          => _x( 'Filter Forms', 'Post type general name', 'wc-ajax-product-filter' ),
					'singular_name' => _x( 'Filter Form', 'Post type singular name', 'wc-ajax-product-filter' ),
				),
				'public' => false,
			)
		);
	}
}
