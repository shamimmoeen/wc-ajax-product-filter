<?php
/**
 * Plugin Name: WC Ajax Product Filter
 * Plugin URI: https://wptools.io/wc-ajax-product-filter
 * Description: A plugin to filter WooCommerce products with AJAX request.
 * Version: 3.3.1
 * Requires at least: 4.0
 * Requires PHP: 5.5
 * Author: wptools.io
 * Author URI: https://wptools.io
 * Text Domain: wc-ajax-product-filter
 * Domain Path: /languages
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU
 * General Public License as published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * @since     3.0.0
 * @package   wc-ajax-product-filter
 * @copyright Copyright (c) 2018, wptools.io
 * @author    wptools.io
 * @license   https://www.gnu.org/licenses/gpl-3.0.html
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Defines constant WCAPF_SLUG
if ( ! defined( 'WCAPF_SLUG' ) ) {
	define( 'WCAPF_SLUG', 'wc-ajax-product-filter' );
}

// Defines constant WCAPF_VERSION
if ( ! defined( 'WCAPF_VERSION' ) ) {
	define( 'WCAPF_VERSION', '3.3.1' );
}

// Defines constant WCAPF_PLUGIN_FILE
if ( ! defined( 'WCAPF_PLUGIN_FILE' ) ) {
	define( 'WCAPF_PLUGIN_FILE', __FILE__ );
}

// Defines constant WCAPF_PLUGIN_DIR
if ( ! defined( 'WCAPF_PLUGIN_DIR' ) ) {
	define( 'WCAPF_PLUGIN_DIR', __DIR__ );
}

// Defines constant WCAPF_PLUGIN_URL
if ( ! defined( 'WCAPF_PLUGIN_URL' ) ) {
	define( 'WCAPF_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Defines constant WCAPF_CACHE_TIME
if ( ! defined( 'WCAPF_CACHE_TIME' ) ) {
	define( 'WCAPF_CACHE_TIME', 60 * 60 * 12 );
}

/**
 * The code that runs during plugin activation.
 *
 * @since 3.0.0
 */
function wcapf_activate() {
	require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-activator.php';
	WCAPF_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 *
 * @since 3.0.0
 */
function wcapf_deactivate() {
	require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf-deactivator.php';
	WCAPF_Deactivator::deactivate();
}

register_activation_hook( WCAPF_PLUGIN_FILE, 'wcapf_activate' );
register_deactivation_hook( WCAPF_PLUGIN_FILE, 'wcapf_deactivate' );

// Include the WCAPF main class
require_once WCAPF_PLUGIN_DIR . '/includes/class-wcapf.php';

/**
 * Instantiate the main class.
 *
 * @since 3.0.0
 */
function wcapf_setup() {
	return WCAPF::instance();
}

wcapf_setup();
