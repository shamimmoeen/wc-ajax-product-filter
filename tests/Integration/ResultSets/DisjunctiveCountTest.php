<?php
/**
 * Disjunctive faceting: one filter's active selection reduces the option counts
 * shown for the OTHER filters (when count-updating is enabled).
 *
 * Counts come from the filter-type item lists; the "other filters" constraint is
 * read from the chosen-filters global via get_where_clauses_by_other_filters(),
 * so this is exercisable without a real shop main query.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @group counts
 */
class DisjunctiveCountTest extends BehaviorTestCase {

	/** @var int */
	private $shirts;
	/** @var int */
	private $hats;
	/** @var int */
	private $sale;
	/** @var int */
	private $newish;

	/**
	 * Categories Shirts/Hats, tags Sale/New, and three products spanning them.
	 */
	public function set_up() {
		parent::set_up();

		$this->shirts = $this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Shirts', 'slug' => 'shirts' ) );
		$this->hats   = $this->factory()->term->create( array( 'taxonomy' => 'product_cat', 'name' => 'Hats', 'slug' => 'hats' ) );
		$this->sale   = $this->factory()->term->create( array( 'taxonomy' => 'product_tag', 'name' => 'Sale', 'slug' => 'sale' ) );
		$this->newish = $this->factory()->term->create( array( 'taxonomy' => 'product_tag', 'name' => 'New', 'slug' => 'new' ) );

		$shirt_sale = $this->make_product();
		wp_set_object_terms( $shirt_sale, array( 'shirts' ), 'product_cat' );
		wp_set_object_terms( $shirt_sale, array( 'sale' ), 'product_tag' );

		$shirt_new = $this->make_product();
		wp_set_object_terms( $shirt_new, array( 'shirts' ), 'product_cat' );
		wp_set_object_terms( $shirt_new, array( 'new' ), 'product_tag' );

		$hat_sale = $this->make_product();
		wp_set_object_terms( $hat_sale, array( 'hats' ), 'product_cat' );
		wp_set_object_terms( $hat_sale, array( 'sale' ), 'product_tag' );
	}

	/**
	 * A taxonomy filter spec for the form.
	 *
	 * @param string $taxonomy Taxonomy.
	 *
	 * @return array
	 */
	private function form_filter( string $taxonomy ): array {
		return array(
			'key'   => $taxonomy,
			'type'  => 'taxonomy',
			'field' => array(
				'taxonomy'   => $taxonomy,
				'query_type' => 'or',
			),
		);
	}

	/**
	 * The product_tag field used to read option counts (count-updating on).
	 *
	 * @return \WCAPF\FormFilter
	 */
	private function tag_field(): \WCAPF\FormFilter {
		return $this->make_field(
			array(
				'type'         => 'taxonomy',
				'taxonomy'     => 'product_tag',
				'field_key'    => 'product_tag',
				'display_type' => 'checkbox',
				'query_type'   => 'or',
				'show_count'   => '1',
				'update_count' => '1',
				'get_options'  => 'automatically',
			)
		);
	}

	/**
	 * Applies a filter selection by populating the chosen-filters global.
	 *
	 * @param array $params Filter key => value.
	 *
	 * @return void
	 */
	private function activate( array $params ): void {
		$this->set_selection( $params );

		$GLOBALS['wcapf_chosen_filters'] = ( new \WCAPF\ProductFilter() )->get_chosen_filters();
	}

	public function test_tag_counts_are_global_when_no_other_filter_is_active() {
		$this->make_form( array( $this->form_filter( 'product_cat' ), $this->form_filter( 'product_tag' ) ) );
		$this->activate( array() );

		$items = $this->taxonomy_items( $this->tag_field() );

		// Both Sale products (shirt + hat) counted.
		$this->assertSame( 2, (int) $items[ $this->sale ]['count'] );
		$this->assertSame( 1, (int) $items[ $this->newish ]['count'] );
	}

	public function test_active_category_reduces_the_other_filters_counts() {
		$this->make_form( array( $this->form_filter( 'product_cat' ), $this->form_filter( 'product_tag' ) ) );
		$this->activate( array( 'product_cat' => 'shirts' ) );

		$items = $this->taxonomy_items( $this->tag_field() );

		// With Shirts active, the Sale count drops to the one shirt that is on sale
		// (the hat-sale product is no longer counted) — disjunctive faceting.
		$this->assertSame( 1, (int) $items[ $this->sale ]['count'] );
		$this->assertSame( 1, (int) $items[ $this->newish ]['count'] );
	}
}
