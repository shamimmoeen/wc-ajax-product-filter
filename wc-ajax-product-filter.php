<?php
/**
 * Plugin Name: WC Ajax Product Filter
 * Plugin URI: https://wordpress.org/plugins/wc-ajax-product-filter
 * Description: A plugin to filter woocommerce products with AJAX request.
 * Version: 3.0.0
 * Author: Mainul Hassan Main
 * Author URI: http://mainulhassan.info
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
 * @copyright Copyright (c) 2018, Mainul Hassan Main
 * @author    Mainul Hassan Main
 * @license   https://www.gnu.org/licenses/gpl-3.0.html
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TODO: Define the constands inside the loader class.
 */

// Defines constant WCAPF_SLUG
if ( ! defined( 'WCAPF_SLUG' ) ) {
	define( 'WCAPF_SLUG', 'wc-ajax-product-filter' );
}

// Defines constant WCAPF_VERSION
if ( ! defined( 'WCAPF_VERSION' ) ) {
	define( 'WCAPF_VERSION', '3.0.0' );
}

// Defines constant WCAPF_PLUGIN_FILE
if ( ! defined( 'WCAPF_PLUGIN_FILE' ) ) {
	define( 'WCAPF_PLUGIN_FILE', __FILE__ );
}

/**
 * The code that runs during plugin activation.
 *
 * @since 3.0.0
 */
function wcapf_activate() {
	require_once plugin_dir_path( WCAPF_PLUGIN_FILE ) . 'includes/class-wcapf-activator.php';
	WCAPF_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 *
 * @since 3.0.0
 */
function wcapf_deactivate() {
	require_once plugin_dir_path( WCAPF_PLUGIN_FILE ) . 'includes/class-wcapf-deactivator.php';
	WCAPF_Deactivator::deactivate();
}

register_activation_hook( WCAPF_PLUGIN_FILE, 'wcapf_activate' );
register_deactivation_hook( WCAPF_PLUGIN_FILE, 'wcapf_deactivate' );

// Include the WCAPF main class
require_once plugin_dir_path( WCAPF_PLUGIN_FILE ) . 'includes/class-wcapf.php';

/**
 * Instantiate the main class.
 *
 * @since 3.0.0
 */
function wcapf_setup() {
	return WCAPF::instance();
}

wcapf_setup();
