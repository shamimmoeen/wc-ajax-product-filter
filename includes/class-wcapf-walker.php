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
	 * Display type.
	 *
	 * @var string
	 */
	public $display_type;

	/**
	 * Is Hierarchical.
	 *
	 * @var bool
	 */
	public $hierarchical;

	/**
	 * Enable Hierarchy Accordion.
	 *
	 * @var bool
	 */
	public $enable_hierarchy_accordion;

	/**
	 * All items label.
	 *
	 * @var string
	 */
	public $all_items_label;

	/**
	 * Use chosen.
	 *
	 * @var bool
	 */
	public $use_chosen;

	/**
	 * Chosen no results message.
	 *
	 * @var string
	 */
	public $no_results_message;

	/**
	 * Enable multiple filter.
	 *
	 * @var bool
	 */
	public $enable_multiple;

	/**
	 * Query type.
	 *
	 * @var string
	 */
	public $query_type;

	/**
	 * Show count.
	 *
	 * @var bool
	 */
	public $show_count;

	/**
	 * Filter key.
	 *
	 * @var string
	 */
	public $filter_key;

	/**
	 * Filter key.
	 *
	 * @var string
	 */
	public $filter_type;

	/**
	 * Custom appearance options.
	 *
	 * @var array
	 */
	public $custom_appearance_options;

	/**
	 * Form id.
	 *
	 * @var string
	 */
	public $form_id;

	/**
	 * The position.
	 *
	 * @var string
	 */
	public $position;

	/**
	 * Build the menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	public function build_menu( $tree ) {
		$display_type = $this->display_type;
		$show_count   = $this->show_count;

		$list_types     = array( 'checkbox', 'radio' );
		$dropdown_types = array( 'select', 'multi-select' );

		if ( in_array( $display_type, $list_types ) ) {
			$wrapper_classes = 'wcapf-layered-nav display-type-' . $display_type;
		} elseif ( in_array( $display_type, $dropdown_types ) ) {
			$wrapper_classes = 'wcapf-dropdown-nav';
		} else {
			$wrapper_classes = 'wcapf-labeled-nav display-type-' . $display_type;
		}

		if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
			$wrapper_classes .= ' hierarchy-accordion';
		}

		if ( $show_count ) {
			$wrapper_classes .= ' show-count';
		}

		if ( in_array( $display_type, $list_types ) ) {
			if ( $this->hierarchical ) {
				$html = $this->build_hierarchical_menu( $tree );
			} else {
				$html = $this->build_non_hierarchical_menu( $tree );
			}
		} elseif ( in_array( $display_type, $dropdown_types ) ) {
			$html = $this->build_dropdown_menu( $tree );
		} else {
			$html = $this->build_labeled_nav( $tree );
		}

		$attrs = $this->get_wrapper_attrs();

		$menu = '<div class="' . esc_attr( $wrapper_classes ) . '" ' . $attrs . '>';
		$menu .= $html;
		$menu .= '</div>';

		return apply_filters( 'wcapf_walker_menu', $menu, $this );
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
				$increment ++;

				$depth = $item['depth'];

				if ( 1 === $increment ) {
					$parent_wrapper_class = apply_filters( 'wcapf_tree_parent_wrapper_class', 'with-children', $depth );

					$html .= '<ul class="' . esc_attr( $parent_wrapper_class ) . '">';
				}

				$html .= '<li>';
				$html .= $this->tree_item( $item, $depth );

				if ( isset( $item['children'] ) ) {
					$html .= $this->get_hierarchy_accordion_html( $item );
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
		$html         = '';
		$checked      = '';
		$input_markup = '';
		$filter_key   = $this->filter_key;
		$input_name   = $filter_key;

		if ( $this->item_active( $item ) ) {
			$checked .= ' checked="checked"';
		}

		if ( $this->enable_multiple ) {
			$input_name .= '[]';
		}

		$item_id   = $item['id'];
		$unique_id = $filter_key . '-input-' . $this->form_id . '-' . $this->position . '-' . $item_id;

		$input_markup .= '<input type="' . esc_attr( $this->display_type ) . '"';
		$input_markup .= ' id="' . $unique_id . '"';
		$input_markup .= ' name="' . esc_attr( $input_name ) . '"';
		$input_markup .= ' value="' . esc_attr( $item_id ) . '"';
		$input_markup .= $checked . '>';

		$inner = $this->tree_item_inner( $item, $unique_id, $depth );

		$html .= $input_markup;
		$html .= $inner;

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
		$active_items = $this->get_active_items();

		if ( $active_items ) {
			if ( in_array( strval( $item['id'] ), $active_items, true ) ) {
				return true;
			}
		} else {
			if ( '-1' === $item['count'] ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Gets the active items.
	 *
	 * @return array|string[]
	 */
	public function get_active_items() {
		$active_filters = $this->get_active_filters();

		return isset( $active_filters['values'] ) ? $active_filters['values'] : array();
	}

	/**
	 * Gets the active filters.
	 *
	 * @return array
	 */
	private function get_active_filters() {
		$filter_key     = $this->filter_key;
		$filter_type    = $this->filter_type;
		$wcapf_filter   = WCAPF_Product_Filter::instance();
		$chosen_filters = $wcapf_filter->get_chosen_filters();

		$filters = $chosen_filters[ $filter_type ];

		return isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();
	}

	/**
	 * Tree/Menu item inner content.
	 *
	 * @param array $item  The item array.
	 * @param mixed $depth The item depth.
	 *
	 * @return string
	 */
	private function tree_item_inner( $item, $unique_id, $depth = null ) {
		$inner = '<label for="' . esc_attr( $unique_id ) . '">';
		$inner .= '<span>' . esc_html( $item['name'] ) . '</span>';

		$count = $item['count'];

		if ( $this->show_count && '-1' !== $count ) {
			$inner .= '<span class="count">' . esc_html( $count ) . '</span>';
		}

		$inner .= '</label>';

		return apply_filters( 'wcapf_tree_item', $inner, $item, $depth );
	}

	/**
	 * @param array $item The item data.
	 *
	 * @return string
	 */
	private function get_hierarchy_accordion_html( $item ) {
		$html = '';

		if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
			$classes = 'hierarchy-accordion-toggle';

			if ( $this->item_active_as_ancestor( $item ) ) {
				$classes .= ' active';
			}

			$html .= '<span class="' . esc_attr( $classes ) . '" tabindex="0"></span>';
		}

		return $html;
	}

	/**
	 * Checks if the given item is active as ancestor.
	 *
	 * @param array $item The item data.
	 *
	 * @return bool
	 */
	private function item_active_as_ancestor( $item ) {
		// Ancestors are coming as int, and we don't compare it in strict mode.
		if ( in_array( $item['id'], $this->get_active_ancestors() ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Gets the active ancestors.
	 *
	 * @return array
	 */
	public function get_active_ancestors() {
		$active_filters = $this->get_active_filters();

		return isset( $active_filters['active_ancestors'] ) ? $active_filters['active_ancestors'] : array();
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

	/**
	 * Build the dropdown menu.
	 *
	 * @param array $tree The tree as multidimensional array.
	 */
	private function build_dropdown_menu( $tree ) {
		$input_name     = $this->filter_key;
		$input_multiple = '';
		$input_attrs    = '';

		if ( 'multi-select' === $this->display_type ) {
			$input_name     .= '[]';
			$input_multiple = ' multiple="multiple"';
		}

		if ( $this->use_chosen ) {
			$input_classes = 'wcapf-chosen-select';
		} else {
			$input_classes = 'wcapf-select';
		}

		$all_items_label = $this->all_items_label;

		if ( $all_items_label && 'multi-select' === $this->display_type ) {
			$input_attrs .= 'data-placeholder="' . esc_attr( $all_items_label ) . '"';
		}

		$no_results_message = $this->no_results_message;

		if ( $no_results_message ) {
			$input_attrs .= ' data-no-results-message="' . esc_attr( $no_results_message ) . '"';
		}

		$html = '<select class="' . $input_classes . '"';
		$html .= ' name="' . esc_attr( $input_name ) . '"';
		$html .= $input_attrs;
		$html .= $input_multiple;
		$html .= '>';

		foreach ( $tree as $item ) {
			$html .= $this->dropdown_item( $item );
		}

		$html .= '</select>';

		return $html;
	}

	/**
	 * Dropdown item.
	 *
	 * @param array $item The item array.
	 *
	 * @return string
	 */
	private function dropdown_item( $item ) {
		$option = '';

		$selected = $this->item_active( $item ) ? ' selected="selected"' : '';

		$option .= '<option value="' . esc_attr( $item['id'] ) . '"' . $selected . '>';

		if ( $this->hierarchical ) {
			$option .= $this->dropdown_item_depth( $item );
		}

		$option .= $item['name'];

		$count = $item['count'];

		if ( $this->show_count && '-1' !== $count ) {
			$option .= ' (' . $item['count'] . ')';
		}

		$option .= '</option>';

		$children = isset( $item['children'] ) ? $item['children'] : array();

		if ( $children ) {
			foreach ( $children as $child_item ) {
				$option .= $this->dropdown_item( $child_item );
			}
		}

		return $option;
	}

	private function dropdown_item_depth( $item ) {
		$spaces = '';
		$depth  = $item['depth'];

		while ( $depth > 1 ) {
			$spaces .= '&nbsp;&nbsp;&nbsp;';
			$depth --;
		}

		return $spaces;
	}

	private function build_labeled_nav( $tree ) {
		$html = '';

		foreach ( $tree as $item ) {
			$html .= $this->labeled_item( $item );
		}

		return $html;
	}

	private function labeled_item( $item ) {
		$style = '';

		$display_type = $this->display_type;

		$id = $item['id'];

		if ( 'color' === $display_type ) {
			$color = '#fff'; // Default color.

			$appearance_options = isset( $this->custom_appearance_options[ $id ] )
				? $this->custom_appearance_options[ $id ]
				: array();

			if ( $appearance_options ) {
				$color = $appearance_options['color'];
			}

			$style .= ' style="background-color: ' . $color . ';"';
		}

		$classes = 'item';

		if ( $this->item_active( $item ) ) {
			$classes .= ' checked';
		}

		$html = '<div class="' . $classes . '"' . $style . ' data-value="' . esc_attr( $id ) . '" tabindex="0">';

		if ( 'color' !== $display_type && 'image' !== $display_type ) {
			$html .= $item['name'];
		}

		if ( 'image' === $display_type ) {
			$appearance_options = isset( $this->custom_appearance_options[ $id ] )
				? $this->custom_appearance_options[ $id ]
				: array();

			if ( $appearance_options ) {
				$image = $appearance_options['image_url'];
				$html  .= '<img src="' . esc_url( $image ) . '" alt="' . esc_attr( $item['name'] ) . '">';
			}
		}

		if ( $this->show_count ) {
			$html .= '<span class="count">' . $item['count'] . '</span>';
		}

		$html .= '</div>';

		$children = isset( $item['children'] ) ? $item['children'] : array();

		if ( $children ) {
			foreach ( $children as $child_item ) {
				$html .= $this->labeled_item( $child_item );
			}
		}

		return $html;
	}

	/**
	 * @return string
	 */
	private function get_wrapper_attrs() {
		$wrapper_attrs = '';

		if ( $this->enable_multiple ) {
			$wrapper_attrs .= 'data-multiple-filter="1"';
		} else {
			$wrapper_attrs .= 'data-multiple-filter="0"';
		}

		$wrapper_attrs .= 'data-filter-key="' . $this->filter_key . '"';

		return $wrapper_attrs;
	}

}
