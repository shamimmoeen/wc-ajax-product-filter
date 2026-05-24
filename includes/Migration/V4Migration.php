<?php
/**
 * V4 migration.
 *
 * Runs the v3 → v4 data transformation when needed, plus the form-edit-page
 * "review filters" notice that follows a successful migration. The trigger is
 * a single `init` priority 20 hook so the migration runs on any request
 * (frontend, admin, REST, CLI/cron) — not just admin pages.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Migration
 * @author     Mainul Hassan
 */

namespace WCAPF\Migration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * V4 migration entry point and review-filters notice plumbing.
 */
class V4Migration {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'maybe_run' ), 20 );

		add_action( 'wp_ajax_wcapf_dismiss_v4_review_filters_notice', array( $this, 'dismiss_review_filters_notice' ) );
		add_filter( 'wcapf_admin_js_params', array( $this, 'inject_js_params' ) );
	}

	/**
	 * Idempotent migration entry point — runs the v3 → v4 transformation when
	 * needed, then applies the "set default settings" path on fresh/updated installs.
	 *
	 * @return void
	 */
	public function maybe_run(): void {
		$db_version_option_key  = 'wcapf_db_version';
		$existing_wcapf_version = get_option( $db_version_option_key );

		$perform_v4_migration = false;

		if ( version_compare( $existing_wcapf_version, '4.0.0', '<' ) ) {
			$perform_v4_migration = true;
		} elseif ( get_option( 'wcapf_run_migrate' ) ) {
			$perform_v4_migration = true;
		}

		if ( $perform_v4_migration ) {
			$this->do_migrate();

			$plugin_version = defined( 'WCAPF_BASIC_VERSION' ) ? WCAPF_BASIC_VERSION : WCAPF_VERSION;
			update_option( $db_version_option_key, $plugin_version );

			delete_option( 'wcapf_run_migrate' );

			delete_transient( 'wcapf_forms_with_locations' );
		}

		$set_default_settings = false;

		if ( get_option( 'wcapf_set_default_settings' ) ) {
			$set_default_settings = true;
		} elseif ( get_option( 'wcapf_update_default_settings' ) ) {
			$set_default_settings = true;
		}

		$settings_option_key = 'wcapf_settings';

		if ( $set_default_settings ) {
			$default_settings  = \WCAPF_Default_Data::default_settings();
			$existing_settings = get_option( $settings_option_key, array() );

			update_option( $settings_option_key, array_merge( $default_settings, $existing_settings ) );

			delete_option( 'wcapf_set_default_settings' );
			delete_option( 'wcapf_update_default_settings' );
		}
	}

	/**
	 * Performs the v3 → v4 data transformation. Soft-locked via transient to
	 * avoid concurrent migrations.
	 *
	 * @return void
	 */
	private function do_migrate(): void {
		$transient_name = 'wcapf_v4_migration_status';

		if ( get_transient( $transient_name ) ) {
			return;
		}

		set_transient( $transient_name, 1 );

		// post_excerpt carries the filter_type signature ('taxonomy>product_cat',
		// etc.) and would be HTML-escaped to '&gt;' when the migration runs
		// outside an admin context (auto-updater, WP-CLI install, logged-out
		// visitor's first request). Drop just the excerpt_save_pre filter for
		// the duration of the migration; kses_init() restores it to match the
		// current user's caps.
		remove_filter( 'excerpt_save_pre', 'wp_filter_post_kses' );
		try {
			$this->migrate_settings();
			$this->migrate_filters();
		} finally {
			kses_init();
		}

		delete_transient( $transient_name );
	}

	/**
	 * Migrates the plugin settings from v3 to v4 schema.
	 *
	 * @return void
	 */
	private function migrate_settings(): void {
		$option_key  = 'wcapf_settings';
		$v3_settings = get_option( $option_key );
		$v4_settings = array();

		$default_settings = \WCAPF_Default_Data::default_settings();

		foreach ( $default_settings as $key => $_value ) {
			$mapped_key = $key;

			if ( 'sorting_data_in_active_filters' === $key ) {
				$mapped_key = 'show_sorting_data_in_active_filters';
			}

			if ( 'attach_combobox_on_sorting' === $key ) {
				$mapped_key = 'attach_chosen_on_sorting';
			}

			if ( isset( $v3_settings[ $mapped_key ] ) ) {
				$value = $v3_settings[ $mapped_key ];
			} else {
				$value = $_value;
			}

			if ( 'loading_animation' === $key ) {
				$value = 'overlay-with-icon';
			}

			if ( 'scroll_window' === $key ) {
				$value = 'none';
			}

			$v4_settings[ $key ] = $value;
		}

		update_option( $option_key, $v4_settings );
	}

	/**
	 * Migrates v3 filter posts into a single v4 form post.
	 *
	 * @return void
	 */
	private function migrate_filters(): void {
		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'any',
				'nopaging'    => true,
				'orderby'     => 'ID',
				'order'       => 'ASC',
			)
		);

		usort(
			$filters,
			function ( $a, $b ) {
				if ( 'publish' === $a->post_status && 'publish' !== $b->post_status ) {
					return -1;
				} elseif ( 'publish' !== $a->post_status && 'publish' === $b->post_status ) {
					return 1;
				}

				return $a->ID - $b->ID;
			}
		);

		$filter_default_data = \WCAPF_Default_Data::filter_default_data();

		$taxonomy_types  = array( 'custom-taxonomy', 'attribute', 'category', 'tag' );
		$component_types = array( 'reset-button', 'active-filters' );

		$migrated_filters = array();

		foreach ( $filters as $filter ) {
			$v3_field_data = get_post_meta( $filter->ID, '_field_data', true );

			if ( ! $v3_field_data ) {
				continue;
			}

			$migrated_data = array();

			$migrated_data['post_status'] = $filter->post_status;

			foreach ( $filter_default_data as $key => $_value ) {
				$mapped_key = $key;

				if ( 'id' === $key ) {
					$mapped_key = 'field_id';
				}

				if ( isset( $v3_field_data[ $mapped_key ] ) ) {
					$value = $v3_field_data[ $mapped_key ];
				} else {
					$value = $_value;
				}

				if ( 'title' === $key ) {
					$value = $filter->post_title;
				}

				if ( 'type' === $key && in_array( $value, $taxonomy_types, true ) ) {
					$value = 'taxonomy';
				}

				if ( 'type' === $key && in_array( $value, $component_types, true ) ) {
					$v3_field_data['component'] = $value;

					$value = 'component';
				}

				if ( 'type' === $key && 'post-property' === $value ) {
					if (
						isset( $v3_field_data['post_property'] )
						&& 'post_author' === $v3_field_data['post_property']
					) {
						$value = 'post-author';
					}
				}

				if ( 'enable_reduce_height' === $key && ! empty( $v3_field_data['enable_soft_limit'] ) ) {
					$value = 'soft_limit';
				}

				$migrated_data[ $key ] = $value;
			}

			if ( 'taxonomy' === $migrated_data['type'] ) {
				if ( 'category' === $v3_field_data['type'] ) {
					$migrated_data['taxonomy'] = 'product_cat';
				} elseif ( 'tag' === $v3_field_data['type'] ) {
					$migrated_data['taxonomy'] = 'product_tag';
				}

				if ( ! empty( $migrated_data['taxonomy'] ) ) {
					$hierarchical = '';

					if ( is_taxonomy_hierarchical( $migrated_data['taxonomy'] ) ) {
						$hierarchical = '1';
					}

					$migrated_data['taxHierarchical'] = $hierarchical;
				}

				if ( empty( $migrated_data['order_terms_by'] ) ) {
					$migrated_data['order_terms_by'] = 'default';
				}

				if ( empty( $migrated_data['order_terms_dir'] ) ) {
					$migrated_data['order_terms_dir'] = 'asc';
				}

				$include_terms  = array();
				$exclude_terms  = array();
				$parent_term    = 0;
				$child_terms    = array();
				$child_term_ids = array();

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

						if ( $children && ! is_wp_error( $children ) ) {
							$child_terms = $children;
						}

						$child_term_ids = array_map( 'intval', $child_terms );
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
								if ( $include_terms && in_array( (string) $id, $include_terms, true ) ) {
									$manual_options[] = $data;
								}

								break;

							case 'exclude':
								if ( $exclude_terms && ! in_array( (string) $id, $exclude_terms, true ) ) {
									$manual_options[] = $data;
								}

								break;

							case 'child':
								if ( $parent_term && $child_term_ids && in_array( (int) $id, $child_term_ids, true ) ) {
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

				$swatch_types    = array( 'image', 'color' );
				$v3_display_type = $migrated_data['display_type'];

				if ( in_array( $v3_display_type, $swatch_types, true ) ) {
					$migrated_data['get_options'] = 'manual_entry';

					$migrated_data['display_type']               = 'label';
					$migrated_data['custom_display_type_layout'] = 'inline';

					$migrated_data['enable_swatch']     = '1';
					$migrated_data['swatch_type']       = $v3_display_type;
					$migrated_data['swatch_with_label'] = '';
				}
			}

			if ( 'component' === $migrated_data['type'] && 'active-filters' === $migrated_data['component'] ) {
				$show_if_empty = isset( $v3_field_data['show_if_empty'] ) ? $v3_field_data['show_if_empty'] : '';

				if ( ! $show_if_empty ) {
					$migrated_data['empty_filter_message'] = '';
				}
			}

			$migrated_filters[] = $migrated_data;
		}

		if ( ! $migrated_filters ) {
			return;
		}

		$form_settings = \WCAPF_Default_Data::form_default_data();

		$post_arr = array(
			'post_title'   => __( 'Default form', 'wc-ajax-product-filter' ),
			'post_content' => maybe_serialize( $form_settings ),
			'menu_order'   => 0,
			'post_type'    => 'wcapf-form',
			'post_status'  => 'publish',
		);

		$new_form_id = wp_insert_post( $post_arr, true );

		$form_filters_utils = new \WCAPF_Form_Filters_Utils();

		$form_filters_utils->save_form_filters( $migrated_filters, $new_form_id, true );

		update_post_meta( $new_form_id, '_wcapf_v4_needs_review', '1' );
	}

	/**
	 * AJAX handler that clears the "needs review" flag on the migrated form.
	 *
	 * @return void
	 */
	public function dismiss_review_filters_notice(): void {
		check_ajax_referer( 'dismiss-v4-review-filters-notice-nonce', 'nonce' );

		$form_id = ! empty( $_POST['form_id'] ) ? absint( wp_unslash( $_POST['form_id'] ) ) : 0;

		if ( $form_id ) {
			delete_post_meta( $form_id, '_wcapf_v4_needs_review' );
		}

		wp_send_json_success();
	}

	/**
	 * Injects the dismiss nonce when the review-filters notice should show.
	 * The nonce's presence is what tells the React component to render — no
	 * separate visibility flag is needed.
	 *
	 * @param array $params Admin script parameters.
	 *
	 * @return array
	 */
	public function inject_js_params( $params ): array {
		if ( wcapf()->notices->is_v4_review_filters_visible() ) {
			$params['v4_review_filters_dismiss_nonce'] = wp_create_nonce( 'dismiss-v4-review-filters-notice-nonce' );
		}

		return $params;
	}
}
