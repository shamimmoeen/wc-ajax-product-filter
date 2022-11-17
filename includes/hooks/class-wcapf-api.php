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
 * @since 4.0.0
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
		// For filter.
		add_action( 'wp_ajax_wcapf_get_filter_data', array( $this, 'get_filter_data' ) );
		add_action( 'wp_ajax_wcapf_get_filter_additional_data', array( $this, 'get_filter_additional_data' ) );
		add_action( 'wp_ajax_wcapf_save_filter', array( $this, 'save_filter' ) );
		add_action( 'wp_ajax_wcapf_duplicate_filter', array( $this, 'duplicate_filter' ) );
		add_action( 'wp_ajax_wcapf_delete_filter', array( $this, 'delete_filter' ) );
		add_action( 'wp_ajax_wcapf_get_filter_preview', array( $this, 'get_filter_preview' ) );
		add_action( 'wp_ajax_wcapf_get_taxonomy_terms_for_modal', array( $this, 'get_taxonomy_terms_for_modal' ) );
		add_action( 'wp_ajax_wcapf_get_meta_values_for_modal', array( $this, 'get_meta_values' ) );
		add_action( 'wp_ajax_wcapf_get_post_authors_for_modal', array( $this, 'get_post_authors_for_modal' ) );
		add_action( 'wp_ajax_wcapf_get_taxonomy_terms_for_dropdown', array( $this, 'get_taxonomy_terms_for_dropdown' ) );
		add_action( 'wp_ajax_wcapf_get_post_authors_for_dropdown', array( $this, 'get_post_authors_for_dropdown' ) );

		// For form.
		add_action( 'wp_ajax_wcapf_get_available_filters', array( $this, 'get_available_filters' ) );
		add_action( 'wp_ajax_wcapf_get_form_data', array( $this, 'get_form_data' ) );
		add_action( 'wp_ajax_wcapf_save_form', array( $this, 'save_form' ) );
		add_action( 'wp_ajax_wcapf_get_form_preview', array( $this, 'get_form_preview' ) );
		add_action( 'wp_ajax_wcapf_duplicate_form', array( $this, 'duplicate_form' ) );
		add_action( 'wp_ajax_wcapf_delete_form', array( $this, 'delete_form' ) );

		// Save settings.
		add_action( 'wp_ajax_wcapf_save_settings', array( $this, 'save_settings' ) );
	}

	/**
	 * Saves the form via ajax.
	 *
	 * @return void
	 */
	public function save_form() {
		$post_id    = isset( $_POST['form_id'] ) ? absint( $_POST['form_id'] ) : '';
		$post_title = isset( $_POST['form_title'] ) ? sanitize_text_field( $_POST['form_title'] ) : '';

		$_form_filters = isset( $_POST['form_filters'] ) ? $_POST['form_filters'] : '';
		$form_filters  = stripslashes( $_form_filters );
		$form_filters  = json_decode( $form_filters, true );

		$_form_settings = isset( $_POST['form_settings'] ) ? $_POST['form_settings'] : '';
		$form_settings  = stripslashes( $_form_settings );
		$form_settings  = json_decode( $form_settings, true );

		if ( $post_id && 'wcapf-form' === get_post_type( $post_id ) ) {
			$post_arr = array(
				'ID'          => $post_id,
				'post_title'  => $post_title,
				'post_status' => 'publish',
			);

			$new_post_id = wp_update_post( $post_arr, true );
		} else {
			$post_arr = array(
				'post_title'  => $post_title,
				'post_type'   => 'wcapf-form',
				'post_status' => 'publish',
			);

			$new_post_id = wp_insert_post( $post_arr, true );
		}

		if ( is_wp_error( $new_post_id ) ) {
			wp_send_json_error( $new_post_id->get_error_message() );
		}

		// Remove title, type from the filter data.
		$parsed_filters = array();

		foreach ( $form_filters as $form_filter ) {
			if ( isset( $form_filter['title'] ) ) {
				unset( $form_filter['title'] );
			}

			if ( isset( $form_filter['type'] ) ) {
				unset( $form_filter['type'] );
			}

			$parsed_filters[] = $form_filter;
		}

		$parsed_data = array(
			'filters'  => $parsed_filters,
			'settings' => $form_settings,
		);

		update_post_meta( $new_post_id, '_form_data', $parsed_data );

		wp_send_json_success( WCAPF_API_Utils::get_form_data( $new_post_id ) );
	}

	/**
	 * Gets the form data via ajax for the edit form UI.
	 *
	 * @return void
	 */
	public function get_form_data() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';

		$form_data     = get_post_meta( $post_id, '_form_data', true );
		$form_filters  = isset( $form_data['filters'] ) ? $form_data['filters'] : array();
		$form_settings = isset( $form_data['settings'] ) ? $form_data['settings'] : array();

		// Set the filter title and type.
		$parsed_filters = array();

		foreach ( $form_filters as $form_filter ) {
			$id = isset( $form_filter['id'] ) ? $form_filter['id'] : '';

			$filter_data = WCAPF_API_Utils::get_field_data( $id );
			$filter_type = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

			$form_filter['title'] = get_the_title( $id );
			$form_filter['type']  = $filter_type;

			$parsed_filters[] = $form_filter;
		}

		wp_send_json_success( array(
			'post_id'       => $post_id,
			'post_title'    => get_the_title( $post_id ),
			'form_filters'  => $parsed_filters,
			'form_settings' => $form_settings,
		) );
	}

	public function get_form_preview() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';

		ob_start();

		echo do_shortcode( '[wcapf_filter_form id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	/**
	 * Saves the filter via ajax.
	 *
	 * @return void
	 */
	public function save_filter() {
		list( $filter_data, $post_id, $post_title ) = $this->get_filter_data_from_post_request();

		$_visibility_rules = isset( $_POST['visibility_rules'] ) ? $_POST['visibility_rules'] : array();

		$visibility_rules = stripslashes( $_visibility_rules );
		$visibility_rules = json_decode( $visibility_rules, true );

		$filter_type = $filter_data['type'];
		$filter_key  = sanitize_title( $filter_data['field_key'] );

		$error_code = WCAPF_API_Utils::validate_filter( $filter_type, $filter_key, $post_id );

		if ( $error_code ) {
			$error_message = WCAPF_API_Utils::get_error_message_from_code( $error_code );

			wp_send_json_error( __( $error_message, 'wc-ajax-product-filter' ) );
		}

		if ( $post_id && 'wcapf-filter' === get_post_type( $post_id ) ) {
			$post_arr = array(
				'ID'          => $post_id,
				'post_title'  => $post_title,
				'post_status' => 'publish',
			);

			$new_post_id = wp_update_post( $post_arr, true );
		} else {
			$post_arr = array(
				'post_title'  => $post_title,
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
			);

			$new_post_id = wp_insert_post( $post_arr, true );
		}

		if ( is_wp_error( $new_post_id ) ) {
			wp_send_json_error( $new_post_id->get_error_message() );
		}

		update_option( '_pet', $filter_data ); // todo: remove

		$filter_data = $this->parse_new_ui_filter_data( $filter_data );

		update_option( '_pet2', $filter_data ); // todo: remove

		$parsed_field = WCAPF_API_Utils::parse_filter_data( $filter_data, $filter_type, $filter_key, $new_post_id );

		update_post_meta( $new_post_id, '_field_data', $parsed_field );
		update_post_meta( $new_post_id, '_filter_key', $filter_key );

		update_option( '_pet_rules', $visibility_rules ); // todo: remove

		// Parse the visibility rules.
		$parsed_visibility_rules = WCAPF_API_Utils::parse_visibility_rules( $visibility_rules );

		update_option( '_pet2_rules', $parsed_visibility_rules ); // todo: remove

		update_post_meta( $new_post_id, '_field_visibility_rules', $parsed_visibility_rules );

		// For the filters list table.
		$short = WCAPF_API_Utils::get_filter_data( $new_post_id );

		// For the filter edit page.
		$detailed = $this->get_filter( $new_post_id );

		wp_send_json_success( array(
			'short'    => $short,
			'detailed' => $detailed,
		) );
	}

	private function get_filter_data_from_post_request() {
		$filter_title = isset( $_POST['filter_title'] ) ? sanitize_text_field( $_POST['filter_title'] ) : '';
		$filter_id    = isset( $_POST['filter_id'] ) ? absint( $_POST['filter_id'] ) : '';
		$_filter_data = isset( $_POST['filter_data'] ) ? $_POST['filter_data'] : array();

		$filter_data = stripslashes( $_filter_data );
		$filter_data = json_decode( $filter_data, true );

		return array( $filter_data, $filter_id, $filter_title );
	}

	/**
	 * Parse the filter data comes from the new UI.
	 *
	 * @param array $filter_data The filter data.
	 *
	 * @return array
	 */
	private function parse_new_ui_filter_data( $filter_data ) {
		$parent_term        = $filter_data['parent_term'];
		$limit_values_by_id = $filter_data['limit_values_by_id'];
		$exclude_values_id  = $filter_data['exclude_values_id'];
		$appearance_options = $filter_data['custom_appearance_options'];
		$include_user_roles = $filter_data['include_user_roles'];

		if ( $parent_term ) {
			$filter_data['parent_term'] = $parent_term['value'];
		}

		if ( $limit_values_by_id ) {
			$values = wp_list_pluck( $limit_values_by_id, 'value' );

			$filter_data['limit_values_by_id'] = implode( ',', $values );
		}

		if ( $exclude_values_id ) {
			$values = wp_list_pluck( $exclude_values_id, 'value' );

			$filter_data['exclude_values_id'] = implode( ',', $values );
		}

		if ( $appearance_options ) {
			$parsed = array();

			foreach ( $appearance_options as $option ) {
				$term_id = $option['id'];

				$parsed[ $term_id ] = $option;
			}

			$filter_data['custom_appearance_options'] = $parsed;
		}

		if ( $include_user_roles ) {
			$filter_data['include_user_roles'] = wp_list_pluck( $include_user_roles, 'value' );
		}

		return $filter_data;
	}

	/**
	 * Gets the filter data via ajax.
	 *
	 * @return void
	 */
	public function get_filter_data() {
		$post_id = isset( $_GET['post_id'] ) ? absint( $_GET['post_id'] ) : '';

		wp_send_json_success( $this->get_filter( $post_id ) );
	}

	/**
	 * Gets the data for the edit filter view.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return array
	 */
	private function get_filter( $post_id ) {
		$filter_data      = WCAPF_API_Utils::get_field_data( $post_id );
		$filter_data      = $this->prepare_filter_data_for_new_ui( $filter_data );
		$visibility_rules = WCAPF_API_Utils::prepare_filter_visibility_rules( $post_id );

		return array(
			'post_title'       => get_the_title( $post_id ),
			'filter_data'      => $filter_data,
			'visibility_rules' => $visibility_rules,
		);
	}

	/**
	 * Prepare the filter data for new UI.
	 *
	 * TODO: Might be deprecated in the future.
	 *
	 * @param array $filter_data The filter data array.
	 *
	 * @return array
	 */
	private function prepare_filter_data_for_new_ui( $filter_data ) {
		// Fill the term_ids with value and label.
		$taxonomy_types = array( 'category', 'tag', 'attribute', 'custom-taxonomy' );
		$filter_type    = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

		if ( in_array( $filter_type, $taxonomy_types ) ) {
			$parent_term        = $filter_data['parent_term'];
			$limit_values_by_id = $filter_data['limit_values_by_id'];
			$exclude_values_id  = $filter_data['exclude_values_id'];

			if ( $parent_term ) {
				$term = get_term( $parent_term );

				$filter_data['parent_term'] = array(
					'value' => $term->term_id,
					'label' => $term->name,
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

					$filter_data[ $key ] = $parsed;
				}
			}
		}

		// Set the default values for the order settings.
		$order_terms_dir    = isset( $filter_data['order_terms_dir'] ) ? $filter_data['order_terms_dir'] : '';
		$options_order_dir  = isset( $filter_data['options_order_dir'] ) ? $filter_data['options_order_dir'] : '';
		$options_order_type = isset( $filter_data['options_order_type'] ) ? $filter_data['options_order_type'] : '';

		if ( ! $order_terms_dir ) {
			$filter_data['order_terms_dir'] = 'asc';
		}

		if ( ! $options_order_dir ) {
			$filter_data['options_order_dir'] = 'asc';
		}

		if ( ! $options_order_type ) {
			$filter_data['options_order_type'] = 'alphabetical';
		}

		// Parse custom appearance options.
		$custom_appearance_options = isset( $filter_data['custom_appearance_options'] )
			? $filter_data['custom_appearance_options']
			: array();

		if ( $custom_appearance_options ) {
			$parsed = array();

			foreach ( $custom_appearance_options as $id => $option ) {
				$option['id'] = $id;

				$parsed[] = $option;
			}

			$filter_data['custom_appearance_options'] = $parsed;
		}

		// Parse user roles.
		$include_user_roles = isset( $filter_data['include_user_roles'] )
			? $filter_data['include_user_roles']
			: array();

		if ( $include_user_roles ) {
			$user_roles = WCAPF_Product_Filter_Utils::get_user_roles();
			$parsed     = array();

			foreach ( $include_user_roles as $role ) {
				$parsed[] = array(
					'value' => $role,
					'label' => $user_roles[ $role ],
				);
			}

			$filter_data['include_user_roles'] = $parsed;
		}

		return $filter_data;
	}

	/**
	 * Deletes the filter via ajax.
	 *
	 * @return void
	 */
	public function delete_filter() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-filter' === get_post_type( $post_id ) ) {
			$delete = wp_delete_post( $post_id, true );

			if ( $delete ) {
				wp_send_json_success( __( 'Filter deleted successfully', 'wc-ajax-product-filter' ) );
			} else {
				wp_send_json_error(
					__( 'There was a problem deleting the filter, please try again.', 'wc-ajax-product-filter' )
				);
			}
		} else {
			wp_send_json_error( __( 'Invalid filter id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * TODO: Move the helper methods from pro to free.
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

		// Default sort by options.
		$_sort_by_options = WCAPF_PRO_Helper::get_sort_by_options();
		$sort_by_options  = array();

		foreach ( $_sort_by_options as $sort_by_key => $sort_by_label ) {
			$sort_by_options[] = array(
				'label' => $sort_by_label,
				'value' => $sort_by_key,
			);
		}

		$response['sort_by_options'] = $sort_by_options;

		// Default Meta Types.
		$_meta_types = WCAPF_PRO_Helper::get_meta_types();
		$meta_types  = array();

		foreach ( $_meta_types as $meta_type_key => $meta_type_label ) {
			$meta_types[] = array(
				'label' => $meta_type_label,
				'value' => $meta_type_key,
			);
		}

		$response['meta_types'] = $meta_types;

		// User roles.
		$_user_roles = WCAPF_Product_Filter_Utils::get_user_roles();
		$user_roles  = array();

		foreach ( $_user_roles as $role_value => $role_label ) {
			$user_roles[] = array(
				'label' => $role_label,
				'value' => $role_value,
			);
		}

		$response['user_roles'] = $user_roles;

		// Initial filter keys.
		$response['initial_filter_keys'] = WCAPF_API_Utils::get_initial_filter_keys();

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

	/**
	 * Gets the filter preview via ajax.
	 *
	 * @return void
	 */
	public function get_filter_preview() {
		list( $filter_data, $post_id, $filter_title ) = $this->get_filter_data_from_post_request();

		$filter_type = $filter_data['type'];
		$filter_key  = $filter_data['field_key'];

		$filter_data  = $this->parse_new_ui_filter_data( $filter_data );
		$parsed_field = WCAPF_API_Utils::parse_filter_data( $filter_data, $filter_type, $filter_key, $post_id );

		$parsed_field['for_preview']  = true;
		$parsed_field['filter_title'] = $filter_title;

		$field_class = WCAPF_Helper::get_field_class_name_by_type( $filter_type );

		if ( ! $field_class ) {
			wp_send_json_error( __( 'Invalid filter type', 'wc-ajax-product-filter' ) );
		}

		if ( 'active-filters' === $filter_type ) {
			add_filter( 'wcapf_active_filters_data', array( $this, 'add_dummy_active_filters' ) );
		}

		$field = WCAPF_Helper::get_field_instance( $filter_type, $parsed_field );

		ob_start();

		$field->filter_form();

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	/**
	 * Adds dummy filters to show when previewing the active filters.
	 *
	 * @return array[]
	 */
	public function add_dummy_active_filters() {
		return WCAPF_API_Utils::get_dummy_active_filters();
	}

	/**
	 * Gets the taxonomy terms for the manual options modal via ajax.
	 *
	 * @return void
	 */
	public function get_taxonomy_terms_for_modal() {
		$taxonomy = isset( $_GET['taxonomy'] ) ? sanitize_text_field( $_GET['taxonomy'] ) : '';
		$number   = apply_filters( 'wcapf_max_number_of_terms_for_browse_options_modal', 99 );

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'fields'     => 'id=>name',
			'number'     => absint( $number ),
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

	/**
	 * Gets the taxonomy terms via ajax.
	 *
	 * @return void
	 */
	public function get_taxonomy_terms_for_dropdown() {
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

	/**
	 * Gets the post authors via ajax.
	 *
	 * @return void
	 */
	public function get_post_authors_for_dropdown() {
		$keyword = isset( $_GET['keyword'] ) ? sanitize_text_field( $_GET['keyword'] ) : '';
		$page    = isset( $_GET['page'] ) ? absint( $_GET['page'] ) : 1;

		$per_page = 20;
		$offset   = ( $page - 1 ) * $per_page;

		$args = array(
			'search' => $keyword,
			'number' => $per_page,
			'offset' => $offset,
			'fields' => array( 'ID', 'display_name' ),
		);

		$users    = get_users( $args );
		$response = array();

		if ( $users ) {
			foreach ( $users as $user ) {
				$response[] = array(
					'label' => $user->display_name,
					'value' => $user->ID,
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Gets the meta values via ajax.
	 *
	 * TODO: Move the helper method from pro to free.
	 *
	 * @return void
	 */
	public function get_meta_values() {
		$meta_key = isset( $_GET['meta_key'] ) ? sanitize_text_field( $_GET['meta_key'] ) : '';

		$values   = WCAPF_PRO_Helper::get_available_meta_values( $meta_key );
		$response = array();

		if ( $values ) {
			foreach ( $values as $value ) {
				$response[] = array(
					'value' => $value,
					'label' => $value,
				);
			}
		}

		wp_send_json_success( $response );
	}

	/**
	 * Duplicates the form via ajax.
	 *
	 * @return void
	 */
	public function duplicate_form() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-form' === get_post_type( $post_id ) ) {
			$new_post_id = WCAPF_API_Utils::duplicate_form( $post_id );

			if ( is_wp_error( $new_post_id ) ) {
				wp_send_json_error( $new_post_id->get_error_message() );
			} else {
				wp_send_json_success( array(
					'message'  => __( 'Form duplicated successfully', 'wc-ajax-product-filter' ),
					'new_post' => WCAPF_API_Utils::get_form_data( $new_post_id ),
				) );
			}
		} else {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Duplicates the filter via ajax.
	 *
	 * @return void
	 */
	public function duplicate_filter() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-filter' === get_post_type( $post_id ) ) {
			$new_post_id = WCAPF_API_Utils::duplicate_filter( $post_id );

			if ( is_wp_error( $new_post_id ) ) {
				wp_send_json_error( $new_post_id->get_error_message() );
			} else {
				wp_send_json_success( array(
					'message'  => __( 'Filter duplicated successfully', 'wc-ajax-product-filter' ),
					'new_post' => WCAPF_API_Utils::get_filter_data( $new_post_id ),
				) );
			}
		} else {
			wp_send_json_error( __( 'Invalid filter id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Gets the available filters for the form via ajax.
	 *
	 * @return void
	 */
	public function get_available_filters() {
		$filter_ids = WCAPF_API_Utils::get_filter_ids( 'publish' );
		$columns    = WCAPF_API_Utils::get_filter_overridden_columns();
		$filters    = array();

		foreach ( $filter_ids as $filter_id ) {
			$filter_data = WCAPF_API_Utils::get_field_data( $filter_id );
			$filter_type = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

			$data = array(
				'id'    => $filter_id,
				'title' => get_the_title( $filter_id ),
				'type'  => $filter_type,
			);

			foreach ( $columns as $column => $default_value ) {
				if ( isset( $filter_data[ $column ] ) ) {
					$data[ $column ] = $filter_data[ $column ];
				} else {
					$data[ $column ] = $default_value;
				}
			}

			$filters[] = $data;
		}

		wp_send_json_success( $filters );
	}

	/**
	 * Deletes the form via ajax.
	 *
	 * @return void
	 */
	public function delete_form() {
		$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : '';

		if ( $post_id && 'wcapf-form' === get_post_type( $post_id ) ) {
			$delete = wp_delete_post( $post_id, true );

			if ( $delete ) {
				wp_send_json_success( __( 'Form deleted successfully', 'wc-ajax-product-filter' ) );
			} else {
				wp_send_json_error(
					__( 'There was a problem deleting the form, please try again.', 'wc-ajax-product-filter' )
				);
			}
		} else {
			wp_send_json_error( __( 'Invalid form id', 'wc-ajax-product-filter' ) );
		}
	}

	/**
	 * Saves the plugin settings via ajax.
	 *
	 * @return void
	 */
	public function save_settings() {
		$_settings = isset( $_POST['settings'] ) ? $_POST['settings'] : array();

		$settings = stripslashes( $_settings );
		$settings = json_decode( $settings, true );

		if ( isset( $settings['loading_image_src'] ) ) {
			unset( $settings['loading_image_src'] );
		}

		update_option( WCAPF_Helper::settings_option_key(), $settings );

		wp_send_json_success( __( 'Settings saved successfully', 'wc-ajax-product-filter' ) );
	}

}

WCAPF_API::instance();
