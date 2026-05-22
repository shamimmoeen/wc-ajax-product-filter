<?php
/**
 * Settings helper.
 *
 * Exposes plugin settings, labels, and behavior toggles as instance methods.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Settings helper.
 */
class Settings {

	/**
	 * Gets a single setting value from the request-time settings array.
	 *
	 * Falls back to the supplied default when the stored value is empty.
	 *
	 * @param string $key           Setting key.
	 * @param mixed  $default_value Default value.
	 *
	 * @return mixed Setting value.
	 */
	public function get( string $key, $default_value = '' ) {
		global $wcapf;

		$value = $wcapf[ $key ] ?? '';

		if ( '' === $value && '' !== $default_value ) {
			return $default_value;
		}

		return $value;
	}

	/**
	 * Gets the full plugin settings array (DB values merged with defaults).
	 *
	 * @return array Plugin settings.
	 */
	public function all(): array {
		$db_options = get_option( $this->option_key() );
		$db_options = is_array( $db_options ) ? $db_options : array();
		$settings   = wp_parse_args( $db_options, \WCAPF_Default_Data::default_settings() );

		return apply_filters( 'wcapf_settings', $settings );
	}

	/**
	 * The option key under which plugin settings are stored.
	 *
	 * @return string
	 */
	public function option_key(): string {
		return 'wcapf_settings';
	}

	/**
	 * The relationship used between filter conditions ('and' or 'or').
	 *
	 * Falls back to 'and' when the stored value isn't one of the two.
	 *
	 * @return string
	 */
	public function field_relations(): string {
		$relation = $this->get( 'filter_relationships' );

		if ( ! in_array( $relation, array( 'and', 'or' ), true ) ) {
			$relation = 'and';
		}

		return $relation;
	}

	/**
	 * Determines whether debug mode is enabled for the current user.
	 *
	 * @return bool
	 */
	public function is_debug_mode_enabled(): bool {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		$settings = $this->all();

		if ( ! empty( $settings['disable_wcapf'] ) ) {
			return false;
		}

		return ! empty( $settings['debug_mode'] );
	}

	/**
	 * Wraps a debug message in the standard styled container.
	 *
	 * @param string $message The debug message.
	 *
	 * @return string
	 */
	public function debug_message( string $message ): string {
		$styles = 'border: 1px dashed #b9b9b9;font-size: 14px;padding: 10px;margin: 0 0 15px;';

		return sprintf(
			'<div class="wcapf-debug-message" style="%1$s">%2$s</div>',
			esc_attr( $styles ),
			wp_kses_post( $message )
		);
	}

	/**
	 * Gets the clear-all button label.
	 *
	 * @return string
	 */
	public function clear_all_button_label(): string {
		return $this->get(
			'clear_all_button_label',
			__( 'Clear All', 'wc-ajax-product-filter' )
		);
	}

	/**
	 * Gets the reset button label.
	 *
	 * @return string
	 */
	public function reset_button_label(): string {
		return $this->get( 'reset_button_label', __( 'Reset', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the no-results text.
	 *
	 * @return string
	 */
	public function no_results_text(): string {
		return $this->get(
			'no_results_text',
			__( 'No results for:', 'wc-ajax-product-filter' )
		);
	}

	/**
	 * Gets the empty filter text.
	 *
	 * @return string
	 */
	public function empty_filter_text(): string {
		return $this->get( 'empty_filter_text', __( 'N/A', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the sort-by prefix text.
	 *
	 * @return string
	 */
	public function sort_by_prefix(): string {
		return $this->get( 'sort_by_prefix', __( 'Sort by:', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Gets the keyword filter prefix text.
	 *
	 * @return string
	 */
	public function keyword_filter_prefix(): string {
		return $this->get( 'keyword_filter_prefix', __( 'Keyword:', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Determines whether the accordion should stay open when its filter is active.
	 *
	 * @return bool
	 */
	public function keep_accordion_opened_when_filter_active(): bool {
		return apply_filters( 'wcapf_keep_accordion_opened_when_filter_active', false );
	}

	/**
	 * Determines whether soft-limit options should be shown when the filter is active.
	 *
	 * @return bool
	 */
	public function show_soft_limit_options_when_filter_active(): bool {
		return apply_filters( 'wcapf_show_soft_limit_options_when_filter_active', true );
	}

	/**
	 * Determines whether Tippy.js should be used for tooltips.
	 *
	 * @return bool
	 */
	public function use_tippyjs_for_tooltip(): bool {
		return apply_filters( 'wcapf_use_tippyjs_for_tooltip', empty( $this->get( 'disable_tippyjs' ) ) );
	}

	/**
	 * Determines whether frontend scripts should be loaded conditionally.
	 *
	 * @return bool
	 */
	public function load_scripts_conditionally(): bool {
		return apply_filters( 'wcapf_load_scripts_conditionally', true );
	}

	/**
	 * Determines whether WooCommerce's attribute lookup table is active.
	 *
	 * @return bool
	 */
	public function filtering_via_lookup_table_is_active(): bool {
		return apply_filters(
			'wcapf_attribute_lookup_enabled',
			'yes' === get_option( 'woocommerce_attribute_lookup_enabled' )
		);
	}

	/**
	 * Determines whether out-of-stock items should be hidden.
	 *
	 * @return bool
	 */
	public function hide_stock_out_items(): bool {
		return apply_filters(
			'wcapf_hide_out_of_stock_items',
			'yes' === get_option( 'woocommerce_hide_out_of_stock_items' )
		);
	}
}
