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
abstract class WCAPF_Widget_Taxonomy extends WCAPF_Widget {

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

	protected function widget_fields() {
		$fields = array(
			array(
				'type'     => 'text',
				'id'       => 'title',
				'label'    => __( 'Title', 'wc-ajax-product-filter' ),
				'name'     => 'title',
				'position' => 5,
			),
			array(
				'type'     => 'select',
				'id'       => 'display_type',
				'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
				'name'     => 'display_type',
				'options'  => array(
					'list'     => __( 'List', 'wc-ajax-product-filter' ),
					'dropdown' => __( 'Dropdown', 'wc-ajax-product-filter' ),
				),
				'position' => 10,
			),
			array(
				'type'     => 'select',
				'id'       => 'query_type',
				'label'    => __( 'Query Type', 'wc-ajax-product-filter' ),
				'name'     => 'query_type',
				'options'  => array(
					'and' => __( 'AND', 'wc-ajax-product-filter' ),
					'or'  => __( 'OR', 'wc-ajax-product-filter' ),
				),
				'position' => 15,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'enable_multiple',
				'label'    => __( 'Enable multiple filter', 'wc-ajax-product-filter' ),
				'name'     => 'enable_multiple',
				'position' => 20,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'show_count',
				'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
				'name'     => 'show_count',
				'position' => 25,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'hide_empty',
				'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
				'name'     => 'hide_empty',
				'position' => 40,
			),
		);

		if ( $this->is_hierarchical() ) {
			$fields = array_merge( $fields, array(
				array(
					'type'     => 'checkbox',
					'id'       => 'hierarchical',
					'label'    => __( 'Show hierarchy', 'wc-ajax-product-filter' ),
					'name'     => 'hierarchical',
					'position' => 30,
				),
				array(
					'type'     => 'checkbox',
					'id'       => 'show_children_only',
					'label'    => __( 'Only show children of the current', 'wc-ajax-product-filter' ),
					'name'     => 'show_children_only',
					'position' => 35,
				),
			) );
		}

		return $fields;
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
