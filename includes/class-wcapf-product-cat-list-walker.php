<?php

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * WCAPF_Product_Cat_List_Walker class.
 *
 * @since      3.0.0
 */
class WCAPF_Product_Cat_List_Walker extends WC_Product_Cat_List_Walker {
	public $query_type;
	public $multiple_filter;
	public $base;

	public function __construct( $query_type = 'and', $multiple_filter = true ) {
		$this->query_type      = $query_type;
		$this->multiple_filter = $multiple_filter ? true : false;
		$this->base            = $this->get_base();
	}

	public function get_base() {
		if ( $this->query_type === 'and' ) {
			$base = 'cata';
		} else {
			$base = 'cato';
		}

		return $base;
	}

	/**
	 * Start the element output.
	 *
	 * @see        Walker::start_el()
	 * @since      3.0.0
	 *
	 * @param      string   $output             Passed by reference. Used to
	 *                                          append additional content.
	 * @param      object   $cat                Category.
	 * @param      int      $depth              Depth of category in reference
	 *                                          to parents.
	 * @param      array    $args               Arguments.
	 * @param      integer  $current_object_id  Current object ID.
	 */
	public function start_el( &$output, $cat, $depth = 0, $args = array(), $current_object_id = 0 ) {
		$cat_id = intval( $cat->term_id );

		$output .= '<li class="cat-item cat-item-' . $cat_id;

		if ( $args['current_category'] === $cat_id ) {
			$output .= ' current-cat';
		}

		if (
			$args['has_children'] &&
			$args['hierarchical'] &&
			( empty( $args['max_depth'] ) || $args['max_depth'] > $depth + 1 )
		) {
			$output .= ' cat-parent';
		}

		if (
			$args['current_category_ancestors'] &&
			$args['current_category'] &&
			in_array( $cat_id, $args['current_category_ancestors'], true )
		) {
			$output .= ' current-cat-parent';
		}

		$cat_link = wcapf_build_query_string( $this->base, $cat_id, $this->multiple_filter );

		$output .=
			'"><a href="' . $cat_link . '">' . apply_filters( 'wcapf_list_product_cats', $cat->name, $cat ) . '</a>';

		if ( $args['show_count'] ) {
			$output .= ' <span class="count">(' . $cat->count . ')</span>';
		}
	}
}
