<?php
/**
 * The [wcapf_reset_button] shortcode.
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
 * Renders the standalone reset-button via the reset-button template.
 */
class ResetButton {

	/**
	 * Renders the shortcode output.
	 *
	 * @param array $attrs Shortcode attributes.
	 *
	 * @return string
	 */
	public function render( $attrs = array() ) {
		$a = shortcode_atts(
			array(
				'id'          => '',
				'btn_label'   => wcapf()->settings->reset_button_label(),
				'show_always' => '',
			),
			$attrs
		);

		if ( $a['id'] ) {
			$a['unique_id'] = $a['id'];
		}

		$args = wcapf()->active_filters->prepare_reset_button_args( $a );

		return \WCAPF_Template_Loader::get_instance()->load( 'reset-button', $args, false );
	}
}
