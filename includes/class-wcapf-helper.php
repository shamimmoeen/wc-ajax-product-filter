<?php
/**
 * The helper class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Helper class.
 *
 * @since 3.0.0
 */
class WCAPF_Helper {

	/**
	 * Determines whether the Pro version is active.
	 *
	 * @return bool True if the Pro version constant is defined, otherwise false.
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

		$cache_key = 'wcapf_available_meta_keys';
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $cached;
		}

		$query = "
			SELECT DISTINCT $wpdb->postmeta.meta_key
			FROM $wpdb->postmeta
			INNER JOIN $wpdb->posts
			ON $wpdb->posts.ID = $wpdb->postmeta.post_id
			WHERE $wpdb->posts.post_type = 'product'
			AND $wpdb->postmeta.meta_key IS NOT NULL
			ORDER BY $wpdb->postmeta.meta_key
		";

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared -- Query does not contain user input and results are cached via transient.
		$results   = $wpdb->get_col( $query );
		$meta_keys = array();

		foreach ( $results as $result ) {
			$meta_keys[] = array(
				'value' => $result,
				'label' => $result,
			);
		}

		set_transient( $cache_key, $meta_keys, 12 * HOUR_IN_SECONDS );

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
	 * @param string $meta_key The meta key.
	 *
	 * @return array
	 */
	public static function get_available_meta_values( $meta_key ) {
		global $wpdb;

		$cache_key = 'wcapf_available_meta_values_' . md5( $meta_key );
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			return $cached;
		}

		$query = $wpdb->prepare(
			"
				SELECT DISTINCT $wpdb->postmeta.meta_value
				FROM $wpdb->postmeta
				INNER JOIN $wpdb->posts
				ON $wpdb->postmeta.post_id = $wpdb->posts.ID
				WHERE $wpdb->posts.post_type = 'product'
				AND $wpdb->postmeta.meta_key = %s
				AND $wpdb->postmeta.meta_value <> ''
				ORDER BY $wpdb->postmeta.meta_value
			",
			$meta_key
		);

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared -- Query is prepared above and results are cached using a transient.
		$results = $wpdb->get_col( $query );

		set_transient( $cache_key, $results, 12 * HOUR_IN_SECONDS );

		return apply_filters( 'wcapf_product_meta_values', $results, $meta_key );
	}

	/**
	 * The filtering works for the products with these post statuses.
	 *
	 * @return array
	 */
	public static function filterable_post_statuses() {
		$post_statuses = array( 'publish' );

		// Shop managers can see private products, so filtering should work there as well.
		// phpcs:ignore WordPress.WP.Capabilities.Unknown -- "manage_woocommerce" is a valid custom capability added by WooCommerce.
		if ( current_user_can( 'manage_woocommerce' ) ) {
			$post_statuses[] = 'private';
		}

		return apply_filters( 'wcapf_filterable_post_statuses', $post_statuses );
	}

	/**
	 * Gets the time period options.
	 *
	 * @param bool $with_ranges Whether to return full option data including date ranges.
	 *
	 * @throws Exception If date parsing fails.
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

		$range_separator = self::range_values_separator();
		$timezone        = wp_timezone();
		$today           = new DateTimeImmutable( 'now', $timezone );
		$format          = 'Y-m-d';

		foreach ( $ranges as $value => $label ) {
			$range = '';

			switch ( $value ) {
				case 'today':
					$start = $today->format( $format );
					$range = $start . $range_separator . $start;

					break;

				case 'yesterday':
					$start = $today->modify( '-1 day' )->format( $format );
					$range = $start . $range_separator . $start;

					break;

				case 'this-week':
					$start = $today->modify( 'monday this week' )->format( $format );
					$end   = $today->modify( 'sunday this week' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-week':
					$start = $today->modify( 'monday last week' )->format( $format );
					$end   = $today->modify( 'sunday last week' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'this-month':
					$start = $today->modify( 'first day of this month' )->format( $format );
					$end   = $today->modify( 'last day of this month' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-month':
					$start = $today->modify( 'first day of last month' )->format( $format );
					$end   = $today->modify( 'last day of last month' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-14-days':
					$start = $today->modify( '-13 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-30-days':
					$start = $today->modify( '-29 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-90-days':
					$start = $today->modify( '-89 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'this-year':
					$start = $today->setDate( (int) $today->format( 'Y' ), 1, 1 )->format( $format );
					$end   = $today->setDate( (int) $today->format( 'Y' ), 12, 31 )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-year':
					$last_year = (int) $today->format( 'Y' ) - 1;
					$start     = $today->setDate( $last_year, 1, 1 )->format( $format );
					$end       = $today->setDate( $last_year, 12, 31 )->format( $format );
					$range     = $start . $range_separator . $end;

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
	 * Gets the separator used for range values.
	 *
	 * @return string Range values separator.
	 */
	public static function range_values_separator() {
		return '~';
	}

	/**
	 * Gets the display types that use number-based range inputs.
	 *
	 * @return array Number input display types.
	 */
	public static function number_input_display_types() {
		return array( 'range_slider', 'range_number' );
	}

	/**
	 * Determines whether range min and max values should be rounded.
	 *
	 * @param WCAPF_Field_Instance $instance Field instance.
	 *
	 * @return bool True if range values should be rounded, otherwise false.
	 */
	public static function round_range_min_max_values( $instance ) {
		return apply_filters( 'wcapf_round_range_min_max_values', true, $instance );
	}

	/**
	 * Gets the relationship used between filter conditions.
	 *
	 * Determines how multiple filters are combined in the query.
	 * Possible values are 'and' or 'or'.
	 *
	 * @return string Filter relationship.
	 */
	public static function get_field_relations() {
		$relation = self::wcapf_option( 'filter_relationships' );

		if ( ! in_array( $relation, array( 'and', 'or' ), true ) ) {
			$relation = 'and';
		}

		return $relation;
	}

	/**
	 * Gets a plugin option value.
	 *
	 * Returns the default value when the stored option is empty.
	 *
	 * @param string $key           Option key.
	 * @param mixed  $default_value Default value.
	 *
	 * @since 4.0.0
	 *
	 * @return mixed Option value.
	 */
	public static function wcapf_option( $key, $default_value = '' ) {
		global $wcapf;

		$value = isset( $wcapf[ $key ] ) ? $wcapf[ $key ] : '';

		if ( '' === $value && '' !== $default_value ) {
			return $default_value;
		}

		return $value;
	}

	/**
	 * Determines whether filter data is available for the current request.
	 *
	 * @since 4.0.0
	 *
	 * @return bool True if filter data is found, otherwise false.
	 */
	public static function found_wcapf() {
		global $wcapf;

		return (bool) $wcapf;
	}

	/**
	 * Determines whether frontend scripts should be loaded conditionally.
	 *
	 * @since 4.0.0
	 *
	 * @return bool True if scripts should be loaded conditionally, otherwise false.
	 */
	public static function load_scripts_conditionally() {
		return apply_filters( 'wcapf_load_scripts_conditionally', true );
	}

	/**
	 * Gets rating star entities markup.
	 *
	 * @param int $rating Rating value.
	 *
	 * @return string Rating entities markup.
	 */
	public static function get_rating_entities( $rating ) {
		$rating_entities = '';

		while ( $rating > 0 ) {
			// @source https://www.htmlsymbols.xyz/unicode/U+2B50
			$rating_entities .= '&#11088;';
			--$rating;
		}

		return $rating_entities;
	}

	/**
	 * Gets rating star icon markup for the given rating.
	 *
	 * @param int $rating Rating value.
	 *
	 * @return string Rating icon markup.
	 */
	public static function get_rating_svg_icons( $rating ) {
		$rating_html = '';
		$star_icons  = self::get_rating_star_icons();

		$remaining = 5 - $rating;

		while ( $rating > 0 ) {
			$rating_html .= $star_icons['star_full'];
			--$rating;
		}

		$show_empty_stars = apply_filters( 'wcapf_show_empty_star_in_rating', false );

		if ( $show_empty_stars ) {
			while ( $remaining > 0 ) {
				$rating_html .= $star_icons['star_empty'];
				--$remaining;
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
	 * Determines whether out-of-stock items should be hidden.
	 *
	 * @return bool True if out-of-stock items should be hidden, otherwise false.
	 */
	public static function hide_stock_out_items() {
		return apply_filters(
			'wcapf_hide_out_of_stock_items',
			'yes' === get_option( 'woocommerce_hide_out_of_stock_items' )
		);
	}

	/**
	 * Gets the active filters markup.
	 *
	 * Builds the markup for active filter items using the provided filter data.
	 *
	 * @param array  $filter_data Filter data.
	 * @param string $extra_class Additional CSS class for the filter items.
	 *
	 * @return string Active filters markup.
	 */
	public static function get_active_filters_markup( $filter_data, $extra_class = '' ) {
		$active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();
		$filter_key     = isset( $filter_data['filter_key'] ) ? $filter_data['filter_key'] : '';
		$filter_type    = isset( $filter_data['filter_type'] ) ? $filter_data['filter_type'] : '';

		$classes  = 'wcapf-filter-clear-btn wcapf-active-filter-item';
		$classes .= $extra_class ? ' ' . $extra_class : '';

		$html = '';

		foreach ( $active_filters as $value => $label ) {
			$url_builder = new WCAPF_URL_Builder( $filter_key, true );

			if ( 'keyword' === $filter_type ) {
				// Here, it is possible to apply multiple keywords, so clear all applied keywords at once.
				$clear_filter_url = $url_builder->get_clear_filter_url();
			} else {
				$clear_filter_url = $url_builder->get_filter_url( $value, true );
			}

			$attrs  = 'class="' . esc_attr( $classes ) . '"';
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
	 * Gets the reset button markup.
	 *
	 * Builds the reset button markup using the given label, optional custom class,
	 * and button style.
	 *
	 * @param string $button_label   Button label.
	 * @param string $override_class Custom CSS class.
	 * @param string $style          Button style. Accepts `primary` or `secondary`.
	 *
	 * @return string Reset button markup.
	 */
	public static function get_reset_button_markup( $button_label, $override_class = '', $style = 'secondary' ) {
		$active_filters = self::get_active_filters_data();
		$filter_keys    = array_keys( $active_filters );

		if ( $override_class ) {
			$classes = 'wcapf-filter-clear-btn ' . $override_class;
		} elseif ( 'primary' === $style ) {
			$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-primary';
		} else {
			$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-secondary';
		}

		$url_builder = new WCAPF_URL_Builder();
		$reset_url   = $url_builder->get_reset_url();

		$attrs = 'data-clear-filter-url="' . esc_url( $reset_url ) . '"';

		if ( ! $filter_keys ) {
			$attrs .= ' disabled="disabled"';
		}

		$html  = '<button class="' . esc_attr( $classes ) . '" ' . $attrs . '>';
		$html .= esc_html( $button_label );
		$html .= '</button>';

		return $html;
	}

	/**
	 * Gets the active filters data.
	 *
	 * Returns normalized active filter data prepared from the chosen filters.
	 *
	 * @return array Active filters data.
	 */
	public static function get_active_filters_data() {
		$chosen_filters = self::get_chosen_filters();
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
	 * Gets the chosen filters data.
	 *
	 * @return array Chosen filters data.
	 */
	public static function get_chosen_filters() {
		global $wcapf_chosen_filters;

		return $wcapf_chosen_filters ? $wcapf_chosen_filters : array();
	}

	/**
	 * Prepares template arguments for the active filters template.
	 *
	 * @param array $raw_args Raw template arguments.
	 *
	 * @since 4.2.4
	 *
	 * @return array Prepared template arguments.
	 */
	public static function prepare_active_filters_args( $raw_args ) {
		$layout = ! empty( $raw_args['layout'] ) ? $raw_args['layout'] : 'simple';
		$title  = ! empty( $raw_args['title'] ) ? $raw_args['title'] : '';

		$all_filters = self::get_active_filter_items( $layout );

		$clear_all_btn_label  = ! empty( $raw_args['clear_all_btn_label'] ) ? $raw_args['clear_all_btn_label'] : '';
		$clear_all_btn_layout = ! empty( $raw_args['clear_all_btn_layout'] ) ? $raw_args['clear_all_btn_layout'] : 'block';
		$show_clear_btn       = ! empty( $raw_args['show_clear_btn'] );
		$empty_message        = ! empty( $raw_args['empty_message'] ) ? $raw_args['empty_message'] : '';

		if ( 'extended' === $layout ) {
			$clear_all_btn_layout = 'block';
		}

		$unique_id = wp_unique_id( 'af-' );
		$classes   = array( 'wcapf-active-filters', 'wcapf-active-filters-' . $unique_id );
		$classes[] = 'layout-' . $layout;
		$classes[] = 'clear-all-btn-layout-' . $clear_all_btn_layout;

		$show_title = true;

		if ( ! $title ) {
			$show_title = false;
		}

		if ( ! $show_title ) {
			$show_clear_btn = false;
		}

		$inner_classes = array( 'wcapf-filter' );

		if ( $show_clear_btn && $all_filters ) {
			$inner_classes[] = 'filter-active';
		}

		$should_render = true;

		if ( ! $all_filters && ! $empty_message ) {
			$should_render = false;
		}

		return array(
			'filter_title'         => $title,
			'show_filter_title'    => $show_title,
			'filter_layout'        => $layout,
			'filter_empty_message' => $empty_message,
			'clear_all_btn_label'  => $clear_all_btn_label,
			'clear_all_btn_layout' => $clear_all_btn_layout,
			'show_clear_btn'       => $show_clear_btn,
			'all_filters'          => $all_filters,
			'total_filters'        => count( $all_filters ),
			'filter_unique_id'     => $unique_id,
			'filter_classes'       => implode( ' ', $classes ),
			'filter_inner_classes' => implode( ' ', $inner_classes ),
			'reset_btn_class'      => 'wcapf-reset-filters-btn',
			'filter_should_render' => $should_render,
		);
	}

	/**
	 * Prepares template arguments for the reset button template.
	 *
	 * @param array $args Raw template arguments.
	 *
	 * @since 4.2.4
	 *
	 * @return array Prepared template arguments.
	 */
	public static function prepare_reset_button_args( $args ) {
		$btn_label   = ! empty( $args['btn_label'] ) ? $args['btn_label'] : '';
		$show_always = ! empty( $args['show_always'] );

		$active_filters = self::get_active_filters_data();

		$unique_id = wp_unique_id( 'rf-' );
		$classes   = array( 'wcapf-reset-filters', 'wcapf-reset-filters-' . $unique_id );

		$should_render = true;

		if ( ! $active_filters && ! $show_always ) {
			$should_render = false;
		}

		return array(
			'reset_btn_label'     => $btn_label,
			'reset_unique_id'     => $unique_id,
			'reset_classes'       => implode( ' ', $classes ),
			'reset_should_render' => $should_render,
		);
	}

	/**
	 * Prepares template arguments for the range filter template.
	 *
	 * @since 4.2.4
	 *
	 * @param array $args Raw template arguments.
	 *
	 * @return array Prepared template arguments.
	 */
	public static function prepare_range_filter_args( $args ) {
		$range_value_unit     = '';
		$range_unit_position  = '';
		$range_display_values = $args['display_values_as'];

		if ( ! empty( $args['value_prefix'] ) ) {
			$range_value_unit    = $args['value_prefix'];
			$range_unit_position = 'left';
		} elseif ( ! empty( $args['value_postfix'] ) ) {
			$range_value_unit    = $args['value_postfix'];
			$range_unit_position = 'right';
		}

		if ( 'range_number' === $args['display_type'] ) {
			$range_display_values = 'input_field';
		}

		if ( 'input_field' === $range_display_values ) {
			$range_value_unit = str_replace( '&nbsp;', '', $range_value_unit );

			$args['text_before_min_value'] = '';
			$args['text_before_max_value'] = '';
		}

		$range_data_attributes   = array();
		$range_data_attributes[] = 'data-range-min-value="' . esc_attr( $args['range_min_value'] ) . '"';
		$range_data_attributes[] = 'data-range-max-value="' . esc_attr( $args['range_max_value'] ) . '"';
		$range_data_attributes[] = 'data-min-value="' . esc_attr( $args['min_value'] ) . '"';
		$range_data_attributes[] = 'data-max-value="' . esc_attr( $args['max_value'] ) . '"';
		$range_data_attributes[] = 'data-step="' . esc_attr( $args['step'] ) . '"';
		$range_data_attributes[] = 'data-format-numbers="' . esc_attr( $args['format_numbers'] ) . '"';
		$range_data_attributes[] = 'data-decimal-places="' . esc_attr( $args['decimal_places'] ) . '"';
		$range_data_attributes[] = 'data-thousand-separator="' . esc_attr( $args['thousand_separator'] ) . '"';
		$range_data_attributes[] = 'data-decimal-separator="' . esc_attr( $args['decimal_separator'] ) . '"';
		$range_data_attributes[] = 'data-display-values-as="' . esc_attr( $range_display_values ) . '"';
		$range_data_attributes[] = 'data-url="' . esc_url( $args['filter_url'] ) . '"';
		$range_data_attributes[] = 'data-clear-filter-url="' . esc_url( $args['clear_filter_url'] ) . '"';

		$range_data_attributes_markup = implode( ' ', $range_data_attributes );

		$range_input_type         = 'text';
		$range_show_as_spinbox    = false;
		$range_spinbox_attributes = '';

		if (
			( ! empty( $args['input_type_number'] ) && 'range_slider' === $args['display_type'] && 'input_field' === $range_display_values )
			|| 'range_number' === $args['display_type']
		) {
			$range_input_type      = 'number';
			$range_show_as_spinbox = true;

			$range_spinbox_attrs   = array();
			$range_spinbox_attrs[] = 'step="' . esc_attr( $args['step'] ) . '"';
			$range_spinbox_attrs[] = 'min="' . esc_attr( $args['range_min_value'] ) . '"';
			$range_spinbox_attrs[] = 'max="' . esc_attr( $args['range_max_value'] ) . '"';

			$range_spinbox_attributes = implode( ' ', $range_spinbox_attrs );
		}

		$range_formatted_min_value = $args['min_value'];
		$range_formatted_max_value = $args['max_value'];

		if ( ! empty( $args['format_numbers'] ) ) {
			$range_formatted_min_value = number_format(
				(float) $range_formatted_min_value,
				(int) $args['decimal_places'],
				$args['decimal_separator'],
				$args['thousand_separator']
			);

			$range_formatted_max_value = number_format(
				(float) $range_formatted_max_value,
				(int) $args['decimal_places'],
				$args['decimal_separator'],
				$args['thousand_separator']
			);
		}

		$range_outer_classes = array( 'wcapf-range-wrapper' );

		if ( $range_show_as_spinbox ) {
			$range_outer_classes[] = 'wcapf-range-spinbox';
		}

		if ( 'range_slider' === $args['display_type'] ) {
			$range_outer_classes[] = 'wcapf-range-slider';
			$range_outer_classes[] = ! empty( $args['slider_style'] ) ? $args['slider_style'] : 'style-1';
		} else {
			$range_outer_classes[] = 'wcapf-range-number';
		}

		$range_inner_classes = array(
			'range-values',
			'display-values-as-' . $range_display_values,
		);

		if ( $range_unit_position && ! $range_show_as_spinbox ) {
			$range_inner_classes[] = 'unit-position-' . $range_unit_position;
		}

		if ( 'input_field' === $range_display_values || 'justified' === $args['alignment'] ) {
			$range_inner_classes[] = 'justify-between';
		} elseif ( 'centered' === $args['alignment'] ) {
			$range_inner_classes[] = 'justify-center';
		}

		return array_merge(
			$args,
			array(
				'display_values_as'            => $range_display_values,
				'range_value_unit'             => $range_value_unit,
				'range_unit_position'          => $range_unit_position,
				'range_data_attributes_markup' => $range_data_attributes_markup,
				'range_input_type'             => $range_input_type,
				'range_show_as_spinbox'        => $range_show_as_spinbox,
				'range_spinbox_attributes'     => $range_spinbox_attributes,
				'range_formatted_min_value'    => $range_formatted_min_value,
				'range_formatted_max_value'    => $range_formatted_max_value,
				'range_outer_classes'          => implode( ' ', $range_outer_classes ),
				'range_inner_classes'          => implode( ' ', $range_inner_classes ),
			)
		);
	}

	/**
	 * Gets the active filter items.
	 *
	 * @param string $layout Determines the active filters layout. Accepts `simple` or `extended`.
	 *
	 * @since 4.0.0
	 *
	 * @return array Active filter items.
	 */
	public static function get_active_filter_items( $layout = 'simple' ) {
		$active_filters = self::get_active_filters_data();

		// Sort the data according to the order in $_GET variable.
		$sorted = array();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading query parameters only to determine ordering of active filters in the UI.
		foreach ( $_GET as $_key => $_value ) {
			$key = (string) wp_unslash( $_key );

			if ( array_key_exists( $key, $active_filters ) ) {
				$sorted[ $key ] = $active_filters[ $key ];
			}
		}

		if ( 'extended' === $layout ) {
			$grouped = array();

			foreach ( $sorted as $filter_data ) {
				$filter_key      = isset( $filter_data['filter_key'] ) ? $filter_data['filter_key'] : '';
				$_active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();

				if ( $_active_filters ) {
					if ( array_key_exists( $filter_key, $grouped ) ) {
						$old = $grouped[ $filter_key ]['active_filters'];
						$new = $old + $_active_filters;

						$grouped[ $filter_key ]['active_filters'] = $new;
					} else {
						$grouped[ $filter_key ] = $filter_data;
					}
				}
			}

			return $grouped;
		}

		$filters_data = array();

		foreach ( $sorted as $filter_data ) {
			$active_filters = isset( $filter_data['active_filters'] ) ? $filter_data['active_filters'] : array();

			foreach ( $active_filters as $value => $label ) {
				$filter_data['active_filters'] = array( $value => $label );

				$filters_data[] = $filter_data;
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
	 * Checks if vendor plugin found.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function is_vendor_plugin_found() {
		return apply_filters(
			'wcapf_vendor_plugin_found',
			class_exists( 'WCFMmp' ) || class_exists( 'WC_Vendors' )
		);
	}

	/**
	 * Gets the applied keyword.
	 *
	 * @since 4.1.0
	 *
	 * @return string
	 */
	public static function get_applied_keyword() {
		$chosen = self::get_chosen_filters();

		$filters_data = isset( $chosen['filters_data'] ) ? $chosen['filters_data'] : array();
		$keyword_data = isset( $filters_data['keyword'] ) ? $filters_data['keyword'] : array();

		return isset( $keyword_data['values'][0] ) ? $keyword_data['values'][0] : '';
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
		list( $r, $g, $b ) = sscanf( $hex, '#%02x%02x%02x' );

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
	 * Determines whether Tippy.js should be used for tooltips.
	 *
	 * @return bool True if Tippy.js is enabled for tooltips, otherwise false.
	 */
	public static function use_tippyjs_for_tooltip() {
		return apply_filters( 'wcapf_use_tippyjs_for_tooltip', true );
	}

	/**
	 * Gets the no-results text.
	 *
	 * @since 4.0.0
	 *
	 * @return string No-results text.
	 */
	public static function no_results_text() {
		return self::wcapf_option(
			'no_results_text',
			__( 'No results for:', 'wc-ajax-product-filter' )
		);
	}

	/**
	 * Gets the empty filter text.
	 *
	 * @since 4.0.0
	 *
	 * @return string Empty filter text.
	 */
	public static function empty_filter_text() {
		return self::wcapf_option( 'empty_filter_text', __( 'N/A', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the sort-by prefix text.
	 *
	 * @since 4.0.0
	 *
	 * @return string Sort-by prefix text.
	 */
	public static function sort_by_prefix() {
		return self::wcapf_option( 'sort_by_prefix', __( 'Sort by:', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the keyword filter prefix text.
	 *
	 * @since 4.1.0
	 *
	 * @return string Keyword filter prefix text.
	 */
	public static function keyword_filter_prefix() {
		return self::wcapf_option( 'keyword_filter_prefix', __( 'Keyword:', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the plugin settings.
	 *
	 * Retrieves the saved plugin settings from the database and allows developers
	 * to modify them via the `wcapf_settings` filter before they are returned.
	 *
	 * @return array Plugin settings.
	 */
	public static function get_settings() {
		$option_name = self::settings_option_key();
		$db_options  = get_option( $option_name );
		$db_options  = is_array( $db_options ) ? $db_options : array();

		return apply_filters( 'wcapf_settings', $db_options );
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
	 * Gets the clear-all button label.
	 *
	 * @return string Clear-all button label.
	 */
	public static function clear_all_button_label() {
		return self::wcapf_option(
			'clear_all_button_label',
			__( 'Clear All', 'wc-ajax-product-filter' )
		);
	}

	/**
	 * Gets the reset button label.
	 *
	 * @return string Reset button label.
	 */
	public static function reset_button_label() {
		return self::wcapf_option( 'reset_button_label', __( 'Reset', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Determines whether debug mode is enabled.
	 *
	 * @since 4.0.0
	 *
	 * @return bool True if debug mode is enabled, otherwise false.
	 */
	public static function is_debug_mode_enabled() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		$settings = self::get_settings();

		if ( ! empty( $settings['disable_wcapf'] ) ) {
			return false;
		}

		return ! empty( $settings['debug_mode'] );
	}

	/**
	 * Get the debug message with html markup.
	 *
	 * @param string $message The debug message.
	 *
	 * @since 4.0.0
	 *
	 * @return string
	 */
	public static function get_debug_message( $message ) {
		$styles = 'border: 1px dashed #b9b9b9;font-size: 14px;padding: 10px;margin: 0 0 15px;';

		return sprintf(
			'<div class="wcapf-debug-message" style="%1$s">%2$s</div>',
			esc_attr( $styles ),
			wp_kses_post( $message )
		);
	}

	/**
	 * Determines if the review notice for milestone achieved should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function review_notice_for_milestone_achieved_can_be_shown() {
		if ( ! self::review_notices_can_be_shown() ) {
			return false;
		}

		$user_id  = get_current_user_id();
		$meta_key = 'wcapf_review_notice_for_milestone_achieved_dismissed';

		if ( get_user_meta( $user_id, $meta_key, true ) ) {
			return false;
		}

		$form_updates_count = get_user_meta( $user_id, 'wcapf_form_updates_count', true );
		$form_updates_count = intval( $form_updates_count );

		// Check if the form updates count is at least 5
		if ( $form_updates_count >= 5 ) {
			return true;
		}

		return false;
	}

	/**
	 * Determines if the review notices can be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function review_notices_can_be_shown() {
		// Check if the user has the capability to manage options
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		// Check if we are showing the v4 migration notice.
		if ( self::v4_migration_notice_can_be_shown() ) {
			return false;
		}

		// Check if we are showing the v4 review filters notice.
		if ( self::v4_review_filters_notice_can_be_shown() ) {
			return false;
		}

		// Check if we are showing the pro version update required notice.
		if ( self::pro_update_notice_can_be_shown() ) {
			return false;
		}

		return true;
	}

	/**
	 * Determines if the v4 migration notice should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function v4_migration_notice_can_be_shown() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		if ( '1' !== get_option( 'wcapf_v4_migration_notice_status' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Determines if the v4 migration notice should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool
	 */
	public static function v4_review_filters_notice_can_be_shown() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		if ( '1' !== get_option( 'wcapf_v4_review_filters_notice_status' ) ) {
			return false;
		}

		global $current_screen;

		$screen_id = isset( $current_screen->id ) ? $current_screen->id : '';

		if ( 'toplevel_page_wcapf' !== $screen_id ) {
			return false;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading query arg only to determine whether the admin notice should be shown.
		$form_id = ! empty( $_GET['id'] ) ? absint( wp_unslash( $_GET['id'] ) ) : 0;

		if ( ! $form_id ) {
			return false;
		}

		if ( get_option( 'wcapf_migrated_filters_form_id' ) !== $form_id ) {
			return false;
		}

		return true;
	}

	/**
	 * Determines whether the Pro update notice should be shown.
	 *
	 * TODO: Check this thoroughly.
	 *
	 * @since 4.0.0
	 *
	 * @return array Pro update notices. Returns an empty array when no notice should be shown.
	 */
	public static function pro_update_notice_can_be_shown() {
		$notices = array();

		// Check if the current user has the capability to manage options
		if ( ! current_user_can( 'manage_options' ) ) {
			return $notices;
		}

		// Check if the Pro version plugin is not active
		if ( ! is_plugin_active( 'wc-ajax-product-filter-pro/wc-ajax-product-filter-pro.php' ) ) {
			return $notices;
		}

		// Check if pro version found but the version number could not be obtained using the constant.
		if ( ! defined( 'WCAPF_PRO_VERSION' ) ) {
			$notices[] = self::get_pro_update_notice( '2.1.0' );

			return $notices;
		}

		// Check if the free version is 4.0.0 and pro version is less than 2.0.0
		if ( defined( 'WCAPF_VERSION' ) && version_compare( WCAPF_VERSION, '4.0.0', '=' ) && version_compare( WCAPF_PRO_VERSION, '2.0.0', '<' ) ) {
			$notices[] = self::get_pro_update_notice( '2.0.0' );
		}

		// Check if the free version is 4.1.0 and pro version is less than or equal to 2.0.0
		if ( defined( 'WCAPF_VERSION' ) && version_compare( WCAPF_VERSION, '4.1.0', '=' ) && version_compare( WCAPF_PRO_VERSION, '2.0.0', '<=' ) ) {
			$notices[] = self::get_pro_update_notice( '2.1.0' );
		}

		return $notices;
	}

	/**
	 * Get the pro updated notice.
	 *
	 * @param string $required_pro_version The required pro version.
	 *
	 * @since 4.1.0
	 *
	 * @return string
	 */
	private static function get_pro_update_notice( $required_pro_version ) {
		$update_plugin_doc_url = add_query_arg(
			array(
				'utm_source'   => 'WP+Admin',
				'utm_medium'   => 'update_pro_notice',
				'utm_campaign' => 'WCAPF+Pro+Update',
			),
			'https://wptools.io/docs/wc-ajax-product-filter/getting-started/update-plugin/'
		);

		if ( defined( 'WCAPF_PRO_VERSION' ) ) {
			$pro_version = WCAPF_PRO_VERSION;
		} else {
			$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/wc-ajax-product-filter-pro/wc-ajax-product-filter-pro.php' );
			$pro_version = $plugin_data['Version'];
		}

		return sprintf(
			/* translators: 1: free plugin version, 2: required Pro version, 3: installed Pro version, 4: update documentation URL. */
			__( 'WCAPF - WooCommerce Ajax Product Filter version %1$s requires WCAPF - WooCommerce Ajax Product Filter Pro version %2$s or higher, but you are using %3$s. The Pro version is currently NOT RUNNING. <a href="%4$s" target="_blank">Please proceed with the update</a>.', 'wc-ajax-product-filter' ),
			WCAPF_VERSION,
			$required_pro_version,
			$pro_version,
			esc_url( $update_plugin_doc_url )
		);
	}

	/**
	 * Determines if the review notice for time since should be shown.
	 *
	 * @since 4.0.0
	 *
	 * @return bool|string Return false when the review notice should not be shown otherwise return the time since.
	 */
	public static function review_notice_for_time_since_can_be_shown() {
		if ( ! self::review_notices_can_be_shown() ) {
			return false;
		}

		$user_id      = get_current_user_id();
		$current_time = time();

		// Check if the milestone achieved notice is dismissed within the past 24 hours.
		$meta_key       = 'wcapf_review_notice_for_milestone_achieved_dismissed_at';
		$dismissal_time = get_user_meta( $user_id, $meta_key, true );

		if ( $dismissal_time && ( $current_time - $dismissal_time ) < 24 * 60 * 60 ) {
			return false;
		}

		// Check if the time since notice is permanently disabled for this user.
		$meta_key = 'wcapf_review_notice_time_since_hide_permanently';

		if ( get_user_meta( $user_id, $meta_key, true ) ) {
			return false;
		}

		$activation_time = get_option( 'wcapf_activation_time' );

		if ( ! $activation_time ) {
			return false;
		}

		// Intervals to show the review notice (in seconds) with corresponding human-readable strings.
		$intervals = array(
			31536000 => '1 year',
			15552000 => '6 months',
			7776000  => '3 months',
			2592000  => '1 month',
			1209600  => '2 weeks',
			604800   => '1 week',
		);

		$dismissal_key      = 'wcapf_review_notice_time_since_dismissed_at';
		$dismissal_time     = get_user_meta( $user_id, $dismissal_key, true );
		$dismissed_interval = null;

		if ( $dismissal_time ) {
			$elapsed_time = $dismissal_time - $activation_time;

			// Find the dismissed interval.
			foreach ( array_keys( $intervals ) as $interval ) {
				if ( $interval >= $elapsed_time ) {
					$dismissed_interval = $interval;
				}
			}
		}

		$timestamp    = null;
		$show         = null;
		$elapsed_time = $current_time - $activation_time;

		// Find the current interval based on elapsed time.
		foreach ( $intervals as $interval => $human_readable_interval ) {
			if ( $elapsed_time >= $interval ) {
				$timestamp = $interval;
				$show      = $human_readable_interval;

				break;
			}
		}

		if ( $dismissed_interval && $timestamp < $dismissed_interval ) {
			return false;
		}

		return $show;
	}
}
