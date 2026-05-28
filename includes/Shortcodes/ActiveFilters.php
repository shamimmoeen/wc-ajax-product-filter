<?php
/**
 * The [wcapf_active_filters] shortcode.
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
 * Renders the active-filters bar via the active-filters template.
 */
class ActiveFilters {

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
				'id'                   => '',
				'title'                => __( 'Active Filters', 'wc-ajax-product-filter' ),
				'layout'               => 'simple',
				'empty_message'        => '',
				'clear_all_btn_label'  => wcapf()->settings->clear_all_button_label(),
				'clear_all_btn_layout' => 'block',
			),
			$attrs
		);

		if ( $a['id'] ) {
			$a['unique_id'] = $a['id'];
		}

		$args = wcapf()->active_filters->prepare_args( $a );

		return \WCAPF_Template_Loader::get_instance()->load( 'active-filters', $args, false );
	}
}
