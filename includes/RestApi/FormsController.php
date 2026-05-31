<?php
/**
 * Forms + filters CRUD routes. Owns the parse/sanitize plumbing the React
 * form-edit screen needs (parent_term + include/exclude_terms +
 * include/exclude_authors + include_user_roles + manual_options shaping).
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/RestApi
 * @author     Mainul Hassan
 */

namespace WCAPF\RestApi;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WCAPF\Defaults;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Routes: POST /forms, GET|POST|DELETE /forms/{id}, DELETE /filters/{id}.
 */
class FormsController extends Controller {

	/**
	 * Registers the form + filter routes.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$auth = array( $this, 'permission_check' );

		register_rest_route(
			self::REST_NAMESPACE,
			'/forms',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_form' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/forms/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_form' ),
					'permission_callback' => $auth,
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
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
			self::REST_NAMESPACE,
			'/filters/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_filter' ),
				'permission_callback' => $auth,
			)
		);
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
	 * Parses a stored filter row into the {value,label} shape the React UI
	 * expects (term/author/role lookups + manual_options name resolution).
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
}
