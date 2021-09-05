<?php
/**
 * A class for displaying various tree-like structures.
 *
 * @package WC_Ajax_Product_Filter
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
	 * Gets the menu item link.
	 *
	 * @return  string  The url with query strings.
	 */
	public function get_item_link() {
		return $link;
	}

	/**
	 * Build non hierarchical menu.
	 *
	 * @param array $tree      The tree as multidimensional array.
	 * @param bool  $wrap_with Should we wrap with 'ul' or not.
	 */
	public function build_non_hierarchical_menu( $tree, $wrap_with = true ) {
		if ( $wrap_with ) {
			echo '<ul>';
		}

		foreach ( $tree as $item ) {
			echo '<li><a href="#">' . esc_html( $item['name'] ) . '</a>';

			if ( isset( $item['children'] ) ) {
				$wrap_with = false;
				$this->build_non_hierarchical_menu( $item['children'], $wrap_with );
			}
		}

		if ( $wrap_with ) {
			echo '</ul>';
		}
	}

	/**
	 * Build the hierarchical menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	public function build_hierarchical_menu( $tree ) {
		if ( $tree ) {
			$size      = count( $tree );
			$increment = 0;

			foreach ( $tree as $item ) {
				$increment++;

				if ( 1 === $increment ) {
					echo '<ul>';
				}

				echo '<li><a href="#">' . esc_html( $item['name'] ) . '</a>';

				if ( isset( $item['children'] ) ) {
					$this->build_hierarchical_menu( $item['children'] );
				}

				echo '</li>';

				if ( $increment === $size ) {
					echo '</ul>';
				}
			}
		}
	}

	/**
	 * Build the menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	public function build_menu( $tree ) {
		if ( isset( $this->display_type ) && 'list' === $this->display_type ) {
			if ( isset( $this->hierarchical ) && 1 === $this->hierarchical ) {
				$this->build_hierarchical_menu( $tree );
			} else {
				$this->build_non_hierarchical_menu( $tree );
			}
		} else {
			echo 'Make the dropdown';
		}
	}
}
