<?php
/**
 * The helper class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Helper class.
 *
 * @since 3.0.0
 */
class WCAPF_Helper {

	/**
	 * Determines if we show the pro features modal.
	 *
	 * @return bool
	 */
	public static function show_pro_version_offer() {
		return apply_filters( 'wcapf_show_pro_offer', true );
	}

	/**
	 * @return bool
	 */
	public static function found_pro_version() {
		return defined( 'WCAPF_PRO_VERSION' );
	}

	/**
	 * The settings page url.
	 *
	 * @return string
	 */
	public static function settings_page_url() {
		return menu_page_url( 'wcapf-settings', false );
	}

	/**
	 * The filtering works for the products with these post statuses.
	 *
	 * @return array
	 */
	public static function filterable_post_statuses() {
		$post_statuses = array( 'publish' );

		// Shop managers can see the private products, the filtering should work there.
		if ( current_user_can( 'manage_woocommerce' ) ) {
			$post_statuses[] = 'private';
		}

		return apply_filters( 'wcapf_filterable_post_statuses', $post_statuses );
	}

	/**
	 * The available search form fields.
	 *
	 * @return array
	 */
	public static function available_search_fields() {
		$fields = array(
			array(
				'type'     => 'active-filters',
				'name'     => __( 'Active Filters', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'category',
				'name'     => __( 'Filter by Category', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'tag',
				'name'     => __( 'Filter by Tag', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'attribute',
				'name'     => __( 'Filter by Attribute', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'price',
				'name'     => __( 'Filter by Price', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'rating',
				'name'     => __( 'Filter by Rating', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'product-status',
				'name'     => __( 'Filter by Product Status', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'reset-button',
				'name'     => __( 'Reset Button', 'wc-ajax-product-filter' ),
				'position' => 15,
			),
		);

		$fields = apply_filters( 'wcapf_available_search_fields', $fields );
		$fields = wp_list_sort( $fields, 'position' );

		return wp_list_pluck( $fields, 'name', 'type' );
	}

	/**
	 * The field types where the field key is required.
	 *
	 * @return array
	 */
	public static function field_types_with_key_required() {
		return apply_filters(
			'wcapf_field_types_with_key_required',
			array(
				'category',
				'tag',
				'attribute',
				'price',
				'rating',
				'product-status',
			)
		);
	}

	/**
	 * The taxonomy field types.
	 *
	 * @return array
	 */
	public static function taxonomy_field_types() {
		$types = array( 'category', 'tag', 'attribute' );

		return apply_filters( 'wcapf_taxonomy_field_types', $types );
	}

	/**
	 * Renders the field's form for the given instance.
	 *
	 * @param array $field_instance The field's instance.
	 *
	 * @return void
	 */
	public static function render_field_form_by_instance( $field_instance ) {
		$type       = isset( $field_instance['type'] ) ? $field_instance['type'] : '';
		$class_name = self::get_field_class_name_by_type( $type );

		if ( ! $class_name ) {
			return;
		}

		$field = self::get_field_instance( $type, $field_instance );
		$field->form();
	}

	/**
	 * Gets the field's class name for the given type.
	 *
	 * @param string $type The field type.
	 *
	 * @return string
	 */
	public static function get_field_class_name_by_type( $type ) {
		$field_keys = explode( '-', $type );
		$class_name = 'WCAPF_Field_';
		$index      = 0;

		foreach ( $field_keys as $_field_key ) {
			if ( 0 < $index ) {
				$class_name .= '_';
			}

			$class_name .= ucfirst( $_field_key );

			$index ++;
		}

		if ( ! class_exists( $class_name ) ) {
			return '';
		}

		return apply_filters( 'wcapf_field_class_name_by_type', $class_name, $type );
	}

	/**
	 * Gets the field's instance.
	 *
	 * @param string $type           The field type.
	 * @param array  $field_instance The field's instance.
	 *
	 * @return WCAPF_Field
	 */
	public static function get_field_instance( $type, $field_instance = array() ) {
		$class = self::get_field_class_name_by_type( $type );

		return new $class( $field_instance );
	}

	/**
	 * Gets the product status options.
	 *
	 * @return array
	 */
	public static function get_product_status_options() {
		$options = array(
			'featured' => __( 'Featured', 'wc-ajax-product-filter' ),
			'on_sale'  => __( 'On sale', 'wc-ajax-product-filter' ),
		);

		return apply_filters( 'wcapf_product_status_options', $options );
	}

	/**
	 * The product status option row markup.
	 *
	 * @param array $data The template data.
	 *
	 * @return void
	 */
	public static function product_status_option_markup( $data = array() ) {
		WCAPF_Template_Loader::get_instance()->load( 'admin/field-templates/product-status-option-row', $data );
	}

	/**
	 * @return string
	 */
	public static function range_values_separator() {
		return '~';
	}

	/**
	 * @return array
	 */
	public static function range_number_filter_types() {
		return apply_filters( 'wcapf_range_number_filter_types', array( 'range_slider', 'range_number' ) );
	}

	/**
	 * @param WCAPF_Field_Instance $instance The field instance.
	 *
	 * @return bool
	 */
	public static function round_range_min_max_values( $instance ) {
		$type  = $instance->type;
		$round = false;

		// For price filter we do the rounding.
		if ( 'price' === $type ) {
			$round = true;
		}

		return apply_filters( 'wcapf_round_range_min_max_values', $round, $instance );
	}

	/**
	 * Gets the field relations.
	 *
	 * @return string
	 */
	public static function get_field_relations() {
		$settings = WCAPF_Helper::get_settings();

		return isset( $settings['filter_relationships'] ) ? $settings['filter_relationships'] : 'and';
	}

	/**
	 * Gets the wcapf settings.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$option_name = self::settings_option_key();
		$db_options  = get_option( $option_name );
		$db_options  = $db_options ?: array();

		if ( has_filter( $option_name ) ) {
			$settings = wp_parse_args( apply_filters( $option_name, $db_options ), $db_options );
		} else {
			$settings = $db_options;
		}

		return $settings;
	}

	/**
	 * The option key that contains the plugin settings.
	 *
	 * @return string
	 */
	public static function settings_option_key() {
		return 'wcapf_settings';
	}

	/**
	 * @param int $rating The rating.
	 *
	 * @return string
	 */
	public static function get_rating_entities( $rating ) {
		$rating_entities = '';

		while ( $rating > 0 ) {
			// @source https://www.htmlsymbols.xyz/unicode/U+2B50
			$rating_entities .= '&#11088;';
			$rating --;
		}

		return $rating_entities;
	}

	/**
	 * @param int $rating The rating.
	 *
	 * @return string
	 */
	public static function get_rating_svg_icons( $rating ) {
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
	 * Checks if the product attribute filtering via lookup table feature is enabled.
	 *
	 * @return bool
	 */
	public static function filtering_via_lookup_table_is_active() {
		return 'yes' === get_option( 'woocommerce_attribute_lookup_enabled' );
	}

	/**
	 * @return bool
	 */
	public static function hide_stock_out_items() {
		return 'yes' === get_option( 'woocommerce_hide_out_of_stock_items' );
	}

	/**
	 * @param array  $filter_data Active filters data.
	 * @param string $filter_key  The filter key.
	 * @param string $layout      The layout, simple or extended.
	 * @param string $extra_class Markup extra class.
	 *
	 * @return string
	 */
	public static function get_active_filters_markup( $filter_data, $filter_key, $layout, $extra_class = '' ) {
		$active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();
		$filter_type    = isset( $filter_data['filter_type'] ) ? $filter_data['filter_type'] : array();
		$filter_id      = isset( $filter_data['filter_id'] ) ? $filter_data['filter_id'] : array();

		$html = '';

		$classes = 'item';

		if ( $extra_class ) {
			$classes .= ' ' . $extra_class;
		}

		foreach ( $active_filters as $value => $label ) {
			$attrs = 'class="' . $classes . '"';
			$attrs .= ' tabindex="0"';
			$attrs .= ' data-filter-key="' . esc_attr( $filter_key ) . '"';
			$attrs .= ' data-value="' . esc_attr( rawurlencode( $value ) ) . '"';

			$label = apply_filters( 'wcapf_active_filter_label', $label, $layout, $filter_type, $filter_id, $filter_key );

			$html .= '<div ' . $attrs . '>' . wp_kses_post( $label ) . '</div>';
		}

		return $html;
	}

	/**
	 * @param string $button_label The label for button.
	 *
	 * @return string
	 */
	public static function get_reset_filters_button_markup( $button_label, $tag = 'button' ) {
		$active_filters = self::get_active_filters_data();
		$filter_keys    = array_keys( $active_filters );

		if ( $filter_keys ) {
			$keys = implode( ',', $filter_keys );
		} else {
			$keys = '';
		}

		$attrs = 'data-keys="' . esc_attr( $keys ) . '"';

		if ( ! $filter_keys ) {
			$attrs .= 'disabled="disabled"';
		}

		if ( 'a' === $tag ) {
			$html = '<a role="button" tabindex="0" class="wcapf-reset-filters-btn" ' . $attrs . '>';
			$html .= $button_label;
			$html .= '</a>';
		} else {
			$html = '<button type="button" class="wcapf-reset-filters-btn" ' . $attrs . '>';
			$html .= $button_label;
			$html .= '</button>';
		}

		return $html;
	}

	/**
	 * @return array
	 */
	public static function get_active_filters_data( $sort_by_value = false ) {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();
		$active_filters = array();

		foreach ( $chosen_filters as $filter_type_filters ) {
			foreach ( $filter_type_filters as $filter_type => $filter ) {
				$_active_filters = isset( $filter['active_filters'] ) ? $filter['active_filters'] : array();
				$filter_id       = isset( $filter['filter_id'] ) ? $filter['filter_id'] : '';
				$filter_key      = ! empty( $filter['filter_key'] ) ? $filter['filter_key'] : $filter_type;

				if ( ! $_active_filters ) {
					continue;
				}

				if ( $sort_by_value ) {
					foreach ( $_active_filters as $value => $label ) {
						$active_filters[] = array(
							'filter_key'     => $filter_key,
							'filter_type'    => $filter_type,
							'filter_id'      => $filter_id,
							'active_filters' => array( $value => $label ),
						);
					}
				} else {
					$active_filters[ $filter_key ] = array(
						'filter_type'    => $filter_type,
						'filter_id'      => $filter_id,
						'active_filters' => $_active_filters,
					);
				}
			}
		}

		// Sort the data according to the order in $_GET variable.
		$sorted = array();

		if ( $sort_by_value ) {
			foreach ( $_GET as $_key => $_value ) {
				foreach ( $active_filters as $active_filter ) {
					if ( $_key === $active_filter['filter_key'] ) {
						$sorted[] = $active_filter;
					}
				}
			}
		} else {
			foreach ( $_GET as $_key => $_value ) {
				if ( array_key_exists( $_key, $active_filters ) ) {
					$sorted[ $_key ] = $active_filters[ $_key ];
				}
			}
		}

		return apply_filters( 'wcapf_active_filters_data', $sorted, $chosen_filters );
	}

	/**
	 * @return array
	 */
	public static function get_chosen_filters() {
		global $wcapf_chosen_filters;

		return $wcapf_chosen_filters ?: array();
	}

}
