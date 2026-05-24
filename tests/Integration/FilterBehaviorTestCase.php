<?php
/**
 * Base test case for filter-behavior integration tests.
 *
 * The concrete tests assert what a configured filter PRODUCES (the filter-type
 * output), never the hook callbacks or `apply_filters('wcapf_*')` directly, so
 * they stay valid whether the limit/sort/hierarchy logic lives in the Hooks\*
 * consumers or is later moved into the filter-type classes.
 *
 * This base is the single place that names the not-yet-namespaced
 * WCAPF_Field_Instance / WCAPF_Filter_Type_* classes, so a future rename of
 * those touches one file.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared fixtures and pipeline calls for filter-behavior tests.
 */
abstract class FilterBehaviorTestCase extends WP_UnitTestCase {

	/**
	 * Builds a configured field instance from a flat field-data array.
	 *
	 * @param array $config Field data (type, taxonomy, get_options, limit_options, include_terms, ...).
	 *
	 * @return \WCAPF_Field_Instance
	 */
	protected function make_field( array $config ): \WCAPF_Field_Instance {
		return new \WCAPF_Field_Instance( $config );
	}

	/**
	 * Prepared items for a taxonomy field (also used for rating, which reuses the taxonomy type).
	 *
	 * @param \WCAPF_Field_Instance $field The field instance.
	 *
	 * @return array
	 */
	protected function taxonomy_items( \WCAPF_Field_Instance $field ): array {
		return ( new \WCAPF_Filter_Type_Taxonomy( $field ) )->get_items();
	}

	/**
	 * Prepared items for a post-author field.
	 *
	 * @param \WCAPF_Field_Instance $field The field instance.
	 *
	 * @return array
	 */
	protected function post_author_items( \WCAPF_Field_Instance $field ): array {
		return ( new \WCAPF_Filter_Type_Post_Author( $field ) )->get_items();
	}

	/**
	 * Creates a published product.
	 *
	 * @param array $args Optional post-array overrides (e.g. post_author).
	 *
	 * @return int Product ID.
	 */
	protected function make_product( array $args = array() ): int {
		return $this->factory()->post->create(
			array_merge(
				array(
					'post_type'   => 'product',
					'post_status' => 'publish',
					'post_title'  => 'Product',
				),
				$args
			)
		);
	}
}
