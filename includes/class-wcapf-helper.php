<?php
/**
 * The helper class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Helper class.
 */
class WCAPF_Helper {

	/**
	 * Determines if we show the pro features modal.
	 *
	 * @return mixed|void
	 */
	public static function show_pro_version_offer() {
		return apply_filters( 'wcapf_show_pro_offer', true );
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
	 * The option key that contains the plugin settings.
	 *
	 * @return string
	 */
	public static function settings_option_key() {
		return 'wcapf_settings';
	}

	/**
	 * Gets the wcapf settings.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$option_name = self::settings_option_key();
		$db_options  = get_option( $option_name );

		if ( has_filter( $option_name ) ) {
			$settings = wp_parse_args( apply_filters( $option_name, $db_options ), $db_options );
		} else {
			$settings = $db_options;
		}

		return $settings;
	}

	/**
	 * Check to see if store is incl tax but display excl.
	 *
	 * @return bool
	 */
	public static function store_is_in_tax_inclusive_mode() {
		if ( wc_tax_enabled() && 'excl' === get_option( 'woocommerce_tax_display_shop' ) && wc_prices_include_tax() ) {
			return true;
		}

		return false;
	}

	/**
	 * Check to see if store is excl tax but display incl.
	 *
	 * @return bool
	 */
	public static function store_is_in_tax_exclusive_mode() {
		if ( wc_tax_enabled() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) && ! wc_prices_include_tax() ) {
			return true;
		}

		return false;
	}

	/**
	 * @return string
	 */
	public static function price_data_type() {
		// woocommerce_price_num_decimals
		$decimal_places = get_option( 'woocommerce_price_num_decimals' );
		$decimal_places = strlen( $decimal_places ) ? $decimal_places : 3;

		return apply_filters( 'wcapf_price_data_type', 'DECIMAL(10,' . $decimal_places . ')' );
	}

	/**
	 * The meta key that contains the product's price with tax.
	 *
	 * @return string
	 */
	public static function meta_key_for_price_with_tax() {
		return '_price_with_tax';
	}

	/**
	 * The option key that contains the information if the product prices generated earlier.
	 *
	 * @return string
	 */
	public static function product_prices_generated_option_key() {
		return 'wcapf_product_prices_generated';
	}

	/**
	 * Gets the meta key for price filter.
	 *
	 * @return string
	 */
	public static function get_meta_key_for_price_filter() {
		$prices_with_tax_generated = '1' === get_option( self::product_prices_generated_option_key() );

		$store_is_in_tax_incl_or_excl_mode = self::store_is_in_tax_inclusive_mode()
		                                     || self::store_is_in_tax_exclusive_mode();

		if ( $prices_with_tax_generated && $store_is_in_tax_incl_or_excl_mode ) {
			$meta_key = self::meta_key_for_price_with_tax();
		} else {
			$meta_key = '_price';
		}

		return $meta_key;
	}

	/**
	 * The filtering system for the private products only work if the user is logged in.
	 *
	 * @return array
	 */
	public static function visible_product_statuses() {
		$valid_statuses = array( 'publish' );

		if ( is_user_logged_in() ) {
			$valid_statuses[] = 'private';
		}

		return apply_filters( 'wcapf_valid_post_statuses_for_sql_query', $valid_statuses );
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

}
