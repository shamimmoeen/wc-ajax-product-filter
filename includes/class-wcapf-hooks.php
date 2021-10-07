<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter hooks class.
 *
 * @since  3.0.0
 * @author Mainul Hassan Main
 */
class WCAPF_Hooks {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'woocommerce_before_shop_loop', array( $this, 'insert_before_shop_loop' ), 0 );
		add_action( 'woocommerce_after_shop_loop', array( $this, 'insert_after_shop_loop' ), 200 );
		add_action( 'woocommerce_before_template_part', array( $this, 'insert_before_no_products' ), 0 );
		add_action( 'woocommerce_after_template_part', array( $this, 'insert_after_no_products' ), 200 );
		add_action( 'woocommerce_update_product', array( $this, 'delete_transients' ) );
	}

	/**
	 * HTML wrapper to insert after the not found product loops.
	 *
	 * @param string $template_name The template name
	 */
	public function insert_after_no_products( $template_name ) {
		if ( $template_name == 'loop/no-products-found.php' ) {
			echo '</div>';
		}
	}

	/**
	 * HTML wrapper to insert after the shop loop.
	 */
	public function insert_after_shop_loop() {
		echo '</div>';
	}

	/**
	 * HTML wrapper to insert before the not found product loops.
	 *
	 * @param string $template_name The template name
	 */
	public function insert_before_no_products( $template_name ) {
		if ( $template_name == 'loop/no-products-found.php' ) {
			echo '<div class="wcapf-before-products">';
		}
	}

	/**
	 * HTML wrapper to insert before the shop loop.
	 */
	public function insert_before_shop_loop() {
		echo '<div class="wcapf-before-products">';
	}

	/**
	 * TODO: Delete transients when product gets updated.
	 *
	 * @param $post_id
	 */
	public function delete_transients( $post_id ) {
		delete_transient( 'wcapf_term_product_counts_product_cat' );
	}

}
