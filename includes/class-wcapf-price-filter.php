<?php
/**
 * The price filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Price_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Price_Filter {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Price_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Price_Filter();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_filter( 'wcapf_price_filter_items', array( $this, 'set_price_min_max' ), 10, 2 );
	}

	/**
	 * @param array                $items    The filter items.
	 * @param WCAPF_Field_Instance $instance The field instance.
	 *
	 * @return array
	 */
	public function set_price_min_max( $items, $instance ) {
		$display_type         = $instance->display_type;
		$range_number_filters = WCAPF_Helper::range_number_filter_types();

		if ( in_array( $display_type, $range_number_filters ) ) {
			return WCAPF_Product_Filter_Utils::get_price_range( $instance );
		}

		return $items;
	}

}

WCAPF_Price_Filter::instance();
