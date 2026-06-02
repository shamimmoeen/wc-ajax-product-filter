<?php
/**
 * Read-only data sources backing the React admin's AsyncPaginate selectors
 * and the manual-options browse modal. Each route is a thin
 * param-to-`get_*()` translator — orthogonal query params do the talking
 * (search, page, per_page, plus per-resource filters like taxonomy,
 * roles, capability, only_parent).
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
use WP_REST_Response;
use WP_REST_Server;

/**
 * Routes: GET /terms, /authors, /pages, /products, /meta-values.
 */
class DataSourcesController extends Controller {

	private const DEFAULT_PER_PAGE = 20;

	/**
	 * Registers the data-source routes.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/terms',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_terms' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/authors',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_authors' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/pages',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_pages' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/products',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_products' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/meta-values',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_meta_values' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);
	}

	/**
	 * GET /terms — taxonomy terms list. Orthogonal params: search, page,
	 * per_page, only_parent. The browse-options modal calls with a high
	 * per_page (capped by `wcapf_max_number_of_terms_for_browse_options_modal`);
	 * the AsyncPaginate dropdown sends search + page + default per_page.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_terms( WP_REST_Request $request ): WP_REST_Response {
		$taxonomy = sanitize_text_field( (string) $request->get_param( 'taxonomy' ) );
		$search   = sanitize_text_field( (string) $request->get_param( 'search' ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page = $this->per_page( $request );

		/**
		 * Caps the per_page on this route.
		 *
		 * Originally added to keep the browse-options modal from freezing on
		 * sites with thousands of terms. The proper long-term fix is
		 * pagination/virtual-scroll in the React modal — at that point this
		 * filter goes away.
		 *
		 * @deprecated 3.0.0 To be removed once the browse-options modal
		 *                   supports pagination on the React side.
		 */
		$per_page = min( $per_page, absint( apply_filters( 'wcapf_max_number_of_terms_for_browse_options_modal', 99 ) ) );

		$args = array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'search'     => $search,
			'number'     => $per_page,
			'offset'     => ( $page - 1 ) * $per_page,
			'fields'     => 'id=>name',
		);

		if ( 'true' === sanitize_text_field( (string) $request->get_param( 'only_parent' ) ) ) {
			$args['include'] = $this->terms_with_children( $taxonomy );
		}

		$terms = get_terms( $args );

		return rest_ensure_response( $this->terms_to_options( $terms ) );
	}

	/**
	 * GET /authors — users list. Orthogonal params: search, page, per_page,
	 * roles[], capability. Modal callers send roles[]; dropdown callers send
	 * capability=edit_posts + search + page.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_authors( WP_REST_Request $request ): WP_REST_Response {
		$roles      = array_map( 'sanitize_text_field', (array) $request->get_param( 'roles' ) );
		$capability = sanitize_text_field( (string) $request->get_param( 'capability' ) );
		$search     = sanitize_text_field( (string) $request->get_param( 'search' ) );
		$page       = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page   = $this->per_page( $request );

		$args = array(
			'fields' => array( 'ID', 'display_name' ),
			'number' => $per_page,
			'offset' => ( $page - 1 ) * $per_page,
		);

		if ( $roles ) {
			$args['role__in'] = $roles;
		}

		if ( $capability ) {
			$args['capability'] = $capability;
		}

		// Default to "users who can author posts" when no explicit filter is
		// given — matches the pre-v3 dropdown behavior.
		if ( ! $roles && ! $capability ) {
			$args['capability'] = 'edit_posts';
		}

		if ( $search ) {
			$args['search'] = '*' . $search . '*';
		}

		$users = get_users( $args );

		return rest_ensure_response( $this->users_to_options( $users ) );
	}

	/**
	 * GET /pages — paginated page search.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_pages( WP_REST_Request $request ): WP_REST_Response {
		return rest_ensure_response( $this->posts_to_options( $this->run_post_query( 'page', $request ) ) );
	}

	/**
	 * GET /products — paginated product search.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_products( WP_REST_Request $request ): WP_REST_Response {
		return rest_ensure_response( $this->posts_to_options( $this->run_post_query( 'product', $request ) ) );
	}

	/**
	 * GET /meta-values — distinct values for a meta key.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_meta_values( WP_REST_Request $request ): WP_REST_Response {
		$meta_key = sanitize_text_field( (string) $request->get_param( 'meta_key' ) );

		$values   = wcapf()->data->available_meta_values( $meta_key );
		$response = array();

		if ( $values ) {
			foreach ( $values as $value ) {
				$response[] = array(
					'label' => $value,
					'value' => $value,
				);
			}
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Reads `per_page` off the request, falling back to the controller default.
	 *
	 * @param WP_REST_Request $request The request.
	 *
	 * @return int
	 */
	private function per_page( WP_REST_Request $request ): int {
		$value = absint( $request->get_param( 'per_page' ) );

		return $value > 0 ? $value : self::DEFAULT_PER_PAGE;
	}

	/**
	 * Returns the term IDs in `$taxonomy` that have at least one child term.
	 *
	 * Single underlying query via `fields => id=>parent` — array_filter drops
	 * the 0 markers (top-level terms have parent 0), array_unique dedupes
	 * (one parent can show up once per child).
	 *
	 * @param string $taxonomy The taxonomy slug.
	 *
	 * @return int[]
	 */
	private function terms_with_children( string $taxonomy ): array {
		$pairs = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
				'fields'     => 'id=>parent',
			)
		);

		if ( ! $pairs || is_wp_error( $pairs ) ) {
			return array();
		}

		return array_values( array_unique( array_filter( $pairs ) ) );
	}

	/**
	 * Runs a `WP_Query` for the given post type with `search`, `page`,
	 * `per_page` taken off the request.
	 *
	 * @param string          $post_type The post type slug.
	 * @param WP_REST_Request $request   The request.
	 *
	 * @return \WP_Post[]
	 */
	private function run_post_query( string $post_type, WP_REST_Request $request ): array {
		$search   = sanitize_text_field( (string) $request->get_param( 'search' ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ) );
		$per_page = $this->per_page( $request );

		$query = new \WP_Query(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				's'              => $search,
				'posts_per_page' => $per_page,
				'paged'          => $page,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		return $query->posts;
	}

	/**
	 * Maps a `get_terms( ['fields' => 'id=>name'] )` result to the React
	 * option shape.
	 *
	 * @param array|\WP_Error $terms The terms result.
	 *
	 * @return array
	 */
	private function terms_to_options( $terms ): array {
		if ( ! $terms || is_wp_error( $terms ) ) {
			return array();
		}

		$options = array();
		foreach ( $terms as $term_id => $term_name ) {
			$options[] = array(
				'label' => $term_name,
				'value' => absint( $term_id ),
			);
		}

		return $options;
	}

	/**
	 * Maps a `get_users( ['fields' => ['ID', 'display_name']] )` result to
	 * the React option shape.
	 *
	 * @param array $users The users result.
	 *
	 * @return array
	 */
	private function users_to_options( array $users ): array {
		$options = array();
		foreach ( $users as $user ) {
			$options[] = array(
				'label' => $user->display_name,
				'value' => (int) $user->ID,
			);
		}

		return $options;
	}

	/**
	 * Maps `WP_Query`'s post objects to the React option shape.
	 *
	 * @param \WP_Post[] $posts The post objects.
	 *
	 * @return array
	 */
	private function posts_to_options( array $posts ): array {
		$options = array();
		foreach ( $posts as $post ) {
			$options[] = array(
				'label' => $post->post_title,
				'value' => $post->ID,
			);
		}

		return $options;
	}
}
