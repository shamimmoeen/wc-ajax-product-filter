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
	 * Gets the sort by options.
	 *
	 * @return array
	 */
	public static function get_sort_by_options() {
		return apply_filters(
			'wcapf_sort_by_options',
			array(
				'ID'             => __( 'Post ID', 'wc-ajax-product-filter' ),
				'author'         => __( 'Author', 'wc-ajax-product-filter' ),
				'title'          => __( 'Title', 'wc-ajax-product-filter' ),
				'name'           => __( 'Name (Post Slug)', 'wc-ajax-product-filter' ),
				'date'           => __( 'Date', 'wc-ajax-product-filter' ),
				'modified'       => __( 'Modified', 'wc-ajax-product-filter' ),
				'parent'         => __( 'Parent ID', 'wc-ajax-product-filter' ),
				'rand'           => __( 'Random Order', 'wc-ajax-product-filter' ),
				'review_count'   => __( 'Review Count', 'wc-ajax-product-filter' ),
				'menu_order'     => __( 'Menu Order', 'wc-ajax-product-filter' ),
				'total_sales'    => __( 'Total Sales', 'wc-ajax-product-filter' ),
				'average_rating' => __( 'Average Rating', 'wc-ajax-product-filter' ),
				'min_price'      => __( 'Min Price', 'wc-ajax-product-filter' ),
				'max_price'      => __( 'Max Price', 'wc-ajax-product-filter' ),
				'meta_value'     => __( 'Meta Value', 'wc-ajax-product-filter' ),
			)
		);
	}

	/**
	 * Gets the meta type options.
	 *
	 * @return array
	 */
	public static function get_meta_type_options() {
		return apply_filters(
			'wcapf_meta_type_options',
			array(
				'alphabetic' => __( 'Alphabetic', 'wc-ajax-product-filter' ),
				'numeric'    => __( 'Numeric', 'wc-ajax-product-filter' ),
				'date'       => __( 'Date', 'wc-ajax-product-filter' ),
				'datetime'   => __( 'DateTime', 'wc-ajax-product-filter' ),
				'decimal'    => __( 'Decimal', 'wc-ajax-product-filter' ),
			)
		);
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

			$label = apply_filters( 'wcapf_active_filter_label', $label, $filter_data );

			$html .= '<button ' . $attrs . '>';
			$html .= wp_kses_post( $label );
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
	public static function get_active_filters_data( $sort_by_value = false ) {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();
		$active_filters = array();

		// TODO: Use condition here.
		$sort_by_value = true;

		foreach ( $chosen_filters as $filter_type_filters ) {
			foreach ( $filter_type_filters as $filter_type => $filter ) {
				$_active_filters = isset( $filter['active_filters'] ) ? $filter['active_filters'] : array();
				$filter_id       = isset( $filter['filter_id'] ) ? $filter['filter_id'] : '';
				$filter_key      = ! empty( $filter['filter_key'] ) ? $filter['filter_key'] : $filter_type;

				if ( ! $_active_filters ) {
					continue;
				}

				foreach ( $_active_filters as $value => $label ) {
					$active_filters[] = array(
						'filter_key'     => $filter_key,
						'filter_type'    => $filter_type,
						'filter_id'      => $filter_id,
						'active_filters' => array( $value => $label ),
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
		$filter_keys    = wp_list_pluck( $active_filters, 'filter_key' );

		return in_array( $filter_key, $filter_keys );
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
		global $wcapf;

		if ( ! empty( $wcapf['opening_btn_label'] ) ) {
			return $wcapf['opening_btn_label'];
		}

		return __( 'No results for:', 'wc-ajax-product-filter' );
	}

	/**
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function empty_filter_text() {
		global $wcapf;

		if ( ! empty( $wcapf['empty_filter_text'] ) ) {
			return $wcapf['empty_filter_text'];
		}

		return __( 'N/A', 'wc-ajax-product-filter' );
	}

	public static function opening_btn_label() {
		$settings = self::get_settings();

		if ( ! empty( $settings['opening_btn_label'] ) ) {
			return $settings['opening_btn_label'];
		}

		return __( 'Filters', 'wc-ajax-product-filter' );
	}

	public static function slide_out_panel_label() {
		$settings = self::get_settings();

		if ( ! empty( $settings['slide_out_panel_label'] ) ) {
			return $settings['slide_out_panel_label'];
		}

		return __( 'Filters', 'wc-ajax-product-filter' );
	}

	public static function clear_button_label() {
		$settings = self::get_settings();

		if ( ! empty( $settings['clear_button_label'] ) ) {
			return $settings['clear_button_label'];
		}

		return __( 'Clear', 'wc-ajax-product-filter' );
	}

	public static function clear_all_button_label() {
		global $wcapf;

		if ( ! empty( $wcapf['clear_all_button_label'] ) ) {
			return $wcapf['clear_all_button_label'];
		}

		return __( 'Clear All', 'wc-ajax-product-filter' );
	}

	public static function reset_button_label() {
		global $wcapf;

		if ( ! empty( $wcapf['reset_button_label'] ) ) {
			return $wcapf['reset_button_label'];
		}

		return __( 'Reset', 'wc-ajax-product-filter' );
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

}
