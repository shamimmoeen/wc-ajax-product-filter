<?php
/**
 * Behavior tests for the product-status filter option list and active label.
 *
 * Pins what a configured product-status field PRODUCES: the option items from
 * its manual options, the per-status product counts (featured / on sale), and
 * the active-filter label. Asserts the filter-type / engine output, so it stays
 * valid whether that logic lives in the legacy classes or is later moved into
 * the filter-type classes. (The result-set query is covered separately by
 * PriceStatusResultSetTest.)
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * @group product-status-filter
 */
class ProductStatusTest extends BehaviorTestCase {

	/**
	 * The configured featured / on-sale options.
	 *
	 * @return array
	 */
	private function status_options(): array {
		return array(
			array(
				'value' => 'featured',
				'label' => 'Featured',
			),
			array(
				'value' => 'on_sale',
				'label' => 'On sale',
			),
		);
	}

	/**
	 * Builds a product-status field.
	 *
	 * @return \WCAPF\FormFilter
	 */
	private function status_field(): \WCAPF\FormFilter {
		return $this->make_field(
			array(
				'type'                   => 'product-status',
				'field_key'              => 'product_status',
				'id'                     => 1,
				'show_count'             => '1',
				'hide_empty'             => '',
				'product_status_options' => $this->status_options(),
			)
		);
	}

	public function test_items_are_the_configured_statuses_keyed_by_value() {
		$items = $this->product_status_items( $this->status_field() );

		$this->assertSame( array( 'featured', 'on_sale' ), array_keys( $items ) );
		$this->assertSame( 'Featured', $items['featured']['name'] );
		$this->assertSame( 'On sale', $items['on_sale']['name'] );
	}

	public function test_counts_reflect_featured_and_on_sale_products() {
		$this->make_wc_product(
			array(
				'regular_price' => 30,
				'featured'      => true,
			)
		);
		$this->make_wc_product(
			array(
				'regular_price' => 20,
				'sale_price'    => 10,
			)
		);
		// Featured AND on sale — counts toward both statuses.
		$this->make_wc_product(
			array(
				'regular_price' => 20,
				'sale_price'    => 5,
				'featured'      => true,
			)
		);

		$items = $this->product_status_items( $this->status_field() );

		$this->assertSame( 2, (int) $items['featured']['count'] );
		$this->assertSame( 2, (int) $items['on_sale']['count'] );
	}

	public function test_active_filter_label_uses_the_option_label() {
		$this->make_form(
			array(
				array(
					'key'   => 'product_status',
					'type'  => 'product-status',
					'field' => array(
						'show_in_active_filters' => '1',
						'product_status_options' => $this->status_options(),
					),
				),
			)
		);
		$this->set_selection( array( 'product_status' => 'featured,on_sale' ) );

		$chosen = $this->chosen_filters();

		$this->assertSame(
			array(
				'featured' => 'Featured',
				'on_sale'  => 'On sale',
			),
			$chosen['product-status']['product_status']['active_filters']
		);
	}
}
