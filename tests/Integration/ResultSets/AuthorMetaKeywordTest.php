<?php
/**
 * Result-set tests for the post-author, post-meta (exact value), and keyword filters.
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
class AuthorMetaKeywordTest extends BehaviorTestCase {

	public function test_post_author_filter_returns_that_authors_products() {
		$alice = $this->factory()->user->create( array( 'role' => 'shop_manager' ) );
		$bob   = $this->factory()->user->create( array( 'role' => 'shop_manager' ) );

		$alice_one = $this->make_product( array( 'post_author' => $alice ) );
		$alice_two = $this->make_product( array( 'post_author' => $alice ) );
		$this->make_product( array( 'post_author' => $bob ) );

		$this->make_form(
			array(
				array(
					'key'   => 'author',
					'type'  => 'post-author',
					'field' => array(
						'type'       => 'post-author',
						'query_type' => 'or',
					),
				),
			)
		);
		$this->set_selection( array( 'author' => (string) $alice ) );

		$this->assertEqualsCanonicalizing( array( $alice_one, $alice_two ), $this->matching_product_ids() );
	}

	public function test_post_meta_filter_matches_exact_value() {
		$nike  = $this->make_product();
		update_post_meta( $nike, 'brand', 'nike' );

		$adidas = $this->make_product();
		update_post_meta( $adidas, 'brand', 'adidas' );

		$this->make_form(
			array(
				array(
					'key'   => 'brand',
					'type'  => 'post-meta',
					'field' => array(
						'type'       => 'post-meta',
						'meta_key'   => 'brand',
						'value_type' => 'text',
						'query_type' => 'or',
					),
				),
			)
		);
		$this->set_selection( array( 'brand' => 'nike' ) );

		$this->assertSame( array( $nike ), $this->matching_product_ids() );
	}

	public function test_keyword_filter_searches_product_titles() {
		$shirt = $this->make_product( array( 'post_title' => 'Red Shirt' ) );
		$this->make_product( array( 'post_title' => 'Blue Hat' ) );

		$this->make_form(
			array(
				array(
					'key'   => 'keyword',
					'type'  => 'keyword',
					'field' => array( 'type' => 'keyword' ),
				),
			)
		);
		$this->set_selection( array( 'keyword' => 'Shirt' ) );

		$this->assertSame( array( $shirt ), $this->matching_product_ids() );
	}

	public function test_keyword_with_no_match_returns_empty() {
		$this->make_product( array( 'post_title' => 'Red Shirt' ) );

		$this->make_form(
			array(
				array(
					'key'   => 'keyword',
					'type'  => 'keyword',
					'field' => array( 'type' => 'keyword' ),
				),
			)
		);
		$this->set_selection( array( 'keyword' => 'umbrella' ) );

		$this->assertSame( array(), $this->matching_product_ids() );
	}

	public function test_post_author_match_any_of_multiple_authors() {
		$alice = $this->factory()->user->create( array( 'role' => 'shop_manager' ) );
		$bob   = $this->factory()->user->create( array( 'role' => 'shop_manager' ) );

		$by_alice = $this->make_product( array( 'post_author' => $alice ) );
		$by_bob   = $this->make_product( array( 'post_author' => $bob ) );
		$this->make_product( array( 'post_author' => $this->factory()->user->create() ) );

		$this->make_form(
			array(
				array(
					'key'   => 'author',
					'type'  => 'post-author',
					'field' => array(
						'type'       => 'post-author',
						'query_type' => 'or',
					),
				),
			)
		);
		$this->set_selection( array( 'author' => $alice . ',' . $bob ) );

		$this->assertEqualsCanonicalizing( array( $by_alice, $by_bob ), $this->matching_product_ids() );
	}

	public function test_post_meta_match_any_of_multiple_values() {
		$nike = $this->make_product();
		update_post_meta( $nike, 'brand', 'nike' );
		$adidas = $this->make_product();
		update_post_meta( $adidas, 'brand', 'adidas' );
		$puma = $this->make_product();
		update_post_meta( $puma, 'brand', 'puma' );

		$this->make_form(
			array(
				array(
					'key'   => 'brand',
					'type'  => 'post-meta',
					'field' => array(
						'type'       => 'post-meta',
						'meta_key'   => 'brand',
						'value_type' => 'text',
						'query_type' => 'or',
					),
				),
			)
		);
		$this->set_selection( array( 'brand' => 'nike,adidas' ) );

		$this->assertEqualsCanonicalizing( array( $nike, $adidas ), $this->matching_product_ids() );
	}

	public function test_post_meta_match_all_requires_every_value() {
		// Match-all means the product must carry every selected meta value
		// (separate postmeta rows on the same key -> one JOIN per value).
		$both = $this->make_product();
		add_post_meta( $both, 'feature', 'waterproof' );
		add_post_meta( $both, 'feature', 'insulated' );

		$one = $this->make_product();
		add_post_meta( $one, 'feature', 'waterproof' );

		$this->make_form(
			array(
				array(
					'key'   => 'feature',
					'type'  => 'post-meta',
					'field' => array(
						'type'       => 'post-meta',
						'meta_key'   => 'feature',
						'value_type' => 'text',
						'query_type' => 'and',
					),
				),
			)
		);
		$this->set_selection( array( 'feature' => 'waterproof,insulated' ) );

		$this->assertSame( array( $both ), $this->matching_product_ids() );
	}
}
