<?php
/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/search-fields
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

	protected function render_filter_form() {
		// TODO: Implement render_form() method.
	}
}
