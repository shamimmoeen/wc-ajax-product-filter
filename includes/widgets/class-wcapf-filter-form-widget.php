<?php
/**
 * WC Ajax Product Filter Form widget.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/widgets
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Form_Widget class.
 *
 * @since 3.1.0
 */
class WCAPF_Filter_Form_Widget extends WP_Widget {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Display a form to filter products in your store.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			false, // Base ID
			'WC Ajax Product Filter Form', // Name of Widget
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
		$form_id = ! empty( $instance['form_id'] ) ? $instance['form_id'] : '';

		if ( ! $form_id ) {
			return;
		}

		echo do_shortcode( '[wcapf_filter_form id="' . $form_id . '"]' );
	}

	/**
	 * Back-end widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 *
	 * @return void
	 */
	public function form( $instance ) {
		$filter_forms = get_posts(
			array(
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
			)
		);

		$new_form_link = admin_url( 'post-new.php?post_type=wcapf-form' );
		$_field_id     = $this->get_field_id( 'filter_id' );
		$form_id       = ! empty( $instance['form_id'] ) ? $instance['form_id'] : '';
		?>
		<?php if ( $filter_forms ) : ?>
			<p>
				<label for="<?php echo esc_attr( $_field_id ); ?>">
					<?php echo esc_html__( 'Choose a form:', 'wc-ajax-product-filter' ); ?>
				</label>
				<select
					name="<?php echo esc_attr( $this->get_field_name( 'form_id' ) ); ?>"
					id="<?php echo esc_attr( $_field_id ); ?>"
					class="wcapf-widget-dropdown-field"
				>
					<option
						value=""
						data-edit-link=""
					>
						<?php esc_html_e( '-- Choose --', 'wc-ajax-product-filter' ); ?>
					</option>
					<?php foreach ( $filter_forms as $post_id ) : ?>
						<option
							value="<?php echo esc_attr( $post_id ); ?>"
							<?php selected( $form_id, $post_id ); ?>
							data-edit-link="<?php echo get_edit_post_link( $post_id ); ?>"
						>
							<?php echo esc_html( get_the_title( $post_id ) ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</p>
			<p>
				<a href="<?php echo esc_url( $new_form_link ); ?>" target="_blank">
					<?php esc_html_e( 'Add New', 'wc-ajax-product-filter' ); ?>
				</a>
				<span<?php echo ! $form_id ? ' style="display: none;"' : ''; ?>>
					<span>&nbsp;|&nbsp;</span>
					<a href="<?php echo get_edit_post_link( $form_id ); ?>" class="edit-link" target="_blank">
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
				<?php esc_html_e( 'There is no filter form found.', 'wc-ajax-product-filter' ); ?>
			</p>
			<p>
				<a href="<?php echo esc_url( $new_form_link ); ?>" target="_blank">
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
function wcapf_register_filter_form_widget() {
	register_widget( 'WCAPF_Filter_Form_Widget' );
}

add_action( 'widgets_init', 'wcapf_register_filter_form_widget' );
