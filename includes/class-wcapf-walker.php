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
	 * TODO: Maybe we remove this.
	 *
	 * @var array
	 */
	public $custom_appearance_options;

	/**
	 * Determines if filter option tooltip is enabled.
	 *
	 * @var string
	 */
	public $enable_tooltip;

	/**
	 * Determines if we show the product count in filter option tooltip.
	 *
	 * @var string
	 */
	public $show_count_in_tooltip;

	/**
	 * Determines the tooltip position.
	 *
	 * @var string
	 */
	public $tooltip_position;

	/**
	 * Determines if we show a search box to narrow down the filter options.
	 *
	 * @var string
	 */
	public $enable_search_field;

	/**
	 * Should we try to reduce the filter height by setting a max height or enabling soft limit?
	 *
	 * @var string
	 */
	public $enable_reduce_height;

	public $enable_soft_limit;

	public $enable_max_height;

	/**
	 * Determines the no of visible items for soft limit.
	 *
	 * @var string
	 */
	public $soft_limit;

	/**
	 * Determines the filter max height.
	 *
	 * @var string
	 */
	public $max_height;

	/**
	 * The property for the extra field data.
	 *
	 * @var array
	 */
	public $field_data;

	/**
	 * The walker items.
	 *
	 * @var array
	 */
	private $items;

	/**
	 * Determines the soft limit status.
	 *
	 * @var string
	 */
	private $soft_limit_status;

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
	 * The term id for current taxonomy archive page.
	 *
	 * TODO: Show the term as checked for the current term page.
	 *
	 * @var int
	 */
	private $current_tax;

	/**
	 * @var WCAPF_URL_Builder
	 */
	private $url_builder;

	/**
	 * The constructor.
	 *
	 * @param WCAPF_Field_Instance $field The field instance.
	 */
	public function __construct( $field ) {
		$this->set_properties( $field );

		$this->items            = $this->set_items( $field );
		$this->active_filters   = $this->active_filters();
		$this->active_items     = $this->active_items();
		$this->active_ancestors = $this->active_ancestors();
		$this->current_tax      = get_queried_object_id();
		$this->url_builder      = new WCAPF_URL_Builder( $this->filter_key, $this->enable_multiple_filter );
	}

	/**
	 * @param WCAPF_Field_Instance $field The field instance.
	 *
	 * @return void
	 */
	private function set_properties( $field ) {
		$default_properties = array(
			'display_type'               => '',
			'hierarchical'               => '',
			'enable_hierarchy_accordion' => '',
			'all_items_label'            => '',
			'use_chosen'                 => '',
			'no_results_message'         => '',
			'enable_multiple_filter'     => '',
			'query_type'                 => '',
			'show_count'                 => '',
			'filter_key'                 => '',
			'filter_type'                => '',
			'type'                       => '',
			'filter_id'                  => '',
			'get_options'                => '',
			'custom_appearance_options'  => array(),
			'enable_tooltip'             => '',
			'show_count_in_tooltip'      => '',
			'tooltip_position'           => '',
			'enable_search_field'        => '',
			'enable_reduce_height'       => '',
			'enable_soft_limit'          => '',
			'enable_max_height'          => '',
			'soft_limit'                 => '',
			'max_height'                 => '',
		);

		foreach ( $default_properties as $key => $value ) {
			if ( isset( $field->$key ) ) {
				$property_value = $field->$key;
			} else {
				$property_value = $field->get_sub_field_value( $key );
			}

			$this->$key = $property_value;
		}

		$this->field_data = apply_filters( 'wcapf_walker_field_data', array(), $field );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return array
	 */
	private function set_items( $field_instance ) {
		$type  = $this->type;
		$items = array();

		switch ( $type ) {
			case 'taxonomy':
			case 'rating':
				$field = new WCAPF_Filter_Type_Taxonomy( $field_instance );
				$items = $field->get_items();

				break;

			case 'product-status':
				$filter = new WCAPF_Filter_Type_Product_Status( $field_instance );
				$items  = $filter->get_items();

				break;

			case 'post-author':
				$filter = new WCAPF_Filter_Type_Post_Author( $field_instance );
				$items  = $filter->get_items();

				break;

			case 'post-meta':
				$filter = new WCAPF_Filter_Type_Post_Meta( $field_instance );
				$items  = $filter->get_items();

				break;
		}

		return $items;
	}

	/**
	 * The active filters.
	 *
	 * @return array
	 */
	private function active_filters() {
		$filter_key = $this->filter_key;
		$field_type = $this->type;

		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		if ( 'rating' === $field_type ) {
			$field_type = 'taxonomy';
		}

		// We have grouped the filters based on filter types.
		$filters = isset( $chosen_filters[ $field_type ] ) ? $chosen_filters[ $field_type ] : array();

		$filter_data = isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();

		return apply_filters( 'wcapf_walker_filter_data', $filter_data, $field_type );
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
	 */
	public function build_menu() {
		$items        = $this->items;
		$display_type = $this->display_type;
		$show_count   = $this->show_count;

		if ( ! $items ) {
			return '<div>' . esc_html__( 'N/A', 'wc-ajax-product-filter' ) . '</div>';
		}

		if ( 'radio' === $display_type || 'select' === $display_type ) {
			$all_items = array(
				0 => array(
					'id'    => '',
					'name'  => $this->all_items_label,
					'count' => '-1',
					'depth' => 1,
				),
			);

			$items = array_merge( $all_items, $items );
		}

		$items = apply_filters( 'wcapf_menu_items', $items, $this );

		if ( $this->enable_soft_limit ) {
			$this->soft_limit_status = $this->get_soft_limit_status( $items );
		}

		$dropdown_types    = array( 'select', 'multiselect' );
		$native_list_types = array( 'checkbox', 'radio' );
		$wrapper_classes   = array();

		if ( in_array( $display_type, $dropdown_types ) ) {
			$wrapper_classes[] = 'wcapf-dropdown-wrapper';
		} else {
			$wrapper_classes[] = 'wcapf-list-wrapper';

			if ( in_array( $display_type, $native_list_types ) ) {
				$wrapper_classes[] = 'list-type-native';

				// Stylish checkbox and radio.
				if ( WCAPF_Helper::use_stylish_checkbox_radio() ) {
					$wrapper_classes[] = 'stylish-checkbox-radio';
				}

				// Hierarchy List.
				if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
					$wrapper_classes[] = 'has-hierarchy-accordion';
				}
			} else {
				$input_type = $this->enable_multiple_filter ? 'checkbox' : 'radio';

				$wrapper_classes[] = 'list-type-custom-' . $input_type;
				$wrapper_classes[] = 'display-type-' . $display_type;

				if ( $show_count ) {
					$wrapper_classes[] = 'show-count';
				}
			}
		}

		if ( in_array( $display_type, $native_list_types ) ) {
			if ( $this->hierarchical ) {
				$html = $this->build_hierarchical_menu( $items );
			} else {
				$html = $this->build_non_hierarchical_menu( $items );
			}
		} elseif ( in_array( $display_type, $dropdown_types ) ) {
			$html = $this->build_dropdown_menu( $items );
		} else {
			$html = $this->build_non_hierarchical_menu( $items );
		}

		if ( 'visible' === $this->soft_limit_status ) {
			$wrapper_classes[] = 'show-hidden-options';
		}

		$wrapper_classes = implode( ' ', $wrapper_classes );

		$menu = '<div class="' . esc_attr( $wrapper_classes ) . '">';
		$menu .= $html;
		$menu .= '</div>';

		return apply_filters( 'wcapf_walker_menu', $menu, $items, $this );
	}

	private function get_soft_limit_status( $items ) {
		$status              = 'hidden';
		$no_of_visible_items = $this->soft_limit;
		$active_items        = $this->active_items;

		if ( ! $active_items ) {
			return $status;
		}

		$index = 0;

		foreach ( $items as $item ) {
			$index ++;

			if ( in_array( $item['id'], $active_items ) ) {
				if ( $index > $no_of_visible_items ) {
					$status = 'visible';
					break;
				}
			}
		}

		return $status;
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

				if ( 1 === $increment ) {
					$html .= $this->hierarchical_menu_start_markup( $parent );
				}

				$has_children = isset( $item['children'] );

				$html .= '<li class="wcapf-filter-option">';
				$html .= $this->menu_item( $item, $has_children );

				if ( $has_children ) {
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
		$classes = 'wcapf-filter-options';
		$attrs   = '';

		if ( $parent ) {
			if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
				if ( $this->item_active_as_ancestor( $parent ) ) {
					$attrs .= ' style="display: block;"';
				} else {
					$attrs .= ' style="display: none;"';
				}
			}
		}

		return '<ul class="' . $classes . '"' . $attrs . '>';
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
	 * @param array $item         The item array.
	 * @param bool  $has_children Determines if we insert the accordion toggle.
	 *
	 * @return string
	 */
	private function menu_item( $item, $has_children = false ) {
		$html         = '';
		$checked      = '';
		$input_markup = '';
		$display_type = $this->display_type;
		$filter_key   = $this->filter_key;
		$item_active  = $this->item_active( $item );
		$input_name   = $filter_key;

		if ( $item_active ) {
			$checked .= ' checked="checked"';
		}

		$item_id    = $item['id'];
		$item_value = rawurlencode( $item['id'] );
		$unique_id  = $filter_key . '-' . $this->filter_id . '-' . $item_id;
		$filter_url = $this->url_builder->get_filter_url( $item_value, $item_active );

		if ( 'checkbox' === $display_type || 'radio' === $display_type ) {
			$input_type = $display_type;
		} else {
			$input_type = 'checkbox';
		}

		$input_markup .= '<input type="' . esc_attr( $input_type ) . '"';
		$input_markup .= ' id="' . esc_attr( $unique_id ) . '"';
		$input_markup .= ' name="' . esc_attr( $input_name ) . '"';
		$input_markup .= ' value="' . esc_attr( $item_value ) . '"';
		$input_markup .= ' data-url="' . esc_url( $filter_url ) . '"';
		$input_markup .= ' aria-invalid="false"';

		/**
		 * Why does the checkbox stay checked when reloading the page?
		 *
		 * @source https://stackoverflow.com/a/471140
		 */
		$input_markup .= ' autocomplete="off"';

		$input_markup .= $checked . '>';

		$name = apply_filters( 'wcapf_menu_item_name', $item['name'], $item, $this );

		$inner = '<span class="wcapf-filter-item-label"';

		if ( $this->enable_search_field ) {
			$inner .= ' data-label="' . esc_attr( $name ) . '"';
		}

		$inner .= '>';
		$inner .= wp_kses_post( $name );

		$count = $item['count'];

		if ( $this->show_count && '-1' !== $count ) {
			$for_screen_reader = sprintf(
				_n( '%d product', '%d products', $count, 'wc-ajax-product-filter' ),
				number_format_i18n( $count )
			);

			$inner .= '<span class="wcapf-nav-item-count">';
			$inner .= '<span aria-hidden="true">' . esc_html( $count ) . '</span>';
			$inner .= '<span class="screen-reader-text">' . esc_html( $for_screen_reader ) . '</span>';
			$inner .= '</span>';
		}

		$inner .= '</span>';

		$html .= '<div class="wcapf-filter-item">';
		$html .= '<label for="' . esc_attr( $unique_id ) . '">';
		$html .= $input_markup;
		$html .= $inner;
		$html .= '</label>';

		if ( $has_children ) {
			$html .= $this->get_hierarchy_accordion_html( $item, $unique_id );
		}

		$html .= '</div>';

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
	 * @param array  $item      The item data.
	 * @param string $unique_id The unique identifier.
	 *
	 * @return string
	 */
	private function get_hierarchy_accordion_html( $item, $unique_id ) {
		$html = '';

		if ( $this->hierarchical && $this->enable_hierarchy_accordion ) {
			$is_active = 'false';

			if ( $this->item_active_as_ancestor( $item ) ) {
				$is_active = 'true';
			}

			$aria_label = sprintf( __( 'Expand/Collapse %s', 'wc-ajax-product-filter' ), $item['name'] );

			$toggle_content = apply_filters( 'wcapf_hierarchy_accordion_toggle_content', '' );

			$html .= '<span';
			$html .= ' class="wcapf-hierarchy-accordion-toggle"';
			$html .= ' role="button" aria-pressed="' . $is_active . '" tabindex="0"';
			$html .= ' aria-label="' . esc_attr( $aria_label ) . '"';
			$html .= ' data-id="' . esc_attr( $unique_id ) . '"';
			$html .= '>' . $toggle_content . '</span>';
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
		$index = 0;

		if ( ! $items ) {
			return $html;
		}

		$visible_items = $this->soft_limit;

		// Show the search field before the filter options.
		$html .= $this->get_search_field();

		$wrapper_classes = 'wcapf-filter-options';
		$wrapper_styles  = '';

		if ( $this->enable_max_height ) {
			$wrapper_classes .= ' wcapf-enable-scrollbar';
			$wrapper_styles  = ' style="max-height: ' . $this->max_height . 'px;"';
		}

		$html .= '<ul class="' . $wrapper_classes . '"' . $wrapper_styles . '>';

		foreach ( $items as $item ) {
			$index ++;

			$item_classes = 'wcapf-filter-option';

			if ( $this->enable_soft_limit && $index > $visible_items ) {
				$item_classes .= ' wcapf-filter-option-hidden';
			}

			$html .= '<li class="' . $item_classes . '">';
			$html .= $this->menu_item( $item );
			$html .= '</li>';
		}

		$html .= '</ul>';

		if ( count( $items ) > $visible_items ) {
			$html .= $this->get_soft_limit_toggle();
		}

		return $html;
	}

	/**
	 * Gets the search field html markup.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public function get_search_field() {
		if ( ! $this->enable_search_field ) {
			return '';
		}

		$placeholder = __( 'Search', 'wc-ajax-product-filter' );

		return WCAPF_Template_Loader::get_instance()->load(
			'search-box',
			array(
				'placeholder'   => $placeholder,
				'icon_position' => 'right',
			),
			false
		);
	}

	/**
	 * Gets the html markup of soft limit toggle.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public function get_soft_limit_toggle() {
		$html = '';

		if ( $this->enable_soft_limit ) {
			$is_active = 'false';

			if ( 'visible' === $this->soft_limit_status ) {
				$is_active = 'true';
			}

			$show_all  = esc_html__( '+ Show more', 'wc-ajax-product-filter' );
			$show_less = esc_html__( '− Show less', 'wc-ajax-product-filter' );

			$html .= '<div class="wcapf-soft-limit-wrapper">';
			$html .= '<span';
			$html .= ' class="wcapf-soft-limit-trigger"';
			$html .= ' role="button" aria-pressed="' . $is_active . '" tabindex="0"';
			$html .= ' aria-label="' . esc_attr__( 'Show/hide all options', 'wc-ajax-product-filter' ) . '"';
			$html .= '>';
			$html .= '<span aria-hidden="true" class="wcapf-show-more">' . $show_all . '</span>';
			$html .= '<span aria-hidden="true" class="wcapf-show-less">' . $show_less . '</span>';
			$html .= '</span>';
			$html .= '</div>';
		}

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
			$input_multiple = ' multiple="multiple"';
		}

		$use_combobox = WCAPF_Helper::use_combobox();

		if ( $use_combobox ) {
			$input_classes = 'wcapf-chosen';
		} else {
			$input_classes = 'wcapf-select';

			if ( WCAPF_Helper::improve_native_select() ) {
				$input_classes .= ' wcapf-select-improved';

				if ( 'multiselect' === $display_type ) {
					$input_classes .= ' wcapf-select-multiple';
				}
			}
		}

		$all_items_label = $this->all_items_label;

		if ( 'multiselect' === $display_type ) {
			$input_attrs .= 'data-placeholder="' . esc_attr( $all_items_label ) . '"';

			if ( $use_combobox && $this->hierarchical ) {
				$input_classes .= ' has-hierarchy';
			}
		}

		$filter_url       = $this->url_builder->get_dropdown_url();
		$clear_filter_url = $this->url_builder->get_clear_filter_url();

		$input_attrs .= ' data-url="' . esc_url( $filter_url ) . '"';
		$input_attrs .= ' data-clear-filter-url="' . esc_url( $clear_filter_url ) . '"';

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
		$item_active = $this->item_active( $item );

		$option = '';
		$attrs  = '';

		if ( $item_active ) {
			$attrs .= ' selected="selected"';
		}

		$item_value = rawurlencode( $item['id'] );

		$attrs .= ' value="' . esc_attr( $item_value ) . '"';

		if ( $this->hierarchical && $this->use_chosen ) {
			$attrs .= ' class="depth-' . esc_attr( $item['depth'] ) . '"';
		}

		$option .= '<option' . $attrs . '>';

		if ( $this->hierarchical && ! $this->use_chosen ) {
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
		$_indent = apply_filters( 'wcapf_dropdown_item_indent_content', '&nbsp;&nbsp;&nbsp;&nbsp;' );
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

		$html .= '<ul class="wcapf-filter-options">';

		foreach ( $items as $item ) {
			$index ++;
			$attrs = '';

			$html .= '<li class="wcapf-filter-option"' . $attrs . '>';
			$html .= $this->labeled_item( $item, $index );
			$html .= '</li>';
		}

		$html .= '</ul>';

		return $html;
	}

	private function labeled_item( $item, $index ) {
		$attrs       = '';
		$classes     = 'item';
		$item_active = $this->item_active( $item );

		if ( $item_active ) {
			$classes .= ' checked';
		}

		$item_value = rawurlencode( $item['id'] );
		$filter_url = $this->url_builder->get_filter_url( $item_value, $item_active );

		$classes = apply_filters( 'wcapf_labeled_item_classes', $classes, $index, $this, $item );
		$attrs   = apply_filters( 'wcapf_labeled_item_attrs', $attrs, $item, $this );

		$html = '<button class="' . $classes . '" data-url="' . esc_url( $filter_url ) . '"' . $attrs . '>';

		$label = apply_filters( 'wcapf_labeled_item_name', $item['name'], $item, $this );
		$html  .= wp_kses_post( $label );

		if ( $this->show_count ) {
			$html .= '<span class="wcapf-nav-item-count">' . $item['count'] . '</span>';
		}

		$html .= '</button>';

		$html = $this->menu_item( $item );

		return $html;
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
			$inner .= '<span class="wcapf-nav-item-count">' . esc_html( $count ) . '</span>';
		}

		$inner .= '</label>';

		return apply_filters( 'wcapf_tree_item_inner', $inner, $item, $unique_id, $this, $depth );
	}

}
