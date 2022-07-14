<?php
/**
 * WCAPF_Walker class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
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
	 * @var string
	 */
	public $hierarchical;

	/**
	 * Enable Hierarchy Accordion.
	 *
	 * @var string
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
	 * @var string
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
	 * @var string
	 */
	public $enable_multiple_filter;

	/**
	 * Query type.
	 *
	 * @var string
	 */
	public $query_type;

	/**
	 * Show count.
	 *
	 * @var string
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
	 * Field type.
	 *
	 * @var string
	 */
	public $type;

	/**
	 * Filter id.
	 *
	 * @var string
	 */
	public $filter_id;

	/**
	 * Get options method.
	 *
	 * @var string
	 */
	public $get_options;

	/**
	 * Custom appearance options.
	 *
	 * @var array
	 */
	public $custom_appearance_options;

	/**
	 * The property for the extra field data.
	 *
	 * @var array
	 */
	public $field_data;

	/**
	 * The active filters.
	 *
	 * @var array
	 */
	private $active_filters;

	/**
	 * The active items.
	 *
	 * @var array
	 */
	private $active_items;

	/**
	 * The active ancestors.
	 *
	 * @var array
	 */
	private $active_ancestors;

	/**
	 * The constructor.
	 *
	 * @param WCAPF_Field_Instance $field The field instance.
	 */
	public function __construct( $field ) {
		$this->set_properties( $field );

		$this->active_filters   = $this->active_filters();
		$this->active_items     = $this->active_items();
		$this->active_ancestors = $this->active_ancestors();
	}

	/**
	 * @param WCAPF_Field_Instance $field The field instance.
	 *
	 * @return void
	 */
	private function set_properties( $field ) {
		$default_properties = array(
			'display_type'               => '',
			'hierarchical'               => false,
			'enable_hierarchy_accordion' => false,
			'all_items_label'            => '',
			'use_chosen'                 => false,
			'no_results_message'         => '',
			'enable_multiple_filter'     => false,
			'query_type'                 => '',
			'show_count'                 => false,
			'filter_key'                 => '',
			'filter_type'                => '',
			'type'                       => '',
			'filter_id'                  => '',
			'get_options'                => '',
			'custom_appearance_options'  => array(),
		);

		foreach ( $default_properties as $key => $value ) {
			$property_value = $value;

			if ( isset( $field->$key ) ) {
				$property_value = $field->$key;
			}

			$this->$key = $property_value;
		}

		$this->field_data = apply_filters( 'wcapf_walker_field_data', array(), $field );
	}

	/**
	 * The active filters.
	 *
	 * @return array
	 */
	private function active_filters() {
		$filter_key  = $this->filter_key;
		$filter_type = $this->filter_type;
		$field_type  = $this->type;

		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		if ( 'attribute' === $field_type ) {
			$filter_type = 'attribute';
		} elseif ( 'price' === $field_type ) {
			$filter_type = 'price';
		}

		// We have grouped the filters based on filter types.
		$filters = isset( $chosen_filters[ $filter_type ] ) ? $chosen_filters[ $filter_type ] : array();

		$filter_data = isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();

		return apply_filters( 'wcapf_walker_filter_data', $filter_data, $filter_type );
	}

	/**
	 * The active items.
	 *
	 * @return array|string[]
	 */
	private function active_items() {
		$active_filters = $this->active_filters;

		return isset( $active_filters['values'] ) ? $active_filters['values'] : array();
	}

	/**
	 * The active ancestors.
	 *
	 * @return array
	 */
	private function active_ancestors() {
		$active_filters = $this->active_filters;

		return isset( $active_filters['active_ancestors'] ) ? $active_filters['active_ancestors'] : array();
	}

	/**
	 * Build the menu.
	 *
	 * @param array $items The array of items.
	 */
	public function build_menu( $items ) {
		$display_type = $this->display_type;
		$show_count   = $this->show_count;

		if ( 'radio' === $display_type || 'select' === $display_type ) {
			$all_items = array(
				0 => array(
					'id'    => '',
					'name'  => $this->all_items_label,
					'count' => '-1',
					'depth' => 1,
				)
			);

			$items = array_merge( $all_items, $items );
		}

		$items = apply_filters( 'wcapf_menu_items', $items, $this );

		$list_types     = array( 'checkbox', 'radio' );
		$dropdown_types = array( 'select', 'multiselect' );

		if ( in_array( $display_type, $list_types ) ) {
			$wrapper_classes = 'wcapf-layered-nav display-type-' . $display_type;
		} elseif ( in_array( $display_type, $dropdown_types ) ) {
			$wrapper_classes = 'wcapf-dropdown-nav';
		} else {
			$wrapper_classes = 'wcapf-labeled-nav display-type-' . $display_type;
		}

		if ( $show_count ) {
			$wrapper_classes .= ' show-count';
		}

		if ( in_array( $display_type, $list_types ) ) {
			if ( $this->hierarchical ) {
				$html = $this->build_hierarchical_menu( $items );
			} else {
				$html = $this->build_non_hierarchical_menu( $items );
			}
		} elseif ( in_array( $display_type, $dropdown_types ) ) {
			$html = $this->build_dropdown_menu( $items );
		} else {
			$html = $this->build_labeled_nav( $items );
		}

		$attrs = $this->get_wrapper_attrs();

		$menu = '<div class="' . esc_attr( $wrapper_classes ) . '" ' . $attrs . '>';
		$menu .= $html;
		$menu .= '</div>';

		return apply_filters( 'wcapf_walker_menu', $menu, $items, $this );
	}

	/**
	 * Build the hierarchical menu.
	 *
	 * @param array $items  The array of items.
	 * @param array $parent The parent item data.
	 *
	 * @return string
	 */
	private function build_hierarchical_menu( $items, $parent = array() ) {
		$html = '';

		if ( $items ) {
			$size      = count( $items );
			$increment = 0;

			foreach ( $items as $item ) {
				$increment ++;

				$depth = $item['depth'];

				if ( 1 === $increment ) {
					$html .= $this->hierarchical_menu_start_markup( $parent );
				}

				$html .= '<li>';
				$html .= $this->menu_item( $item, $depth );

				if ( isset( $item['children'] ) ) {
					$html .= $this->get_hierarchy_accordion_html( $item );
					$html .= $this->build_hierarchical_menu( $item['children'], $item );
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
	 * Hierarchical menu's start markup.
	 *
	 * @param array $parent The parent item.
	 *
	 * @return string
	 */
	private function hierarchical_menu_start_markup( $parent ) {
		$attrs = '';

		if ( $parent ) {
			$attrs .= ' class="item-children"';

			if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
				if ( $this->item_active_as_ancestor( $parent ) ) {
					$attrs .= ' style="display: block;"';
				} else {
					$attrs .= ' style="display: none;"';
				}
			}
		}

		return '<ul' . $attrs . '>';
	}

	/**
	 * Checks if the given item is active as ancestor.
	 *
	 * @param array $item The item data.
	 *
	 * @return bool
	 */
	private function item_active_as_ancestor( $item ) {
		if ( in_array( $item['id'], $this->active_ancestors ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Menu item.
	 *
	 * @param array $item  The item array.
	 * @param int   $depth The item depth.
	 *
	 * @return string
	 */
	private function menu_item( $item, $depth ) {
		$html         = '';
		$checked      = '';
		$input_markup = '';
		$filter_key   = $this->filter_key;
		$input_name   = $filter_key;

		if ( $this->item_active( $item ) ) {
			$checked .= ' checked="checked"';
		}

		if ( $this->enable_multiple_filter ) {
			$input_name .= '[]';
		}

		$item_id    = $item['id'];
		$item_value = rawurlencode( $item['id'] );
		$unique_id  = $filter_key . '-input-' . $this->filter_id . '-' . $item_id;

		$input_markup .= '<input type="' . esc_attr( $this->display_type ) . '"';
		$input_markup .= ' id="' . $unique_id . '"';
		$input_markup .= ' name="' . esc_attr( $input_name ) . '"';
		$input_markup .= ' value="' . esc_attr( $item_value ) . '"';
		$input_markup .= $checked . '>';

		$inner = $this->menu_item_inner( $item, $unique_id, $depth );

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
		$active_items = $this->active_items;

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
	 * Menu item inner content.
	 *
	 * @param array $item  The item array.
	 * @param mixed $depth The item depth.
	 *
	 * @return string
	 */
	private function menu_item_inner( $item, $unique_id, $depth = null ) {
		$inner = '<label for="' . esc_attr( $unique_id ) . '">';

		$name = apply_filters( 'wcapf_menu_item_name', $item['name'], $item, $this );

		$inner .= '<span>' . wp_kses_post( $name ) . '</span>';

		$count = $item['count'];

		if ( $this->show_count && '-1' !== $count ) {
			$inner .= '<span class="count">' . esc_html( $count ) . '</span>';
		}

		$inner .= '</label>';

		return apply_filters( 'wcapf_tree_item_inner', $inner, $item, $unique_id, $this, $depth );
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

			$toggle_content = apply_filters( 'wcapf_hierarchy_accordion_toggle_content', '' );

			$html .= '<span class="' . esc_attr( $classes ) . '" tabindex="0">' . $toggle_content . '</span>';
		}

		return $html;
	}

	/**
	 * Build non-hierarchical menu.
	 *
	 * @param array $items The array of items.
	 */
	private function build_non_hierarchical_menu( $items ) {
		$html  = '';
		$depth = 0;
		$index = 0;

		if ( ! $items ) {
			return $html;
		}

		$html .= '<ul>';

		foreach ( $items as $item ) {
			$index ++;
			$attrs = apply_filters( 'wcapf_non_hierarchical_menu_item_attrs', '', $index, $this, $item );

			$html .= '<li' . $attrs . '>';
			$html .= $this->menu_item( $item, $depth );
		}

		$html .= '</ul>';

		return $html;
	}

	/**
	 * Build the dropdown menu.
	 *
	 * @param array $items The array of items.
	 */
	private function build_dropdown_menu( $items ) {
		$display_type   = $this->display_type;
		$input_name     = $this->filter_key;
		$input_multiple = '';
		$input_attrs    = '';

		if ( 'multiselect' === $display_type ) {
			$input_name     .= '[]';
			$input_multiple = ' multiple="multiple"';
		}

		if ( $this->use_chosen ) {
			$input_classes = 'wcapf-chosen-select';
		} else {
			$input_classes = 'wcapf-select';
		}

		$all_items_label = $this->all_items_label;

		if ( 'multiselect' === $display_type ) {
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

		foreach ( $items as $item ) {
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

		$item_value = rawurlencode( $item['id'] );

		$option .= '<option value="' . esc_attr( $item_value ) . '"' . $selected . '>';

		if ( $this->hierarchical ) {
			$option .= $this->dropdown_item_indent( $item );
		}

		$inner = $item['name'];

		$option .= apply_filters( 'wcapf_dropdown_item_name', $inner, $item, $this );

		$count = $item['count'];

		if ( $this->show_count && '-1' !== $count ) {
			$count_before = apply_filters( 'wcapf_dropdown_item_count_before', ' (' );
			$count_after  = apply_filters( 'wcapf_dropdown_item_count_after', ')' );

			$option .= $count_before . $item['count'] . $count_after;
		}

		$option .= '</option>';

		$inner = apply_filters( 'wcapf_dropdown_item', $option, $item, $this );

		$children = isset( $item['children'] ) ? $item['children'] : array();

		if ( $children ) {
			foreach ( $children as $child_item ) {
				$inner .= $this->dropdown_item( $child_item );
			}
		}

		return $inner;
	}

	/**
	 * Indent for hierarchy in dropdown.
	 *
	 * @param array $item The item array.
	 *
	 * @return string
	 */
	private function dropdown_item_indent( $item ) {
		$indent  = '';
		$_indent = apply_filters( 'wcapf_dropdown_item_indent_content', '&nbsp;&nbsp;&nbsp;' );
		$depth   = $item['depth'];

		while ( $depth > 1 ) {
			$indent .= $_indent;
			$depth --;
		}

		return $indent;
	}

	/**
	 * Build the labeled nav menu.
	 *
	 * @param array $items The array of items.
	 */
	private function build_labeled_nav( $items ) {
		$html  = '';
		$index = 0;

		foreach ( $items as $item ) {
			$index ++;
			$html .= $this->labeled_item( $item, $index );
		}

		return $html;
	}

	private function labeled_item( $item, $index ) {
		$attrs   = '';
		$classes = 'item';

		if ( $this->item_active( $item ) ) {
			$classes .= ' checked';
		}

		$item_value = rawurlencode( $item['id'] );

		$attrs .= ' data-value="' . esc_attr( $item_value ) . '"';
		$attrs .= ' tabindex="0"';

		$classes = apply_filters( 'wcapf_labeled_item_classes', $classes, $index, $this, $item );
		$attrs   = apply_filters( 'wcapf_labeled_item_attrs', $attrs, $item, $this );

		$html = '<div class="' . $classes . '"' . $attrs . '>';

		$label = apply_filters( 'wcapf_labeled_item_name', $item['name'], $item, $this );
		$html  .= wp_kses_post( $label );

		if ( $this->show_count ) {
			$html .= '<span class="count">' . $item['count'] . '</span>';
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * @return string
	 */
	private function get_wrapper_attrs() {
		$wrapper_attrs = '';

		if ( $this->enable_multiple_filter ) {
			$wrapper_attrs .= 'data-multiple-filter="1"';
		} else {
			$wrapper_attrs .= 'data-multiple-filter="0"';
		}

		$wrapper_attrs .= 'data-filter-key="' . $this->filter_key . '"';

		return $wrapper_attrs;
	}

}
