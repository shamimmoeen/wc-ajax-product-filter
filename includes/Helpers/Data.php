<?php
/**
 * Data helper.
 *
 * Provides the option lists and lookup data the plugin uses to build
 * filter configurations (available meta keys/values, filterable post
 * statuses, time-period presets, display-type options, value formats).
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

use DateTimeImmutable;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Data helper.
 */
class Data {

	/**
	 * Distinct meta keys present on any product post.
	 *
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlDialectInspection
	 *
	 * @source https://stackoverflow.com/a/54017483
	 *
	 * @return array<int, array{value: string, label: string}>
	 */
	public function available_meta_keys(): array {
		global $wpdb;

		$query = "
			SELECT DISTINCT $wpdb->postmeta.meta_key
			FROM $wpdb->postmeta
			INNER JOIN $wpdb->posts
			ON $wpdb->posts.ID = $wpdb->postmeta.post_id
			WHERE $wpdb->posts.post_type = 'product'
			AND $wpdb->postmeta.meta_key IS NOT NULL
			ORDER BY $wpdb->postmeta.meta_key
		";

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Query has no user input; not cached because meta keys change when products are edited.
		$results   = $wpdb->get_col( $query );
		$meta_keys = array();

		foreach ( $results as $result ) {
			$meta_keys[] = array(
				'value' => $result,
				'label' => $result,
			);
		}

		return apply_filters( 'wcapf_available_meta_keys', $meta_keys );
	}

	/**
	 * Distinct values stored under a given meta key for any product post.
	 *
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlDialectInspection
	 *
	 * @source https://wordpress.stackexchange.com/q/9394
	 *
	 * @param string $meta_key The meta key.
	 *
	 * @return array<int, string>
	 */
	public function available_meta_values( string $meta_key ): array {
		global $wpdb;

		$query = $wpdb->prepare(
			"
				SELECT DISTINCT $wpdb->postmeta.meta_value
				FROM $wpdb->postmeta
				INNER JOIN $wpdb->posts
				ON $wpdb->postmeta.post_id = $wpdb->posts.ID
				WHERE $wpdb->posts.post_type = 'product'
				AND $wpdb->postmeta.meta_key = %s
				AND $wpdb->postmeta.meta_value <> ''
				ORDER BY $wpdb->postmeta.meta_value
			",
			$meta_key
		);

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Query is prepared above; not cached because meta values change when products are edited.
		$results = $wpdb->get_col( $query );

		return apply_filters( 'wcapf_product_meta_values', $results, $meta_key );
	}

	/**
	 * Post statuses the plugin will filter products against.
	 *
	 * Shop managers can see private products, so the filter includes them
	 * when the current user has that capability.
	 *
	 * @return array<int, string>
	 */
	public function filterable_post_statuses(): array {
		$post_statuses = array( 'publish' );

		// phpcs:ignore WordPress.WP.Capabilities.Unknown -- "manage_woocommerce" is a valid custom capability added by WooCommerce.
		if ( current_user_can( 'manage_woocommerce' ) ) {
			$post_statuses[] = 'private';
		}

		return apply_filters( 'wcapf_filterable_post_statuses', $post_statuses );
	}

	/**
	 * Predefined time-period options used by the date-range filter.
	 *
	 * When $with_ranges is true, each option includes its computed date range;
	 * otherwise only value→label pairs are returned.
	 *
	 * @param bool $with_ranges Whether to include the computed date ranges.
	 *
	 * @throws \Exception If date parsing fails.
	 *
	 * @return array
	 */
	public function time_period_options( bool $with_ranges = false ): array {
		$options = array();

		$ranges = array(
			'today'        => __( 'Today', 'wc-ajax-product-filter' ),
			'yesterday'    => __( 'Yesterday', 'wc-ajax-product-filter' ),
			'this-week'    => __( 'This week', 'wc-ajax-product-filter' ),
			'last-week'    => __( 'Last week', 'wc-ajax-product-filter' ),
			'this-month'   => __( 'This month', 'wc-ajax-product-filter' ),
			'last-month'   => __( 'Last month', 'wc-ajax-product-filter' ),
			'last-14-days' => __( 'Last 14 days', 'wc-ajax-product-filter' ),
			'last-30-days' => __( 'Last 30 days', 'wc-ajax-product-filter' ),
			'last-90-days' => __( 'Last 90 days', 'wc-ajax-product-filter' ),
			'this-year'    => __( 'This year', 'wc-ajax-product-filter' ),
			'last-year'    => __( 'Last year', 'wc-ajax-product-filter' ),
		);

		$range_separator = $this->range_values_separator();
		$timezone        = wp_timezone();
		$today           = new DateTimeImmutable( 'now', $timezone );
		$format          = 'Y-m-d';

		foreach ( $ranges as $value => $label ) {
			$range = '';

			switch ( $value ) {
				case 'today':
					$start = $today->format( $format );
					$range = $start . $range_separator . $start;

					break;

				case 'yesterday':
					$start = $today->modify( '-1 day' )->format( $format );
					$range = $start . $range_separator . $start;

					break;

				case 'this-week':
					$start = $today->modify( 'monday this week' )->format( $format );
					$end   = $today->modify( 'sunday this week' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-week':
					$start = $today->modify( 'monday last week' )->format( $format );
					$end   = $today->modify( 'sunday last week' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'this-month':
					$start = $today->modify( 'first day of this month' )->format( $format );
					$end   = $today->modify( 'last day of this month' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-month':
					$start = $today->modify( 'first day of last month' )->format( $format );
					$end   = $today->modify( 'last day of last month' )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-14-days':
					$start = $today->modify( '-13 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-30-days':
					$start = $today->modify( '-29 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-90-days':
					$start = $today->modify( '-89 days' )->format( $format );
					$end   = $today->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'this-year':
					$start = $today->setDate( (int) $today->format( 'Y' ), 1, 1 )->format( $format );
					$end   = $today->setDate( (int) $today->format( 'Y' ), 12, 31 )->format( $format );
					$range = $start . $range_separator . $end;

					break;

				case 'last-year':
					$last_year = (int) $today->format( 'Y' ) - 1;
					$start     = $today->setDate( $last_year, 1, 1 )->format( $format );
					$end       = $today->setDate( $last_year, 12, 31 )->format( $format );
					$range     = $start . $range_separator . $end;

					break;
			}

			if ( ! $range ) {
				continue;
			}

			$options[] = array(
				'value' => $value,
				'label' => $label,
				'range' => $range,
			);
		}

		$time_period_options = apply_filters( 'wcapf_time_period_options', $options );

		if ( $with_ranges ) {
			return $time_period_options;
		}

		return wp_list_pluck( $time_period_options, 'label', 'value' );
	}

	/**
	 * The separator used between min/max values in range filter strings.
	 *
	 * @return string
	 */
	public function range_values_separator(): string {
		return '~';
	}

	/**
	 * Display types that use number-based range inputs.
	 *
	 * @return array<int, string>
	 */
	public function number_input_display_types(): array {
		return array( 'range_slider', 'range_number' );
	}
}
