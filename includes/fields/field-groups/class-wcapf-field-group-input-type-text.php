<?php
/**
 * WCAPF_Field_Group_Input_Type_Text class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/field-groups
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Group_Input_Type_Text class.
 *
 * @since 3.0.0
 */
trait WCAPF_Field_Group_Input_Type_Text {

	private function input_type_text_group_fields() {
		return array_merge(
			$this->get_input_type_text_col1_sub_fields(),
			$this->get_input_type_text_col2_sub_fields(),
			$this->get_input_type_text_options_col1_sub_fields(),
			$this->get_input_type_text_options_col2_sub_fields()
		);
	}

	/**
	 * @return array[]
	 */
	private function get_input_type_text_col1_sub_fields() {
		return array(
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
				'position' => 15,
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
				'position' => 15,
			),
			array(
				'type'     => 'text',
				'id'       => 'all_items_label',
				'label'    => __( 'Change All Items Label', 'wc-ajax-product-filter' ),
				'name'     => 'all_items_label',
				'position' => 15,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'use_chosen',
				'label'    => __( 'Use jQuery Chosen Library', 'wc-ajax-product-filter' ),
				'name'     => 'use_chosen',
				'position' => 15,
			),
			array(
				'type'     => 'text',
				'id'       => 'chosen_no_results_message',
				'label'    => __( 'No results message', 'wc-ajax-product-filter' ),
				'name'     => 'chosen_no_results_message',
				'position' => 15,
			),
		);
	}

	/**
	 * @return array[]
	 */
	private function get_input_type_text_col2_sub_fields() {
		return array(
			array(
				'type'     => 'checkbox',
				'id'       => 'show_count',
				'label'    => __( 'Show count', 'wc-ajax-product-filter' ),
				'name'     => 'show_count',
				'position' => 20,
			),
			array(
				'type'     => 'checkbox',
				'id'       => 'hide_empty',
				'label'    => __( 'Hide empty', 'wc-ajax-product-filter' ),
				'name'     => 'hide_empty',
				'position' => 20,
			),
		);
	}

	/**
	 * @return array[]
	 */
	private function get_input_type_text_options_col1_sub_fields() {
		return array(
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
				'position' => 25,
			),
			array(
				'type'     => 'hidden',
				'id'       => 'manual_options',
				'name'     => 'manual_options',
				'position' => 26,
			),
		);
	}

	/**
	 * @return array[]
	 */
	private function get_input_type_text_options_col2_sub_fields() {
		return array(
			array(
				'type'      => 'select',
				'id'        => 'options_order_by',
				'parent_id' => 'get_options_orderby',
				'name'      => 'options_order_by',
				'options'   => array(
					'label' => __( 'Label', 'wc-ajax-product-filter' ),
					'value' => __( 'Value', 'wc-ajax-product-filter' ),
					'count' => __( 'Count', 'wc-ajax-product-filter' ),
					'none'  => __( 'None', 'wc-ajax-product-filter' ),
				),
				'position'  => 30,
			),
			array(
				'type'      => 'select',
				'id'        => 'options_order_dir',
				'parent_id' => 'get_options_orderby',
				'name'      => 'options_order_dir',
				'options'   => array(
					'asc'  => __( 'ASC', 'wc-ajax-product-filter' ),
					'desc' => __( 'DESC', 'wc-ajax-product-filter' ),
				),
				'position'  => 30,
			),
			array(
				'type'      => 'select',
				'id'        => 'options_order_type',
				'parent_id' => 'get_options_orderby',
				'name'      => 'options_order_type',
				'options'   => array(
					'alphabetical' => __( 'Alphabetical', 'wc-ajax-product-filter' ),
					'numerical'    => __( 'Numerical', 'wc-ajax-product-filter' ),
				),
				'position'  => 30,
			),
		);
	}

	private function render_input_type_text_group_fields() {
		$input_type_text_col1_sub_fields = wp_list_sort(
			$this->get_input_type_text_col1_sub_fields(), 'position'
		);

		$input_type_text_col2_sub_fields = wp_list_sort(
			$this->get_input_type_text_col2_sub_fields(), 'position'
		);

		$input_type_text_options_col1_sub_fields = wp_list_sort(
			$this->get_input_type_text_options_col1_sub_fields(), 'position'
		);

		$input_type_text_options_col2_sub_fields = wp_list_sort(
			$this->get_input_type_text_options_col2_sub_fields(), 'position'
		);

		$instance          = $this->get_instance();
		$field_index       = $this->get_field_index();
		$field_name_prefix = 'wcapf-fields[' . $this->type() . '][' . $field_index . ']';

		$manual_options = isset( $instance['manual_options'] ) ? $instance['manual_options'] : '';
		?>
		<div class="column-start separator-top input-type-text-fields">
			<div class="column-start row">
				<div class="column-start column">
					<?php
					if ( $input_type_text_col1_sub_fields ) {
						$this->render_sub_fields(
							$input_type_text_col1_sub_fields,
							$field_index,
							$instance,
							$field_name_prefix
						);
					}
					?>
				</div>
				<div class="column-start column">
					<?php
					if ( $input_type_text_col2_sub_fields ) {
						$this->render_sub_fields(
							$input_type_text_col2_sub_fields,
							$field_index,
							$instance,
							$field_name_prefix
						);
					}
					?>
				</div>
			</div>

			<div class="column-start separator-top">
				<div class="column-start row">
					<h4 class="no-top-margin"><?php esc_html_e( 'Options', 'wc-ajax-product-filter' ); ?></h4>
				</div>

				<div class="column-start row">
					<div class="column-start column">
						<?php
						if ( $input_type_text_options_col1_sub_fields ) {
							$this->render_sub_fields(
								$input_type_text_options_col1_sub_fields,
								$field_index,
								$instance,
								$field_name_prefix
							);
						}
						?>
					</div>
					<div class="column-start column">
						<div class="wcapf-form-sub-field wcapf-post-meta-order-options-field">
							<div class="wcapf-form-sub-field-label">
								<?php esc_html_e( 'Order Options by', 'wc-ajax-product-filter' ); ?>
							</div>
							<div class="wcapf-wrapper">
								<?php
								if ( $input_type_text_options_col2_sub_fields ) {
									$this->render_sub_fields(
										$input_type_text_options_col2_sub_fields,
										$field_index,
										$instance,
										$field_name_prefix
									);
								}
								?>
							</div>
						</div>
					</div>
				</div>

				<div class="column-start manual-options-table<?php echo $manual_options ? ' has-options' : ''; ?>">
					<p><?php esc_html_e( 'Add the options that will be available to this field, each option must have a value and a label.', 'wc-ajax-product-filter' ); ?></p>

					<div class="manual-options-table-header">
						<div><?php esc_html_e( 'Value', 'wc-ajax-product-filter' ); ?></div>
						<div><?php esc_html_e( 'Label', 'wc-ajax-product-filter' ); ?></div>
					</div>

					<div class="manual-options-table-body">
						<div class="manual-options-table-body-rows">
							<?php
							if ( $manual_options ) {
								$utils = new WCAPF_Pro_Product_Filter_Utils();

								foreach ( $manual_options as $manual_option ) {
									$value = isset( $manual_option[0] ) ? $manual_option[0] : '';
									$label = isset( $manual_option[1] ) ? $manual_option[1] : '';

									$utils->text_manual_option_row( $value, $label );
								}
							}
							?>
						</div>
						<div class="no-options-found">
							<?php esc_html_e( 'There are no options.', 'wc-ajax-product-filter' ); ?>
						</div>
					</div>

					<div class="manual-options-table-footer">
						<div>
							<button type="button" class="button add-option">
								<?php esc_html_e( 'Add Option', 'wc-ajax-product-filter' ); ?>
							</button>
							<button type="button" class="button browse-values">
								<?php esc_html_e( 'Browse Values', 'wc-ajax-product-filter' ); ?>
							</button>
						</div>
						<div>
							<button type="button" class="button clear-all-options">
								<?php esc_html_e( 'Clear All Options', 'wc-ajax-product-filter' ); ?>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

}
