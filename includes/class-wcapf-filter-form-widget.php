<?php
/**
 * WC Ajax Product Filter form widget.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Form_Widget class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Form_Widget extends WP_Widget {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Display the product filter form.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-product-filter-form', // Base ID
			__( 'WC Ajax Product Filter Form', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	/**
	 * Outputs the content of the widget.
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance The widget options.
	 *
	 * @return void
	 */
	public function widget( $args, $instance ) {
		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		WCAPF_Helper::render_filter_form();

		echo $args['after_widget'];
		// phpcs:enable
	}

	/**
	 * Back-end widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 *
	 * @return void
	 */
	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : '';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				<?php echo esc_html__( 'Title:', 'wc-ajax-product-filter' ); ?>
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $title ); ?>"
			>
		</p>
		<?php
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_filter_form_widget() {
	register_widget( 'WCAPF_Filter_Form_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_filter_form_widget' );
