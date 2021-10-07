<?php
/**
 * A class for displaying various tree-like structures.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Class
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * WCAPF_List_Walker class.
 *
 * @since 3.0.0
 */
class WCAPF_List_Walker {

	/**
	 * Display type
	 *
	 * @var string
	 */
	public $display_type;

	/**
	 * Query type
	 *
	 * @var string
	 */
	public $query_type;

	/**
	 * Enable multiple filter
	 *
	 * @var bool
	 */
	public $enable_multiple;

	/**
	 * Show count
	 *
	 * @var bool
	 */
	public $show_count;

	/**
	 * Hierarchical
	 *
	 * @var bool
	 */
	public $hierarchical;

	/**
	 * Show children only
	 *
	 * @var bool
	 */
	public $show_children_only;

	/**
	 * Hide empty
	 *
	 * @var bool
	 */
	public $hide_empty;

	/**
	 * Build the menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	public function build_menu( $tree ) {
		$html  = '';
		$attrs = '';

		if ( $this->enable_multiple ) {
			$attrs .= 'data-multiple-filter="1"';
		} else {
			$attrs .= 'data-multiple-filter="0"';
		}

		$attrs .= 'data-filter-key="cata"'; // todo cata or cato

		if ( isset( $this->display_type ) && 'list' === $this->display_type ) {
			$html .= '<div class="wcapf-layered-nav" ' . $attrs . '>';

			if ( isset( $this->hierarchical ) && $this->hierarchical ) {
				$html .= $this->build_hierarchical_menu( $tree );
			} else {
				$html .= $this->build_non_hierarchical_menu( $tree );
			}

		} else {
			$html .= '<div class="wcapf-dropdown-nav">';
			$html .= 'Make the dropdown';
		}

		$html .= '</div>';

		return apply_filters( 'wcapf_build_menu', $html, $this );
	}

	/**
	 * Tree/Menu item.
	 *
	 * @param array $item  The item array.
	 * @param int   $depth The item depth.
	 *
	 * @return string
	 */
	private function tree_item( $item, $depth ) {
		$html = '';

		$inner = '<span>' . esc_html( $item['name'] ) . '</span>';
		$inner .= '<span class="count">(' . esc_html( $item['count'] ) . ')</span>';

		$inner = apply_filters( 'wcapf_tree_item', $inner, $item, $depth );

		$html .= '<span class="item" data-filter-id="' . esc_attr( $item['id'] ) . '">';
		$html .= $inner;
		$html .= '</span>';

		return $html;
	}

	/**
	 * Build the hierarchical menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	public function build_hierarchical_menu( $tree ) {
		$html = '';

		if ( $tree ) {
			$size      = count( $tree );
			$increment = 0;

			foreach ( $tree as $item ) {
				$increment ++;

				$depth = $item['depth'];

				if ( 1 === $increment ) {
					$parent_wrapper_class = apply_filters( 'wcapf_tree_parent_wrapper_class', 'with-children', $depth );

					$html .= '<ul class="' . esc_attr( $parent_wrapper_class ) . '">';
				}

				$html .= '<li>';
				$html .= $this->tree_item( $item, $depth );

				if ( isset( $item['children'] ) ) {
					$html .= $this->build_hierarchical_menu( $item['children'] );
				}

				$html .= '</li>';

				if ( $increment === $size ) {
					$html .= '</ul>';
				}
			}
		}

		return $html;
	}

	/**
	 * Build non-hierarchical menu.
	 *
	 * @param array $tree      The tree as multidimensional array.
	 * @param bool  $wrap_with Determine if we wrap with 'ul' or not.
	 */
	public function build_non_hierarchical_menu( $tree, $wrap_with = true ) {
		$html  = '';
		$depth = 0;

		if ( $wrap_with ) {
			$html .= '<ul>';
		}

		foreach ( $tree as $item ) {
			$html .= '<li>';
			$html .= $this->tree_item( $item, $depth );

			if ( isset( $item['children'] ) ) {
				$wrap_with = false;

				$html .= $this->build_non_hierarchical_menu( $item['children'], $wrap_with );
			}
		}

		if ( $wrap_with ) {
			$html .= '</ul>';
		}

		return $html;
	}

}
