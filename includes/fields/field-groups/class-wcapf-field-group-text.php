<?php
/**
 * WCAPF_Field_Group_Text class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields/field-groups
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Group_Text class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Group_Text extends WCAPF_Field_Group {

	private $is_hierarchical = false;

	public function set_hierarchical() {
		$this->is_hierarchical = true;
	}

	protected function set_group_fields() {
		$right_column_fields = array();

		if ( $this->is_hierarchical ) {
			// TODO: We may need to group the elements in another element.
			$right_column_fields = array_merge(
				$right_column_fields,
				array(
					array(
						'type'     => 'checkbox',
						'id'       => 'hierarchical',
						'label'    => __( 'Show hierarchy', 'wc-ajax-product-filter' ),
						'name'     => 'hierarchical',
						'position' => 20,
					),
					array(
						'type'     => 'checkbox',
						'id'       => 'enable_hierarchy_accordion',
						'label'    => __( 'Enable hierarchy accordion', 'wc-ajax-product-filter' ),
						'name'     => 'enable_hierarchy_accordion',
						'position' => 25,
					),
					array(
						'type'     => 'checkbox',
						'id'       => 'show_children_only',
						'label'    => __( 'Only show children of the current', 'wc-ajax-product-filter' ),
						'name'     => 'show_children_only',
						'position' => 30,
					),
				)
			);
		}

		$right_column_fields = array_merge(
			$right_column_fields,
			array(
				array(
					'type'     => 'checkbox',
					'id'       => 'show_count',
					'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
					'name'     => 'show_count',
					'position' => 35,
				),
				array(
					'type'     => 'checkbox',
					'id'       => 'hide_empty',
					'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
					'name'     => 'hide_empty',
					'position' => 40,
				),
			)
		);

		return array(
			array(
				'name'     => 'display_type',
				'class'    => 'separator-top',
				'position' => 15,
				'columns'  => array(
					array(
						array(
							'type'     => 'select',
							'id'       => 'display_type',
							'label'    => __( 'Display Type', 'wc-ajax-product-filter' ),
							'name'     => 'display_type',
							'options'  => array(
								'checkbox'     => __( 'Checkbox', 'wc-ajax-product-filter' ),
								'radio'        => __( 'Radio', 'wc-ajax-product-filter' ),
								'select'       => __( 'Select', 'wc-ajax-product-filter' ),
								'multi-select' => __( 'Multi select', 'wc-ajax-product-filter' ),
							),
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
							'position' => 25,
						),
						array(
							'type'     => 'text',
							'id'       => 'all_items_label',
							'label'    => __( 'Change All Items Label', 'wc-ajax-product-filter' ),
							'name'     => 'all_items_label',
							'position' => 30,
						),
						array(
							'type'     => 'checkbox',
							'id'       => 'use_chosen',
							'label'    => __( 'Use jQuery Chosen Library', 'wc-ajax-product-filter' ),
							'name'     => 'use_chosen',
							'position' => 35,
						),
						array(
							'type'     => 'text',
							'id'       => 'chosen_no_results_message',
							'label'    => __( 'No results message', 'wc-ajax-product-filter' ),
							'name'     => 'chosen_no_results_message',
							'position' => 40,
						),
					),
					$right_column_fields,
				),
			),
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
