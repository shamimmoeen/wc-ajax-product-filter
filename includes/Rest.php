<?php
/**
 * REST controllers for the React admin UI.
 *
 * Registers the wcapf/v1 namespace. Mirrors the React-facing admin-ajax
 * endpoints during the Phase-0 axios → apiFetch migration. The admin-ajax
 * handlers in \WCAPF\Ajax stay alive in parallel and are deleted once the
 * React swap completes.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

namespace WCAPF;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Registers the wcapf/v1 REST routes that back the React admin UI.
 */
class Rest {

	private const NAMESPACE = 'wcapf/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Registers every wcapf/v1 route.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$auth = array( $this, 'permission_check' );

		register_rest_route(
			self::NAMESPACE,
			'/forms',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_form' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/forms/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_form' ),
					'permission_callback' => $auth,
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_form' ),
					'permission_callback' => $auth,
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_form' ),
					'permission_callback' => $auth,
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/filters/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_filter' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_settings' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/terms',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_terms' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/authors',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_authors' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/pages',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_pages' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/products',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_products' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/meta-values',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_meta_values' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/notices/review/dismiss',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'dismiss_review_notice' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/notices/v4-review-filters/dismiss',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'dismiss_v4_review_filters_notice' ),
				'permission_callback' => $auth,
			)
		);
	}

	/**
	 * Permission check for every route in this controller.
	 *
	 * @return bool
	 */
	public function permission_check(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Creates a form. Body `{template: 'sample'}` seeds the sample filters;
	 * otherwise an empty form is created from `{form_title, form_settings}`.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function create_form( WP_REST_Request $request ) {
		$template = (string) $request->get_param( 'template' );

		if ( 'sample' === $template ) {
			$form_settings = Defaults::form_default_data();
			$post_arr      = array(
				'post_title'   => __( 'Sample form', 'wc-ajax-product-filter' ),
				'post_content' => maybe_serialize( $form_settings ),
				'menu_order'   => 0,
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
			);

			$new_form_id = wp_insert_post( $post_arr, true );

			if ( is_wp_error( $new_form_id ) ) {
				return $new_form_id;
			}

			wcapf()->form_filters->save( Defaults::get_sample_filters(), $new_form_id );

			return wcapf()->api->form_data( $new_form_id );
		}

		$form_title    = sanitize_text_field( (string) $request->get_param( 'form_title' ) );
		$form_settings = $this->json_param_to_array( $request, 'form_settings' );

		$new_form_id = wp_insert_post(
			array(
				'post_title'   => $form_title,
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( $form_settings ),
			),
			true
		);

		if ( is_wp_error( $new_form_id ) ) {
			return $new_form_id;
		}

		return wcapf()->api->form_data( $new_form_id );
	}

	/**
	 * Returns the form data the React form-edit screen consumes.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function get_form( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];
		$form    = get_post( $post_id );

		if ( ! $form || 'wcapf-form' !== $form->post_type ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		$filter_ids = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'any',
				'nopaging'    => true,
				'post_parent' => $post_id,
				'order'       => 'ASC',
				'orderby'     => 'menu_order',
			)
		);

		$form_filters = array();
		foreach ( $filter_ids as $filter_post ) {
			if ( ! $filter_post || 'wcapf-filter' !== $filter_post->post_type ) {
				continue;
			}
			$filter         = maybe_unserialize( $filter_post->post_content );
			$form_filters[] = $this->parse_filter_data( $filter );
		}

		$form_settings = $this->parse_form_settings( maybe_unserialize( $form->post_content ) );

		return array(
			'post_id'       => $post_id,
			'post_title'    => get_the_title( $post_id ),
			'filter_keys'   => wcapf()->api->filter_keys(),
			'form_filters'  => $form_filters,
			'form_settings' => $form_settings,
		);
	}

	/**
	 * Updates a form's title, settings, and child filters.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function update_form( WP_REST_Request $request ) {
		$form_id = (int) $request['id'];

		if ( ! $form_id || 'wcapf-form' !== get_post_type( $form_id ) ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		$form_title    = sanitize_text_field( (string) $request->get_param( 'form_title' ) );
		$form_filters  = $this->json_param_to_array( $request, 'form_filters' );
		$form_settings = $this->json_param_to_array( $request, 'form_settings' );

		$sanitized_form_settings = apply_filters(
			'wcapf_sanitize_form_settings',
			$this->sanitize_form_settings( $form_settings ),
			$form_settings
		);

		$post_arr = array(
			'ID'           => $form_id,
			'post_title'   => $form_title,
			'post_content' => maybe_serialize( $sanitized_form_settings ),
			'menu_order'   => isset( $form_settings['priority'] ) ? $form_settings['priority'] : 0,
		);

		$updated = wp_update_post( $post_arr, true );

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		list( $filters, $errors ) = wcapf()->form_filters->save( $form_filters, $form_id );

		if ( $errors ) {
			return new WP_Error(
				'wcapf_filter_validation_failed',
				__( 'One or more filters failed validation.', 'wc-ajax-product-filter' ),
				array(
					'status' => 422,
					'errors' => $errors,
				)
			);
		}

		do_action( 'wcapf_form_saved', $form_id );

		$filters_for_ui = array();
		foreach ( $filters as $filter ) {
			$filters_for_ui[] = $this->parse_filter_data( $filter );
		}

		$form_settings = $this->parse_form_settings( $sanitized_form_settings );

		return array(
			'filter_keys'        => wcapf()->api->filter_keys(),
			'form_filters'       => $filters_for_ui,
			'form_settings'      => $form_settings,
			'show_review_notice' => wcapf()->notices->is_milestone_review_visible(),
		);
	}

	/**
	 * Deletes a form and cascades to its child filters.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function delete_form( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];

		if ( ! $post_id || 'wcapf-form' !== get_post_type( $post_id ) ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		$filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'any',
				'post_parent' => $post_id,
				'nopaging'    => true,
				'fields'      => 'ids',
			)
		);

		$deleted = wp_delete_post( $post_id, true );

		if ( ! $deleted ) {
			return new WP_Error(
				'wcapf_delete_failed',
				__( 'There was a problem deleting the form, please try again.', 'wc-ajax-product-filter' ),
				array( 'status' => 500 )
			);
		}

		foreach ( $filters as $filter_id ) {
			wp_delete_post( $filter_id, true );
		}

		return array( 'message' => __( 'Form deleted successfully', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Deletes a single filter.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function delete_filter( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];

		if ( ! $post_id || 'wcapf-filter' !== get_post_type( $post_id ) ) {
			return new WP_Error( 'wcapf_invalid_filter_id', __( 'Invalid filter id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		$deleted = wp_delete_post( $post_id, true );

		if ( ! $deleted ) {
			return new WP_Error(
				'wcapf_delete_failed',
				__( 'There was a problem deleting the filter, please try again.', 'wc-ajax-product-filter' ),
				array( 'status' => 500 )
			);
		}

		return array( 'message' => __( 'Filter deleted successfully', 'wc-ajax-product-filter' ) );
	}

	/**
	 * Saves the plugin settings; optionally renames filter slugs.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function save_settings( WP_REST_Request $request ) {
		$settings           = $this->json_param_to_array( $request, 'settings' );
		$filter_keys        = $this->json_param_to_array( $request, 'filter_keys' );
		$update_filter_keys = sanitize_text_field( (string) $request->get_param( 'update_filter_keys' ) );

		$sanitized_settings = apply_filters(
			'wcapf_sanitize_settings',
			$this->sanitize_settings_data( $settings ),
			$settings
		);

		update_option( wcapf()->settings->option_key(), $sanitized_settings );

		if ( ! $update_filter_keys ) {
			return array(
				'settings'           => wcapf()->api->settings(),
				'global_filter_keys' => wcapf()->api->filter_keys( true ),
			);
		}

		$possible_types  = wcapf()->api->filter_types();
		$new_filter_keys = array();
		$errors          = array();

		foreach ( $filter_keys as $order => $filter ) {
			$post_name = isset( $filter['field_key'] ) ? urldecode( sanitize_title( $filter['field_key'] ) ) : '';
			$type      = isset( $filter['type'] ) ? $filter['type'] : '';
			$taxonomy  = isset( $filter['taxonomy'] ) ? $filter['taxonomy'] : '';
			$meta_key  = isset( $filter['meta_key'] ) ? $filter['meta_key'] : '';

			list( $post_name, $error_data ) = wcapf()->form_filters->filter_key(
				$type,
				$possible_types,
				$taxonomy,
				$filter,
				$post_name,
				$meta_key,
				$order
			);

			if ( $error_data ) {
				$errors[] = $error_data;
				continue;
			}

			if ( $errors ) {
				continue;
			}

			$filter['field_key'] = $post_name;
			$new_filter_keys[]   = $filter;
		}

		if ( $errors ) {
			return new WP_Error(
				'wcapf_filter_key_validation_failed',
				__( 'One or more filter keys failed validation.', 'wc-ajax-product-filter' ),
				array(
					'status' => 422,
					'errors' => $errors,
				)
			);
		}

		$update_filter_key_errors = array();

		foreach ( $new_filter_keys as $filter ) {
			$post_name = $filter['field_key'];

			global $wpdb;

			$old_filter_key = isset( $filter['_field_key'] ) ? $filter['_field_key'] : '';
			$filters        = array();

			if ( $old_filter_key ) {
				// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Exact raw post_name match is required here because WP_Query/name sanitizes non-ASCII slugs and breaks filter key lookups.
				$filter_ids = $wpdb->get_col(
					$wpdb->prepare(
						"SELECT ID
						FROM {$wpdb->posts}
						WHERE post_type = %s
						AND post_name = %s",
						'wcapf-filter',
						$old_filter_key
					)
				);

				if ( $filter_ids ) {
					$filters = get_posts(
						array(
							'post_type' => 'wcapf-filter',
							'post__in'  => $filter_ids,
							'nopaging'  => true,
						)
					);
				}
			}

			foreach ( $filters as $filter_data ) {
				$filter_settings              = maybe_unserialize( $filter_data->post_content );
				$filter_settings['field_key'] = $post_name;

				$post_arr = array(
					'ID'           => $filter_data->ID,
					'post_name'    => $post_name,
					'post_content' => maybe_serialize( $filter_settings ),
				);

				$slug_cb = static function () use ( $post_name ) {
					return $post_name;
				};

				add_filter( 'pre_wp_unique_post_slug', $slug_cb );
				$updated_filter_id = wp_update_post( $post_arr, true );
				remove_filter( 'pre_wp_unique_post_slug', $slug_cb );

				if ( is_wp_error( $updated_filter_id ) ) {
					$update_filter_key_errors[] = $updated_filter_id->get_error_message();
				}
			}
		}

		if ( $update_filter_key_errors ) {
			return new WP_Error(
				'wcapf_filter_key_update_failed',
				$update_filter_key_errors[0],
				array( 'status' => 500 )
			);
		}

		do_action( 'wcapf_after_update_filter_keys', $new_filter_keys );

		return array(
			'settings'           => wcapf()->api->settings(),
			'global_filter_keys' => wcapf()->api->filter_keys( true ),
		);
	}

	/**
	 * GET /terms — collapses the modal + dropdown handlers behind ?context=.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function get_terms( WP_REST_Request $request ): array {
		$context  = $request->get_param( 'context' );
		$taxonomy = sanitize_text_field( (string) $request->get_param( 'taxonomy' ) );

		if ( 'modal' === $context ) {
			$number = apply_filters( 'wcapf_max_number_of_terms_for_browse_options_modal', 99 );
			$terms  = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
					'fields'     => 'id=>name',
					'number'     => absint( $number ),
				)
			);

			$response = array();
			if ( $terms && ! is_wp_error( $terms ) ) {
				foreach ( $terms as $term_id => $term_name ) {
					$response[] = array(
						'value' => $term_id,
						'label' => $term_name,
					);
				}
			}

			return $response;
		}

		$only_parent = sanitize_text_field( (string) $request->get_param( 'only_parent' ) );
		$keyword     = sanitize_text_field( (string) $request->get_param( 'keyword' ) );
		$page        = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page    = 20;
		$offset      = ( $page - 1 ) * $per_page;

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'search'     => $keyword,
			'number'     => $per_page,
			'offset'     => $offset,
			'fields'     => 'id=>name',
		);

		if ( 'true' === $only_parent ) {
			$includes  = array();
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

		$terms    = get_terms( $args );
		$response = array();

		if ( $terms && ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term_id => $term_name ) {
				$response[] = array(
					'label' => $term_name,
					'value' => absint( $term_id ),
				);
			}
		}

		return $response;
	}

	/**
	 * GET /authors — collapses the modal + dropdown handlers behind ?context=.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function get_authors( WP_REST_Request $request ): array {
		$context = $request->get_param( 'context' );

		if ( 'modal' === $context ) {
			$roles = (array) $request->get_param( 'roles' );
			$roles = array_map( 'sanitize_text_field', $roles );
			$users = get_users(
				array(
					'role__in' => $roles,
					'fields'   => array( 'ID', 'display_name' ),
				)
			);

			$response = array();
			foreach ( $users as $user ) {
				$response[] = array(
					'label' => $user->display_name,
					'value' => $user->ID,
				);
			}

			return $response;
		}

		$keyword  = sanitize_text_field( (string) $request->get_param( 'keyword' ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page = 20;

		$args = array(
			'capability' => 'edit_posts',
			'search'     => $keyword ? '*' . $keyword . '*' : '',
			'fields'     => array( 'ID', 'display_name' ),
			'number'     => $per_page,
			'offset'     => ( $page - 1 ) * $per_page,
		);

		$users = get_users( $args );

		$response = array();
		foreach ( $users as $user ) {
			$response[] = array(
				'label' => $user->display_name,
				'value' => $user->ID,
			);
		}

		return $response;
	}

	/**
	 * GET /pages — paginated page search.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function get_pages( WP_REST_Request $request ): array {
		$keyword  = sanitize_text_field( (string) $request->get_param( 'keyword' ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page = 20;

		$query = new \WP_Query(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				's'              => $keyword,
				'posts_per_page' => $per_page,
				'paged'          => $page,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		$response = array();
		foreach ( $query->posts as $post ) {
			$response[] = array(
				'label' => $post->post_title,
				'value' => $post->ID,
			);
		}

		return $response;
	}

	/**
	 * GET /products — paginated product search.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function get_products( WP_REST_Request $request ): array {
		$keyword  = sanitize_text_field( (string) $request->get_param( 'keyword' ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page = 20;

		$query = new \WP_Query(
			array(
				'post_type'      => 'product',
				'post_status'    => 'publish',
				's'              => $keyword,
				'posts_per_page' => $per_page,
				'paged'          => $page,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		$response = array();
		foreach ( $query->posts as $post ) {
			$response[] = array(
				'label' => $post->post_title,
				'value' => $post->ID,
			);
		}

		return $response;
	}

	/**
	 * GET /meta-values — distinct values for a meta key.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function get_meta_values( WP_REST_Request $request ): array {
		$meta_key = sanitize_text_field( (string) $request->get_param( 'meta_key' ) );

		$values   = wcapf()->data->available_meta_values( $meta_key );
		$response = array();

		if ( $values ) {
			foreach ( $values as $value ) {
				$response[] = array(
					'value' => $value,
					'label' => $value,
				);
			}
		}

		return $response;
	}

	/**
	 * POST /notices/review/dismiss — same behavior as
	 * \WCAPF\Admin::dismiss_review_notices.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array|WP_Error
	 */
	public function dismiss_review_notice( WP_REST_Request $request ) {
		$type = sanitize_text_field( (string) $request->get_param( 'type' ) );

		if ( ! $type ) {
			return new WP_Error(
				'wcapf_invalid_notice_type',
				__( 'Invalid type for dismissing the review notices', 'wc-ajax-product-filter' ),
				array( 'status' => 400 )
			);
		}

		$user_id = get_current_user_id();

		if ( 'milestone-achieved' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_for_milestone_achieved_dismissed', '1' );
			update_user_meta( $user_id, 'wcapf_review_notice_for_milestone_achieved_dismissed_at', time() );
		} elseif ( 'permanently-dismiss-time-since' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_time_since_hide_permanently', '1' );
		} elseif ( 'postpone-time-since' === $type ) {
			update_user_meta( $user_id, 'wcapf_review_notice_time_since_dismissed_at', time() );
		}

		return array( 'message' => __( 'WCAPF review notice dismissed', 'wc-ajax-product-filter' ) );
	}

	/**
	 * POST /notices/v4-review-filters/dismiss — clears the per-form review flag.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function dismiss_v4_review_filters_notice( WP_REST_Request $request ): array {
		$form_id = absint( $request->get_param( 'form_id' ) );

		if ( $form_id ) {
			delete_post_meta( $form_id, '_wcapf_v4_needs_review' );
		}

		return array();
	}

	/**
	 * Decodes a param that arrives either as a JSON string (form-encoded
	 * requests) or as an already-decoded array (JSON-bodied requests).
	 *
	 * @param WP_REST_Request $request The request.
	 * @param string          $name    The param name.
	 *
	 * @return array
	 */
	private function json_param_to_array( WP_REST_Request $request, string $name ): array {
		$value = $request->get_param( $name );

		if ( is_array( $value ) ) {
			return $value;
		}

		$decoded = json_decode( (string) $value, true );

		return is_array( $decoded ) ? $decoded : array();
	}

	/**
	 * Parses a stored filter row into the {value,label} shape the React UI
	 * expects (term/author/role lookups + manual_options name resolution).
	 * Mirrors the same-named method on \WCAPF\Ajax during the transition.
	 *
	 * @param array $filter The stored filter row.
	 *
	 * @return array
	 */
	private function parse_filter_data( $filter ): array {
		$value_may_have_spaces = array(
			'value_prefix',
			'value_postfix',
			'values_separator',
			'text_before_min_value',
			'text_before_max_value',
		);

		foreach ( $value_may_have_spaces as $key ) {
			$value          = isset( $filter[ $key ] ) ? $filter[ $key ] : '';
			$filter[ $key ] = str_replace( '&nbsp;', ' ', $value );
		}

		$parent_term   = isset( $filter['parent_term'] ) ? $filter['parent_term'] : '';
		$include_terms = isset( $filter['include_terms'] ) ? $filter['include_terms'] : array();
		$exclude_terms = isset( $filter['exclude_terms'] ) ? $filter['exclude_terms'] : array();

		if ( $parent_term ) {
			$term = get_term( $parent_term );

			if ( $term && ! is_wp_error( $term ) ) {
				$filter['parent_term'] = array(
					'value' => $term->term_id,
					'label' => $term->name,
				);
			}
		}

		foreach ( array(
			'include_terms' => $include_terms,
			'exclude_terms' => $exclude_terms,
		) as $key => $values ) {
			if ( ! $values ) {
				continue;
			}

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
			$filter[ $key ] = $parsed;
		}

		$include_authors = isset( $filter['include_authors'] ) ? $filter['include_authors'] : array();
		$exclude_authors = isset( $filter['exclude_authors'] ) ? $filter['exclude_authors'] : array();

		foreach ( array(
			'include_authors' => $include_authors,
			'exclude_authors' => $exclude_authors,
		) as $key => $values ) {
			if ( ! $values ) {
				continue;
			}

			$parsed = array();
			foreach ( $values as $id ) {
				$user = get_userdata( $id );
				if ( $user && ! is_wp_error( $user ) ) {
					$parsed[] = array(
						'value' => $user->ID,
						'label' => $user->display_name,
					);
				}
			}
			$filter[ $key ] = $parsed;
		}

		$include_user_roles = isset( $filter['include_user_roles'] ) ? $filter['include_user_roles'] : array();

		if ( $include_user_roles ) {
			$roles  = wcapf()->data->user_roles();
			$parsed = array();
			foreach ( $include_user_roles as $role ) {
				$parsed[] = array(
					'value' => $role,
					'label' => $roles[ $role ] ?? $role,
				);
			}
			$filter['include_user_roles'] = $parsed;
		}

		$type = isset( $filter['type'] ) ? $filter['type'] : '';

		if ( 'taxonomy' === $type ) {
			$manual_options = isset( $filter['manual_options'] ) ? $filter['manual_options'] : array();

			if ( $manual_options ) {
				$parsed = array();
				foreach ( $manual_options as $option ) {
					$term = get_term( $option['value'] );
					if ( ! $term ) {
						continue;
					}
					$option['name'] = $term->name;
					$parsed[]       = $option;
				}
				$filter['manual_options'] = $parsed;
			}
		} elseif ( 'post-author' === $type ) {
			$manual_options = isset( $filter['manual_options'] ) ? $filter['manual_options'] : array();

			if ( $manual_options ) {
				$parsed = array();
				foreach ( $manual_options as $option ) {
					$user = get_userdata( $option['value'] );
					if ( $user && ! is_wp_error( $user ) ) {
						$option['name'] = $user->display_name;
						$parsed[]       = $option;
					}
				}
				$filter['manual_options'] = $parsed;
			}
		}

		return apply_filters( 'wcapf_parse_filter_data', $filter );
	}

	/**
	 * Passes the form settings through the parse filter so pro can inject the
	 * form_locations display shape.
	 *
	 * @param array $sanitized The sanitized form settings.
	 *
	 * @return array
	 */
	private function parse_form_settings( $sanitized ): array {
		return apply_filters( 'wcapf_parse_form_settings', $sanitized );
	}

	/**
	 * Plain-text sanitization for the form settings array. Pro tightens this
	 * via the wcapf_sanitize_form_settings filter for nested fields.
	 *
	 * @param array $form The form settings.
	 *
	 * @return array
	 */
	private function sanitize_form_settings( array $form ): array {
		$sanitized = array();
		foreach ( $form as $key => $value ) {
			$sanitized[ $key ] = sanitize_text_field( $value );
		}
		return $sanitized;
	}

	/**
	 * Sanitization branches for plugin settings (author_roles pluck,
	 * sort_by_form to int, everything else as plain text).
	 *
	 * @param array $settings The raw settings.
	 *
	 * @return array
	 */
	private function sanitize_settings_data( array $settings ): array {
		$sanitized = array();
		foreach ( $settings as $key => $value ) {
			if ( 'author_roles' === $key ) {
				$value = wp_list_pluck( $settings['author_roles'], 'value' );
			} elseif ( 'sort_by_form' === $key ) {
				$value = absint( $value );
			} else {
				$value = sanitize_text_field( $value );
			}
			$sanitized[ $key ] = $value;
		}
		return $sanitized;
	}
}
