<?php
/**
 * Pre-v3 theme template override fallback.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Hooks
 * @author     Mainul Hassan
 */

namespace WCAPF\Hooks;

use WCAPF\Helpers\Template;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Bridges the pre-v3 theme override path. When WC's lookup falls through to
 * the plugin default (no override at <theme>/woocommerce/wcapf/) but the
 * legacy <theme>/wcapf/ file exists, the legacy file is used and a deprecation
 * notice is emitted so developers see it under WP_DEBUG.
 */
class LegacyTemplatePath {

	/**
	 * The pre-v3 subdir customer themes used to override WCAPF templates.
	 *
	 * @var string
	 */
	private const LEGACY_PATH = 'wcapf/';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wc_get_template', array( $this, 'apply' ), 10, 5 );
	}

	/**
	 * Filter callback for `wc_get_template`. Replaces the located path with the
	 * legacy theme override when one exists.
	 *
	 * @param string $located       Path WC resolved.
	 * @param string $template_name Template file name, e.g. 'active-filters.php'.
	 * @param array  $args          Args extracted into the template (unused).
	 * @param string $template_path The theme-relative path passed to wc_get_template.
	 * @param string $default_path  The plugin's templates directory.
	 *
	 * @return string
	 */
	public function apply( $located, $template_name, $args, $template_path, $default_path ) {
		if ( Template::THEME_PATH !== $template_path ) {
			return $located;
		}

		// If WC found an override at the new theme path, keep it.
		if ( trailingslashit( $default_path ) . $template_name !== $located ) {
			return $located;
		}

		$legacy = locate_template( array( self::LEGACY_PATH . $template_name ) );

		if ( ! $legacy ) {
			return $located;
		}

		_doing_it_wrong(
			'WCAPF template override',
			sprintf(
				/* translators: 1: legacy theme path, 2: new theme path. */
				esc_html__( 'Template override "%1$s" uses the pre-v3 theme path. Move it to "%2$s".', 'wc-ajax-product-filter' ),
				esc_html( self::LEGACY_PATH . $template_name ),
				esc_html( Template::THEME_PATH . $template_name )
			),
			'5.0.0'
		);

		return $legacy;
	}
}
