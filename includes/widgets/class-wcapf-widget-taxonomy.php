<?php
/**
 * WCAPF_Widget_Taxonomy class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Widget_Taxonomy class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Widget_Taxonomy extends WP_Widget {

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

		list(
			$query_type,
			$enable_multiple,
			$show_count,
			$hierarchical,
			$show_children_only,
			$hide_empty,
			$display_type ) = $this->widget_settings( $instance );

		$filter_key = $this->get_filter_key();
		$taxonomy   = $this->get_taxonomy();

		$walker = new WCAPF_Taxonomy_Walker();

		$walker->taxonomy        = $taxonomy;
		$walker->display_type    = $display_type;
		$walker->query_type      = $query_type;
		$walker->enable_multiple = $enable_multiple;
		$walker->show_count      = $show_count;
		$walker->hide_empty      = $hide_empty;
		$walker->filter_key      = $filter_key;

		if ( is_taxonomy_hierarchical( $taxonomy ) ) {
			$walker->hierarchical       = $hierarchical;
			$walker->show_children_only = $show_children_only;
		} else {
			$walker->hierarchical       = false;
			$walker->show_children_only = false;
		}

		$taxonomy = new WCAPF_Taxonomy( $walker );
		$terms    = $taxonomy->get_terms();

		if ( ! $terms ) {
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

		echo $walker->build_menu( $terms );

		echo $args['after_widget'];
	}

	/**
	 * @param array $instance
	 *
	 * @return array
	 */
	public function widget_settings( $instance ) {
		$query_type         = isset( $instance['query_type'] ) ? $instance['query_type'] : '';
		$enable_multiple    = isset( $instance['enable_multiple'] ) ? boolval( $instance['enable_multiple'] ) : '';
		$show_count         = isset( $instance['show_count'] ) ? boolval( $instance['show_count'] ) : '';
		$hierarchical       = isset( $instance['hierarchical'] ) ? boolval( $instance['hierarchical'] ) : '';
		$show_children_only = isset( $instance['show_children_only'] ) ? boolval( $instance['show_children_only'] ) : '';
		$hide_empty         = isset( $instance['hide_empty'] ) ? boolval( $instance['hide_empty'] ) : '';
		$display_type       = isset( $instance['display_type'] ) ? $instance['display_type'] : '';
		$title              = isset( $instance['title'] ) ? $instance['title'] : '';

		return array(
			$query_type,
			$enable_multiple,
			$show_count,
			$hierarchical,
			$show_children_only,
			$hide_empty,
			$display_type,
			$title
		);
	}

	abstract protected function get_filter_key();

	abstract protected function get_taxonomy();

	/**
	 * Output widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		list(
			$query_type,
			$enable_multiple,
			$show_count,
			$hierarchical,
			$show_children_only,
			$hide_empty,
			$display_type,
			$title ) = $this->widget_settings( $instance );
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
		<?php if ( $this->is_hierarchical() ) : ?>
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
		<?php endif; ?>
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

	/**
	 * Checks if the taxonomy is hierarchical.
	 *
	 * @return bool
	 */
	private function is_hierarchical() {
		return is_taxonomy_hierarchical( $this->get_taxonomy() );
	}

}
