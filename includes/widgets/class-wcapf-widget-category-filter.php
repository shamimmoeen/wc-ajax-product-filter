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
 * @since 1.0.0
 */
class WCAPF_Widget_Category_Filter extends WP_Widget {

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

		$display_type       = isset( $instance['display_type'] ) ? $instance['display_type'] : '';
		$query_type         = isset( $instance['query_type'] ) ? $instance['query_type'] : '';
		$enable_multiple    = isset( $instance['enable_multiple'] ) ? boolval( $instance['enable_multiple'] ) : '';
		$show_count         = isset( $instance['show_count'] ) ? boolval( $instance['show_count'] ) : '';
		$update_count       = isset( $instance['update_count'] ) ? boolval( $instance['update_count'] ) : '';
		$hierarchical       = isset( $instance['hierarchical'] ) ? boolval( $instance['hierarchical'] ) : '';
		$show_children_only = isset( $instance['show_children_only'] ) ? boolval( $instance['show_children_only'] ) : '';
		$hide_empty         = isset( $instance['hide_empty'] ) ? boolval( $instance['hide_empty'] ) : '';

		$filter_key = 'product-cat';
		$taxonomy   = 'product_cat';

		$tree = $this->get_terms( $taxonomy, $query_type );

		// $tree = $term_helper->build_tree( $new_terms );
		// $tree = $term_helper->count_parent_term_items( $tree );

		$walker = new WCAPF_List_Walker();

		$walker->display_type       = $display_type;
		$walker->query_type         = $query_type;
		$walker->enable_multiple    = $enable_multiple;
		$walker->show_count         = $show_count;
		$walker->hierarchical       = $hierarchical;
		$walker->show_children_only = $show_children_only;
		$walker->hide_empty         = $hide_empty;
		$walker->filter_key         = $filter_key;

		if ( ! $tree ) {
			$widget_class = 'wcapf-widget-hidden woocommerce wcapf-ajax-term-filter';
		} else {
			$widget_class = 'woocommerce wcapf-ajax-term-filter';
		}

		$before_widget = $args['before_widget'];

		// no class found, so add it
		if ( strpos( $before_widget, 'class' ) === false ) {
			$before_widget = str_replace( '>', 'class="' . $widget_class . '"', $before_widget );
		} // class found but not the one that we need, so add it
		else {
			$before_widget = str_replace( 'class="', 'class="' . $widget_class . ' ', $before_widget );
		}

		echo $before_widget; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		echo $walker->build_menu( $tree );

		echo $args['after_widget'];
	}

	private function get_terms( $taxonomy, $query_type ) {
		$terms       = get_terms( array( 'taxonomy' => $taxonomy ) );
		$term_helper = new WCAPF_Term_Helper();
		$new_terms   = array();

		foreach ( $terms as $_term ) {
			$term_id   = $_term->term_id;
			$count     = $_term->count;
			$parent_id = $_term->parent;
			$name      = $_term->name;

			$_term = array(
				'id'        => $term_id,
				'name'      => $name,
				'count'     => $count,
				'parent_id' => $parent_id,
			);

			$new_terms[ $term_id ] = $_term;
		}

		if ( 'or' === $query_type ) {
			return $term_helper->build_tree( $new_terms );
		}

		// taxonomy hierarchical
		// query_type = AND
		// show count
		// update count
		// hide empty

		// TODO: make an array with term_id, count for active terms, include active terms' parents also
		$active_terms_results = $term_helper->new_get_filtered_term_product_counts( $terms, $taxonomy, $query_type );

		$active_terms    = wp_list_pluck( $active_terms_results, 'term_count', 'term_count_id' );
		$active_term_ids = wp_list_pluck( $active_terms_results, 'term_count_id' );
		$ancestors       = array();

		foreach ( $active_term_ids as $active_term_id ) {
			$term_ancestors = get_ancestors( $active_term_id, $taxonomy );
			$ancestors      = array_unique( array_merge( $ancestors, $term_ancestors ) );
		}

		// echo 'ancestors';
		// echo '<pre>';
		// print_r( $ancestors );
		// echo '</pre>';
		//
		// echo 'active term ids';
		// echo '<pre>';
		// print_r( $active_term_ids );
		// echo '</pre>';
		//
		// echo 'active term results';
		// echo '<pre>';
		// print_r( $active_terms_results );
		// echo '</pre>';

		$updated_count_terms = array();

		foreach ( $new_terms as $term_id => $term ) {
			$term['count'] = isset( $active_terms[ $term_id ] ) ? $active_terms[ $term_id ] : 0;

			$updated_count_terms[ $term_id ] = $term;
		}

		$updated_count_terms_tree = $term_helper->build_tree( $updated_count_terms );
		$updated_count_terms_tree = $term_helper->count_parent_term_items( $updated_count_terms_tree );

		// echo 'updated count';
		// echo '<pre>';
		// print_r( $updated_count_terms_tree );
		// echo '</pre>';

		return $updated_count_terms_tree;
	}

	/**
	 * Output widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		// TODO: Hide update_count, hide_empty for query_type=or
		$title              = isset( $instance['title'] ) ? $instance['title'] : '';
		$display_type       = isset( $instance['display_type'] ) ? $instance['display_type'] : '';
		$query_type         = isset( $instance['query_type'] ) ? $instance['query_type'] : '';
		$enable_multiple    = isset( $instance['enable_multiple'] ) ? boolval( $instance['enable_multiple'] ) : '';
		$show_count         = isset( $instance['show_count'] ) ? boolval( $instance['show_count'] ) : '';
		$update_count       = isset( $instance['update_count'] ) ? boolval( $instance['update_count'] ) : '';
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
				id="<?php echo esc_attr( $this->get_field_id( 'update_count' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'update_count' ) ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $show_count, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $this->get_field_id( 'update_count' ) ); ?>">
				<?php esc_html_e( 'Update count', 'wc-ajax-product-filter' ); ?>
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
				<?php esc_html_e( 'Only show children of the current', 'wc-ajax-product-filter' ); ?>
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
				<?php esc_html_e( 'Hide empty', 'wc-ajax-product-filter' ); ?>
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
