<?php
/**
 * The rating filter element.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Filter
 * @author     Mainul Hassan
 */

namespace WCAPF\Filter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * In automatic mode the rating filter is a taxonomy filter over the
 * product_visibility `rated-N` terms: it restricts the term query to those
 * terms, maps them to their star value, converts a selected rating to its term
 * ID, and labels the active filters with stars.
 */
class Rating extends Taxonomy {

	/**
	 * Restricts the term query to the five rated-N terms, highest first.
	 *
	 * @return array
	 */
	protected function terms_query_args() {
		$args = parent::terms_query_args();

		$names = array();

		for ( $rating = 5; $rating >= 1; $rating-- ) {
			$names[] = 'rated-' . $rating;
		}

		$args['name']  = $names;
		$args['order'] = 'DESC';

		return $args;
	}

	/**
	 * Maps each rated-N term to its bare star value on the item id.
	 *
	 * @param array $terms The prepared terms.
	 *
	 * @return array
	 */
	protected function normalize_terms( $terms ) {
		$new_terms = array();

		foreach ( $terms as $term_id => $term ) {
			$term['id'] = str_replace( 'rated-', '', $term['name'] );

			$new_terms[ $term_id ] = $term;
		}

		return $new_terms;
	}

	/**
	 * Converts the selected star values into product_visibility term IDs.
	 *
	 * @param array $filter_values The selected filter values.
	 *
	 * @return array
	 */
	protected function get_chosen_term_ids( $filter_values ) {
		$slugs = array();

		foreach ( $filter_values as $value ) {
			$slugs[] = 'rated-' . $value;
		}

		$terms = get_terms(
			array(
				'taxonomy'   => 'product_visibility',
				'hide_empty' => false,
				'fields'     => 'ids',
				'slug'       => $slugs,
			)
		);

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		return $terms;
	}

	/**
	 * Labels the active filters with their star rating (icons or "N stars").
	 *
	 * @param array $filter_values The selected filter values.
	 *
	 * @return array
	 */
	protected function active_term_labels( $filter_values ) {
		if ( ! $this->field->get_sub_field_value( 'show_in_active_filters' ) ) {
			return array();
		}

		$use_star_icons = apply_filters( 'wcapf_use_star_icons_in_rating_filters_data', false );

		$rating_data = array();

		foreach ( $filter_values as $rating ) {
			$rating = absint( $rating );

			if ( $use_star_icons ) {
				$rating_data[ $rating ] = wcapf()->rating->icons( $rating );
			} else {
				$rating_data[ $rating ] = $this->rating_label( $rating );
			}
		}

		return $rating_data;
	}

	/**
	 * The translated "N stars" label for a rating.
	 *
	 * @param int $rating The rating.
	 *
	 * @return string
	 */
	private function rating_label( int $rating ): string {
		return sprintf(
			/* translators: %d: rating value. */
			_n( '%d star', '%d stars', $rating, 'wc-ajax-product-filter' ),
			number_format_i18n( $rating )
		);
	}
}
