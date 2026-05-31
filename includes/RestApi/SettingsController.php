<?php
/**
 * Plugin settings save route. Owns the sanitize branches the React settings
 * UI relies on (author_roles pluck, sort_by_form to int, everything else as
 * plain text) and the filter-key drag-rename pass.
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

use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Route: POST /settings.
 */
class SettingsController extends Controller {

	/**
	 * Registers the settings route.
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			self::REST_NAMESPACE,
			'/settings',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'save_settings' ),
				'permission_callback' => array( $this, 'permission_check' ),
			)
		);
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
