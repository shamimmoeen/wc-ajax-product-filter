<?php
/**
 * Behavior tests for the taxonomy filter.
 *
 * Asserts the items a configured taxonomy field produces (include/exclude,
 * child expansion, sort, hide-empty, hierarchy tree, orphan reparenting) via
 * the filter-type output, independent of where that logic is wired.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/FilterBehaviorTestCase.php';

/**
 * @group taxonomy-filter
 */
class TaxonomyFilterTest extends FilterBehaviorTestCase {

	/**
	 * Parent category ID.
	 *
	 * @var int
	 */
	private $parent;

	/**
	 * First child category ID (under parent).
	 *
	 * @var int
	 */
	private $child_a;

	/**
	 * Second child category ID (under parent).
	 *
	 * @var int
	 */
	private $child_b;

	/**
	 * Top-level sibling category ID.
	 *
	 * @var int
	 */
	private $sibling;

	/**
	 * Creates a small product_cat tree: Parent > (Child A, Child B); Sibling.
	 */
	public function set_up() {
		parent::set_up();

		$this->parent  = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Parent',
			)
		);
		$this->child_a = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Child A',
				'parent'   => $this->parent,
			)
		);
		$this->child_b = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Child B',
				'parent'   => $this->parent,
			)
		);
		$this->sibling = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Sibling',
			)
		);
	}

	/**
	 * Builds a product_cat field with the given overrides applied.
	 *
	 * @param array $overrides Field-data overrides.
	 *
	 * @return \WCAPF_Field_Instance
	 */
	private function tax_field( array $overrides = array() ): \WCAPF_Field_Instance {
		return $this->make_field(
			array_merge(
				array(
					'type'         => 'taxonomy',
					'taxonomy'     => 'product_cat',
					'field_key'    => 'product_cat',
					'id'           => 1,
					'get_options'  => 'automatically',
					'display_type' => 'checkbox',
					'show_count'   => '1',
					'hide_empty'   => '',
				),
				$overrides
			)
		);
	}

	public function test_include_limits_terms_to_listed() {
		$field = $this->tax_field(
			array(
				'limit_options' => 'include',
				'include_terms' => array( $this->child_a, $this->sibling ),
			)
		);

		$ids = array_keys( $this->taxonomy_items( $field ) );
		sort( $ids );

		$expected = array( $this->child_a, $this->sibling );
		sort( $expected );

		$this->assertSame( $expected, $ids );
	}

	public function test_include_child_expands_to_descendants() {
		$field = $this->tax_field(
			array(
				'limit_options' => 'include',
				'include_terms' => array( $this->parent ),
				'include_child' => '1',
			)
		);

		$ids = array_keys( $this->taxonomy_items( $field ) );

		$this->assertContains( $this->parent, $ids );
		$this->assertContains( $this->child_a, $ids );
		$this->assertContains( $this->child_b, $ids );
	}

	public function test_exclude_removes_listed_term() {
		$field = $this->tax_field(
			array(
				'limit_options' => 'exclude',
				'exclude_terms' => array( $this->sibling ),
			)
		);

		$ids = array_keys( $this->taxonomy_items( $field ) );

		$this->assertNotContains( $this->sibling, $ids );
		$this->assertContains( $this->parent, $ids );
		$this->assertContains( $this->child_a, $ids );
	}

	public function test_sort_by_name_ascending_and_descending() {
		$base = array(
			'limit_options'   => 'include',
			'include_terms'   => array( $this->parent, $this->child_a, $this->child_b, $this->sibling ),
			'order_terms_by'  => 'name',
		);

		$asc = array_keys( $this->taxonomy_items( $this->tax_field( $base + array( 'order_terms_dir' => 'asc' ) ) ) );
		$this->assertSame( array( $this->child_a, $this->child_b, $this->parent, $this->sibling ), $asc );

		$desc = array_keys( $this->taxonomy_items( $this->tax_field( $base + array( 'order_terms_dir' => 'desc' ) ) ) );
		$this->assertSame( array_reverse( $asc ), $desc );
	}

	public function test_sort_by_id_ascending() {
		$field = $this->tax_field(
			array(
				'limit_options'   => 'include',
				'include_terms'   => array( $this->parent, $this->child_a, $this->child_b, $this->sibling ),
				'order_terms_by'  => 'id',
				'order_terms_dir' => 'asc',
			)
		);

		$ids      = array_keys( $this->taxonomy_items( $field ) );
		$expected = $ids;
		sort( $expected, SORT_NUMERIC );

		$this->assertSame( $expected, $ids );
	}

	public function test_hide_empty_drops_zero_count_terms() {
		$empty = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Empty',
			)
		);

		$product = $this->make_product();
		wp_set_object_terms( $product, array( $this->sibling ), 'product_cat' );

		$field = $this->tax_field(
			array(
				'limit_options' => 'include',
				'include_terms' => array( $this->sibling, $empty ),
				'hide_empty'    => 'remove',
			)
		);

		$ids = array_keys( $this->taxonomy_items( $field ) );

		$this->assertContains( $this->sibling, $ids );
		$this->assertNotContains( $empty, $ids );
	}

	public function test_hierarchical_builds_nested_tree() {
		$field = $this->tax_field(
			array(
				'hierarchical'  => '1',
				'limit_options' => 'include',
				'include_terms' => array( $this->parent ),
				'include_child' => '1',
			)
		);

		$items = $this->taxonomy_items( $field );

		// Parent is top level; children are nested under it.
		$this->assertArrayHasKey( $this->parent, $items );
		$this->assertArrayHasKey( 'children', $items[ $this->parent ] );
		$this->assertArrayHasKey( $this->child_a, $items[ $this->parent ]['children'] );
		$this->assertArrayHasKey( $this->child_b, $items[ $this->parent ]['children'] );
	}

	public function test_hierarchical_count_aggregates_child_products() {
		// One product directly in Parent; one in each child.
		wp_set_object_terms( $this->make_product(), array( $this->parent ), 'product_cat' );
		wp_set_object_terms( $this->make_product(), array( $this->child_a ), 'product_cat' );
		wp_set_object_terms( $this->make_product(), array( $this->child_b ), 'product_cat' );

		$items = $this->taxonomy_items( $this->tax_field( array( 'hierarchical' => '1' ) ) );

		// Parent's count rolls up its own product plus both children's.
		$this->assertSame( 3, (int) $items[ $this->parent ]['count'] );
		$this->assertSame( 1, (int) $items[ $this->parent ]['children'][ $this->child_a ]['count'] );
		$this->assertSame( 1, (int) $items[ $this->parent ]['children'][ $this->child_b ]['count'] );
	}

	public function test_orphan_child_is_reparented_to_top_level() {
		// Include a child whose parent is NOT in the result set, with hierarchy on.
		$field = $this->tax_field(
			array(
				'hierarchical'  => '1',
				'limit_options' => 'include',
				'include_terms' => array( $this->child_a ),
			)
		);

		$items = $this->taxonomy_items( $field );

		// Without parent reparenting the orphan would be dropped from the tree.
		$this->assertArrayHasKey( $this->child_a, $items );
		$this->assertSame( 0, $items[ $this->child_a ]['parent_id'] );
	}
}
