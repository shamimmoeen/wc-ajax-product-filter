<?php
/**
 * The rating filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
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
		add_filter( 'wcapf_get_terms_args', array( $this, 'set_rating_terms' ), 10, 2 );
		add_filter( 'wcapf_taxonomy_terms', array( $this, 'set_rating_terms_data' ), 10, 2 );

		add_filter( 'wcapf_tree_item_name', array( $this, 'set_labeled_item_name' ), 10, 3 );
		add_filter( 'wcapf_labeled_item_name', array( $this, 'set_labeled_item_name' ), 10, 3 );
		add_filter( 'wcapf_dropdown_item_name', array( $this, 'set_dropdown_item_name' ), 10, 3 );

		add_filter( 'wcapf_term_filter_query_args', array( $this, 'set_rating_filter_query_args' ), 10, 2 );
	}

	/**
	 * @param array                $args           The arguments of the get_terms function.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_terms( $args, $field_instance ) {
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
	public function set_dropdown_item_name( $inner, $item, $walker ) {
		if ( 'rating' !== $walker->type ) {
			return $inner;
		}

		$rating = absint( $item['id'] );

		if ( ! $rating ) {
			return $inner;
		}

		return $this->get_rating_entities( $rating );
	}

	private function get_rating_entities( $rating ) {
		$rating_entities = '';

		while ( $rating > 0 ) {
			// @source https://www.htmlsymbols.xyz/unicode/U+2B50
			$rating_entities .= '&#11088;';
			$rating --;
		}

		return $rating_entities;
	}

	/**
	 * @param string       $inner  Tree/Menu item inner content.
	 * @param array        $item   The item array.
	 * @param WCAPF_Walker $walker The walker.
	 *
	 * @return string
	 */
	public function set_labeled_item_name( $inner, $item, $walker ) {
		if ( 'rating' !== $walker->type ) {
			return $inner;
		}

		$rating = absint( $item['id'] );

		if ( ! $rating ) {
			return $inner;
		}

		return $this->get_rating_svg_icons( $rating );
	}

	private function get_rating_svg_icons( $rating ) {
		$rating_html = '';

		$remaining = 5 - $rating;

		while ( $rating > 0 ) {
			$rating_html .= '<i class="wcapf-icon-star-full"></i>';
			$rating --;
		}

		$show_empty_stars = apply_filters( 'wcapf_show_empty_star_in_rating', true );

		if ( $show_empty_stars ) {
			while ( $remaining > 0 ) {
				$rating_html .= '<i class="wcapf-icon-star-empty"></i>';
				$remaining --;
			}
		}

		return $rating_html;
	}

	/**
	 * @param array                $args           The products' query args.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function set_rating_filter_query_args( $args, $field_instance ) {
		if ( 'rating' === $field_instance->type ) {
			$tax_query = $args['tax_query'];
			$tax_query = $tax_query[0];

			$rating_tax_query = $tax_query;

			$rating_tax_query['field'] = 'name';
			$rating_tax_query['terms'] = 'rated-' . $tax_query['terms'];

			$args['tax_query'][0] = $rating_tax_query;
		}

		return $args;
	}

}

WCAPF_Rating_Filter::instance();
