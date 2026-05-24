<?php
/**
 * Behavior tests for the rating filter.
 *
 * Rating is not its own filter type: in automatic mode it resolves to a
 * taxonomy filter over the product_visibility `rated-N` terms. These assert
 * that resolution plus the rated-term query/normalisation produced via the
 * filter-type output, independent of where that logic is wired. (Star-icon
 * rendering happens in the walker and is out of scope here.)
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/FilterBehaviorTestCase.php';

/**
 * @group rating-filter
 */
class RatingFilterTest extends FilterBehaviorTestCase {

	/**
	 * Seeds the product_visibility taxonomy with the rated-1..5 terms AND the
	 * standard non-rating terms, so the tests prove the rating filter selects
	 * only the rated terms out of the full set.
	 */
	public function set_up() {
		parent::set_up();

		$terms = array(
			'rated-1',
			'rated-2',
			'rated-3',
			'rated-4',
			'rated-5',
			'featured',
			'outofstock',
			'exclude-from-catalog',
			'exclude-from-search',
		);

		foreach ( $terms as $slug ) {
			if ( ! term_exists( $slug, 'product_visibility' ) ) {
				wp_insert_term( $slug, 'product_visibility' );
			}
		}
	}

	/**
	 * Builds a rating field in automatic mode.
	 *
	 * @return \WCAPF_Field_Instance
	 */
	private function rating_field(): \WCAPF_Field_Instance {
		return $this->make_field(
			array(
				'type'         => 'rating',
				'field_key'    => '_rating',
				'id'           => 1,
				'display_type' => 'checkbox',
				'show_count'   => '1',
				'hide_empty'   => '',
			)
		);
	}

	public function test_rating_resolves_to_product_visibility_taxonomy() {
		$field = $this->rating_field();

		$this->assertSame( 'taxonomy', $field->filter_type );
		$this->assertSame( 'product_visibility', $field->taxonomy );
	}

	public function test_items_are_only_rated_terms_normalised_in_descending_order() {
		$items = $this->taxonomy_items( $this->rating_field() );

		// Exactly the five rated terms, never the other product_visibility terms.
		$this->assertCount( 5, $items );

		$slugs = wp_list_pluck( $items, 'slug' );
		$this->assertNotContains( 'featured', $slugs );
		$this->assertNotContains( 'outofstock', $slugs );

		$ids = array_map( 'intval', array_values( wp_list_pluck( $items, 'id' ) ) );
		$this->assertSame( array( 5, 4, 3, 2, 1 ), $ids );
	}

	public function test_count_is_per_rated_term_and_ignores_non_rating_terms() {
		// One product rated 4 stars.
		$rated_product = $this->make_product();
		wp_set_object_terms( $rated_product, array( 'rated-4' ), 'product_visibility' );

		// One product flagged only "featured" — must not leak into any rating count.
		$featured_product = $this->make_product();
		wp_set_object_terms( $featured_product, array( 'featured' ), 'product_visibility' );

		$counts = array();
		foreach ( $this->taxonomy_items( $this->rating_field() ) as $item ) {
			$counts[ (int) $item['id'] ] = (int) $item['count'];
		}

		$this->assertEquals(
			array(
				5 => 0,
				4 => 1,
				3 => 0,
				2 => 0,
				1 => 0,
			),
			$counts
		);
	}
}
