<?php
/**
 * WCAPF_Walker class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Walker class.
 *
 * @since 3.0.0
 */
class WCAPF_Walker {

	/**
	 * Display type
	 *
	 * @var string
	 */
	public $display_type;

	/**
	 * Is Hierarchical
	 *
	 * @var string
	 */
	public $hierarchical;

	/**
	 * Enable multiple filter
	 *
	 * @var bool
	 */
	public $enable_multiple;

	/**
	 * Query type
	 *
	 * @var string
	 */
	public $query_type;

	/**
	 * Show count
	 *
	 * @var bool
	 */
	public $show_count;

	/**
	 * Filter key
	 *
	 * @var string
	 */
	public $filter_key;

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

		$filter_key = $this->get_filter_key();

		$attrs .= 'data-filter-key="' . $filter_key . '"';

		if ( isset( $this->display_type ) && 'list' === $this->display_type ) {
			$html .= '<div class="wcapf-layered-nav" ' . $attrs . '>';

			if ( $this->hierarchical ) {
				$html .= $this->build_hierarchical_menu( $tree );
			} else {
				$html .= $this->build_non_hierarchical_menu( $tree );
			}
		} else {
			$html .= '<div class="wcapf-dropdown-nav">';
			$html .= 'Make the dropdown'; // TODO: Build the dropdown
		}

		$html .= '</div>';

		return apply_filters( 'wcapf_build_menu', $html, $this );
	}

	/**
	 * Gets the filter key.
	 *
	 * TODO: Maybe redundant.
	 *
	 * @return string
	 */
	private function get_filter_key() {
		return $this->filter_key;
	}

	/**
	 * Build the hierarchical menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	private function build_hierarchical_menu( $tree ) {
		$html = '';

		if ( $tree ) {
			$size      = count( $tree );
			$increment = 0;

			foreach ( $tree as $item ) {
				$increment++;

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
	 * Tree/Menu item.
	 *
	 * @param array $item  The item array.
	 * @param int   $depth The item depth.
	 *
	 * @return string
	 */
	private function tree_item( $item, $depth ) {
		$html = '';

		$classes = $this->item_active( $item ) ? 'item chosen' : 'item';

		$inner = '<span>' . esc_html( $item['name'] ) . '</span>';

		if ( $this->show_count ) {
			$inner .= '<span class="count">(' . esc_html( $item['count'] ) . ')</span>';
		}

		$inner = apply_filters( 'wcapf_tree_item', $inner, $item, $depth );

		$html .= '<span class="' . $classes . '" data-filter-id="' . esc_attr( $item['id'] ) . '">';
		$html .= $inner;
		$html .= '</span>';

		return $html;
	}

	/**
	 * Checks if the given item is active.
	 *
	 * @param array $item The item data.
	 *
	 * @return bool
	 */
	private function item_active( $item ) {
		if ( in_array( strval( $item['id'] ), $this->get_active_filters(), true ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Gets the active filters.
	 *
	 * @return array|string[]
	 */
	public function get_active_filters() {
		$key = $this->get_filter_key();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$str = isset( $_GET[ $key ] ) ? $_GET[ $key ] : '';

		if ( $str ) {
			return explode( ',', $str );
		}

		return array();
	}

	/**
	 * Build non-hierarchical menu.
	 *
	 * @param array $tree      The tree as multidimensional array.
	 * @param bool  $wrap_with Determine if we wrap with 'ul' or not.
	 */
	private function build_non_hierarchical_menu( $tree, $wrap_with = true ) {
		$html  = '';
		$depth = 0;

		if ( $wrap_with ) {
			$html .= '<ul>';
		}

		foreach ( $tree as $item ) {
			$html .= '<li>';
			$html .= $this->tree_item( $item, $depth );

			if ( isset( $item['children'] ) ) {
				$html .= $this->build_non_hierarchical_menu( $item['children'], false );
			}
		}

		if ( $wrap_with ) {
			$html .= '</ul>';
		}

		return $html;
	}

}
