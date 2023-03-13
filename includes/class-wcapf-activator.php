<?php
/**
 * Fired during plugin activation.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * This class defines all code necessary to run during the plugin's activation.
 */
class WCAPF_Activator {

	/**
	 * @since 3.0.0
	 */
	public static function activate() {

	}

	/**
	 * Default settings for this plugin.
	 *
	 * @return array
	 */
	public function default_settings() {
		return array(
			'shop_loop_container'                 => '.wcapf-before-products',
			'not_found_container'                 => '.wcapf-before-products',
			'enable_pagination_via_ajax'          => '1',
			'pagination_container'                => '.woocommerce-pagination',
			'sorting_control'                     => '1',
			'show_sorting_data_in_active_filters' => '1',
			'attach_chosen_on_sorting'            => '',
			'loading_animation'                   => '1',
			'scroll_window'                       => 'results',
			'scroll_window_for'                   => 'both',
			'scroll_window_when'                  => 'after',
			'scroll_window_custom_element'        => '',
			'scroll_to_top_offset'                => '100',
			'filter_relationships'                => 'and',
			'update_count'                        => '1',
			'remove_data'                         => '',
		);
	}

}
