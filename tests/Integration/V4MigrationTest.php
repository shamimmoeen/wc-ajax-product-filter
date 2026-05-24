<?php
/**
 * Integration tests for \WCAPF\Migration\V4Migration.
 *
 * Drives the migration with real v3 `_field_data` fixtures and asserts the
 * v4 form/filter output: type/taxonomy mapping, hierarchical detection,
 * dedup behavior, component translation, scalar passthrough, settings
 * migration, idempotency. Runs with no current user — matching the realistic
 * trigger context (auto-updater, WP-CLI install, or a logged-out visitor's
 * first request after the plugin update).
 *
 * @package wc-ajax-product-filter
 */

class V4MigrationTest extends WP_UnitTestCase {

	public function set_up(): void {
		parent::set_up();

		delete_option( 'wcapf_db_version' );
		delete_option( 'wcapf_run_migrate' );
		delete_transient( 'wcapf_v4_migration_status' );

		// pa_color isn't auto-registered: the migration calls
		// is_taxonomy_hierarchical() and save_form_filters() validates the
		// taxonomy exists.
		if ( ! taxonomy_exists( 'pa_color' ) ) {
			register_taxonomy( 'pa_color', array( 'product' ), array( 'hierarchical' => false ) );
		}
	}

	public function test_migrates_v3_filters_into_v4_form_with_correct_settings(): void {
		$ids = $this->seed_v3_filters( $this->v3_fixtures() );

		update_option( 'wcapf_db_version', '3.0.0' );
		wcapf()->v4_migration->maybe_run();

		$form = $this->load_only_form();
		$this->assertSame( 'publish', $form->post_status );
		$this->assertSame(
			'1',
			get_post_meta( $form->ID, '_wcapf_v4_needs_review', true ),
			'Form should be flagged for the post-migration review notice.'
		);
		$this->assertSame(
			WCAPF_Default_Data::form_default_data(),
			maybe_unserialize( $form->post_content )
		);

		$filters = $this->load_form_filters( $form->ID );
		$this->assertCount( 11, $filters, 'All 11 v3 filter posts should attach to the new form.' );

		// post_excerpt = filter_type signature, post_status = publish/draft
		// (taxonomy duplicates drop to draft; component duplicates both publish).
		$expected_envelope = array(
			'active_filters'          => array( 'component>active-filters', 'publish' ),
			'active_filters_extended' => array( 'component>active-filters', 'publish' ),
			'category'                => array( 'taxonomy>product_cat',     'publish' ),
			'category_2'              => array( 'taxonomy>product_cat',     'draft' ),
			'tag'                     => array( 'taxonomy>product_tag',     'publish' ),
			'color'                   => array( 'taxonomy>pa_color',        'publish' ),
			'color_2'                 => array( 'taxonomy>pa_color',        'draft' ),
			'price'                   => array( 'price',                    'publish' ),
			'rating'                  => array( 'rating',                   'publish' ),
			'product_status'          => array( 'product-status',           'publish' ),
			'reset_button'            => array( 'component>reset-button',   'publish' ),
		);
		foreach ( $expected_envelope as $key => list( $excerpt, $status ) ) {
			$filter = $filters[ $ids[ $key ] ];
			$this->assertSame( $excerpt, $filter->post_excerpt, "[$key] post_excerpt" );
			$this->assertSame( $status, $filter->post_status, "[$key] post_status" );
		}

		// Taxonomy schema mapping: v3 type → v4 type=taxonomy + taxonomy
		// resolution, hierarchical detection, display/query passthrough.
		$taxonomy_cases = array(
			'category'   => array( 'product_cat', '1', 'checkbox', 'and' ),
			'category_2' => array( 'product_cat', '1', 'radio',    'and' ),
			'tag'        => array( 'product_tag', '',  'checkbox', 'and' ),
			'color'      => array( 'pa_color',    '',  'select',   'or' ),
			'color_2'    => array( 'pa_color',    '',  'select',   'and' ),
		);
		foreach ( $taxonomy_cases as $key => list( $taxonomy, $hierarchical, $display, $query ) ) {
			$settings = $this->load_settings( $filters[ $ids[ $key ] ] );
			$this->assertSame( 'taxonomy', $settings['type'], "[$key] type" );
			$this->assertSame( $taxonomy, $settings['taxonomy'], "[$key] taxonomy" );
			$this->assertSame( $hierarchical, $settings['taxHierarchical'], "[$key] taxHierarchical" );
			$this->assertSame( $display, $settings['display_type'], "[$key] display_type" );
			$this->assertSame( $query, $settings['query_type'], "[$key] query_type" );
		}

		// Component schema mapping. The active-filters special case: v3
		// show_if_empty='' clears empty_filter_message; '1' preserves it.
		// reset-button has no extra fields to assert (its v3 reset_button_label
		// moved to global wcapf_settings in v4 and is dropped from post_content).
		$component_cases = array(
			'active_filters'          => array( 'active-filters', 'simple',   '' ),
			'active_filters_extended' => array( 'active-filters', 'extended', 'No filter is applied.' ),
			'reset_button'            => array( 'reset-button',   null,       null ),
		);
		foreach ( $component_cases as $key => list( $component, $layout, $empty_message ) ) {
			$settings = $this->load_settings( $filters[ $ids[ $key ] ] );
			$this->assertSame( 'component', $settings['type'], "[$key] type" );
			$this->assertSame( $component, $settings['component'], "[$key] component" );
			if ( null !== $layout ) {
				$this->assertSame( $layout, $settings['active_filters_layout'], "[$key] active_filters_layout" );
				$this->assertSame( $empty_message, $settings['empty_filter_message'], "[$key] empty_filter_message" );
			}
		}

		// Scalar types that pass through. Catches numeric coercion (step → float)
		// and verifies nested arrays (product_status_options) survive intact.
		$price = $this->load_settings( $filters[ $ids['price'] ] );
		$this->assertSame( 'price', $price['type'] );
		$this->assertSame( 'range_slider', $price['number_display_type'] );
		$this->assertSame( '$', $price['value_prefix'] );
		$this->assertSame( 10.0, $price['step'] );

		$rating = $this->load_settings( $filters[ $ids['rating'] ] );
		$this->assertSame( 'rating', $rating['type'] );
		$this->assertSame( 'checkbox', $rating['display_type'] );

		$status = $this->load_settings( $filters[ $ids['product_status'] ] );
		$this->assertSame( 'product-status', $status['type'] );
		$this->assertSame(
			array(
				array( 'value' => 'featured', 'label' => 'Featured' ),
				array( 'value' => 'on_sale',  'label' => 'On sale' ),
			),
			$status['product_status_options']
		);
	}

	/**
	 * A second maybe_run() must be a no-op once db_version is current — both
	 * the gate (no new form created) AND the filter wiring (existing form's
	 * filters not double-processed). A regression in either would spawn extra
	 * posts on every page load.
	 */
	public function test_does_not_re_migrate_after_db_version_is_bumped(): void {
		$ids = $this->seed_v3_filters( $this->v3_fixtures() );

		update_option( 'wcapf_db_version', '3.0.0' );
		wcapf()->v4_migration->maybe_run();
		wcapf()->v4_migration->maybe_run();

		$forms = get_posts(
			array(
				'post_type'      => 'wcapf-form',
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);
		$this->assertCount( 1, $forms, 'Second maybe_run() should not spawn another form.' );

		$filters = $this->load_form_filters( $forms[0] );
		$this->assertCount(
			count( $ids ),
			$filters,
			'Filter count should match the seeded v3 set (no duplicates from re-run).'
		);
	}

	/**
	 * Covers migrate_settings() — the wcapf_settings option transform that
	 * runs alongside the filter migration. Verifies the two v3→v4 key
	 * renames, the two forced v4 overrides (loading_animation, scroll_window),
	 * and that unchanged v3 values pass through. No filter fixtures needed:
	 * settings migration runs whenever the gate opens.
	 */
	public function test_migrates_v3_plugin_settings_to_v4(): void {
		update_option(
			'wcapf_settings',
			array(
				// v3 keys the migration renames into the v4 names.
				'show_sorting_data_in_active_filters' => '1',
				'attach_chosen_on_sorting'            => '1',
				// Pass-through (same key in both schemas).
				'primary_color'                       => '#abcdef',
				// v3 values v4 overrides unconditionally.
				'loading_animation'                   => 'fade',
				'scroll_window'                       => 'auto',
			)
		);

		update_option( 'wcapf_db_version', '3.0.0' );
		wcapf()->v4_migration->maybe_run();

		$settings = get_option( 'wcapf_settings' );

		// Renames: v3 'show_*' lost its prefix; v3 'chosen' → v4 'combobox'.
		$this->assertSame( '1', $settings['sorting_data_in_active_filters'] );
		$this->assertSame( '1', $settings['attach_combobox_on_sorting'] );

		// Unchanged key carries through.
		$this->assertSame( '#abcdef', $settings['primary_color'] );

		// v4 forces these regardless of v3 value (product decision).
		$this->assertSame( 'overlay-with-icon', $settings['loading_animation'] );
		$this->assertSame( 'none', $settings['scroll_window'] );

		// v4-only key uses the v4 default when v3 didn't have it.
		$this->assertSame( 'and', $settings['filter_relationships'] );
	}

	/**
	 * Creates a wcapf-filter post for each fixture and rewrites the fixture's
	 * `field_id` to the actual post ID before saving _field_data — so the
	 * migration's field_id lookup finds and UPDATES each post in place (the
	 * real customer scenario) rather than inserting duplicates.
	 *
	 * @param array<int, array{key: string, title: string, field_data: array}> $fixtures
	 *
	 * @return array<string, int> Map of fixture key → created post ID.
	 */
	private function seed_v3_filters( array $fixtures ): array {
		$ids = array();

		foreach ( $fixtures as $fixture ) {
			$post_id = $this->factory()->post->create(
				array(
					'post_type'   => 'wcapf-filter',
					'post_status' => 'publish',
					'post_title'  => $fixture['title'],
				)
			);

			$field_data             = $fixture['field_data'];
			$field_data['field_id'] = $post_id;
			update_post_meta( $post_id, '_field_data', $field_data );

			$ids[ $fixture['key'] ] = $post_id;
		}

		return $ids;
	}

	private function load_only_form(): WP_Post {
		$forms = get_posts(
			array(
				'post_type'      => 'wcapf-form',
				'post_status'    => 'any',
				'posts_per_page' => -1,
			)
		);
		$this->assertCount( 1, $forms, 'Migration should create exactly one form post.' );

		return $forms[0];
	}

	/**
	 * @return array<int, WP_Post> Map of v3 filter ID → migrated WP_Post.
	 */
	private function load_form_filters( int $form_id ): array {
		$posts = get_posts(
			array(
				'post_type'      => 'wcapf-filter',
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'post_parent'    => $form_id,
				'orderby'        => 'menu_order',
				'order'          => 'ASC',
			)
		);

		$by_id = array();
		foreach ( $posts as $post ) {
			$by_id[ $post->ID ] = $post;
		}

		return $by_id;
	}

	private function load_settings( WP_Post $filter ): array {
		$settings = maybe_unserialize( $filter->post_content );
		$this->assertIsArray( $settings, "Filter '$filter->post_title' post_content should hold v4 settings." );

		return $settings;
	}

	/**
	 * 11 free-tier v3 filter fixtures from a real export. Each `field_data`
	 * is the unserialized v3 `_field_data` post meta verbatim, so the test
	 * exercises the migration on shapes a real customer site would produce.
	 *
	 * @return array<int, array{key: string, title: string, field_data: array}>
	 */
	private function v3_fixtures(): array {
		return array(
			array(
				'key'        => 'active_filters',
				'title'      => 'Active Filters',
				'field_data' => array(
					'show_title'                    => '1',
					'active_filters_layout'         => 'simple',
					'enable_clear_all_button'       => '1',
					'clear_all_button_fields_start' => '',
					'clear_all_button_label'        => 'Clear All',
					'clear_all_button_fields_end'   => '',
					'show_if_empty'                 => '',
					'empty_filter_message'          => 'No filter is applied.',
					'type'                          => 'active-filters',
					'field_key'                     => '',
					'field_id'                      => 61,
				),
			),
			array(
				'key'        => 'active_filters_extended',
				'title'      => 'Active Filters (Extended)',
				'field_data' => array(
					'show_title'                    => '1',
					'active_filters_layout'         => 'extended',
					'enable_clear_all_button'       => '1',
					'clear_all_button_fields_start' => '',
					'clear_all_button_label'        => 'Clear All',
					'clear_all_button_fields_end'   => '',
					'show_if_empty'                 => '1',
					'empty_filter_message'          => 'No filter is applied.',
					'type'                          => 'active-filters',
					'field_key'                     => '',
					'field_id'                      => 62,
				),
			),
			array(
				'key'        => 'category',
				'title'      => 'Filter by Category',
				'field_data' => array(
					'show_title'                 => '1',
					'field_key'                  => '_product_cat',
					'display_type'               => 'checkbox',
					'query_type'                 => 'and',
					'all_items_label'            => '',
					'use_chosen'                 => '',
					'chosen_no_results_message'  => '',
					'enable_multiple_filter'     => '',
					'hierarchical_fields_start'  => '',
					'hierarchical'               => '1',
					'enable_hierarchy_accordion' => '1',
					'hierarchical_fields_end'    => '',
					'show_count'                 => '1',
					'hide_empty'                 => '1',
					'type'                       => 'category',
					'field_id'                   => 63,
				),
			),
			array(
				'key'        => 'category_2',
				'title'      => 'Filter by Category 2',
				'field_data' => array(
					'show_title'                 => '1',
					'field_key'                  => '_product_cat2',
					'display_type'               => 'radio',
					'query_type'                 => 'and',
					'all_items_label'            => '',
					'use_chosen'                 => '',
					'chosen_no_results_message'  => '',
					'enable_multiple_filter'     => '',
					'hierarchical_fields_start'  => '',
					'hierarchical'               => '1',
					'enable_hierarchy_accordion' => '1',
					'hierarchical_fields_end'    => '',
					'show_count'                 => '1',
					'hide_empty'                 => '1',
					'type'                       => 'category',
					'field_id'                   => 64,
				),
			),
			array(
				'key'        => 'tag',
				'title'      => 'Filter by Tag',
				'field_data' => array(
					'show_title'                => '1',
					'field_key'                 => '_product_tag',
					'display_type'              => 'checkbox',
					'query_type'                => 'and',
					'all_items_label'           => '',
					'use_chosen'                => '',
					'chosen_no_results_message' => '',
					'enable_multiple_filter'    => '',
					'show_count'                => '',
					'hide_empty'                => '',
					'type'                      => 'tag',
					'field_id'                  => 65,
				),
			),
			array(
				'key'        => 'color',
				'title'      => 'Filter by Color',
				'field_data' => array(
					'show_title'                => '1',
					'field_key'                 => '_attribute_color',
					'taxonomy'                  => 'pa_color',
					'display_type'              => 'select',
					'query_type'                => 'or',
					'all_items_label'           => '',
					'use_chosen'                => '',
					'chosen_no_results_message' => '',
					'enable_multiple_filter'    => '',
					'show_count'                => '1',
					'hide_empty'                => '1',
					'type'                      => 'attribute',
					'field_id'                  => 66,
				),
			),
			array(
				'key'        => 'color_2',
				'title'      => 'Filter by Color',
				'field_data' => array(
					'show_title'                => '1',
					'field_key'                 => '_attribute_color2',
					'taxonomy'                  => 'pa_color',
					'display_type'              => 'select',
					'query_type'                => 'and',
					'all_items_label'           => '',
					'use_chosen'                => '',
					'chosen_no_results_message' => '',
					'enable_multiple_filter'    => '',
					'show_count'                => '1',
					'hide_empty'                => '1',
					'type'                      => 'attribute',
					'field_id'                  => 67,
				),
			),
			array(
				'key'        => 'price',
				'title'      => 'Filter by Price',
				'field_data' => array(
					'show_title'                            => '1',
					'field_key'                             => '_price',
					'number_display_type'                   => 'range_slider',
					'number_range_slider_display_values_as' => 'plain_text',
					'align_values_at_the_end'               => '1',
					'min_value'                             => 0.0,
					'min_value_auto_detect'                 => '1',
					'max_value'                             => 0.0,
					'max_value_auto_detect'                 => '1',
					'step'                                  => 10.0,
					'value_prefix'                          => '$',
					'value_postfix'                         => '',
					'values_separator'                      => '-',
					'decimal_places'                        => 0,
					'thousand_separator'                    => '',
					'decimal_separator'                     => '.',
					'type'                                  => 'price',
					'field_id'                              => 68,
				),
			),
			array(
				'key'        => 'rating',
				'title'      => 'Filter by Rating',
				'field_data' => array(
					'show_title'                => '1',
					'field_key'                 => '_rating',
					'display_type'              => 'checkbox',
					'query_type'                => 'and',
					'all_items_label'           => '',
					'use_chosen'                => '',
					'chosen_no_results_message' => '',
					'enable_multiple_filter'    => '',
					'show_count'                => '1',
					'hide_empty'                => '1',
					'type'                      => 'rating',
					'field_id'                  => 69,
				),
			),
			array(
				'key'        => 'product_status',
				'title'      => 'Filter by Product Status',
				'field_data' => array(
					'show_title'                    => '1',
					'field_key'                     => '_status',
					'display_type'                  => 'checkbox',
					'query_type'                    => 'and',
					'all_items_label'               => '',
					'use_chosen'                    => '',
					'chosen_no_results_message'     => '',
					'enable_multiple_filter'        => '',
					'show_count'                    => '',
					'hide_empty'                    => '',
					'product_status_options'        => array(
						array( 'value' => 'featured', 'label' => 'Featured' ),
						array( 'value' => 'on_sale',  'label' => 'On sale' ),
					),
					'product_status_options_markup' => '',
					'type'                          => 'product-status',
					'field_id'                      => 70,
				),
			),
			array(
				'key'        => 'reset_button',
				'title'      => 'Reset Filters',
				'field_data' => array(
					'show_title'         => '1',
					'reset_button_label' => 'Reset',
					'show_if_empty'      => '',
					'type'               => 'reset-button',
					'field_key'          => '',
					'field_id'           => 71,
				),
			),
		);
	}
}
