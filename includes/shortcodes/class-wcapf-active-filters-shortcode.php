<?php
/**
 * Active filters shortcode.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/shortcodes
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Active_Filters_Shortcode class.
 *
 * @since 4.0.0
 */
class WCAPF_Active_Filters_Shortcode {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Renders the active filters shortcode output.
	 *
	 * @param array $attrs Shortcode attributes.
	 *
	 * @return string
	 */
	public function shortcode_output( $attrs = array() ) {
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

		return WCAPF_Template_Loader::get_instance()->load( 'active-filters', $args, false );
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Active_Filters_Shortcode();
		}

		return $instance;
	}
}

add_shortcode( 'wcapf_active_filters', array( WCAPF_Active_Filters_Shortcode::get_instance(), 'shortcode_output' ) );
