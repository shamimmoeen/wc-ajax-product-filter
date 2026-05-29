<?php
/**
 * Template helper.
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
 * Loads WCAPF templates through WooCommerce's template loader. Themes override
 * templates at <theme>/woocommerce/wcapf/<slug>.php; WC's `wc_get_template`
 * filter is the documented seam for path-rewriting plugins. The pre-v3
 * <theme>/wcapf/ fallback lives in \WCAPF\Hooks\LegacyTemplatePath.
 */
class Template {

	/**
	 * The Woo-conventional subdir for theme overrides.
	 *
	 * @var string
	 */
	public const THEME_PATH = 'woocommerce/wcapf/';

	/**
	 * Renders a template.
	 *
	 * @param string $slug Template slug (without the .php extension).
	 * @param array  $args Variables to make available as locals in the template.
	 *
	 * @return void
	 */
	public function load( string $slug, array $args = array() ): void {
		wc_get_template( $slug . '.php', $args, self::THEME_PATH, $this->plugin_path() );
	}

	/**
	 * Returns the rendered template as a string.
	 *
	 * @param string $slug Template slug (without the .php extension).
	 * @param array  $args Variables to make available as locals in the template.
	 *
	 * @return string
	 */
	public function get( string $slug, array $args = array() ): string {
		return wc_get_template_html( $slug . '.php', $args, self::THEME_PATH, $this->plugin_path() );
	}

	/**
	 * The plugin's templates directory.
	 *
	 * @return string
	 */
	public function plugin_path(): string {
		return WCAPF_PLUGIN_DIR . '/templates/';
	}
}
