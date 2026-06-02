<?php
/**
 * Result-set tests for the price and product-status filters.
 *
 * Uses real WooCommerce products (so the price lookup table and visibility terms
 * are populated), then asserts which products a selection returns.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @group result-set
 */
class PriceStatusTest extends BehaviorTestCase {

	/**
	 * Price filter spec keyed "price".
	 *
	 * @return array
	 */
	private function price_filter(): array {
		return array(
			'key'   => 'price',
			'type'  => 'price',
			'field' => array( 'type' => 'price' ),
		);
	}

	/**
	 * Product-status filter spec keyed "product_status".
	 *
	 * @return array
	 */
	private function status_filter( string $query_type = 'or' ): array {
		return array(
			'key'   => 'product_status',
			'type'  => 'product-status',
			'field' => array(
				'type'       => 'product-status',
				'query_type' => $query_type,
			),
		);
	}

	public function test_price_range_returns_products_in_range() {
		$cheap  = $this->make_wc_product( array( 'regular_price' => 10 ) );
		$mid    = $this->make_wc_product( array( 'regular_price' => 50 ) );
		$pricey = $this->make_wc_product( array( 'regular_price' => 100 ) );

		$this->make_form( array( $this->price_filter() ) );
		$this->set_selection( array( 'price' => '10~50' ) );

		$this->assertEqualsCanonicalizing( array( $cheap, $mid ), $this->matching_product_ids() );

		$this->set_selection( array( 'price' => '60~120' ) );

		$this->assertSame( array( $pricey ), $this->matching_product_ids() );
	}

	public function test_featured_status_returns_only_featured() {
		$featured = $this->make_wc_product( array( 'regular_price' => 30, 'featured' => true ) );
		$this->make_wc_product( array( 'regular_price' => 30 ) );

		$this->make_form( array( $this->status_filter() ) );
		$this->set_selection( array( 'product_status' => 'featured' ) );

		$this->assertSame( array( $featured ), $this->matching_product_ids() );
	}

	public function test_on_sale_status_returns_only_on_sale() {
		$on_sale = $this->make_wc_product( array( 'regular_price' => 20, 'sale_price' => 10 ) );
		$this->make_wc_product( array( 'regular_price' => 20 ) );

		$this->make_form( array( $this->status_filter() ) );
		$this->set_selection( array( 'product_status' => 'on_sale' ) );

		$this->assertSame( array( $on_sale ), $this->matching_product_ids() );
	}

	public function test_price_range_boundaries_are_inclusive() {
		$at_min = $this->make_wc_product( array( 'regular_price' => 10 ) );
		$at_max = $this->make_wc_product( array( 'regular_price' => 50 ) );
		$this->make_wc_product( array( 'regular_price' => 9 ) );  // Just below.
		$this->make_wc_product( array( 'regular_price' => 51 ) ); // Just above.

		$this->make_form( array( $this->price_filter() ) );
		$this->set_selection( array( 'price' => '10~50' ) );

		$this->assertEqualsCanonicalizing( array( $at_min, $at_max ), $this->matching_product_ids() );
	}

	public function test_status_match_any_featured_or_on_sale() {
		$featured = $this->make_wc_product( array( 'regular_price' => 30, 'featured' => true ) );
		$on_sale  = $this->make_wc_product( array( 'regular_price' => 20, 'sale_price' => 10 ) );
		$both     = $this->make_wc_product( array( 'regular_price' => 20, 'sale_price' => 10, 'featured' => true ) );
		$this->make_wc_product( array( 'regular_price' => 30 ) ); // Neither.

		$this->make_form( array( $this->status_filter( 'or' ) ) );
		$this->set_selection( array( 'product_status' => 'featured,on_sale' ) );

		$this->assertEqualsCanonicalizing( array( $featured, $on_sale, $both ), $this->matching_product_ids() );
	}

	public function test_status_match_all_featured_and_on_sale() {
		$this->make_wc_product( array( 'regular_price' => 30, 'featured' => true ) );      // Featured only.
		$this->make_wc_product( array( 'regular_price' => 20, 'sale_price' => 10 ) );       // On-sale only.
		$both = $this->make_wc_product( array( 'regular_price' => 20, 'sale_price' => 10, 'featured' => true ) );

		$this->make_form( array( $this->status_filter( 'and' ) ) );
		$this->set_selection( array( 'product_status' => 'featured,on_sale' ) );

		$this->assertSame( array( $both ), $this->matching_product_ids() );
	}
}
