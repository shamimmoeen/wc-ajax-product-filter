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
	 * @return bool
	 */
	public static function found_pro_version() {
		return defined( 'WCAPF_PRO_VERSION' );
	}

	/**
	 * The forms page url.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function forms_page_url() {
		return menu_page_url( 'wcapf', false );
	}

	/**
	 * The seo rules page url.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function seo_rules_page_url() {
		return menu_page_url( 'wcapf-seo-rules', false );
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
	 * The upgrade page url.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function upgrade_page_url() {
		return menu_page_url( 'wcapf-upgrade', false );
	}

	/**
	 * Gets the meta keys for post type product.
	 *
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlDialectInspection
	 *
	 * @source https://stackoverflow.com/a/54017483
	 *
	 * @return array
	 */
	public static function get_available_meta_keys() {
		global $wpdb;

		$post_type = 'product';

		$query = $wpdb->prepare(
			"
				SELECT DISTINCT($wpdb->postmeta.meta_key)
		        FROM $wpdb->posts
		        LEFT JOIN $wpdb->postmeta
		        ON $wpdb->posts.ID = $wpdb->postmeta.post_id
		        WHERE $wpdb->posts.post_type = %s
				AND $wpdb->postmeta.meta_key IS NOT NULL
				ORDER BY $wpdb->postmeta.meta_key
				",
			$post_type
		);

		$results   = $wpdb->get_col( $query );
		$meta_keys = array();

		foreach ( $results as $result ) {
			$meta_keys[] = array(
				'value' => $result,
				'label' => $result,
			);
		}

		return $meta_keys;
	}

	/**
	 * Gets the available meta values for the given meta key.
	 *
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlDialectInspection
	 *
	 * @source https://wordpress.stackexchange.com/q/9394
	 *
	 * @return array
	 */
	public static function get_available_meta_values( $meta_key ) {
		global $wpdb;

		$post_type     = 'product';
		$post_statuses = WCAPF_Helper::filterable_post_statuses();

		$query = $wpdb->prepare(
			"
				SELECT DISTINCT $wpdb->postmeta.meta_value
				FROM $wpdb->postmeta
				INNER JOIN $wpdb->posts
				ON $wpdb->postmeta.post_id = $wpdb->posts.ID
		        WHERE $wpdb->posts.post_type = %s
		        AND $wpdb->posts.post_status IN ('" . implode( "','", $post_statuses ) . "')
				AND $wpdb->postmeta.meta_key = %s
				AND $wpdb->postmeta.meta_value <> ''
				GROUP BY $wpdb->postmeta.meta_value
				ORDER BY $wpdb->postmeta.meta_value
				",
			$post_type,
			$meta_key
		);

		$query = apply_filters( 'wcapf_available_meta_values_sql_query', $query, $meta_key );

		$results = $wpdb->get_col( $query );

		return apply_filters( 'wcapf_product_meta_values', $results, $meta_key );
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
	 * Gets the time period options.
	 *
	 * @return array
	 */
	public static function get_time_period_options( $with_ranges = false ) {
		$options = array();

		$ranges = array(
			'today'        => __( 'Today', 'wc-ajax-product-filter-pro' ),
			'yesterday'    => __( 'Yesterday', 'wc-ajax-product-filter-pro' ),
			'this-week'    => __( 'This week', 'wc-ajax-product-filter-pro' ),
			'last-week'    => __( 'Last week', 'wc-ajax-product-filter-pro' ),
			'this-month'   => __( 'This month', 'wc-ajax-product-filter-pro' ),
			'last-month'   => __( 'Last month', 'wc-ajax-product-filter-pro' ),
			'last-14-days' => __( 'Last 14 days', 'wc-ajax-product-filter-pro' ),
			'last-30-days' => __( 'Last 30 days', 'wc-ajax-product-filter-pro' ),
			'last-90-days' => __( 'Last 90 days', 'wc-ajax-product-filter-pro' ),
			'this-year'    => __( 'This year', 'wc-ajax-product-filter-pro' ),
			'last-year'    => __( 'Last year', 'wc-ajax-product-filter-pro' ),
		);

		$range_separator = WCAPF_Helper::range_values_separator();

		$timestamp = current_time( 'timestamp' );
		$format    = 'Y-m-d';
		$today     = date( $format, $timestamp );

		foreach ( $ranges as $value => $label ) {
			$range = '';

			switch ( $value ) {
				case 'today':
					$start = date( $format, strtotime( $today ) );
					$range = $start . $range_separator . $start;

					break;

				case 'yesterday':
					$start = date( $format, strtotime( $today . ' -1 day' ) );
					$range = $start . $range_separator . $start;

					break;

				case 'this-week':
					$date = new DateTime();

					$current_year = date( 'Y' );
					$current_week = $date->format( 'W' );

					$dto = new DateTime();
					$dto->setISODate( $current_year, $current_week );
					$start = $dto->format( $format );
					$dto->modify( '+6 days' );
					$end = $dto->format( $format );

					$range = $start . $range_separator . $end;

					break;

				case 'last-week':
					$previous_week = strtotime( '-1 week +1 day' );

					$start_week = strtotime( 'last sunday midnight', $previous_week );
					$end_week   = strtotime( 'next saturday', $start_week );

					$start_week = date( $format, $start_week );
					$end_week   = date( $format, $end_week );

					$range = $start_week . $range_separator . $end_week;

					break;

				case 'this-month':
					$start = date( 'Y-m-01' );
					$end   = date( 'Y-m-t' );

					$range = $start . $range_separator . $end;

					break;

				case 'last-month':
					$start = date( $format, strtotime( 'first day of previous month' ) );
					$end   = date( $format, strtotime( 'last day of previous month' ) );

					$range = $start . $range_separator . $end;

					break;

				case 'last-14-days':
					$start = date( $format, strtotime( $today . ' -13 days' ) );
					$range = $start . $range_separator . $today;

					break;

				case 'last-30-days':
					$start = date( $format, strtotime( $today . ' -29 days' ) );
					$range = $start . $range_separator . $today;

					break;

				case 'last-90-days':
					$start = date( $format, strtotime( $today . ' -89 days' ) );
					$range = $start . $range_separator . $today;

					break;

				case 'this-year':
					$start = date( $format, strtotime( 'first day of January 1st' ) );
					$end   = date( $format, strtotime( 'last day of December 31st' ) );

					$range = $start . $range_separator . $end;

					break;

				case 'last-year':
					$start = date( $format, strtotime( 'last year January 1st' ) );
					$end   = date( $format, strtotime( 'last year December 31st' ) );

					$range = $start . $range_separator . $end;

					break;
			}

			if ( ! $range ) {
				continue;
			}

			$options[] = array(
				'value' => $value,
				'label' => $label,
				'range' => $range,
			);
		}

		$time_period_options = apply_filters( 'wcapf_time_period_options', $options );

		if ( $with_ranges ) {
			return $time_period_options;
		}

		return wp_list_pluck( $time_period_options, 'label', 'value' );
	}

	/**
	 * @return string
	 */
	public static function range_values_separator() {
		return '~';
	}

	/**
	 * The field types where the field key is required.
	 *
	 * TODO: Maybe moved to WCAPF_API_Utils class.
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
	 * @return array
	 */
	public static function range_input_display_types() {
		return array( 'range_slider', 'range_number' );
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
		$settings = self::get_settings();

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

		/**
		 * For v3 to v4 migration, sets the default author roles for our post-author filter.
		 *
		 * TODO: Should be deprecated.
		 */
		if ( ! isset( $db_options['author_roles'] ) ) {
			$db_options['author_roles'] = array( 'administrator', 'shop_manager' );
		}

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
	 * @param array  $filter_data      Active filters data.
	 * @param string $filter_key       The filter key.
	 * @param string $layout           The layout, simple or extended.
	 * @param string $use_custom_title Determines if we show custom title instead of filter title.
	 * @param string $extra_class      Markup extra class.
	 *
	 * @return string
	 */
	public static function get_active_filters_markup(
		$filter_data,
		$filter_key,
		$layout,
		$use_custom_title,
		$extra_class = ''
	) {
		$active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();
		$filter_type    = isset( $filter_data['filter_type'] ) ? $filter_data['filter_type'] : '';
		$filter_id      = isset( $filter_data['filter_id'] ) ? $filter_data['filter_id'] : '';
		$custom_title   = isset( $filter_data['custom_title'] ) ? $filter_data['custom_title'] : '';

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

			$label = apply_filters(
				'wcapf_active_filter_label',
				$label,
				$layout,
				$filter_type,
				$filter_id,
				$use_custom_title,
				$custom_title,
				$filter_key
			);

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

		if ( ! $button_label ) {
			$button_label = __( 'Reset', 'wc-ajax-product-filter' );
		}

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
			$html = '<button type="button" class="button wcapf-reset-filters-btn" ' . $attrs . '>';
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

		return apply_filters( 'wcapf_active_filters_data', $sorted, $sort_by_value, $chosen_filters );
	}

	/**
	 * @return array
	 */
	public static function get_chosen_filters() {
		global $wcapf_chosen_filters;

		return $wcapf_chosen_filters ?: array();
	}

	/**
	 * Retrieve the array format from the filter manual options.
	 * The input is string for v3.0.0 and array for v4.0.0.
	 *
	 * TODO: Might be deprecated in the future.
	 *
	 * @param string|array $raw Filter manual options.
	 *
	 * @return array
	 */
	public static function retrieve_manual_options_array( $raw ) {
		if ( ! is_array( $raw ) ) {
			$decode  = rawurldecode( $raw );
			$options = json_decode( $decode, true );
		} else {
			$options = $raw;
		}

		if ( ! is_array( $options ) ) {
			$options = array();
		}

		return $options;
	}

	/**
	 * Checks if WCFM Marketplace found.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function is_wcfm_marketplace_found() {
		return class_exists( 'WCFMmp' );
	}

	/**
	 * Determines if we enable the focus styles.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function use_focus_style() {
		return apply_filters( 'wcapf_use_focus_style', true );
	}

	/**
	 * Determines if we enable the focus styles.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function use_stylish_checkbox_radio() {
		$settings = self::get_settings();

		return isset( $settings['stylish_checkbox_radio'] ) ? $settings['stylish_checkbox_radio'] : '';
	}

	/**
	 * Determines if we use combobox instead of native select element.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function use_combobox() {
		$settings = self::get_settings();

		return isset( $settings['use_chosen'] ) ? $settings['use_chosen'] : '';
	}

	/**
	 * Determines if we try to improve the native select element.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function improve_native_select() {
		$settings = self::get_settings();

		return isset( $settings['improve_native_select'] ) ? $settings['improve_native_select'] : '';
	}

	/**
	 * Gets the primary color.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_primary_color() {
		$settings = self::get_settings();

		$hex = isset( $settings['primary_color'] ) ? $settings['primary_color'] : '#345DBB';

		list( $r, $g, $b ) = sscanf( $hex, "#%02x%02x%02x" );

		return array( $r, $g, $b );
	}

	/**
	 * Gets the primary color.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_primary_accent_color() {
		$settings = self::get_settings();

		$hex = isset( $settings['primary_accent_color'] ) ? $settings['primary_accent_color'] : '#ffffff';

		list( $r, $g, $b ) = sscanf( $hex, "#%02x%02x%02x" );

		return array( $r, $g, $b );
	}

	/**
	 * Determines if we keep the filter accordion as opened when the filter is active.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function keep_accordion_opened_when_filter_active() {
		return apply_filters( 'wcapf_keep_accordion_opened_when_filter_active', true );
	}

}
