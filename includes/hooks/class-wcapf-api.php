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
		add_action( 'wp_ajax_nopriv_get_available_filters', array( $this, 'get_available_filters' ) );
		add_action( 'wp_ajax_get_available_filters', array( $this, 'get_available_filters' ) ); // todo
		add_action( 'wp_ajax_nopriv_save_filter_form', array( $this, 'save_filter_form' ) );
		add_action( 'wp_ajax_save_filter_form', array( $this, 'save_filter_form' ) ); // todo
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

	public function save_filter_form() {
		wp_send_json_success('hello aurin');
	}

}

WCAPF_API::instance();
