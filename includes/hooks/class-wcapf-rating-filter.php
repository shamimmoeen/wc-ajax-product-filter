<?php
/**
 * The rating filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/hooks
 * @author     wptools.io
 */

/**
 * WCAPF_Rating_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Rating_Filter {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Rating_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Rating_Filter();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_filter( 'wcapf_field_filter_type', array( $this, 'set_rating_filter_type' ), 10, 3 );
		add_filter( 'wcapf_field_taxonomy', array( $this, 'set_taxonomy_for_rating_filter' ), 10, 2 );

		add_filter( 'wcapf_get_terms_args', array( $this, 'set_rating_terms_query_args' ), 10, 2 );
		add_filter( 'wcapf_taxonomy_terms', array( $this, 'set_rating_terms_data' ), 10, 2 );

		add_filter( 'wcapf_taxonomy_filter_values', array( $this, 'set_rating_filter_values' ), 10, 2 );
		add_filter( 'wcapf_active_taxonomy_filter_data', array( $this, 'set_rating_filter_data' ), 10, 3 );

		add_filter( 'wcapf_menu_item_name', array( $this, 'set_rating_item_name' ), 10, 3 );
		add_filter( 'wcapf_labeled_item_name', array( $this, 'set_rating_item_name' ), 10, 3 );
		add_filter( 'wcapf_dropdown_item_name', array( $this, 'set_rating_dropdown_item_name' ), 10, 3 );
	}

	/**
	 * @param string $filter_type The filter type.
	 * @param string $field_type  The field type.
	 * @param string $get_options The field get_options method.
	 *
	 * @return string
	 */
	public function set_rating_filter_type( $filter_type, $field_type, $get_options ) {
		if ( 'rating' !== $field_type ) {
			return $filter_type;
		}

		if ( 'automatically' !== $get_options ) {
			return $filter_type;
		}

		return 'taxonomy';
	}

	/**
	 * @param string $taxonomy   The taxonomy name.
	 * @param string $field_type The field type.
	 *
	 * @return string
	 */
	public function set_taxonomy_for_rating_filter( $taxonomy, $field_type ) {
		if ( 'rating' === $field_type ) {
			$taxonomy = 'product_visibility';
		}

		return $taxonomy;
	}

	/**
	 * @param array                $values         The filter values.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_filter_values( $values, $field_instance ) {
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
	 * @param array                $filter_data    The filter data.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $ratings        The rating values.
	 *
	 * @return array
	 */
	public function set_rating_filter_data( $filter_data, $field_instance, $ratings ) {
		if ( 'rating' !== $field_instance->type ) {
			return $filter_data;
		}

		$display_type = $field_instance->display_type;
		$filter_data  = array();

		foreach ( $ratings as $rating ) {
			$rating = absint( $rating );

			if ( 'select' === $display_type || 'multiselect' === $display_type ) {
				$filter_data[ $rating ] = WCAPF_Helper::get_rating_entities( $rating );
			} else {
				// $filter_data[ $rating ] = WCAPF_Helper::get_rating_svg_icons( $rating );
				$filter_data[ $rating ] = sprintf(
					_n( '%d star', '%d stars', $rating, 'wc-ajax-product-filter' ),
					$rating
				);
			}
		}

		return $filter_data;
	}

	/**
	 * @param array                $args           The arguments of the get_terms function.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_terms_query_args( $args, $field_instance ) {
		if ( 'rating' === $field_instance->type ) {
			$names = array();

			for ( $rating = 5; $rating >= 1; $rating -- ) {
				$names[] = 'rated-' . $rating;
			}

			$args['name']  = $names;
			$args['order'] = 'DESC';
		}

		return $args;
	}

	/**
	 * @param array                $terms          The taxonomy terms.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_terms_data( $terms, $field_instance ) {
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
	 * @param string       $inner  Tree/Menu item inner content.
	 * @param array        $item   The item array.
	 * @param WCAPF_Walker $walker The walker.
	 *
	 * @return string
	 */
	public function set_rating_dropdown_item_name( $inner, $item, $walker ) {
		if ( 'rating' !== $walker->type ) {
			return $inner;
		}

		if ( 'automatically' !== $walker->get_options ) {
			return $inner;
		}

		$rating = absint( $item['id'] );

		if ( ! $rating ) {
			return $inner;
		}

		return WCAPF_Helper::get_rating_entities( $rating );
	}

	/**
	 * @param string       $inner  Tree/Menu item inner content.
	 * @param array        $item   The item array.
	 * @param WCAPF_Walker $walker The walker.
	 *
	 * @return string
	 */
	public function set_rating_item_name( $inner, $item, $walker ) {
		if ( 'rating' !== $walker->type ) {
			return $inner;
		}

		if ( 'automatically' !== $walker->get_options ) {
			return $inner;
		}

		$rating = absint( $item['id'] );

		if ( ! $rating ) {
			return $inner;
		}

		return WCAPF_Helper::get_rating_svg_icons( $rating );
	}

}

WCAPF_Rating_Filter::instance();
