<?php
/**
 * The filter-form widget.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Widgets
 * @author     Mainul Hassan
 */

namespace WCAPF\Widgets;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the configured filter form via the [wcapf_form] shortcode. Which form
 * actually shows is governed by each form's per-form "Available on" settings,
 * not by a widget-instance field.
 */
class Form extends \WP_Widget {

	/**
	 * Constructor. The id_base ('wcapf_form_widget') is passed explicitly so
	 * `wp widget add wcapf_form_widget …` works without relying on WP's
	 * lowercased-class-name fallback. The pre-v3 id_base 'wcapf_filter_widget'
	 * is kept alive by the LegacyFilter shim for existing customer sidebars.
	 */
	public function __construct() {
		parent::__construct(
			'wcapf_form_widget',
			'WCAPF - Product Filter Form',
			array(
				'description'           => __( 'Display a form to filter products in your store.', 'wc-ajax-product-filter' ),
				'show_instance_in_rest' => true,
			)
		);
	}

	/**
	 * Outputs the widget's frontend content.
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance The widget instance.
	 *
	 * @return void
	 */
	public function widget( $args, $instance ) {
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return;
		}

		echo do_shortcode( '[wcapf_form]' );
	}

	/**
	 * Outputs the widget's admin settings form.
	 *
	 * @param array $instance The widget instance.
	 *
	 * @return void
	 */
	public function form( $instance ) {
		?>
		<p>
			<?php echo wp_kses_post( __( 'No settings are required! The form will be displayed according to the <b>Available on</b> setting.', 'wc-ajax-product-filter' ) ); ?>
		</p>
		<?php
	}
}
