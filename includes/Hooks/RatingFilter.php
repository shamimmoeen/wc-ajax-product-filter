<?php
/**
 * Rating filter behavior hooks.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Hooks
 * @author     Mainul Hassan
 */

namespace WCAPF\Hooks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wires the rating filter into the rest of the pipeline.
 *
 * The data behavior (rated-N term query, value/label mapping) lives in
 * WCAPF\Filter\Rating. These two hooks remain because they act outside the
 * element: the filter-type mapping is resolved before an element is built, and
 * the star-icon rendering runs in the walker after the option list is assembled.
 */
class RatingFilter {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wcapf_field_filter_type', array( $this, 'set_rating_filter_type' ), 10, 3 );
		add_filter( 'wcapf_menu_items', array( $this, 'set_rating_items' ), 10, 2 );
	}

	/**
	 * When displaying the rating filter options automatically mark this as a taxonomy filter.
	 *
	 * @param string $filter_type The filter type.
	 * @param string $field_type  The field type.
	 * @param string $get_options The field get_options method.
	 *
	 * @return string
	 */
	public function set_rating_filter_type( $filter_type, $field_type, $get_options ): string {
		if ( 'rating' !== $field_type ) {
			return $filter_type;
		}

		if ( 'automatically' !== $get_options ) {
			return $filter_type;
		}

		return 'taxonomy';
	}

	/**
	 * Gets the translated rating label.
	 *
	 * @param int $rating The rating.
	 *
	 * @return string
	 */
	public function get_rating_label( int $rating ): string {
		return sprintf(
			/* translators: %d: rating value. */
			_n( '%d star', '%d stars', $rating, 'wc-ajax-product-filter' ),
			number_format_i18n( $rating )
		);
	}

	/**
	 * Fill the rating items with star icons.
	 *
	 * @param array         $items  The walker items.
	 * @param \WCAPF\Walker $walker The walker class instance.
	 *
	 * @return array
	 */
	public function set_rating_items( array $items, $walker ): array {
		if ( 'rating' !== $walker->type ) {
			return $items;
		}

		if ( 'automatically' !== $walker->get_options ) {
			return $items;
		}

		$display_type   = $walker->display_type;
		$dropdown_types = array( 'select', 'multiselect' );
		$is_dropdown    = in_array( $display_type, $dropdown_types, true );

		$parsed = array();

		foreach ( $items as $key => $item ) {
			$rating = absint( $item['id'] );

			if ( $rating ) {
				if ( $is_dropdown ) {
					$item['name'] = wcapf()->rating->entities( $rating );
				} else {
					$item['name'] = wcapf()->rating->icons( $rating );
				}
			}

			$item['tooltip'] = $this->get_rating_label( $rating );

			$parsed[ $key ] = $item;
		}

		return $parsed;
	}
}
