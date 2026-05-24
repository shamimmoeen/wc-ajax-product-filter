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
 * Renders the rating filter on top of the taxonomy filter pipeline.
 *
 * Rating is not a distinct filter type; it reuses the taxonomy type against
 * the product_visibility `rated-N` terms, with these hooks adjusting the
 * term query, values, labels and star-icon output.
 */
class RatingFilter {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wcapf_field_filter_type', array( $this, 'set_rating_filter_type' ), 10, 3 );

		add_filter( 'wcapf_get_terms_args', array( $this, 'set_rating_terms_query_args' ), 10, 2 );
		add_filter( 'wcapf_taxonomy_terms', array( $this, 'set_rating_terms_data' ), 10, 2 );

		add_filter( 'wcapf_taxonomy_filter_values', array( $this, 'set_rating_filter_values' ), 10, 2 );
		add_filter( 'wcapf_active_taxonomy_filter_data', array( $this, 'rating_filter_star_icons' ), 10, 3 );

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
	 * Sets rating filter values using product visibility term IDs.
	 *
	 * @param array                 $values         The filter values.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_filter_values( array $values, $field_instance ): array {
		if ( 'rating' !== $field_instance->type ) {
			return $values;
		}

		$new_values = array();

		foreach ( $values as $value ) {
			$new_values[] = 'rated-' . $value;
		}

		$terms = get_terms(
			array(
				'taxonomy'   => 'product_visibility',
				'hide_empty' => false,
				'fields'     => 'ids',
				'slug'       => $new_values,
			)
		);

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		return $terms;
	}

	/**
	 * Set the rating filter data for active filters.
	 *
	 * @param array                 $filter_data    The filter data.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                 $ratings        The rating values.
	 *
	 * @return array
	 */
	public function rating_filter_star_icons( array $filter_data, $field_instance, array $ratings ): array {
		if ( 'rating' !== $field_instance->type ) {
			return $filter_data;
		}

		$use_star_icons = apply_filters( 'wcapf_use_star_icons_in_rating_filters_data', false );
		$rating_data    = array();

		foreach ( $ratings as $rating ) {
			$rating = absint( $rating );

			if ( $use_star_icons ) {
				$rating_data[ $rating ] = wcapf()->rating->icons( $rating );
			} else {
				$rating_data[ $rating ] = $this->get_rating_label( $rating );
			}
		}

		return $rating_data;
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
	 * Sets the terms query arguments for rating filters.
	 *
	 * @param array                 $args           The arguments of the get_terms() function.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_terms_query_args( array $args, $field_instance ): array {
		if ( 'rating' === $field_instance->type ) {
			$names = array();

			for ( $rating = 5; $rating >= 1; $rating-- ) {
				$names[] = 'rated-' . $rating;
			}

			$args['name']  = $names;
			$args['order'] = 'DESC';
		}

		return $args;
	}

	/**
	 * Normalizes rating term data for the filter output.
	 *
	 * @param array                 $terms          The taxonomy terms.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_terms_data( array $terms, $field_instance ): array {
		if ( 'rating' !== $field_instance->type ) {
			return $terms;
		}

		$new_terms = array();

		foreach ( $terms as $term_id => $term ) {
			$name   = $term['name'];
			$rating = str_replace( 'rated-', '', $name );

			$term['id'] = $rating;

			$new_terms[ $term_id ] = $term;
		}

		return $new_terms;
	}

	/**
	 * Fill the rating items with star icons.
	 *
	 * @param array         $items  The walker items.
	 * @param \WCAPF_Walker $walker The walker class instance.
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
