<?php
/**
 * The [wcapf_form] shortcode.
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
 * Renders the configured form via the base form renderer. In debug mode emits
 * the explanatory message when the page has no assigned form or when the form
 * has already been rendered (free can only render one form per page).
 */
class Form {

	/**
	 * Renders the shortcode output.
	 *
	 * @return string
	 */
	public function render() {
		ob_start();

		$this->render_debug_messages();

		( new \WCAPF\Form() )->render_form();

		return ob_get_clean();
	}

	/**
	 * Emits the debug-mode message that explains why the form did not render or
	 * why the page can't filter products.
	 *
	 * @return void
	 */
	private function render_debug_messages() {
		if ( ! wcapf()->settings->is_debug_mode_enabled() ) {
			return;
		}

		global $wcapf_form;

		if ( is_shop() || is_product_taxonomy() ) {
			if ( ! $wcapf_form ) {
				$debug_message = sprintf(
					/* translators: %s: admin form list URL. */
					__( 'No forms are assigned to this page. <a href="%s">Create a form here</a>.', 'wc-ajax-product-filter' ),
					esc_url( admin_url( 'admin.php?page=wcapf' ) )
				);

				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside helper.
				echo wcapf()->settings->debug_message( $debug_message );
			} elseif ( isset( $wcapf_form['rendered'] ) ) {
				$upgrade_link = add_query_arg(
					array(
						'utm_source'   => 'WCAPF+Free',
						'utm_medium'   => 'frontend+multiple+form',
						'utm_campaign' => 'WCAPF+Pro+Upgrade',
					),
					'https://wptools.io/wc-ajax-product-filter/'
				);

				$debug_message = sprintf(
					/* translators: %s: Pro upgrade URL. */
					__(
						'The form has already been displayed and cannot be shown again. Upgrade to the <a href="%s" target="_blank">Pro version</a> for the ability to use multiple forms on a page.',
						'wc-ajax-product-filter'
					),
					esc_url( $upgrade_link )
				);

				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside helper.
				echo wcapf()->settings->debug_message( $debug_message );
			}
		} else {
			$upgrade_link = add_query_arg(
				array(
					'utm_source'   => 'WCAPF+Free',
					'utm_medium'   => 'frontend+singular+page',
					'utm_campaign' => 'WCAPF+Pro+Upgrade',
				),
				'https://wptools.io/wc-ajax-product-filter/'
			);

			$debug_message = sprintf(
				/* translators: %s: Pro upgrade URL. */
				__(
					'The free version of the plugin does not support filtering products on singular pages. Upgrade to the <a href="%s" target="_blank">Pro version</a> to unlock this feature.',
					'wc-ajax-product-filter'
				),
				esc_url( $upgrade_link )
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside helper.
			echo wcapf()->settings->debug_message( $debug_message );
		}
	}
}
