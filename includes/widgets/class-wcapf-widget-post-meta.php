<?php
/**
 * Filter by post meta widget.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

/**
 * WCAPF_Widget_Post_Meta class.
 */
class WCAPF_Widget_Post_Meta extends WCAPF_Widget {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter woocommerce products by post meta.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-post-meta-filter', // Base ID
			__( 'WC Ajax Product Filter by Post Meta', 'wc-ajax-product-filter' ), // Name of Widget
			$widget_ops // args
		);
	}

	/**
	 * Output widget.
	 *
	 * @param array $args     The arguments.
	 * @param array $instance Saved values from database.
	 */
	public function widget( $args, $instance ) {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		$terms = array( 1, 2, 3 );

		if ( ! $terms ) {
			$widget_class = 'wcapf-widget-hidden woocommerce wcapf-ajax-post-meta-filter';
		} else {
			$widget_class = 'woocommerce wcapf-ajax-post-meta-filter';
		}

		$this->before_widget( $args, $instance, $widget_class );
		echo 'hello world';
		$this->after_widget( $args );
	}

	/**
	 * Register the widget fields.
	 *
	 * @return array
	 */
	protected function widget_fields() {
		$meta_keys = $this->get_meta_keys();

		$meta_key_options = array( '' => __( '-- Select a meta key --', 'wc-ajax-product-filter' ) );

		foreach ( $meta_keys as $meta_key ) {
			$meta_key_options[ $meta_key ] = $meta_key;
		}

		return array(
			array(
				'type'     => 'text',
				'id'       => 'title',
				'label'    => __( 'Title', 'wc-ajax-product-filter' ),
				'name'     => 'title',
				'position' => 5,
			),
			array(
				'type'     => 'select',
				'id'       => 'meta_key',
				'label'    => __( 'Meta Key', 'wc-ajax-product-filter' ),
				'name'     => 'meta_key',
				'options'  => $meta_key_options,
				'position' => 10,
			),
			array(
				'type'     => 'select',
				'id'       => 'value_type',
				'label'    => __( 'Value Type', 'wc-ajax-product-filter' ),
				'name'     => 'value_type',
				'options'  => array(
					'text'   => __( 'Text', 'wc-ajax-product-filter' ),
					'number' => __( 'Number', 'wc-ajax-product-filter' ),
					'date'   => __( 'Date', 'wc-ajax-product-filter' ),
				),
				'default'  => 'text',
				'position' => 15,
			),
			array(
				'type'     => 'select',
				'id'       => 'display_type',
				'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
				'name'     => 'display_type',
				'options'  => array(
					'list'     => __( 'Checkbox', 'wc-ajax-product-filter' ),
					'radio'    => __( 'Radio', 'wc-ajax-product-filter' ),
					'dropdown' => __( 'Select', 'wc-ajax-product-filter' ),
					'cloud'    => __( 'Cloud', 'wc-ajax-product-filter' ),
					'slider'   => __( 'Slider', 'wc-ajax-product-filter' ),
					'range'    => __( 'Range', 'wc-ajax-product-filter' ),
				),
				'default'  => 'list',
				'position' => 20,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'use_select2',
				'label'    => __( 'Use select2', 'wc-ajax-product-filter' ),
				'name'     => 'use_select2',
				'position' => 25,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'enable_multiple',
				'label'    => __( 'Enable multiple filter', 'wc-ajax-product-filter' ),
				'name'     => 'enable_multiple',
				'position' => 30,
			),
			array(
				'type'     => 'radio',
				'id'       => 'query_type',
				'label'    => __( 'Query Type', 'wc-ajax-product-filter' ),
				'name'     => 'query_type',
				'options'  => array(
					'and' => __( 'AND', 'wc-ajax-product-filter' ),
					'or'  => __( 'OR', 'wc-ajax-product-filter' ),
				),
				'default'  => 'and',
				'position' => 35,
			),
			array(
				'type'     => 'radio',
				'id'       => 'get_options',
				'label'    => __( 'Get options', 'wc-ajax-product-filter' ),
				'name'     => 'get_options',
				'options'  => array(
					'automatically' => __( 'Automatically', 'wc-ajax-product-filter' ),
					'manual_entry'  => __( 'Manual Entry', 'wc-ajax-product-filter' ),
				),
				'default'  => 'automatically',
				'position' => 40,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'show_count',
				'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
				'name'     => 'show_count',
				'position' => 80,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'hide_empty',
				'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
				'name'     => 'hide_empty',
				'position' => 85,
			),
			array(
				'type'     => 'script',
				'script'   => $this->get_js_script(),
				'position' => 999,
			),
		);
	}

	/**
	 * Gets the meta keys for post type product.
	 *
	 * @source https://stackoverflow.com/a/54017483
	 *
	 * @return array
	 * @noinspection SqlNoDataSourceInspection
	 */
	private function get_meta_keys() {
		global $wpdb;

		$post_type = 'product';

		return $wpdb->get_col(
			$wpdb->prepare(
				"
					SELECT DISTINCT($wpdb->postmeta.meta_key)
			        FROM $wpdb->posts
			        LEFT JOIN $wpdb->postmeta
			        ON $wpdb->posts.ID = $wpdb->postmeta.post_id
			        WHERE $wpdb->posts.post_type = %s
					AND $wpdb->postmeta.meta_key IS NOT NULL
					ORDER BY $wpdb->postmeta.meta_key
				",
				$post_type
			)
		);
	}

	/**
	 * Gets the js script.
	 *
	 * @return false|string
	 */
	private function get_js_script() {
		ob_start();
		?>
		<script>
			var wrapper = jQuery( '.wcapf-widget-wcapf-post-meta-filter' );
			var displayType = wrapper.find( '.wcapf-widget-field-display_type select' );

			wrapper.on( 'change', '.wcapf-widget-field-value_type select', function() {
				var valueType = jQuery( this ).val();
				var elem = jQuery( displayType ).find( '.slider, .range' );

				if ( 'text' === valueType ) {
					elem.attr( 'disabled', 'disabled' );
				} else {
					elem.removeAttr( 'disabled', 'disabled' );
				}

				console.log( 'hello changed' );

				jQuery( displayType ).trigger( 'change' );
			} );
		</script>
		<?php
		return ob_get_clean();
	}

}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_post_meta_widget() {
	register_widget( 'WCAPF_Widget_Post_Meta' );
}

add_action( 'widgets_init', 'wcapf_register_post_meta_widget' );
