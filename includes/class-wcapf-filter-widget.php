<?php
/**
 * WC Ajax Product Filter widget.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Widget class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Widget extends WP_Widget {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Display a list, dropdown, slider or input field(s) to filter products in your store.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			false, // Base ID
			__( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ), // Name of Widget
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
		$filter_id = ! empty( $instance['filter_id'] ) ? $instance['filter_id'] : '';

		if ( ! $filter_id ) {
			return;
		}

		echo do_shortcode( '[wcapf_filter id="' . $filter_id . '"]' );
	}

	/**
	 * Back-end widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 *
	 * @return void
	 */
	public function form( $instance ) {
		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
			)
		);
		?>
		<?php if ( $filters ) : ?>
			<?php $filter_id = ! empty( $instance['filter_id'] ) ? $instance['filter_id'] : ''; ?>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'filter_id' ) ); ?>">
					<?php echo esc_html__( 'Choose a filter:', 'wc-ajax-product-filter' ); ?>
				</label>
				<select
					name="<?php echo esc_attr( $this->get_field_name( 'filter_id' ) ); ?>"
					id="<?php echo esc_attr( $this->get_field_id( 'filter_id' ) ); ?>"
				>
					<option value=""><?php esc_html_e( '-- Choose --', 'wc-ajax-product-filter' ); ?></option>
					<?php foreach ( $filters as $post_id ) : ?>
						<option value="<?php echo esc_attr( $post_id ); ?>" <?php selected( $filter_id, $post_id ); ?>>
							<?php echo esc_html( get_the_title( $post_id ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</p>
		<?php else : ?>
			<p class="description" style="color: #000;">
				<?php esc_html_e( 'There is no filter to choose from.', 'wc-ajax-product-filter' ); ?>
			</p>
			<?php $btn_url = admin_url( 'post-new.php?post_type=wcapf-filter' ); ?>
			<p>
				<a href="<?php echo esc_url( $btn_url ); ?>" class="button button-small">
					<?php esc_html_e( 'Create a filter', 'wc-ajax-product-filter' ); ?>.
				</a>
			</p>
		<?php endif; ?>
		<?php
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_filter_widget() {
	register_widget( 'WCAPF_Filter_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_filter_widget' );
