<?php
/**
 * The product prices generator class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Product_Prices_Generator class.
 */
class WCAPF_Product_Prices_Generator {

	/**
	 * The constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_generate_product_prices', array( $this, 'generate_product_prices_via_ajax' ) );
	}

	/**
	 * Generates the product prices with and without taxes via ajax.
	 *
	 * @return void
	 */
	public function generate_product_prices_via_ajax() {
		$success   = 'false';
		$message   = '';
		$status    = 'incomplete';
		$data      = array();
		$per_batch = apply_filters( 'wcapf_generate_product_prices_per_batch', 10 );

		$nonce_verified = check_ajax_referer(
			'generate_product_prices_nonce',
			'generate_product_prices_nonce_field',
			false
		);

		if ( $nonce_verified ) {
			ignore_user_abort( true );

			if ( ! ini_get( 'safe_mode' ) ) {
				@set_time_limit( 0 );
			}

			$page  = isset( $_POST['page'] ) ? absint( $_POST['page'] ) : 1;
			$count = isset( $_POST['count'] ) ? absint( $_POST['count'] ) : 0;

			$args = array(
				'paginate' => true,
				'page'     => $page,
				'limit'    => $per_batch,
			);

			$results        = wc_get_products( $args );
			$total_products = $results->total;
			$max_pages      = $results->max_num_pages;

			if ( $page <= $max_pages ) {
				foreach ( $results->products as $product ) {
					$this->store_product_prices( $product );
					$count ++;
				}

				// calculate percentage
				$percentage = floor( ( $count / $total_products ) * 100 );

				$page ++;

				$data = array(
					'page'           => $page,
					'count'          => $count,
					'total_products' => $total_products,
					'status'         => $status,
					'percentage'     => $percentage,
				);
			} else {
				$data = array(
					'page'           => $page,
					'count'          => $count,
					'total_products' => $total_products,
					'status'         => 'complete',
					'percentage'     => 100,
				);

				// Determines if we generated the product prices earlier.
				update_option( WCAPF_Helper::product_prices_generated_option_key(), '1' );

				$message = __( 'Product prices generated successfully!', 'wc-ajax-product-filter' );
			}

			$success = 'true';
		} else {
			$message = __( 'Nonce verification failed.', 'wc-ajax-product-filter' );
		}

		$response = array(
			'success' => $success,
			'message' => $message,
			'data'    => $data,
		);

		wp_send_json( $response );
	}

	/**
	 * Get the product price with and without tax then store them in the metadata table.
	 *
	 * @param WC_Product $product The product object.
	 *
	 * @return void
	 */
	private function store_product_prices( $product ) {
		$product_id     = $product->get_id();
		$price_incl_tax = wc_get_price_including_tax( $product );
		$price_excl_tax = wc_get_price_excluding_tax( $product );

		update_post_meta( $product_id, WCAPF_Helper::meta_key_for_price_including_tax(), $price_incl_tax );
		update_post_meta( $product_id, WCAPF_Helper::meta_key_for_price_excluding_tax(), $price_excl_tax );
	}

}

if ( is_admin() ) {
	new WCAPF_Product_Prices_Generator();
}
