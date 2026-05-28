<?php
/**
 * Deprecated id_base shim for the filter-form widget.
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
 * Keeps the deprecated 'wcapf_filter_widget' id_base registered so customer
 * sidebars that already have the widget placed render unchanged after the v3
 * rename to 'wcapf_form_widget'. Inherits the frontend output from Form;
 * surfaces the deprecation in the admin and (when WP_DEBUG is on) in the log.
 */
class LegacyFilter extends Form {

	/**
	 * Constructor. Registers the deprecated id_base.
	 */
	public function __construct() {
		\WP_Widget::__construct(
			'wcapf_filter_widget',
			'WCAPF - Product Filter Form (deprecated)',
			array(
				'description'           => __( 'Deprecated. Remove this widget and place "WCAPF - Product Filter Form" instead.', 'wc-ajax-product-filter' ),
				'show_instance_in_rest' => true,
			)
		);
	}

	/**
	 * Renders the form. Surfaces the deprecation each render when WP_DEBUG is
	 * on so it shows up in the debug log.
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance The widget instance.
	 *
	 * @return void
	 */
	public function widget( $args, $instance ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			_doing_it_wrong(
				__CLASS__,
				esc_html__( 'The wcapf_filter_widget widget id_base is deprecated. Replace this widget instance with "WCAPF - Product Filter Form" (wcapf_form_widget).', 'wc-ajax-product-filter' ),
				'5.0.0'
			);
		}

		parent::widget( $args, $instance );
	}

	/**
	 * Outputs the admin form with a deprecation notice.
	 *
	 * @param array $instance The widget instance.
	 *
	 * @return void
	 */
	public function form( $instance ) {
		?>
		<p style="color:#a00;">
			<strong><?php esc_html_e( 'This widget is deprecated.', 'wc-ajax-product-filter' ); ?></strong>
			<br />
			<?php echo wp_kses_post( __( 'Remove this widget and place <b>WCAPF - Product Filter Form</b> in its place.', 'wc-ajax-product-filter' ) ); ?>
		</p>
		<?php
	}
}
