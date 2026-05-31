<?php
/**
 * Read-only data sources backing the React admin's AsyncPaginate selectors
 * and the manual-options browse modal. The /terms and /authors routes
 * collapse their modal + dropdown variants behind a `?context=modal` flag.
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

use WP_REST_Request;
use WP_REST_Server;

/**
 * Routes: GET /terms, /authors, /pages, /products, /meta-values.
 */
class DataSourcesController extends Controller {

	/**
	 * Registers the data-source routes.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$auth = array( $this, 'permission_check' );

		register_rest_route(
			self::REST_NAMESPACE,
			'/terms',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_terms' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/authors',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_authors' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/pages',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_pages' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/products',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_products' ),
				'permission_callback' => $auth,
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/meta-values',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_meta_values' ),
				'permission_callback' => $auth,
			)
		);
	}

	/**
	 * GET /terms — collapses the modal + dropdown shapes behind ?context=.
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
	 * GET /authors — collapses the modal + dropdown shapes behind ?context=.
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

		$users = get_users(
			array(
				'capability' => 'edit_posts',
				'search'     => $keyword ? '*' . $keyword . '*' : '',
				'fields'     => array( 'ID', 'display_name' ),
				'number'     => $per_page,
				'offset'     => ( $page - 1 ) * $per_page,
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
}
