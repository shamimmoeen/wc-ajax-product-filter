<?php
/**
 * Result-set tests: which products a shopper's filter selection actually returns.
 *
 * Drives the product query through the same path the shop page uses (the engine's
 * join/where clauses), then asserts the matching product IDs — independent of how
 * the engine is built inside, so these survive a later rewrite.
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
class FilterResultSetTest extends BehaviorTestCase {

	/** @var int Product in Shirts. */
	private $p_shirt;
	/** @var int Product in Shirts + Clearance tag. */
	private $p_shirt_clear;
	/** @var int Product in Hats. */
	private $p_hat;
	/** @var int Product in Hats + Clearance tag. */
	private $p_hat_clear;
	/** @var int Product in both Shirts and Hats. */
	private $p_both;
	/** @var int Product in the Jackets child category only. */
	private $p_jacket;
	/** @var int Product in no category. */
	private $p_none;

	/**
	 * Categories Shirts, Hats, Empty, and Outerwear > Jackets; a Clearance tag; seven products.
	 */
	public function set_up() {
		parent::set_up();

		$this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Shirts', 'slug' => 'shirts' ) );
		$this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Hats', 'slug' => 'hats' ) );
		$this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Empty', 'slug' => 'empty' ) );
		$outer = $this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Outerwear', 'slug' => 'outer' ) );
		$this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Jackets', 'slug' => 'jackets', 'parent' => $outer ) );
		$this->factory()->term->create( array( 'taxonomy' => 'product_tag', 'name' => 'Clearance', 'slug' => 'clearance' ) );

		$this->p_shirt = $this->make_product();
		wp_set_object_terms( $this->p_shirt, array( 'shirts' ), 'product_cat' );

		$this->p_shirt_clear = $this->make_product();
		wp_set_object_terms( $this->p_shirt_clear, array( 'shirts' ), 'product_cat' );
		wp_set_object_terms( $this->p_shirt_clear, array( 'clearance' ), 'product_tag' );

		$this->p_hat = $this->make_product();
		wp_set_object_terms( $this->p_hat, array( 'hats' ), 'product_cat' );

		$this->p_hat_clear = $this->make_product();
		wp_set_object_terms( $this->p_hat_clear, array( 'hats' ), 'product_cat' );
		wp_set_object_terms( $this->p_hat_clear, array( 'clearance' ), 'product_tag' );

		$this->p_both = $this->make_product();
		wp_set_object_terms( $this->p_both, array( 'shirts', 'hats' ), 'product_cat' );

		$this->p_jacket = $this->make_product();
		wp_set_object_terms( $this->p_jacket, array( 'jackets' ), 'product_cat' );

		$this->p_none = $this->make_product();
	}

	/**
	 * A taxonomy filter spec for the form.
	 *
	 * @param string $taxonomy   Taxonomy.
	 * @param string $query_type 'or' (match any) or 'and' (match all).
	 *
	 * @return array
	 */
	private function tax_filter( string $taxonomy, string $query_type = 'or' ): array {
		return array(
			'key'   => $taxonomy,
			'type'  => 'taxonomy',
			'field' => array(
				'taxonomy'               => $taxonomy,
				'display_type'           => 'checkbox',
				'query_type'             => $query_type,
				'enable_multiple_filter' => '1',
				'get_options'            => 'automatically',
			),
		);
	}

	/**
	 * Sets the relationship used between different filters.
	 *
	 * @param string $relation 'and' or 'or'.
	 *
	 * @return void
	 */
	private function set_relationship( string $relation ): void {
		update_option( 'wcapf_settings', array( 'filter_relationships' => $relation ) );
	}

	public function test_no_selection_returns_all_products() {
		$this->make_form( array( $this->tax_filter( 'product_cat' ) ) );
		$this->set_selection( array() );

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt, $this->p_shirt_clear, $this->p_hat, $this->p_hat_clear, $this->p_both, $this->p_jacket, $this->p_none ),
			$this->matching_product_ids()
		);
	}

	public function test_single_category_returns_only_its_products() {
		$this->make_form( array( $this->tax_filter( 'product_cat' ) ) );
		$this->set_selection( array( 'product_cat' => 'shirts' ) );

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt, $this->p_shirt_clear, $this->p_both ),
			$this->matching_product_ids()
		);
	}

	public function test_two_categories_match_any() {
		$this->make_form( array( $this->tax_filter( 'product_cat', 'or' ) ) );
		$this->set_selection( array( 'product_cat' => 'shirts,hats' ) );

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt, $this->p_shirt_clear, $this->p_hat, $this->p_hat_clear, $this->p_both ),
			$this->matching_product_ids()
		);
	}

	public function test_two_categories_match_all() {
		$this->make_form( array( $this->tax_filter( 'product_cat', 'and' ) ) );
		$this->set_selection( array( 'product_cat' => 'shirts,hats' ) );

		$this->assertSame( array( $this->p_both ), $this->matching_product_ids() );
	}

	public function test_non_hierarchical_tag_filter() {
		$this->make_form( array( $this->tax_filter( 'product_tag' ) ) );
		$this->set_selection( array( 'product_tag' => 'clearance' ) );

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt_clear, $this->p_hat_clear ),
			$this->matching_product_ids()
		);
	}

	public function test_parent_category_includes_child_products() {
		$this->make_form( array( $this->tax_filter( 'product_cat' ) ) );
		$this->set_selection( array( 'product_cat' => 'outer' ) );

		$this->assertSame( array( $this->p_jacket ), $this->matching_product_ids() );
	}

	public function test_two_filters_combined_with_and() {
		$this->set_relationship( 'and' );
		$this->make_form( array( $this->tax_filter( 'product_cat' ), $this->tax_filter( 'product_tag' ) ) );
		$this->set_selection(
			array(
				'product_cat' => 'shirts',
				'product_tag' => 'clearance',
			)
		);

		$this->assertSame( array( $this->p_shirt_clear ), $this->matching_product_ids() );
	}

	public function test_two_filters_combined_with_or() {
		$this->set_relationship( 'or' );
		$this->make_form( array( $this->tax_filter( 'product_cat' ), $this->tax_filter( 'product_tag' ) ) );
		$this->set_selection(
			array(
				'product_cat' => 'shirts',
				'product_tag' => 'clearance',
			)
		);

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt, $this->p_shirt_clear, $this->p_both, $this->p_hat_clear ),
			$this->matching_product_ids()
		);
	}

	public function test_selection_matching_no_products_returns_empty() {
		$this->make_form( array( $this->tax_filter( 'product_cat' ) ) );
		$this->set_selection( array( 'product_cat' => 'empty' ) );

		$this->assertSame( array(), $this->matching_product_ids() );
	}

	public function test_nonexistent_term_slug_returns_empty_without_error() {
		$this->make_form( array( $this->tax_filter( 'product_cat' ) ) );
		$this->set_selection( array( 'product_cat' => 'does-not-exist' ) );

		$this->assertSame( array(), $this->matching_product_ids() );
	}

	public function test_mixed_valid_and_invalid_slugs_uses_only_valid() {
		$this->make_form( array( $this->tax_filter( 'product_cat', 'or' ) ) );
		$this->set_selection( array( 'product_cat' => 'shirts,ghost-category' ) );

		$this->assertEqualsCanonicalizing(
			array( $this->p_shirt, $this->p_shirt_clear, $this->p_both ),
			$this->matching_product_ids()
		);
	}
}
