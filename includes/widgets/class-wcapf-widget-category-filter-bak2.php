<?php
/**
 * Category filter widget.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WC Ajax Product Filter by Category class.
 *
 * @since      1.0.0
 */
class WCAPF_Widget_Category_Filter extends WP_Widget {

	/**
	 * Category ancestors.
	 *
	 * @var        array
	 */
	public $cat_ancestors;

	/**
	 * Current Category.
	 *
	 * @var        boolean
	 */
	public $current_cat;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$widget_ops = array(
			'description'           => __( 'Filter products by category.', 'wc-ajax-product-filter' ),
			'show_instance_in_rest' => true,
		);

		parent::__construct(
			'wcapf-category-filter', // Base ID
			__( 'WC Ajax Product Filter by Category', 'wc-ajax-product-filter' ), // Name of Widget
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

		echo $args['before_widget']; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		$display_type       = isset( $instance['display_type'] ) ? $instance['display_type'] : '';
		$query_type         = isset( $instance['query_type'] ) ? $instance['query_type'] : '';
		$enable_multiple    = isset( $instance['enable_multiple'] ) ? boolval( $instance['enable_multiple'] ) : '';
		$show_count         = isset( $instance['show_count'] ) ? boolval( $instance['show_count'] ) : '';
		$hierarchical       = isset( $instance['hierarchical'] ) ? boolval( $instance['hierarchical'] ) : '';
		$show_children_only = isset( $instance['show_children_only'] ) ? boolval( $instance['show_children_only'] ) : '';
		$hide_empty         = isset( $instance['hide_empty'] ) ? boolval( $instance['hide_empty'] ) : '';

		$list_args = array(
			'taxonomy'     => 'product_cat',
			'show_count'   => $show_count,
			'hierarchical' => $hierarchical,
			'hide_empty'   => $hide_empty,
		);

		$this->current_cat   = false;
		$this->cat_ancestors = array();

		if ( is_tax( 'product_cat' ) ) {
			$this->current_cat   = $wp_query->queried_object;
			$this->cat_ancestors = get_ancestors( $this->current_cat->term_id, 'product_cat' );
		}

		// Show Siblings and Children Only.
		if ( $show_children_only && $this->current_cat ) {
			if ( $hierarchical ) {
				$include = array_merge(
					$this->cat_ancestors,
					array( $this->current_cat->term_id ),
					get_terms(
						'product_cat',
						array(
							'fields'       => 'ids',
							'parent'       => 0,
							'hierarchical' => true,
							'hide_empty'   => false,
						)
					),
					get_terms(
						'product_cat',
						array(
							'fields'       => 'ids',
							'parent'       => $this->current_cat->term_id,
							'hierarchical' => true,
							'hide_empty'   => false,
						)
					)
				);

				// Gather siblings of ancestors.
				if ( $this->cat_ancestors ) {
					foreach ( $this->cat_ancestors as $ancestor ) {
						$include = array_merge(
							$include,
							get_terms(
								'product_cat',
								array(
									'fields'       => 'ids',
									'parent'       => $ancestor,
									'hierarchical' => false,
									'hide_empty'   => false,
								)
							)
						);
					}
				}
			} else {
				// Direct children.
				$include = get_terms(
					'product_cat',
					array(
						'fields'       => 'ids',
						'parent'       => $this->current_cat->term_id,
						'hierarchical' => true,
						'hide_empty'   => false,
					)
				);
			}

			$list_args['include']     = implode( ',', $include );
			$dropdown_args['include'] = $list_args['include'];

			if ( empty( $include ) ) {
				return;
			}
		} elseif ( $show_children_only ) {
			$dropdown_args['depth']        = 1;
			$dropdown_args['child_of']     = 0;
			$dropdown_args['hierarchical'] = 1;
			$list_args['depth']            = 1;
			$list_args['child_of']         = 0;
			$list_args['hierarchical']     = 1;
		}

		if ( 'list' === $display_type ) {
			require_once WC()->plugin_path() . '/includes/walkers/class-wc-product-cat-list-walker.php';
			require_once WCAPF_PATH . 'includes/class-wcapf-product-cat-list-walker.php';

			$walker_args = array( $query_type, $enable_multiple );

			$list_args['walker']                     = new WCAPF_Product_Cat_List_Walker( $walker_args );
			$list_args['title_li']                   = '';
			$list_args['pad_counts']                 = 1;
			$list_args['show_option_none']           = __( 'No product categories exist', 'wc-ajax-product-filter' );
			$list_args['current_category']           = $this->current_cat ? $this->current_cat->term_id : '';
			$list_args['current_category_ancestors'] = $this->cat_ancestors;

			echo '<ul class="product-categories">';

			wp_list_categories( apply_filters( 'wcapf_product_categories_widget_args', $list_args ) );

			echo '</ul>';
		} else {
			echo 'preview';
		}

		echo $args['after_widget'];

		$taxonomy = 'product_cat';
		$terms    = get_terms( array( 'taxonomy' => $taxonomy ) );

		$wcapf = WCAPF_Product_Filter::instance();
		$tree  = $wcapf->get_filtered_term_product_counts( $terms, $taxonomy, 'and' );

		$walker = new WCAPF_List_Walker();

		$walker->display_type       = $display_type;
		$walker->query_type         = $query_type;
		$walker->enable_multiple    = $enable_multiple;
		$walker->show_count         = $show_count;
		$walker->hierarchical       = $hierarchical;
		$walker->show_children_only = $show_children_only;
		$walker->hide_empty         = $hide_empty;

		echo 'build the menu';
		$walker->build_menu( $tree );

		echo '<pre>';
		print_r( $tree );
		echo '</pre>';
	}

	/**
	 * Output widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		$title              = isset( $instance['title'] ) ? $instance['title'] : '';
		$display_type       = isset( $instance['display_type'] ) ? $instance['display_type'] : '';
		$query_type         = isset( $instance['query_type'] ) ? $instance['query_type'] : '';
		$enable_multiple    = isset( $instance['enable_multiple'] ) ? boolval( $instance['enable_multiple'] ) : '';
		$show_count         = isset( $instance['show_count'] ) ? boolval( $instance['show_count'] ) : '';
		$hierarchical       = isset( $instance['hierarchical'] ) ? boolval( $instance['hierarchical'] ) : '';
		$show_children_only = isset( $instance['show_children_only'] ) ? boolval( $instance['show_children_only'] ) : '';
		$hide_empty         = isset( $instance['hide_empty'] ) ? boolval( $instance['hide_empty'] ) : '';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				<?php esc_html_e( 'Title:', 'wc-ajax-product-filter' ); ?>
			</label>
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $title ); ?>"
			>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'display_type' ) ); ?>">
				<?php esc_html_e( 'Display Type', 'wc-ajax-product-filter' ); ?>
			</label>
			<select
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'display_type' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'display_type' ) ); ?>"
			>
				<option value="list" <?php selected( $display_type, 'list' ); ?>>
					<?php esc_html_e( 'List', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="dropdown" <?php selected( $display_type, 'dropdown' ); ?>>
					<?php esc_html_e( 'Dropdown', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'query_type' ) ); ?>">
				<?php esc_html_e( 'Query Type', 'wc-ajax-product-filter' ); ?>
			</label>
			<select
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'query_type' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'query_type' ) ); ?>"
			>
				<option value="and" <?php selected( $query_type, 'and' ); ?>>
					<?php esc_html_e( 'AND', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="or" <?php selected( $query_type, 'or' ); ?>>
					<?php esc_html_e( 'OR', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</p>
		<p>
			<input
				id="<?php echo esc_attr( $this->get_field_id( 'enable_multiple' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'enable_multiple' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $enable_multiple, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'enable_multiple' ) ); ?>">
				<?php esc_html_e( 'Enable multiple filter', 'wc-ajax-product-filter' ); ?>
			</label>
		</p>
		<p>
			<input
				id="<?php echo esc_attr( $this->get_field_id( 'show_count' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'show_count' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $show_count, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_count' ) ); ?>">
				<?php esc_html_e( 'Show count', 'wc-ajax-product-filter' ); ?>
			</label>
		</p>
		<p>
			<input
				id="<?php echo esc_attr( $this->get_field_id( 'hierarchical' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'hierarchical' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $hierarchical, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'hierarchical' ) ); ?>">
				<?php esc_html_e( 'Show hierarchy', 'wc-ajax-product-filter' ); ?>
			</label>
		</p>
		<p>
			<input
				id="<?php echo esc_attr( $this->get_field_id( 'show_children_only' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'show_children_only' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $show_children_only, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'show_children_only' ) ); ?>">
				<?php esc_html_e( 'Only show children of the current attribute', 'wc-ajax-product-filter' ); ?>
			</label>
		</p>
		<p>
			<input
				id="<?php echo esc_attr( $this->get_field_id( 'hide_empty' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'hide_empty' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $hide_empty, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'hide_empty' ) ); ?>">
				<?php esc_html_e( 'Hide empty categories', 'wc-ajax-product-filter' ); ?>
			</label>
		</p>
		<?php
	}
}

/**
 * Register the widget.
 *
 * @return void
 */
function wcapf_register_category_filter_widget() {
	register_widget( 'WCAPF_Widget_Category_Filter' );
}

add_action( 'widgets_init', 'wcapf_register_category_filter_widget' );
