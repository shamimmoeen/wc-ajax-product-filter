<?php
/**
 * The file responsible for loading the plugin dependencies.
 *
 * @since      4.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-api-utils.php';
require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-form-filters-utils.php';
require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-helper.php';
require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-template-loader.php';

// Loads the shortcodes.
require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-active-filters-shortcode.php';
require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-shortcode.php';
require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-filter-form-shortcode.php';
require_once WCAPF_PLUGIN_DIR . '/includes/shortcodes/class-wcapf-reset-button-shortcode.php';

// Loads the compatibility fixes.
require_once WCAPF_PLUGIN_DIR . '/includes/wcapf-compatibility-fixes.php';
