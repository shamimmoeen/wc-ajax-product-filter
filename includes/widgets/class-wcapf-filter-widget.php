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

		$new_filter_link = admin_url( 'post-new.php?post_type=wcapf-filter' );
		$_field_id       = $this->get_field_id( 'filter_id' );
		$filter_id       = ! empty( $instance['filter_id'] ) ? $instance['filter_id'] : '';
		?>
		<?php if ( $filters ) : ?>
			<p>
				<label for="<?php echo esc_attr( $_field_id ); ?>">
					<?php echo esc_html__( 'Choose a filter:', 'wc-ajax-product-filter' ); ?>
				</label>
				<select
					name="<?php echo esc_attr( $this->get_field_name( 'filter_id' ) ); ?>"
					id="<?php echo esc_attr( $_field_id ); ?>"
					class="wcapf-widget-dropdown-field"
				>
					<option
						value=""
						data-edit-link=""
					>
						<?php esc_html_e( '-- Choose --', 'wc-ajax-product-filter' ); ?>
					</option>
					<?php foreach ( $filters as $post_id ) : ?>
						<option
							value="<?php echo esc_attr( $post_id ); ?>"
							<?php selected( $filter_id, $post_id ); ?>
							data-edit-link="<?php echo get_edit_post_link( $post_id ); ?>"
						>
							<?php echo esc_html( get_the_title( $post_id ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</p>
			<p>
				<a href="<?php echo esc_url( $new_filter_link ); ?>" target="_blank">
					<?php esc_html_e( 'Add New', 'wc-ajax-product-filter' ); ?>
				</a>
				<span<?php echo ! $filter_id ? ' style="display: none;"' : ''; ?>>
					<span>&nbsp;|&nbsp;</span>
					<a href="<?php echo get_edit_post_link( $filter_id ); ?>" class="edit-link" target="_blank">
						<?php esc_html_e( 'Edit', 'wc-ajax-product-filter' ); ?>
					</a>
				</span>
			</p>
			<!--suppress ES6ConvertVarToLetConst -->
			<script>
				jQuery( '#' + '<?php echo $_field_id; ?>' ).on( 'change', function() {
					var $dropdown        = jQuery( this );
					var $selectedOption  = jQuery( this ).find( 'option:selected' );
					var editLink         = $selectedOption.attr( 'data-edit-link' );
					var $editLink        = $dropdown.closest( '.widget-content' ).find( '.edit-link' );
					var $editLinkWrapper = $editLink.parent();

					jQuery( $editLink.attr( 'href', editLink ) );

					if ( ! editLink.length ) {
						$editLinkWrapper.hide();
					} else {
						$editLinkWrapper.show();
					}
				} );
			</script>
		<?php else : ?>
			<p>
				<?php esc_html_e( 'There is no filter found.', 'wc-ajax-product-filter' ); ?>
			</p>
			<p>
				<a href="<?php echo esc_url( $new_filter_link ); ?>" target="_blank">
					<?php esc_html_e( 'Add New', 'wc-ajax-product-filter' ); ?>
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
