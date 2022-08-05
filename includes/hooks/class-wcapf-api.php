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
		add_action( 'wp_ajax_get_filter_preview', array( $this, 'get_filter_preview' ) );
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
		$post_id   = 242; // TODO
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
		$post_id       = 242; // TODO
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
		$post_id = 242; // TODO

		ob_start();

		echo do_shortcode( '[wcapf_filter_form id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

	public function get_filter_preview() {
		$post_id = 65; // TODO

		ob_start();

		echo do_shortcode( '[wcapf_filter id=' . $post_id . ']' );

		$preview = ob_get_clean();

		wp_send_json_success( $preview );
	}

}

WCAPF_API::instance();
