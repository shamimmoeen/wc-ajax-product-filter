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
	 * The settings page hook.
	 *
	 * @return string
	 */
	public static function settings_page_hook() {
		return 'settings_page_wc-ajax-product-filter';
	}

	/**
	 * The settings page's settings tab url.
	 *
	 * @return string
	 */
	public static function settings_page_tab_url() {
		return add_query_arg( 'tab', 'settings', self::settings_page_url() );
	}

	/**
	 * The settings page url.
	 *
	 * @return string
	 */
	public static function settings_page_url() {
		return menu_page_url( 'wc-ajax-product-filter', false );
	}

	/**
	 * Gets the current tab of the settings page.
	 *
	 * @return string
	 */
	public static function get_current_tab() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return ( isset( $_GET['tab'] ) && 'settings' === $_GET['tab'] ) ? 'settings' : 'search-form';
	}

	/**
	 * The available search form fields.
	 *
	 * @return array
	 */
	public static function available_search_fields() {
		return array(
			'filter-by-category'        => __( 'Filter by Category', 'wc-ajax-product-filter' ),
			'filter-by-tag'             => __( 'Filter by Tag', 'wc-ajax-product-filter' ),
			'filter-by-attribute'       => __( 'Filter by Attribute', 'wc-ajax-product-filter' ),
			'filter-by-price'           => __( 'Filter by Price', 'wc-ajax-product-filter' ),
			'filter-by-custom-taxonomy' => __( 'Filter by Custom Taxonomy', 'wc-ajax-product-filter' ),
			'filter-by-post-meta'       => __( 'Filter by Post Meta', 'wc-ajax-product-filter' ),
			'submit-button'             => __( 'Submit Button', 'wc-ajax-product-filter' ),
			'reset-button'              => __( 'Reset Button', 'wc-ajax-product-filter' ),
		);
	}

}
