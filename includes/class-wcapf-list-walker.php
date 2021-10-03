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
		$html = '';

		if ( isset( $this->display_type ) && 'list' === $this->display_type ) {
			$html .= '<div class="wcapf-layered-nav">';

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

				if ( 1 === $increment ) {
					$html .= '<ul>';
				}

				$html .= '<li><a href="#">' . esc_html( $item['name'] ) . '</a>';
				$html .= '<span class="count">(' . esc_html( $item['count'] ) . ')</span>';

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
		$html = '';

		if ( $wrap_with ) {
			$html .= '<ul>';
		}

		foreach ( $tree as $item ) {
			$html .= '<li><a href="#">' . esc_html( $item['name'] ) . '</a>';

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
