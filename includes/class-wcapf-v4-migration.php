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

	/**
	 * The constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_V4_Migration
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_V4_Migration();
		}

		return $instance;
	}

	public function get_sample_filters() {
		$filters_basic_data = array();

		// Filter by product category.
		$filters_basic_data[] = array(
			'title'                      => __( 'Category', 'wc-ajax-product-filter' ),
			'type'                       => 'taxonomy',
			'taxonomy'                   => 'product_cat',
			'taxHierarchical'            => '1',
			'hierarchical'               => '1',
			'enable_hierarchy_accordion' => '1',
		);

		// Filter by price.
		$price_filter_data = array(
			'title'            => __( 'Price', 'wc-ajax-product-filter' ),
			'type'             => 'price',
			'values_separator' => '&nbsp;–&nbsp;',
		);

		$code   = get_woocommerce_currency();
		$symbol = html_entity_decode( get_woocommerce_currency_symbol( $code ) );

		if ( 'left' === get_option( 'woocommerce_currency_pos' ) ) {
			$price_filter_data['value_prefix'] = $symbol;
		} else {
			$price_filter_data['value_postfix'] = $symbol;
		}

		$filters_basic_data[] = $price_filter_data;

		// Filter by attribute, we pick the first one which has some values for single dropdown filter.
		$attributes = wc_get_attribute_taxonomy_names();
		$used       = array();

		foreach ( $attributes as $attribute ) {
			$attribute_terms = get_terms(
				array(
					'taxonomy'   => $attribute,
					'hide_empty' => false,
				)
			);

			if ( $attribute_terms ) {
				$taxonomy_data = get_taxonomy( $attribute );

				$filters_basic_data[] = array(
					'title'           => $taxonomy_data->labels->singular_name,
					'type'            => 'taxonomy',
					'taxonomy'        => $attribute,
					'display_type'    => 'select',
					'all_items_label' => __( 'Any', 'wc-ajax-product-filter' ),
				);

				$used[] = $attribute;

				break;
			}
		}

		// Filter by attribute, we pick the second attribute which has some values for multi-select dropdown filter.
		$found_second_attribute = false;

		foreach ( $attributes as $attribute ) {
			if ( in_array( $attribute, $used ) ) {
				continue;
			}

			$attribute_terms = get_terms(
				array(
					'taxonomy'   => $attribute,
					'hide_empty' => false,
				)
			);

			if ( $attribute_terms ) {
				$taxonomy_data = get_taxonomy( $attribute );

				$filters_basic_data[] = array(
					'title'        => $taxonomy_data->labels->singular_name,
					'type'         => 'taxonomy',
					'taxonomy'     => $attribute,
					'display_type' => 'multi-select',
				);

				$found_second_attribute = true;

				break;
			}
		}

		// Filter by product tag if tags found and secondary attribute filter not found.
		if ( ! $found_second_attribute ) {
			$tags = get_terms(
				array(
					'taxonomy'   => 'product_tag',
					'hide_empty' => false,
				)
			);

			if ( $tags ) {
				$filters_basic_data[] = array(
					'title'    => __( 'Tag', 'wc-ajax-product-filter' ),
					'type'     => 'taxonomy',
					'taxonomy' => 'product_tag',
					'layout'   => 'multi-select',
				);
			}
		}

		// Filter by Product Status.
		$filters_basic_data[] = array(
			'title'                  => __( 'Status', 'wc-ajax-product-filter' ),
			'type'                   => 'product-status',
			'display_type'           => 'label',
			'product_status_options' => array(
				array(
					'value' => 'featured',
					'label' => __( 'Featured', 'wc-ajax-product-filter' ),
				),
				array(
					'value' => 'on_sale',
					'label' => __( 'On Sale', 'wc-ajax-product-filter' ),
				),
			),
		);

		// Filter by Rating.
		$filters_basic_data[] = array(
			'type' => 'rating',
		);

		// Reset button.
		$filters_basic_data[] = array(
			'type'      => 'component',
			'component' => 'reset-button',
		);

		$default_data = $this->filter_default_data();
		$filters      = array();

		foreach ( $filters_basic_data as $filter_basic_data ) {
			$filter_data = wp_parse_args( $filter_basic_data, $default_data );

			$filters[] = $filter_data;
		}

		return $filters;
	}

	public function filter_default_data() {
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
			'manual_options'                        => array(),
			'order_terms_by'                        => 'default',
			'order_terms_dir'                       => 'asc',
			'limit_options'                         => 'off',
			'include_terms'                         => array(),
			'include_child'                         => '',
			'exclude_terms'                         => array(),
			'exclude_child'                         => '',
			'parent_term'                           => '',
			'direct_child_only'                     => '',
			// Price Filter
			'number_display_type'                   => 'range_slider',
			'number_range_slider_display_values_as' => 'input_field',
			'alignment'                             => 'default',
			'input_type_number'                     => '',
			'number_range_enable_multiple_filter'   => '1',
			'number_range_query_type'               => 'or',
			'number_range_select_all_items_label'   => '',
			'number_range_show_count'               => '1',
			'number_get_options'                    => 'automatically',
			'number_manual_options'                 => array(),
			'auto_detect_min_max'                   => '1',
			'min_value'                             => '0',
			'max_value'                             => '100',
			'step'                                  => '1',
			'gap'                                   => '0',
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
			'product_status_options'                => array(),
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
			'time_period_options'                   => array(),
			// Post Author
			'post_author_order_by'                  => 'default',
			'post_author_order_dir'                 => 'asc',
			'include_authors'                       => array(),
			'exclude_authors'                       => array(),
			'include_user_roles'                    => array(),
			// Sort By
			'sort_by_options'                       => array(),
			// Per Page
			'per_page_options'                      => array(),
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
			'visibility_rules'                      => array(),
			// Active filters
			'active_filters_layout'                 => 'simple',
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

	public function try_to_run_v4_migration() {
		$current_db_version = get_option( 'wcapf_db_version' );
		$run_auto_migrate   = apply_filters( 'wcapf_run_auto_migrate', true );

		if ( version_compare( $current_db_version, '4.0.0', '<' ) && $run_auto_migrate ) {
			$this->do_migrate();

			error_log( 'Ran the automatic wcapf v4 migration.' );

			// Show the v4 migration notice.
			update_option( 'wcapf_v4_migration_notice_status', '1' );

			// Update the db version.
			update_option( 'wcapf_db_version', WCAPF_VERSION );
		}
	}

	/**
	 * @return void
	 */
	public function do_migrate() {
		$transient_name = 'wcapf_v4_migration_status';

		// Don't run the migration if already running.
		if ( get_transient( $transient_name ) ) {
			return;
		}

		set_transient( $transient_name, 1 );

		$this->migrate_settings();
		$this->migrate_filters();

		delete_transient( $transient_name );
	}

	/**
	 * Migrate the plugin settings.
	 *
	 * @return void
	 */
	public function migrate_settings() {
		$option_key  = 'wcapf_settings';
		$v3_settings = get_option( $option_key );
		$v4_settings = array();

		foreach ( $this->default_settings() as $key => $_value ) {
			$mapped_key = $key;

			// Map key.
			if ( 'sorting_data_in_active_filters' === $key ) {
				$mapped_key = 'show_sorting_data_in_active_filters';
			}

			if ( isset( $v3_settings[ $mapped_key ] ) ) {
				$value = $v3_settings[ $mapped_key ];
			} else {
				// Default data.
				$value = $_value;
			}

			// Loading animation.
			if ( 'loading_animation' === $key ) {
				$value = 'overlay-with-icon';
			}

			// Initially we disable the scroll to element.
			if ( 'scroll_window' === $key ) {
				$value = 'none';
			}

			$v4_settings[ $key ] = $value;
		}

		update_option( $option_key, $v4_settings );

		error_log( 'The wcapf settings migrated successfully!' );
	}

	public function default_settings() {
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
			'replace_sorting_options'          => array(),
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
			'improve_input_type_text_number'   => '1',
			'hierarchy_toggle_at_end'          => '1',
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
			'author_roles'                     => array( 'administrator', 'shop_manager' ),
			'multiple_form_locations'          => '',
			// Miscellaneous
			'debug_mode'                       => '1',
			'disable_wcapf'                    => '',
			'send_anonymous_data'              => '',
			'remove_data'                      => '',
		);
	}

	/**
	 * Migrate the filters.
	 *
	 * @return void
	 */
	public function migrate_filters() {
		$filters = get_posts(
			array(
				'post_type' => 'wcapf-filter',
				'nopaging'  => true,
				'orderby'   => 'ID',
				'order'     => 'ASC',
			)
		);

		$filter_default_data = $this->filter_default_data();

		$taxonomy_types  = array( 'custom-taxonomy', 'attribute', 'category', 'tag' );
		$component_types = array( 'reset-button', 'active-filters' );
		$swatch_types    = array( 'image', 'color' );

		$migrated_filters = array();

		foreach ( $filters as $filter ) {
			$v3_field_data = get_post_meta( $filter->ID, '_field_data', true );

			if ( ! $v3_field_data ) {
				continue;
			}

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

				// Taxonomy type.
				if ( 'type' === $key && in_array( $value, $taxonomy_types ) ) {
					$value = 'taxonomy';
				}

				// Component type.
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

			if ( 'taxonomy' === $migrated_data['type'] ) {
				// Set taxonomy.
				if ( 'category' === $migrated_data['taxonomy'] ) {
					$migrated_data['taxonomy'] = 'product_cat';
				} elseif ( 'tag' === $migrated_data['taxonomy'] ) {
					$migrated_data['taxonomy'] = 'product_tag';
				}

				// Tax hierarchical data.
				if ( ! empty( $migrated_data['taxonomy'] ) ) {
					$migrated_data['taxHierarchical'] = is_taxonomy_hierarchical( $migrated_data['taxonomy'] );
				}

				// Order data.
				if ( empty( $migrated_data['order_terms_by'] ) ) {
					$migrated_data['order_terms_by'] = 'default';
				}

				if ( empty( $migrated_data['order_terms_dir'] ) ) {
					$migrated_data['order_terms_dir'] = 'asc';
				}

				// Options data.
				$include_terms = array();
				$exclude_terms = array();
				$parent_term   = 0;
				$child_terms   = array();

				if ( ! empty( $v3_field_data['limit_values_by_id'] ) ) {
					$include_terms = explode( ',', $v3_field_data['limit_values_by_id'] );

					$migrated_data['include_terms'] = $include_terms;
				}

				if ( ! empty( $v3_field_data['exclude_values_id'] ) ) {
					$exclude_terms = explode( ',', $v3_field_data['exclude_values_id'] );

					$migrated_data['exclude_terms'] = $exclude_terms;
				}

				if ( ! empty( $v3_field_data['parent_term'] ) ) {
					$parent_term = absint( $v3_field_data['parent_term'] );

					if ( $parent_term ) {
						$migrated_data['parent_term'] = $parent_term;

						$children = get_term_children( $parent_term, $migrated_data['taxonomy'] );

						if ( $children ) {
							$child_terms = $children;
						}
					}
				}

				$limit_by = $migrated_data['limit_options'];

				if ( ! empty( $v3_field_data['custom_appearance_options'] ) ) {
					$display_type    = $migrated_data['display_type'];
					$appearance_data = $v3_field_data['custom_appearance_options'];

					$manual_options = array();

					foreach ( $appearance_data as $id => $data ) {
						$data = array_merge(
							$data,
							array(
								'label'                   => '',
								'tooltip'                 => '',
								'value'                   => $id,
								'swatch'                  => $display_type,
								'secondary_color_enabled' => '',
								'secondary_color'         => '',
							)
						);

						switch ( $limit_by ) {
							case 'include':
								if ( $include_terms && in_array( $id, $include_terms ) ) {
									$manual_options[] = $data;
								}

								break;

							case 'exclude':
								if ( $exclude_terms && ! in_array( $id, $exclude_terms ) ) {
									$manual_options[] = $data;
								}

								break;

							case 'child':
								if ( $parent_term && $child_terms && in_array( $id, $child_terms ) ) {
									$manual_options[] = $data;
								}

								break;

							default:
								$manual_options[] = $data;

								break;
						}
					}

					$migrated_data['manual_options'] = $manual_options;
				}

				if ( in_array( $migrated_data['display_type'], $swatch_types ) ) {
					$migrated_data['get_options'] = 'manual_entry';
				}
			}

			$migrated_filters[] = $migrated_data;
		}

		if ( ! $migrated_filters ) {
			return;
		}

		$form_settings = $this->form_default_data();

		$post_arr = array(
			'post_title'   => __( 'Default form', 'wc-ajax-product-filter' ),
			'post_content' => maybe_serialize( $form_settings ),
			'menu_order'   => 0,
			'post_type'    => 'wcapf-form',
			'post_status'  => 'publish',
		);

		$new_form_id = wp_insert_post( $post_arr, true );

		$form_filters_utils = new WCAPF_Form_Filters_Utils();

		list( , $errors ) = $form_filters_utils->save_form_filters( $migrated_filters, $new_form_id, true );

		if ( $errors ) {
			$message = 'The following error occurred when trying to migrate the filter data for v4:';
			$message .= "\n";
			$message .= print_r( $errors, true );

			error_log( $message );
		} else {
			update_option( 'wcapf_migrated_filters_form_id', $new_form_id );

			error_log( 'The wcapf filters data migrated successfully!' );
		}
	}

	public function form_default_data() {
		return array(
			'form_locations' => '',
			'priority'       => '0',
			'show_clear_btn' => '',
		);
	}

}

if ( ! function_exists( 'WCAPF_V4_Migration' ) ) {
	/**
	 * Return single instance for WCAPF_V4_Migration class.
	 *
	 * @since 4.0.0
	 *
	 * @return WCAPF_V4_Migration
	 */
	function WCAPF_V4_Migration() {
		return WCAPF_V4_Migration::instance();
	}
}
