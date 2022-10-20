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


		add_action( 'wp_ajax_get_available_filters', array( $this, 'get_available_filters' ) );
		add_action( 'wp_ajax_get_filter_form_data', array( $this, 'get_filter_form_data' ) );
		add_action( 'wp_ajax_save_filter_form', array( $this, 'save_filter_form' ) );
		add_action( 'wp_ajax_get_filter_form_preview', array( $this, 'get_filter_form_preview' ) );
		add_action( 'wp_ajax_get_filter_data', array( $this, 'get_filter_data' ) );
		add_action( 'wp_ajax_wcapf_save_filter', array( $this, 'save_filter' ) );
		add_action( 'wp_ajax_get_filter_additional_data', array( $this, 'get_filter_additional_data' ) );
		add_action( 'wp_ajax_get_filter_preview', array( $this, 'get_filter_preview' ) );
		add_action( 'wp_ajax_get_custom_appearance_data', array( $this, 'get_custom_appearance_data' ) );
		add_action( 'wp_ajax_wcapf_get_taxonomy_terms', array( $this, 'get_taxonomy_terms' ) );
		add_action( 'wp_ajax_wcapf_get_post_authors', array( $this, 'get_post_authors' ) );
		add_action( 'wp_ajax_wcapf_get_meta_values', array( $this, 'get_meta_values' ) );
		add_action( 'wp_ajax_get_filters', array( $this, 'get_filters' ) );
		add_action( 'wp_ajax_check_filter_key', array( $this, 'check_filter_key' ) );
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

	public function save_filter() {
		$filter_title = isset( $_POST['filter_title'] ) ? $_POST['filter_title'] : '';
		$filter_id    = isset( $_POST['filter_id'] ) ? $_POST['filter_id'] : '';
		$_filter_data = isset( $_POST['filter_data'] ) ? $_POST['filter_data'] : array();

		$filter_data = stripslashes( $_filter_data );
		$filter_data = json_decode( $filter_data, true );

		$filter_type = $filter_data['type'];
		$filter_key  = sanitize_title( $filter_data['field_key'] );

		$error_code = WCAPF_API_Utils::validate_filter( $filter_type, $filter_key, $filter_id );

		if ( $error_code ) {
			$error_message = WCAPF_API_Utils::get_error_message_from_code( $error_code );

			wp_send_json_error( __( $error_message, 'wc-ajax-product-filter' ) );
		}

		wp_send_json_success( array(
			'filter_title' => $filter_title,
			'filter_data'  => $filter_data,
		) );
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

	public function get_taxonomy_terms() {
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

	public function get_post_authors() {
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
	 * TODO: Move pro to free.
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
