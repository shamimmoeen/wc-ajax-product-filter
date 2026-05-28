<?php
/**
 * The deprecated [wcapf_filter] alias.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Shortcodes
 * @author     Mainul Hassan
 */

namespace WCAPF\Shortcodes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Maps the deprecated [wcapf_filter] shortcode to [wcapf_form] and emits a
 * deprecation notice. Kept for backward compatibility.
 */
class LegacyFilter {

	/**
	 * Renders the deprecated alias by deferring to [wcapf_form].
	 *
	 * @return string
	 */
	public function render() {
		_deprecated_function( '[wcapf_filter] shortcode', '4.4.0', '[wcapf_form]' );

		return do_shortcode( '[wcapf_form]' );
	}
}
