<?php
/**
 * WCAPF_Field_Group_Text class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields/field-groups
 * @author     wptools.io
 */

/**
 * WCAPF_Field_Group_Text class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Group_Text extends WCAPF_Field_Group {

	private $is_hierarchical = false;

	private $is_advanced_appearance_supported = false;

	private $taxonomy_has_image = false;

	public function set_hierarchical() {
		$this->is_hierarchical = true;
	}

	public function set_advanced_appearance_supported() {
		$this->is_advanced_appearance_supported = true;
	}

	public function set_taxonomy_has_image() {
		return $this->taxonomy_has_image = true;
	}

	protected function set_group_fields() {
		$left_column_fields  = $this->get_left_column_fields();
		$right_column_fields = $this->get_right_column_fields();

		return array(
			array(
				'name'     => 'display_type',
				'class'    => 'separator-top',
				'position' => 15,
				'columns'  => array(
					$left_column_fields,
					$right_column_fields,
				),
			),
		);
	}

	/**
	 * @return array[]|mixed|void
	 */
	private function get_left_column_fields() {
		$text_display_types = array(
			'checkbox'     => __( 'Checkbox', 'wc-ajax-product-filter' ),
			'radio'        => __( 'Radio', 'wc-ajax-product-filter' ),
			'select'       => __( 'Select', 'wc-ajax-product-filter' ),
			'multi-select' => __( 'Multi select', 'wc-ajax-product-filter' ),
			'label'        => __( 'Label', 'wc-ajax-product-filter' ),
		);

		if ( $this->is_advanced_appearance_supported ) {
			$text_display_types = apply_filters( 'wcapf_text_display_types', $text_display_types );
		}

		$left_column_fields = array(
			array(
				'type'     => 'select',
				'id'       => 'display_type',
				'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
				'name'     => 'display_type',
				'options'  => $text_display_types,
				'default'  => 'checkbox',
				'position' => 20,
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
				'type'     => 'text',
				'id'       => 'all_items_label',
				'label'    => __( 'Change All Items Label', 'wc-ajax-product-filter' ),
				'name'     => 'all_items_label',
				'position' => 40,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'use_chosen',
				'label'    => __( 'Use jQuery Chosen Library', 'wc-ajax-product-filter' ),
				'name'     => 'use_chosen',
				'position' => 45,
			),
			array(
				'type'     => 'text',
				'id'       => 'chosen_no_results_message',
				'label'    => __( 'No results message', 'wc-ajax-product-filter' ),
				'name'     => 'chosen_no_results_message',
				'position' => 50,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'enable_multiple_filter',
				'label'    => __( 'Enable Multiple Filter', 'wc-ajax-product-filter' ),
				'name'     => 'enable_multiple_filter',
				'position' => 30,
			),
		);

		if ( $this->is_advanced_appearance_supported ) {
			$left_column_fields = apply_filters(
				'wcapf_field_group_text_left_column_fields',
				$left_column_fields,
				$this->taxonomy_has_image
			);
		}

		return $left_column_fields;
	}

	/**
	 * @return array
	 */
	private function get_right_column_fields() {
		$right_column_fields = array();

		if ( $this->is_hierarchical ) {
			$right_column_fields = array_merge(
				$right_column_fields,
				array(
					array(
						'type'     => 'column-start',
						'id'       => 'hierarchical_fields_start',
						'name'     => 'hierarchical_fields_start',
						'classes'  => 'hierarchical-fields',
						'position' => 20,
					),
					array(
						'type'     => 'checkbox',
						'id'       => 'hierarchical',
						'label'    => __( 'Show hierarchy', 'wc-ajax-product-filter' ),
						'name'     => 'hierarchical',
						'position' => 25,
					),
					array(
						'type'     => 'checkbox',
						'id'       => 'enable_hierarchy_accordion',
						'label'    => __( 'Enable hierarchy accordion', 'wc-ajax-product-filter' ),
						'name'     => 'enable_hierarchy_accordion',
						'position' => 30,
					),
					array(
						'type'     => 'column-end',
						'id'       => 'hierarchical_fields_end',
						'name'     => 'hierarchical_fields_end',
						'position' => 35,
					),
				)
			);
		}

		return array_merge(
			$right_column_fields,
			array(
				array(
					'type'     => 'checkbox',
					'id'       => 'show_count',
					'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
					'name'     => 'show_count',
					'position' => 40,
				),
				array(
					'type'     => 'checkbox',
					'id'       => 'hide_empty',
					'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
					'name'     => 'hide_empty',
					'position' => 45,
				),
			)
		);
	}

	/**
	 * The field group type.
	 *
	 * @return string
	 */
	protected function group_type() {
		return 'text';
	}

}
