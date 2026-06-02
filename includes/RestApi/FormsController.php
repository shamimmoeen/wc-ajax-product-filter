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
use WP_REST_Response;
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
		register_rest_route(
			self::REST_NAMESPACE,
			'/forms',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_form' ),
				'permission_callback' => array( $this, 'permission_check' ),
				'args'                => array(
					'title'    => array(
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'settings' => array(
						'type'              => 'object',
						'default'           => array(),
						'sanitize_callback' => array( $this, 'sanitize_form_settings' ),
					),
				),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/forms/sample',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_sample_form' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/forms/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_form' ),
					'permission_callback' => array( $this, 'permission_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_form' ),
					'permission_callback' => array( $this, 'permission_check' ),
					'args'                => array(
						'title'    => array(
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'settings' => array(
							'type'              => 'object',
							'default'           => array(),
							'sanitize_callback' => array( $this, 'sanitize_form_settings' ),
						),
						'filters'  => array(
							'type'    => 'array',
							'default' => array(),
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_form' ),
					'permission_callback' => array( $this, 'permission_check' ),
				),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/filters/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_filter' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);
	}

	/**
	 * Creates an empty form from the request's `title` + `settings`.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_form( WP_REST_Request $request ) {
		$new_form_id = wp_insert_post(
			array(
				'post_title'   => (string) $request->get_param( 'title' ),
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
				'post_content' => maybe_serialize( (array) $request->get_param( 'settings' ) ),
			),
			true
		);

		if ( is_wp_error( $new_form_id ) ) {
			return $new_form_id;
		}

		return rest_ensure_response( wcapf()->api->form_data( $new_form_id ) );
	}

	/**
	 * Creates a form pre-populated with the default sample filters.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function create_sample_form() {
		$new_form_id = wp_insert_post(
			array(
				'post_title'   => __( 'Sample form', 'wc-ajax-product-filter' ),
				'post_content' => maybe_serialize( Defaults::form_default_data() ),
				'menu_order'   => 0,
				'post_type'    => 'wcapf-form',
				'post_status'  => 'publish',
			),
			true
		);

		if ( is_wp_error( $new_form_id ) ) {
			return $new_form_id;
		}

		wcapf()->form_filters->save( Defaults::get_sample_filters(), $new_form_id );

		return rest_ensure_response( wcapf()->api->form_data( $new_form_id ) );
	}

	/**
	 * Returns the form data the React form-edit screen consumes.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_form( WP_REST_Request $request ) {
		$form = get_post( (int) $request['id'] );

		if ( ! $form || 'wcapf-form' !== $form->post_type ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		return rest_ensure_response( $this->prepare_form_for_response( $form ) );
	}

	/**
	 * Updates a form's title, settings, and child filters.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_form( WP_REST_Request $request ) {
		$form_id = (int) $request['id'];

		if ( ! $form_id || 'wcapf-form' !== get_post_type( $form_id ) ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		$form_settings = (array) $request->get_param( 'settings' );
		$form_filters  = (array) $request->get_param( 'filters' );

		$post_arr = array(
			'ID'           => $form_id,
			'post_title'   => (string) $request->get_param( 'title' ),
			'post_content' => maybe_serialize( $form_settings ),
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

		/*
		 * TODO (Phase 1 wp.data): drop `show_review_notice` from this response.
		 * It's UI-state side-channel data that doesn't belong on a form
		 * resource — it piggybacks today because every extra request adds a
		 * round-trip in the React admin. Once @wordpress/data stores can
		 * invalidate after a save, React refetches it from GET /notices/
		 * review/status and the response becomes the resource only.
		 */
		$response                       = $this->prepare_form_for_response( get_post( $form_id ) );
		$response['show_review_notice'] = wcapf()->notices->is_milestone_review_visible();

		return rest_ensure_response( $response );
	}

	/**
	 * Deletes a form and cascades to its child filters.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_form( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];
		$form    = get_post( $post_id );

		if ( ! $form || 'wcapf-form' !== $form->post_type ) {
			return new WP_Error( 'wcapf_invalid_form_id', __( 'Invalid form id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		// Snapshot the resource before deletion so the response can carry it
		// back as `previous` — matches WP_REST_Posts_Controller::delete_item.
		$previous = wcapf()->api->form_data( $form );

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

		return rest_ensure_response(
			array(
				'deleted'  => true,
				'previous' => $previous,
			)
		);
	}

	/**
	 * Deletes a single filter.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_filter( WP_REST_Request $request ) {
		$post_id = (int) $request['id'];
		$filter  = get_post( $post_id );

		if ( ! $filter || 'wcapf-filter' !== $filter->post_type ) {
			return new WP_Error( 'wcapf_invalid_filter_id', __( 'Invalid filter id', 'wc-ajax-product-filter' ), array( 'status' => 404 ) );
		}

		// Snapshot the resource before deletion — see delete_form for the
		// WP_REST_Posts_Controller convention being followed here.
		$previous = $this->prepare_filter_for_response( maybe_unserialize( $filter->post_content ) );

		$deleted = wp_delete_post( $post_id, true );

		if ( ! $deleted ) {
			return new WP_Error(
				'wcapf_delete_failed',
				__( 'There was a problem deleting the filter, please try again.', 'wc-ajax-product-filter' ),
				array( 'status' => 500 )
			);
		}

		return rest_ensure_response(
			array(
				'deleted'  => true,
				'previous' => $previous,
			)
		);
	}

	/**
	 * Builds the full form-resource representation that get/update return.
	 * Same shape from both endpoints — `WP_REST_Posts_Controller::prepare_
	 * item_for_response` pattern.
	 *
	 * TODO (Phase 1 wp.data): `filter_keys` is a global catalog, not part of
	 * the form resource. Move to GET /filter-keys once wp.data stores can
	 * invalidate after a save.
	 *
	 * @param \WP_Post $form The form post.
	 *
	 * @return array
	 */
	private function prepare_form_for_response( \WP_Post $form ): array {
		$child_filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'any',
				'nopaging'    => true,
				'post_parent' => $form->ID,
				'order'       => 'ASC',
				'orderby'     => 'menu_order',
			)
		);

		$filters = array();
		foreach ( $child_filters as $filter_post ) {
			if ( ! $filter_post || 'wcapf-filter' !== $filter_post->post_type ) {
				continue;
			}
			$filters[] = $this->prepare_filter_for_response( maybe_unserialize( $filter_post->post_content ) );
		}

		return array(
			'id'          => $form->ID,
			'title'       => $form->post_title,
			'filter_keys' => wcapf()->api->filter_keys(),
			'filters'     => $filters,
			'settings'    => apply_filters( 'wcapf_parse_form_settings', maybe_unserialize( $form->post_content ) ),
		);
	}

	/**
	 * Inflates a stored filter row into the {value,label} shape the React UI
	 * expects (term/author/role lookups + manual_options name resolution).
	 *
	 * @param array $filter The stored filter row.
	 *
	 * @return array
	 */
	private function prepare_filter_for_response( $filter ): array {
		// Defensive: legacy/empty post_content can unserialize to a string or
		// scalar. The rest of this method assumes an array shape.
		$filter = (array) $filter;

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
	 * Sanitize callback for the `settings` arg on create/update routes.
	 * Runs sanitize_text_field across each scalar key (nested fields like
	 * `form_locations` get wiped here and re-validated by pro via the
	 * `wcapf_sanitize_form_settings` filter, which sees both the sanitized +
	 * raw shapes).
	 *
	 * @param mixed $raw The raw param value from the request.
	 *
	 * @return array
	 */
	public function sanitize_form_settings( $raw ): array {
		$raw = (array) $raw;

		return apply_filters(
			'wcapf_sanitize_form_settings',
			array_map( 'sanitize_text_field', $raw ),
			$raw
		);
	}
}
