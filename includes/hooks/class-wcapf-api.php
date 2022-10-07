<?php
/**
 * The api class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/hooks
 * @author     wptools.io
 */

/**
 * WCAPF_API class.
 *
 * @since 3.0.0
 */
class WCAPF_API {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_API
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_API();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'wp_ajax_get_available_filters', array( $this, 'get_available_filters' ) );
		add_action( 'wp_ajax_get_filter_form_data', array( $this, 'get_filter_form_data' ) );
		add_action( 'wp_ajax_save_filter_form', array( $this, 'save_filter_form' ) );
		add_action( 'wp_ajax_get_filter_form_preview', array( $this, 'get_filter_form_preview' ) );
		add_action( 'wp_ajax_get_filter_data', array( $this, 'get_filter_data' ) );
		add_action( 'wp_ajax_get_filter_additional_data', array( $this, 'get_filter_additional_data' ) );
		add_action( 'wp_ajax_get_filter_preview', array( $this, 'get_filter_preview' ) );
		add_action( 'wp_ajax_get_custom_appearance_data', array( $this, 'get_custom_appearance_data' ) );
		add_action( 'wp_ajax_get_taxonomy_filter_options', array( $this, 'get_taxonomy_filter_options' ) );
		add_action( 'wp_ajax_get_filters', array( $this, 'get_filters' ) );
		add_action( 'wp_ajax_check_filter_key', array( $this, 'check_filter_key' ) );

		add_action( 'admin_menu', array( $this, 'register_new_endpoint' ) );
		add_action( 'admin_menu', array( $this, 'change_post_menu_label' ) );
		add_filter( 'in_admin_header', array( $this, 'render_header_navigation' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_filters_list_admin_ui_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_filter_forms_list_admin_ui_scripts' ) );
	}

	public function enqueue_filters_list_admin_ui_scripts() {
		$screen = get_current_screen();

		if ( 'toplevel_page_wcapf-new' !== $screen->id ) {
			return;
		}

		// For single filter we load another set of scripts.
		if ( isset( $_GET['id'] ) ) {
			return;
		}

		$script_asset_path = WCAPF_PLUGIN_DIR . '/build/list-filters.asset.php';

		if ( ! file_exists( $script_asset_path ) ) {
			/** @noinspection PhpMultipleClassDeclarationsInspection */
			throw new Error(
				'You need to run `npm start` or `npm run build` for the filter admin ui'
			);
		}

		$admin_js     = 'build/list-filters.js';
		$script_asset = require( $script_asset_path );

		wp_enqueue_script(
			'wcapf-list-filters-admin-ui-js',
			plugins_url( $admin_js, WCAPF_PLUGIN_FILE ),
			$script_asset['dependencies'],
			$script_asset['version']
		);

		$admin_css = 'build/list-filters.css';

		wp_enqueue_style(
			'wcapf-list-filters-admin-ui-css',
			plugins_url( $admin_css, WCAPF_PLUGIN_FILE ),
			[ 'wp-components' ],
			filemtime( WCAPF_PLUGIN_DIR . '/' . $admin_css )
		);
	}

	public function enqueue_filter_forms_list_admin_ui_scripts() {
		$screen = get_current_screen();

		if ( 'wcapf_page_new-filter-forms' !== $screen->id ) {
			return;
		}

		$script_asset_path = WCAPF_PLUGIN_DIR . '/build/list-filter-forms.asset.php';

		if ( ! file_exists( $script_asset_path ) ) {
			/** @noinspection PhpMultipleClassDeclarationsInspection */
			throw new Error(
				'You need to run `npm start` or `npm run build` for the filter admin ui'
			);
		}

		$admin_js     = 'build/list-filter-forms.js';
		$script_asset = require( $script_asset_path );

		wp_enqueue_script(
			'wcapf-list-filter-forms-admin-ui-js',
			plugins_url( $admin_js, WCAPF_PLUGIN_FILE ),
			$script_asset['dependencies'],
			$script_asset['version']
		);

		$admin_css = 'build/list-filter-forms.css';

		wp_enqueue_style(
			'wcapf-list-filter-forms-admin-ui-css',
			plugins_url( $admin_css, WCAPF_PLUGIN_FILE ),
			[ 'wp-components' ],
			filemtime( WCAPF_PLUGIN_DIR . '/' . $admin_css )
		);
	}

	public function render_header_navigation() {
		global $current_screen;

		$valid_lists = array(
			'toplevel_page_wcapf-new',
			'wcapf_page_new-filter-forms',
			'wcapf_page_wcapf-new-settings',
		);

		if ( ! in_array( $current_screen->id, $valid_lists ) ) {
			return;
		}

		WCAPF_Template_Loader::get_instance()->load( 'admin/header-navigation-new' );
	}

	public function change_post_menu_label() {
		global $submenu;

		if ( isset( $submenu['wcapf-new'] ) ) {
			$new_data = $submenu['wcapf-new'];

			if ( isset( $new_data[0][0] ) ) {
				$new_data[0][0] = 'Filters';
			}

			$submenu['wcapf-new'] = $new_data;
		}
	}

	public function register_new_endpoint() {
		add_menu_page(
			'WCAPF',
			'WCAPF',
			'manage_options',
			'wcapf-new',
			array( $this, 'render_filter' ),
			'dashicons-filter',
			5
		);

		add_submenu_page(
			'wcapf-new',
			'Filter Forms',
			'Filter Forms',
			'manage_options',
			'new-filter-forms',
			array( $this, 'render_filter_form' )
		);

		add_submenu_page(
			'wcapf-new',
			'Settings',
			'Settings',
			'manage_options',
			'wcapf-new-settings',
			array( $this, 'render_settings' )
		);
	}

	public function render_settings() {
		echo 'plugin settings';
	}

	public function render_filter() {
		if ( isset( $_GET['id'] ) ) {
			$element = '<div id="wcapf-filter-admin-ui"></div>';
		} else {
			$element = '<div id="wcapf-filters-list-admin-ui"></div>';
		}

		echo $element;
	}

	public function render_filter_form() {
		echo '<div id="wcapf-filter-forms-list-admin-ui"></div>';
	}

	public function get_available_filters() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'post_status' => 'publish',
			'nopaging'    => true,
			'fields'      => 'ids',
		);

		$filters = get_posts( $args );
		$results = array();

		foreach ( $filters as $filter_id ) {
			$title      = get_the_title( $filter_id );
			$filter_key = get_post_meta( $filter_id, '_filter_key', true );
			$query      = $title . $filter_key . $filter_id;

			$results[] = array(
				'id'        => $filter_id,
				'title'     => $title,
				'filterKey' => $filter_key,
				'editLink'  => get_edit_post_link( $filter_id, '' ),
				'query'     => $query,
			);
		}

		wp_send_json_success( $results );
	}

	public function get_filter_form_data() {
		$post_id   = isset( $_GET['post_id'] ) ? sanitize_text_field( $_GET['post_id'] ) : '';
		$form_data = get_post_meta( $post_id, '_form_data', true );
		$response  = array( 'post_title' => get_the_title( $post_id ) );

		$filters_data = array();

		if ( $form_data ) {
			$filter_ids = isset( $form_data['filter_ids'] ) ? $form_data['filter_ids'] : array();

			foreach ( $filter_ids as $field_id ) {
				$field_data = get_post_meta( $field_id, '_field_data', true );
				$field_key  = $field_data['field_key'];

				$filters_data[] = array(
					'id'        => $field_id,
					'title'     => get_the_title( $field_id ),
					'filterKey' => $field_key,
					'editLink'  => get_edit_post_link( $field_id, '' ),
				);
			}
		}

		$response['filters_data'] = $filters_data;

		wp_send_json_success( $response );
	}

	public function save_filter_form() {
		$post_id       = isset( $_GET['post_id'] ) ? sanitize_text_field( $_GET['post_id'] ) : '';
		$_form_filters = isset( $_POST['form_filters'] ) ? $_POST['form_filters'] : '';
		$post_title    = isset( $_POST['post_title'] ) ? $_POST['post_title'] : '';
		$form_filters  = stripslashes( $_form_filters );
		$form_filters  = json_decode( $form_filters, true );

		// Update post data.
		$post_data = array(
			'ID'         => $post_id,
			'post_title' => $post_title,
		);

		wp_update_post( $post_data );

		$filter_ids = array();

		foreach ( $form_filters as $filter_data ) {
			$filter_ids[] = $filter_data['id'];
		}

		$parsed_data = array( 'filter_ids' => $filter_ids );

		update_post_meta( $post_id, '_form_data', $parsed_data );

		wp_send_json_success( __( 'Updated successfully', 'wc-ajax-product-filter' ) );
	}

	public function get_filter_form_preview() {
		$post_id = isset( $_GET['post_id'] ) ? sanitize_text_field( $_GET['post_id'] ) : '';

		ob_start();

		echo do_shortcode( '[wcapf_filter_form id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	/**
	 * Parse the field data.
	 *
	 * TODO: Might be deprecated in future.
	 *
	 * @param array $field_data The field data array.
	 *
	 * @return array
	 */
	private function parse_field_data( $field_data ) {
		// Fill the term_ids with value and label.
		$taxonomy_types = array( 'category', 'tag', 'attribute', 'custom-taxonomy' );
		$filter_type    = isset( $field_data['type'] ) ? $field_data['type'] : '';

		if ( in_array( $filter_type, $taxonomy_types ) ) {
			$parent_term        = $field_data['parent_term'];
			$limit_values_by_id = $field_data['limit_values_by_id'];
			$exclude_values_id  = $field_data['exclude_values_id'];

			if ( $parent_term ) {
				$term = get_term( $parent_term );

				$field_data['parent_term'] = array(
					'value' => $term->term_id,
					'label' => $term->name
				);
			}

			$array = array(
				'limit_values_by_id' => $limit_values_by_id,
				'exclude_values_id'  => $exclude_values_id,
			);

			foreach ( $array as $key => $value ) {
				if ( $value ) {
					$values = explode( ',', $value );
					$parsed = array();

					foreach ( $values as $id ) {
						$term = get_term( $id );

						if ( $term && ! is_wp_error( $term ) ) {
							$parsed[] = array(
								'value' => $term->term_id,
								'label' => $term->name,
							);
						}
					}

					$field_data[ $key ] = $parsed;
				}
			}
		}

		// Set the default values for the order settings.
		$order_terms_dir    = isset( $field_data['order_terms_dir'] ) ? $field_data['order_terms_dir'] : '';
		$options_order_dir  = isset( $field_data['options_order_dir'] ) ? $field_data['options_order_dir'] : '';
		$options_order_type = isset( $field_data['options_order_type'] ) ? $field_data['options_order_type'] : '';

		if ( ! $order_terms_dir ) {
			$field_data['order_terms_dir'] = 'asc';
		}

		if ( ! $options_order_dir ) {
			$field_data['options_order_dir'] = 'asc';
		}

		if ( ! $options_order_type ) {
			$field_data['options_order_type'] = 'alphabetical';
		}

		// Parse custom appearance options.
		$custom_appearance_options = isset( $field_data['custom_appearance_options'] )
			? $field_data['custom_appearance_options']
			: array();

		if ( $custom_appearance_options ) {
			$parsed = array();

			foreach ( $custom_appearance_options as $id => $option ) {
				$option['id'] = $id;

				$parsed[] = $option;
			}

			$field_data['custom_appearance_options'] = $parsed;
		}

		return $field_data;
	}

	public function get_filter_data() {
		$post_id    = isset( $_GET['post_id'] ) ? sanitize_text_field( $_GET['post_id'] ) : '';
		$field_data = get_post_meta( $post_id, '_field_data', true );
		$field_data = $this->parse_field_data( $field_data );

		$response = array(
			'post_title' => get_the_title( $post_id ),
			'field_data' => $field_data,
		);

		wp_send_json_success( $response );
	}

	/**
	 * TODO: Move the helper methods to free version.
	 *
	 * @return void
	 */
	public function get_filter_additional_data() {
		$response = array();

		// Attributes.
		$_attributes = wc_get_attribute_taxonomy_names();
		$attributes  = $this->get_taxonomy_options( $_attributes );

		$response['attributes'] = $attributes;

		// Custom Taxonomies.
		$taxonomies = array();

		if ( class_exists( 'WCAPF_PRO_Helper' ) ) {
			$_taxonomies = WCAPF_PRO_Helper::get_custom_taxonomies();
			$taxonomies  = $this->get_taxonomy_options( $_taxonomies );
		}

		$response['custom_taxonomies'] = $taxonomies;

		// Custom Post Metas.
		$post_metas = array();

		if ( class_exists( 'WCAPF_PRO_Helper' ) ) {
			$meta_keys = WCAPF_PRO_Helper::get_meta_keys();

			foreach ( $meta_keys as $meta_key ) {
				$post_metas[ $meta_key ] = $meta_key;
			}
		}

		$response['meta_keys'] = $post_metas;

		// Post Properties.
		$post_properties = array();

		if ( class_exists( 'WCAPF_PRO_Helper' ) ) {
			$post_properties = WCAPF_PRO_Helper::get_post_properties();
		}

		$response['post_properties'] = $post_properties;

		// Hierarchical Taxonomies.
		$helper = new WCAPF_PRO_Helper;

		$taxonomies    = $helper::get_custom_taxonomies();
		$taxonomy_data = array();

		foreach ( $taxonomies as $taxonomy ) {
			$taxonomy_data[ $taxonomy ] = is_taxonomy_hierarchical( $taxonomy );
		}

		$response['taxonomy_hierarchical_data'] = $taxonomy_data;

		$post_properties    = $helper::get_post_properties();
		$post_property_data = array();

		foreach ( $post_properties as $post_property => $_data ) {
			$post_property_data[ $post_property ] = $_data['type'];
		}

		$response['post_property_data'] = $post_property_data;

		// Default date display formats.
		$response['default_date_display_formats'] = array(
			array(
				'label' => current_time( 'd-m-Y' ) . ' (d-m-Y)',
				'value' => 'dd-mm-yy',
			),
			array(
				'label' => current_time( 'Y-m-d' ) . ' (Y-m-d)',
				'value' => 'yy-mm-dd',
			),
		);

		// Default time periods.
		$_time_period_options = WCAPF_PRO_Helper::get_time_period_options();
		$time_period_options  = array();

		foreach ( $_time_period_options as $time_period_key => $time_period_label ) {
			$time_period_options[] = array(
				'label' => $time_period_label,
				'value' => $time_period_key,
			);
		}

		$response['default_time_periods'] = $time_period_options;

		wp_send_json_success( $response );
	}

	/**
	 * Gets an array of taxonomy name and label, name => label.
	 *
	 * @param array $taxonomies The taxonomies array.
	 *
	 * @return array
	 */
	private function get_taxonomy_options( $taxonomies ) {
		$options = array();

		foreach ( $taxonomies as $_taxonomy ) {
			$taxonomy_data = get_taxonomy( $_taxonomy );

			$options[ $_taxonomy ] = $taxonomy_data->labels->singular_name;
		}

		return $options;
	}

	public function get_filter_preview() {
		$post_id = 65; // TODO

		ob_start();

		echo do_shortcode( '[wcapf_filter id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	public function get_custom_appearance_data() {
		$taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : '';

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'fields'     => 'id=>name',
		);

		$terms    = get_terms( $args );
		$response = array();

		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id => $term_name ) {
				$response[] = array(
					'value' => $term_id,
					'label' => $term_name,
				);
			}
		}

		wp_send_json_success( $response );
	}

	public function get_taxonomy_filter_options() {
		$taxonomy    = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : '';
		$only_parent = isset( $_GET['only_parent'] ) ? sanitize_text_field( $_GET['only_parent'] ) : '';
		$keyword     = isset( $_GET['keyword'] ) ? sanitize_text_field( $_GET['keyword'] ) : '';
		$page        = isset( $_GET['page'] ) ? absint( $_GET['page'] ) : 1;

		$per_page = 20;
		$offset   = ( $page - 1 ) * $per_page;

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'search'     => $keyword,
			'number'     => $per_page,
			'offset'     => $offset,
			'fields'     => 'id=>name',
		);

		if ( 'true' === $only_parent ) {
			$includes = array();

			$all_terms = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'fields'     => 'ids',
				)
			);

			if ( $all_terms && ! is_wp_error( $all_terms ) ) {
				foreach ( $all_terms as $term_id ) {
					if ( get_term_children( $term_id, $taxonomy ) ) {
						$includes[] = $term_id;
					}
				}
			}

			$args['include'] = $includes;
		}

		$terms = get_terms( $args );

		$response = array();

		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id => $term_name ) {
				$response[] = array(
					'value' => $term_id,
					'label' => $term_name,
				);
			}
		}

		wp_send_json_success( $response );
	}

	public function get_filters() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'nopaging'    => true,
			'post_status' => 'any',
			'fields'      => 'ids',
		);

		$filters = get_posts( $args );

		$filters_data = array();

		foreach ( $filters as $filter_id ) {
			$field_data = get_post_meta( $filter_id, '_field_data', true );

			$filters_data[] = array(
				'id'            => $filter_id,
				'field_key'     => $field_data['field_key'],
				'type'          => $field_data['type'],
				'taxonomy'      => isset( $field_data['taxonomy'] ) ? $field_data['taxonomy'] : '',
				'meta_key'      => isset( $field_data['meta_key'] ) ? $field_data['meta_key'] : '',
				'post_property' => isset( $field_data['post_property'] ) ? $field_data['post_property'] : '',
				'title'         => get_the_title( $filter_id ),
			);
		}

		wp_send_json_success( $filters_data );
	}

	public function check_filter_key() {
		$filter_key = isset( $_GET['filter_key'] ) ? sanitize_title( $_GET['filter_key'] ) : '';

		if ( ! $filter_key ) {
			wp_send_json_error( __( 'Filter key is required.', 'wc-ajax-product-filter' ) );
		}

		// Check for existing filter.
		$args = array(
			'post_type'      => 'wcapf-filter',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'   => '_filter_key',
					'value' => $filter_key,
				),
			),
		);

		$found = get_posts( $args );

		if ( $found ) {
			wp_send_json_error( __( 'The filter key is already in use on another filter.', 'wc-ajax-product-filter' ) );
		}

		if ( taxonomy_exists( $filter_key ) ) {
			wp_send_json_error( __( 'There is a taxonomy exists with the filter key.', 'wc-ajax-product-filter' ) );
		}

		wp_send_json_success( 'available' );
	}

}

WCAPF_API::instance();
