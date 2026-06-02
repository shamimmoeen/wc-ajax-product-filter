<?php
/**
 * Behavior tests for the taxonomy active-filter output (labels + ancestors).
 *
 * Pins what a chosen taxonomy/rating filter PRODUCES in the active-filters bar:
 * the term-name label (slug pipeline), the rating star-text label, and the
 * active ancestor slugs for a hierarchical selection. Asserts the engine output
 * (the active_filters / active_ancestors keys), so it stays valid whether that
 * logic lives in the engine + Hooks consumers or is later moved into the
 * filter-type classes.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @group taxonomy-active-filter
 */
class ActiveFiltersTaxonomyTest extends BehaviorTestCase {

	public function test_taxonomy_active_filter_label_is_the_term_name() {
		$this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Shirts',
				'slug'     => 'shirts',
			)
		);

		$this->make_form(
			array(
				array(
					'key'   => 'product_cat',
					'type'  => 'taxonomy',
					'field' => array(
						'taxonomy'               => 'product_cat',
						'display_type'           => 'checkbox',
						'get_options'            => 'automatically',
						'use_term_slug'          => '1',
						'show_in_active_filters' => '1',
					),
				),
			)
		);
		$this->set_selection( array( 'product_cat' => 'shirts' ) );

		$chosen = $this->chosen_filters();

		$this->assertSame(
			array( 'shirts' => 'Shirts' ),
			$chosen['taxonomy']['product_cat']['active_filters']
		);
	}

	public function test_rating_active_filter_label_uses_star_text() {
		foreach ( array( 'rated-1', 'rated-2', 'rated-3', 'rated-4', 'rated-5' ) as $slug ) {
			if ( ! term_exists( $slug, 'product_visibility' ) ) {
				wp_insert_term( $slug, 'product_visibility' );
			}
		}

		$this->make_form(
			array(
				array(
					'key'   => 'rating',
					'type'  => 'rating',
					'field' => array(
						'display_type'           => 'checkbox',
						'get_options'            => 'automatically',
						'show_in_active_filters' => '1',
					),
				),
			)
		);
		$this->set_selection( array( 'rating' => '4' ) );

		$chosen = $this->chosen_filters();

		// Rating resolves onto the taxonomy pipeline; the star-text label comes
		// from the RatingFilter hook, defaulting to "N stars" (no icons).
		$this->assertSame(
			array( 4 => '4 stars' ),
			$chosen['taxonomy']['rating']['active_filters']
		);
	}

	public function test_hierarchical_selection_exposes_active_ancestor_slugs() {
		$parent     = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Parent',
				'slug'     => 'parent',
			)
		);
		$child      = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Child',
				'slug'     => 'child',
				'parent'   => $parent,
			)
		);
		$this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Grandchild',
				'slug'     => 'grandchild',
				'parent'   => $child,
			)
		);

		$this->make_form(
			array(
				array(
					'key'   => 'product_cat',
					'type'  => 'taxonomy',
					'field' => array(
						'taxonomy'               => 'product_cat',
						'display_type'           => 'checkbox',
						'get_options'            => 'automatically',
						'use_term_slug'          => '1',
						'show_in_active_filters' => '1',
					),
				),
			)
		);
		$this->set_selection( array( 'product_cat' => 'grandchild' ) );

		$chosen = $this->chosen_filters();

		// Selecting the grandchild exposes its parent + child as active ancestors
		// (slugs, because use_term_slug is on), used to auto-expand the tree.
		$this->assertEqualsCanonicalizing(
			array( 'parent', 'child' ),
			$chosen['taxonomy']['product_cat']['active_ancestors']
		);
	}
}
