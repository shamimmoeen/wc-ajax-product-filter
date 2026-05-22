<?php
/**
 * Compatibility helper.
 *
 * Detects the presence of the pro version, request-time filter data,
 * and known vendor plugins.
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
 * Compatibility helper.
 */
class Compat {

	/**
	 * Determines whether the Pro version is active.
	 *
	 * @return bool True if the Pro version constant is defined, otherwise false.
	 */
	public function found_pro_version(): bool {
		return defined( 'WCAPF_PRO_VERSION' );
	}

	/**
	 * Determines whether filter data is available for the current request.
	 *
	 * @return bool True if filter data is found, otherwise false.
	 */
	public function found_wcapf(): bool {
		global $wcapf;

		return (bool) $wcapf;
	}

	/**
	 * Determines whether a known vendor plugin is active.
	 *
	 * @return bool
	 */
	public function is_vendor_plugin_found(): bool {
		return apply_filters(
			'wcapf_vendor_plugin_found',
			class_exists( 'WCFMmp' ) || class_exists( 'WC_Vendors' )
		);
	}
}
