<?php
/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Post_Meta extends WCAPF_Field {

	/**
	 * The field's subfields.
	 *
	 * @return array|array[]
	 */
	protected function sub_fields() {
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
				'type'     => 'radio',
				'id'       => 'get_options',
				'label'    => __( 'Get options', 'wc-ajax-product-filter' ),
				'name'     => 'get_options',
				'options'  => array(
					'automatically' => __( 'Automatically', 'wc-ajax-product-filter' ),
					'manual_entry'  => __( 'Manual Entry', 'wc-ajax-product-filter' ),
				),
				'default'  => 'automatically',
				'position' => 90,
			),
			array(
				'type'     => 'get_options_orderby',
				'id'       => 'get_options_orderby',
				'label'    => __( 'Order by', 'wc-ajax-product-filter' ),
				'name'     => 'get_options_orderby',
				'position' => 95,
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
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'post-meta';
	}

	/**
	 * Output the field form.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		$meta_key        = $this->get_sub_field_value( 'meta_key' );
		$value_type      = $this->get_sub_field_value( 'value_type' );
		$display_type    = $this->get_sub_field_value( 'display_type' );
		$enable_multiple = $this->get_sub_field_value( 'enable_multiple' );
		$query_type      = $this->get_sub_field_value( 'query_type' );
		$show_count      = $this->get_sub_field_value( 'show_count' );
		$hide_empty      = $this->get_sub_field_value( 'hide_empty' );
		$get_options     = $this->get_sub_field_value( 'get_options' );

		$filter_key = 'price';

		$field_filter_data = array(
			'post_meta'   => $meta_key,
			'value_type'  => $value_type,
			'query_type'  => $query_type,
			'hide_empty'  => $hide_empty,
			'filter_key'  => $filter_key,
			'get_options' => $get_options,
		);

		$filter = new WCAPF_Filter_Type_Post_Meta( $field_filter_data );
		$items  = $filter->get_items();

		$walker                  = new WCAPF_Walker();
		$walker->display_type    = $display_type;
		$walker->enable_multiple = $enable_multiple;
		$walker->query_type      = $query_type;
		$walker->show_count      = $show_count;
		$walker->filter_key      = $filter_key;

		$classes = array( 'wcapf-ajax-meta-filter' );

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped // todo
		$this->after_filter_form();
	}

}
