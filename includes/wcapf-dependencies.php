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

// Loads the compatibility fixes.
require_once WCAPF_PLUGIN_DIR . '/includes/wcapf-compatibility-fixes.php';
