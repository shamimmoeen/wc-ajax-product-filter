<?php
/**
 * Abstract base for every `wcapf/v1` REST controller. Holds the namespace
 * constant, the shared permission callback, and the rest_api_init binding.
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

/**
 * Base class for `wcapf/v1` REST controllers.
 */
abstract class Controller {

	public const REST_NAMESPACE = 'wcapf/v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Permission check shared by every `wcapf/v1` route.
	 *
	 * @return bool
	 */
	public function permission_check(): bool {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Registers the routes this controller owns. Implementations call
	 * register_rest_route once per route, using self::REST_NAMESPACE.
	 *
	 * @return void
	 */
	abstract public function register_routes(): void;
}
