<?php
/**
 * WCAPF_V4_Migration class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_V4_Migration class.
 *
 * @since 4.0.0
 */
class WCAPF_V4_Migration {

	public static function default_settings() {
		return array(
			// General
			'filter_relationships'             => 'and',
			'update_count'                     => '1',
			'remove_empty'                     => 'show',
			'remove_empty_filters'             => '',
			'disable_ajax'                     => '',
			// Integration
			'active_filters_on_top'            => '1',
			'enable_pagination_via_ajax'       => '1',
			'sorting_control'                  => '1',
			'sorting_data_in_active_filters'   => '1',
			'replace_sorting_options'          => '',
			'sort_by_form'                     => '',
			'use_term_slug'                    => '1',
			'child_terms_only'                 => '',
			'vendor_support'                   => '',
			// Appearance
			'primary_color'                    => '#1c5da1',
			'primary_text_color'               => '#ffffff',
			'stylish_checkbox_radio'           => '1',
			'use_chosen'                       => '1',
			'attach_chosen_on_sorting'         => '',
			'improve_native_select'            => '1',
			'improve_scrollbar'                => '1',
			'number_range_slider_style'        => 'style-1',
			'label_size'                       => 'fixed',
			'active_label_style'               => 'primary',
			'star_icon_color'                  => '#fda256',
			'rating_star_use_fontawesome'      => '',
			'remove_focus_style'               => '',
			'primary_btn_class'                => '',
			'secondary_btn_class'              => '',
			'slide_out_panel_position'         => 'left',
			// Loader & Scroll To
			'loading_animation'                => 'overlay-with-icon',
			'loading_icon'                     => 'Spinner',
			'loading_image'                    => '',
			'loading_image_src'                => '',
			'loading_image_size'               => '60',
			'loading_overlay_color'            => '#FFFFFFCC',
			'wait_cursor'                      => '',
			'scroll_window'                    => 'none',
			'scroll_window_for'                => 'desktop',
			'scroll_window_when'               => 'after',
			'scroll_window_custom_element'     => '',
			'scroll_on'                        => 'all',
			'scroll_to_top_offset'             => '',
			'scroll_window_delay'              => '',
			'disable_scroll_animation'         => '',
			// Others
			'search_field_default_placeholder' => '',
			'no_results_text'                  => '',
			'chosen_no_options_text'           => '',
			'empty_filter_text'                => '',
			'show_more_btn_label'              => '',
			'show_less_btn_label'              => '',
			'opening_btn_label'                => '',
			'slide_out_panel_label'            => '',
			'clear_button_label'               => '',
			'clear_all_button_label'           => '',
			'reset_button_label'               => '',
			'submit_btn_label'                 => '',
			'apply_btn_label'                  => '',
			'results_count_markup'             => '',
			'sort_by_prefix'                   => '',
			'per_page_prefix'                  => '',
			'more_selectors'                   => '',
			'custom_scripts'                   => '',
			'author_roles'                     => [],
			'multiple_form_locations'          => '',
			// Miscellaneous
			'debug_mode'                       => '1',
			'disable_wcapf'                    => '',
			'send_anonymous_data'              => '',
			'remove_data'                      => '',
		);
	}

	public function do_migrate() {
		$form_settings = WCAPF_V4_Migration::form_default_data();

		$post_arr = array(
			'post_title'   => __( 'Default form', 'wc-ajax-product-filter' ),
			'post_content' => maybe_serialize( $form_settings ),
			'menu_order'   => 0,
			'post_type'    => 'wcapf-form',
			'post_status'  => 'publish',
		);

		$new_form_id = wp_insert_post( $post_arr, true );

		$filters = get_posts(
			array(
				'post_type' => 'wcapf-filter',
				'nopaging'  => true,
				// 'posts_per_page' => 1,
				// 'offset'         => 16,
			)
		);

		$filter_default_data = WCAPF_V4_Migration::filter_default_data();

		$migrated_filters = array();

		foreach ( $filters as $filter ) {
			// echo 'filter post';
			// echo '<pre>';
			// print_r( $filter );
			// echo '</pre>';

			$v3_field_data = get_post_meta( $filter->ID, '_field_data', true );

			// echo 'filter data';
			// echo '<pre>';
			// print_r( $v3_field_data );
			// echo '</pre>';

			$migrated_data = array();

			foreach ( $filter_default_data as $key => $_value ) {
				$mapped_key = $key;

				// Map key.
				if ( 'id' === $key ) {
					$mapped_key = 'field_id';
				}

				if ( isset( $v3_field_data[ $mapped_key ] ) ) {
					$value = $v3_field_data[ $mapped_key ];
				} else {
					// Default data.
					$value = $_value;
				}

				// Title.
				if ( 'title' === $key ) {
					$value = $filter->post_title;
				}

				// Migrate taxonomy type.
				$taxonomy_types = array( 'custom-taxonomy', 'attribute', 'category', 'tag' );

				if ( 'type' === $key && in_array( $value, $taxonomy_types ) ) {
					if ( 'category' === $value ) {
						$v3_field_data['taxonomy'] = 'product_cat';
					} elseif ( 'tag' === $value ) {
						$v3_field_data['taxonomy'] = 'product_tag';
					}

					if ( ! empty( $v3_field_data['limit_values_by_id'] ) ) {
						$v3_field_data['include_terms'] = explode( ',', $v3_field_data['limit_values_by_id'] );
					}

					if ( ! empty( $v3_field_data['exclude_values_id'] ) ) {
						$v3_field_data['exclude_terms'] = explode( ',', $v3_field_data['exclude_values_id'] );
					}

					if ( ! empty( $v3_field_data['custom_appearance_options'] ) ) {
						$display_type    = $v3_field_data['display_type'];
						$appearance_data = $v3_field_data['custom_appearance_options'];

						$manual_options = array();

						foreach ( $appearance_data as $id => $data ) {
							$data = array_merge(
								$data,
								array(
									'id'                      => $id,
									'swatch'                  => $display_type,
									'secondary_color_enabled' => '',
									'secondary_color'         => '',
								)
							);

							$manual_options[] = $data;
						}

						$v3_field_data['manual_options'] = $manual_options;
					}

					if ( in_array( $v3_field_data['display_type'], array( 'image', 'color' ) ) ) {
						$v3_field_data['get_options'] = 'manual_entry';
					}

					$value = 'taxonomy';
				}

				// Component type.
				$component_types = array( 'reset-button', 'active-filters' );

				if ( 'type' === $key && in_array( $value, $component_types ) ) {
					$v3_field_data['component'] = $value;

					$value = 'component';
				}

				// Post property.
				if ( 'type' === $key && 'post-property' === $value ) {
					if ( isset( $v3_field_data['post_property'] ) && 'post_author' === $v3_field_data['post_property'] ) {
						$value = 'post-author';
					}
				}

				// Soft limit.
				if ( 'enable_reduce_height' === $key && ! empty( $v3_field_data['enable_soft_limit'] ) ) {
					$value = 'soft_limit';
				}

				$migrated_data[ $key ] = $value;
			}

			// echo 'migrated data';
			// echo '<pre>';
			// print_r( $migrated_data );
			// echo '</pre>';

			$migrated_filters[] = $migrated_data;
		}

		// echo '<pre>';
		// print_r( $migrated_filters );
		// echo '</pre>';

		$form_filters_utils = new WCAPF_Form_Filters_Utils();

		list( , $errors ) = $form_filters_utils->save_form_filters( $migrated_filters, $new_form_id, true );

		if ( $errors ) {
			echo '<pre>';
			print_r( $errors );
			echo '</pre>';
		}
	}

	public static function form_default_data() {
		return array(
			'form_locations' => '',
			'show_clear_btn' => '',
		);
	}

	public static function filter_default_data() {
		return array(
			'id'                                    => '',
			'title'                                 => '',
			'type'                                  => '',
			'taxonomy'                              => '',
			'taxHierarchical'                       => '',
			'meta_key'                              => '',
			'component'                             => '',
			'isACF'                                 => '',
			'value_type'                            => 'text',
			'field_key'                             => '',
			// Taxonomy
			'display_type'                          => 'checkbox',
			'native_display_type_layout'            => 'list-item',
			'custom_display_type_layout'            => 'inline',
			'grid_columns'                          => '2',
			'swatch_with_text'                      => '',
			'query_type'                            => 'or',
			'all_items_label'                       => '',
			'enable_multiple_filter'                => '1',
			'hierarchical'                          => '',
			'enable_hierarchy_accordion'            => '',
			'show_count'                            => '1',
			'enable_tooltip'                        => '',
			'show_count_in_tooltip'                 => '',
			'tooltip_position'                      => 'top',
			'get_options'                           => 'automatically',
			'manual_options'                        => [],
			'order_terms_by'                        => 'default',
			'order_terms_dir'                       => 'asc',
			'limit_options'                         => 'off',
			'include_terms'                         => [],
			'include_child'                         => '',
			'exclude_terms'                         => [],
			'exclude_child'                         => '',
			'parent_term'                           => '',
			'direct_child_only'                     => '',
			// Price Filter
			'number_display_type'                   => 'range_slider',
			'number_range_slider_display_values_as' => 'input_field',
			'alignment'                             => 'default',
			'number_range_enable_multiple_filter'   => '1',
			'number_range_query_type'               => 'or',
			'number_range_select_all_items_label'   => '',
			'number_range_show_count'               => '1',
			'number_get_options'                    => 'automatically',
			'number_manual_options'                 => [],
			'auto_detect_min_max'                   => '1',
			'min_value'                             => '0',
			'max_value'                             => '100',
			'step'                                  => '1',
			'value_prefix'                          => '',
			'value_postfix'                         => '',
			'values_separator'                      => '–',
			'text_before_min_value'                 => '',
			'text_before_max_value'                 => '',
			'format_numbers'                        => '',
			'decimal_places'                        => '2',
			'thousand_separator'                    => '',
			'decimal_separator'                     => '.',
			// Product Status
			'product_status_options'                => [],
			// Post Meta
			'is_acf'                                => '',
			'value_decimal'                         => '',
			'value_decimal_places'                  => '2',
			'date_input_format'                     => 'timestamp',
			'options_order_by'                      => 'none',
			'options_order_dir'                     => 'asc',
			'options_order_type'                    => 'alphabetical',
			// Post Meta - value type Date
			'date_display_type'                     => 'input_date',
			'date_format'                           => 'dd-mm-yy',
			'time_period_enable_multiple_filter'    => '1',
			'time_period_query_type'                => 'or',
			'time_period_select_all_items_label'    => '',
			'show_date_inputs_inline'               => '',
			'time_period_show_count'                => '1',
			'date_picker_month_dropdown'            => '',
			'date_picker_year_dropdown'             => '',
			'date_from_prefix'                      => '',
			'date_from_postfix'                     => '',
			'date_from_placeholder'                 => '',
			'date_to_prefix'                        => '',
			'date_to_postfix'                       => '',
			'date_to_placeholder'                   => '',
			'time_period_options'                   => [],
			// Post Author
			'post_author_order_by'                  => 'default',
			'post_author_order_dir'                 => 'asc',
			'include_authors'                       => [],
			'exclude_authors'                       => [],
			'include_user_roles'                    => [],
			// Sort By
			'sort_by_options'                       => [],
			// Per Page
			'per_page_options'                      => [],
			// Advanced Settings
			'show_title'                            => '1',
			'enable_accordion'                      => '',
			'accordion_default_state'               => 'expanded',
			'help_text'                             => '',
			'enable_search_field'                   => '',
			'search_field_placeholder'              => '',
			'enable_reduce_height'                  => 'no',
			'soft_limit'                            => '5',
			'max_height'                            => '200',
			'show_in_active_filters'                => '1',
			'visibility_rules'                      => [],
			// Active filters
			'empty_filter_message'                  => '',
			// Reset Button
			'show_if_empty'                         => '',
			// Error
			'type_error'                            => '',
			'meta_key_error'                        => '',
			'field_key_error'                       => '',
			'field_key_error_'                      => '', // Comes from server side.
		);
	}

}
