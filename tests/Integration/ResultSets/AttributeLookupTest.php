<?php
/**
 * Result-set tests for attribute-taxonomy (pa_*) filtering via the WC attribute
 * lookup table — a distinct engine path (set_attribute_filter_data) from product_cat,
 * taken only when woocommerce_attribute_lookup_enabled is on.
 *
 * WooCommerce does not auto-populate wc_product_attributes_lookup inside the test
 * transaction, so rows are seeded directly — the test then asserts WCAPF reads them
 * correctly (term_id IN ... / per-term subqueries).
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
class AttributeLookupTest extends BehaviorTestCase {

	/** @var int Red term ID. */
	private $red;
	/** @var int Blue term ID. */
	private $blue;

	/**
	 * Enables the attribute lookup, registers a pa_color attribute with Red/Blue terms.
	 */
	public function set_up() {
		parent::set_up();

		global $wpdb;

		update_option( 'woocommerce_attribute_lookup_enabled', 'yes' );

		// Seed the attribute row directly. wc_create_attribute() is unreliable here:
		// register_taxonomy() persists in-memory across the per-test transaction, so
		// it skips the DB insert on later tests and pa_color stops being recognised.
		$wpdb->insert(
			$wpdb->prefix . 'woocommerce_attribute_taxonomies',
			array(
				'attribute_name'    => 'color',
				'attribute_label'   => 'Color',
				'attribute_type'    => 'select',
				'attribute_orderby' => 'menu_order',
				'attribute_public'  => 0,
			)
		);
		delete_transient( 'wc_attribute_taxonomies' );
		\WC_Cache_Helper::invalidate_cache_group( 'woocommerce-attributes' );

		if ( ! taxonomy_exists( 'pa_color' ) ) {
			register_taxonomy( 'pa_color', array( 'product' ), array( 'hierarchical' => false ) );
		}

		$this->red  = wp_insert_term( 'Red', 'pa_color', array( 'slug' => 'red' ) )['term_id'];
		$this->blue = wp_insert_term( 'Blue', 'pa_color', array( 'slug' => 'blue' ) )['term_id'];
	}

	/**
	 * Seeds a wc_product_attributes_lookup row (WC won't populate it in tests).
	 *
	 * @param int $product_id Product ID.
	 * @param int $term_id    Attribute term ID.
	 *
	 * @return void
	 */
	private function seed_lookup( int $product_id, int $term_id ): void {
		global $wpdb;

		$wpdb->insert(
			$wpdb->prefix . 'wc_product_attributes_lookup',
			array(
				'product_id'             => $product_id,
				'product_or_parent_id'   => $product_id,
				'taxonomy'               => 'pa_color',
				'term_id'                => $term_id,
				'is_variation_attribute' => 0,
				'in_stock'               => 1,
			)
		);
	}

	/**
	 * A pa_color taxonomy filter spec.
	 *
	 * @param string $query_type 'or' or 'and'.
	 *
	 * @return array
	 */
	private function color_filter( string $query_type = 'or' ): array {
		return array(
			'key'   => 'pa_color',
			'type'  => 'taxonomy',
			'field' => array(
				'taxonomy'               => 'pa_color',
				'display_type'           => 'checkbox',
				'query_type'             => $query_type,
				'enable_multiple_filter' => '1',
				'get_options'            => 'automatically',
			),
		);
	}

	public function test_single_attribute_value_via_lookup() {
		$red_product  = $this->make_wc_product();
		$blue_product = $this->make_wc_product();
		$this->seed_lookup( $red_product, $this->red );
		$this->seed_lookup( $blue_product, $this->blue );

		$this->make_form( array( $this->color_filter() ) );
		$this->set_selection( array( 'pa_color' => 'red' ) );

		$this->assertSame( array( $red_product ), $this->matching_product_ids() );
	}

	public function test_attribute_match_any_of_two_values() {
		$red_product  = $this->make_wc_product();
		$blue_product = $this->make_wc_product();
		$this->make_wc_product(); // No color.
		$this->seed_lookup( $red_product, $this->red );
		$this->seed_lookup( $blue_product, $this->blue );

		$this->make_form( array( $this->color_filter( 'or' ) ) );
		$this->set_selection( array( 'pa_color' => 'red,blue' ) );

		$this->assertEqualsCanonicalizing( array( $red_product, $blue_product ), $this->matching_product_ids() );
	}

	public function test_attribute_match_all_requires_every_value() {
		$both = $this->make_wc_product();
		$this->seed_lookup( $both, $this->red );
		$this->seed_lookup( $both, $this->blue );

		$red_only = $this->make_wc_product();
		$this->seed_lookup( $red_only, $this->red );

		$this->make_form( array( $this->color_filter( 'and' ) ) );
		$this->set_selection( array( 'pa_color' => 'red,blue' ) );

		$this->assertSame( array( $both ), $this->matching_product_ids() );
	}
}
