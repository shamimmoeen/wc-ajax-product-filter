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
	 * Gets the form edit page url.
	 *
	 * @param int $form_id The form id.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function form_edit_url( $form_id ) {
		$forms_page_url = admin_url( 'admin.php?page=wcapf' );

		return add_query_arg( 'id', $form_id, $forms_page_url );
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
			'today'        => __( 'Today', 'wc-ajax-product-filter' ),
			'yesterday'    => __( 'Yesterday', 'wc-ajax-product-filter' ),
			'this-week'    => __( 'This week', 'wc-ajax-product-filter' ),
			'last-week'    => __( 'Last week', 'wc-ajax-product-filter' ),
			'this-month'   => __( 'This month', 'wc-ajax-product-filter' ),
			'last-month'   => __( 'Last month', 'wc-ajax-product-filter' ),
			'last-14-days' => __( 'Last 14 days', 'wc-ajax-product-filter' ),
			'last-30-days' => __( 'Last 30 days', 'wc-ajax-product-filter' ),
			'last-90-days' => __( 'Last 90 days', 'wc-ajax-product-filter' ),
			'this-year'    => __( 'This year', 'wc-ajax-product-filter' ),
			'last-year'    => __( 'Last year', 'wc-ajax-product-filter' ),
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
	 * @return array
	 */
	public static function number_input_display_types() {
		return array( 'range_slider', 'range_number' );
	}

	/**
	 * @param WCAPF_Field_Instance $instance The field instance.
	 *
	 * @return bool
	 */
	public static function round_range_min_max_values( $instance ) {
		return apply_filters( 'wcapf_round_range_min_max_values', true, $instance );
	}

	/**
	 * Gets the field relations.
	 *
	 * @return string
	 */
	public static function get_field_relations() {
		return self::wcapf_option( 'filter_relationships', 'and' );
	}

	/**
	 * Gets the option.
	 *
	 * @param string $key
	 * @param mixed  $default
	 *
	 * @since 4.0.0
	 *
	 * @return mixed
	 */
	public static function wcapf_option( $key, $default = '' ) {
		global $wcapf;

		$value = isset( $wcapf[ $key ] ) ? $wcapf[ $key ] : '';

		if ( ! $value && $default ) {
			return $default;
		}

		return $value;
	}

	/**
	 * Determines if wcapf is configured for the page.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function found_wcapf() {
		global $wcapf;

		return (bool) $wcapf;
	}

	/**
	 * Determines if we load the js, css scripts conditionally(only when in the pages where filters found).
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function load_scripts_conditionally() {
		return apply_filters( 'wcapf_load_scripts_conditionally', true );
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
		$star_icons  = self::get_rating_star_icons();

		$remaining = 5 - $rating;

		while ( $rating > 0 ) {
			$rating_html .= $star_icons['star_full'];
			$rating --;
		}

		$show_empty_stars = apply_filters( 'wcapf_show_empty_star_in_rating', false );

		if ( $show_empty_stars ) {
			while ( $remaining > 0 ) {
				$rating_html .= $star_icons['star_empty'];
				$remaining --;
			}
		}

		return $rating_html;
	}

	/**
	 * Gets the html markup of rating star icon.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_rating_star_icons() {
		if ( self::wcapf_option( 'rating_star_use_fontawesome' ) ) {
			$star_full  = '<i class="fa-solid fa-star wcapf-star-icon"></i>';
			$star_empty = '<i class="fa-regular fa-star wcapf-star-icon"></i>';
			$star_half  = '<i class="fa-solid fa-star-half-stroke wcapf-star-icon"></i>';
		} else {
			$star_full  = '<i class="wcapf-icon-star-full wcapf-star-icon"></i>';
			$star_empty = '<i class="wcapf-icon-star-empty wcapf-star-icon"></i>';
			$star_half  = '<i class="wcapf-icon-star-half wcapf-star-icon"></i>';
		}

		return compact( 'star_full', 'star_empty', 'star_half' );
	}

	/**
	 * Shop loop container class.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function shop_loop_container_identifier() {
		return apply_filters( 'wcapf_shop_loop_container_identifier', 'wcapf-before-products' );
	}

	/**
	 * Checks if the product attribute filtering via lookup table feature is enabled.
	 *
	 * @return bool
	 */
	public static function filtering_via_lookup_table_is_active() {
		return apply_filters(
			'wcapf_attribute_lookup_enabled',
			'yes' === get_option( 'woocommerce_attribute_lookup_enabled' )
		);
	}

	/**
	 * @return bool
	 */
	public static function hide_stock_out_items() {
		return apply_filters(
			'wcapf_hide_out_of_stock_items',
			'yes' === get_option( 'woocommerce_hide_out_of_stock_items' )
		);
	}

	/**
	 * @param array  $filter_data Active filter data.
	 * @param string $extra_class Markup extra class.
	 *
	 * @return string
	 */
	public static function get_active_filter_markup( $filter_data, $extra_class = '' ) {
		$active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();
		$filter_key     = isset( $filter_data['filter_key'] ) ? $filter_data['filter_key'] : '';

		$classes = 'wcapf-filter-clear-btn wcapf-active-filter-item';
		$classes .= $extra_class ? ' ' . $extra_class : '';

		$html = '';

		foreach ( $active_filters as $value => $label ) {
			$url_builder      = new WCAPF_URL_Builder( $filter_key, true );
			$clear_filter_url = $url_builder->get_filter_url( $value, true );

			$attrs = 'class="' . esc_attr( $classes ) . '"';
			$attrs .= ' data-clear-filter-url="' . esc_url( $clear_filter_url ) . '"';

			$html .= '<button ' . $attrs . '>';
			$html .= '<span class="wcapf-nav-item-text">'; // To avoid the flex wrap issue.
			$html .= wp_kses_post( $label );
			$html .= '</span>';
			$html .= '<span class="wcapf-cross-sign">&#215;</span>';
			$html .= '</button>';
		}

		return $html;
	}

	/**
	 * @param string $button_label   The label for button.
	 * @param string $override_class Whether to use custom style using a class.
	 * @param string $style          Button style, primary or secondary.
	 *
	 * @return string
	 */
	public static function get_reset_button_markup( $button_label, $override_class = '', $style = 'secondary' ) {
		$active_filters = self::get_active_filters_data();
		$filter_keys    = array_keys( $active_filters );

		if ( $override_class ) {
			$classes = 'wcapf-filter-clear-btn ' . $override_class;
		} else {
			if ( 'primary' === $style ) {
				$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-primary';
			} else {
				$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-secondary';
			}
		}

		$url_builder = new WCAPF_URL_Builder();
		$reset_url   = $url_builder->get_reset_url();

		$attrs = 'data-clear-filter-url="' . esc_url( $reset_url ) . '"';

		if ( ! $filter_keys ) {
			$attrs .= 'disabled="disabled"';
		}

		$html = '<button class="' . esc_attr( $classes ) . '" ' . $attrs . '>';
		$html .= $button_label;
		$html .= '</button>';

		return $html;
	}

	/**
	 * @return array
	 */
	public static function get_active_filters_data() {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();
		$active_filters = array();

		foreach ( $chosen_filters as $filter_type_filters ) {
			foreach ( $filter_type_filters as $filter_type => $filter ) {
				$_active_filters = isset( $filter['active_filters'] ) ? $filter['active_filters'] : array();
				$filter_id       = isset( $filter['filter_id'] ) ? $filter['filter_id'] : '';
				$filter_key      = ! empty( $filter['filter_key'] ) ? $filter['filter_key'] : $filter_type;

				$active_filters[ $filter_key ] = array(
					'filter_key'     => $filter_key,
					'filter_type'    => $filter_type,
					'filter_id'      => $filter_id,
					'active_filters' => $_active_filters,
				);
			}
		}

		return $active_filters;
	}

	/**
	 * @return array
	 */
	public static function get_chosen_filters() {
		global $wcapf_chosen_filters;

		return $wcapf_chosen_filters ?: array();
	}

	/**
	 * Gets the active filter items for the active filters widget.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_active_filter_items() {
		$active_filters = self::get_active_filters_data();

		// Sort the data according to the order in $_GET variable.
		$sorted = array();

		foreach ( $_GET as $_key => $_value ) {
			if ( array_key_exists( $_key, $active_filters ) ) {
				$sorted[ $_key ] = $active_filters[ $_key ];
			}
		}

		$filters_data = array();

		foreach ( $sorted as $filter ) {
			$active_filters = isset( $filter['active_filters'] ) ? $filter['active_filters'] : array();

			foreach ( $active_filters as $value => $label ) {
				$filter['active_filters'] = array( $value => $label );

				$filters_data[] = $filter;
			}
		}

		return $filters_data;
	}

	/**
	 * Checks if filter is active.
	 *
	 * @param string $filter_key The filter key.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function is_filter_active( $filter_key ) {
		$active_filters = self::get_active_filters_data();

		return array_key_exists( $filter_key, $active_filters );
	}

	/**
	 * Checks if marketplace plugin found.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function is_marketplace_plugin_found() {
		return class_exists( 'WCFMmp' ) || class_exists( 'WC_Vendors' );
	}

	/**
	 * Gets the rgb array from hex color.
	 *
	 * @param string $hex The hex color code.
	 *
	 * @since 4.0.0
	 *
	 * @return array
	 */
	public static function get_rgb_from_hex( $hex ) {
		list( $r, $g, $b ) = sscanf( $hex, "#%02x%02x%02x" );

		return array( $r, $g, $b );
	}

	/**
	 * @return bool
	 */
	public static function animation_enabled_in_accordion() {
		return apply_filters( 'wcapf_enable_animation_in_accordion', false );
	}

	/**
	 * Determines if we keep the filter accordion as opened when the filter is active.
	 *
	 * TODO: Maybe move to inside the method.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function keep_accordion_opened_when_filter_active() {
		return apply_filters( 'wcapf_keep_accordion_opened_when_filter_active', false );
	}

	/**
	 * Determines if we show the soft limit options when the filter is active.
	 *
	 * TODO: This one is required.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function show_soft_limit_options_when_filter_active() {
		return apply_filters( 'wcapf_show_soft_limit_options_when_filter_active', true );
	}

	/**
	 * @return bool
	 */
	public static function use_tippyjs_for_tooltip() {
		return apply_filters( 'wcapf_use_tippyjs_for_tooltip', true );
	}

	/**
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function no_results_text() {
		return self::wcapf_option(
			'no_results_text',
			__( 'No results for:', 'wc-ajax-product-filter' )
		);
	}

	/**
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function empty_filter_text() {
		return self::wcapf_option( 'empty_filter_text', __( 'N/A', 'wc-ajax-product-filter' ) );
	}

	/**
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function sort_by_prefix() {
		return self::wcapf_option( 'sort_by_prefix', __( 'Sort by:', 'wc-ajax-product-filter' ) );
	}

	public static function opening_btn_label() {
		$settings = self::get_settings();

		if ( ! empty( $settings['opening_btn_label'] ) ) {
			return $settings['opening_btn_label'];
		}

		return __( 'Filters', 'wc-ajax-product-filter' );
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

	public static function slide_out_panel_label() {
		$settings = self::get_settings();

		if ( ! empty( $settings['slide_out_panel_label'] ) ) {
			return $settings['slide_out_panel_label'];
		}

		return __( 'Filters', 'wc-ajax-product-filter' );
	}

	public static function clear_all_button_label() {
		return self::wcapf_option(
			'clear_all_button_label',
			__( 'Clear All', 'wc-ajax-product-filter' )
		);
	}

	public static function reset_button_label() {
		return self::wcapf_option( 'reset_button_label', __( 'Reset', 'wc-ajax-product-filter' ) );
	}

	public static function submit_btn_label() {
		global $wcapf;

		if ( ! empty( $wcapf['submit_btn_label'] ) ) {
			return $wcapf['submit_btn_label'];
		}

		return __( 'Submit', 'wc-ajax-product-filter' );
	}

	public static function apply_btn_label() {
		global $wcapf;

		if ( ! empty( $wcapf['apply_btn_label'] ) ) {
			return $wcapf['apply_btn_label'];
		}

		return __( 'Apply', 'wc-ajax-product-filter' );
	}

	/**
	 * Determines if debug mode is enabled or not.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function is_debugging() {
		if ( ! current_user_can( 'administrator' ) ) {
			return false;
		}

		return ! empty( self::wcapf_option( 'debug_mode' ) );
	}

}
