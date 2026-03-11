<?php
/**
 * WCAPF - WooCommerce Ajax Product Filter Form shortcode.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     wptools.io
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Filter_Form_Shortcode class.
 *
 * @since 4.0.0
 */
class WCAPF_Filter_Form_Shortcode {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Filter_Form_Shortcode();
		}

		return $instance;
	}

	/**
	 * Renders the filter form shortcode output.
	 *
	 * @return string
	 */
	public function register_shortcode() {
		ob_start();

		$this->render_debug_messages();

		$form = new WCAPF_Form();
		$form->render_form();

		return ob_get_clean();
	}

	/**
	 * Renders debug messages for unsupported shortcode usage.
	 *
	 * @return void
	 */
	public function render_debug_messages() {
		if ( ! WCAPF_Helper::is_debug_mode_enabled() ) {
			return;
		}

		global $wcapf_form;

		if ( is_shop() || is_product_taxonomy() ) {
			if ( ! $wcapf_form ) {
				$debug_message = sprintf(
					/* translators: %s: admin form list URL. */
					__( 'No forms found. <a href="%s">Create a form here</a>.', 'wc-ajax-product-filter' ),
					esc_url( admin_url( 'admin.php?page=wcapf' ) )
				);

				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaped inside helper.
				echo WCAPF_Helper::get_debug_message( $debug_message );
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
				echo WCAPF_Helper::get_debug_message( $debug_message );
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
			echo WCAPF_Helper::get_debug_message( $debug_message );
		}
	}
}

add_shortcode( 'wcapf_form', array( WCAPF_Filter_Form_Shortcode::get_instance(), 'register_shortcode' ) );
