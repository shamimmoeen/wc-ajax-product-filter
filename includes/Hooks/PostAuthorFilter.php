<?php
/**
 * Post-author filter behavior hooks.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Hooks
 * @author     Mainul Hassan
 */

namespace WCAPF\Hooks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adjusts the post-author filter's user query based on field settings.
 */
class PostAuthorFilter {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_filter( 'wcapf_get_post_author_args', array( $this, 'limit_post_authors' ), 10, 2 );
		add_filter( 'wcapf_get_post_author_args', array( $this, 'sort_post_authors' ), 15, 2 );
	}

	/**
	 * Limits the list of post authors based on filter settings.
	 *
	 * @param array                 $args           The arguments of the get_users() function.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function limit_post_authors( array $args, $field_instance ): array {
		$limit_options = $field_instance->get_sub_field_value( 'limit_options' );

		if ( 'manual_entry' === $field_instance->get_options ) {
			return $args;
		}

		if ( 'include' === $limit_options ) {
			$args['include'] = $field_instance->get_sub_field_value( 'include_authors' );
		} elseif ( 'exclude' === $limit_options ) {
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			$args['exclude'] = $field_instance->get_sub_field_value( 'exclude_authors' );
		} elseif ( 'user_roles' === $limit_options ) {
			$args['role__in'] = $field_instance->get_sub_field_value( 'include_user_roles' );
		}

		return $args;
	}

	/**
	 * Sorts the list of post authors based on filter settings.
	 *
	 * @param array                 $args           The arguments of the get_users() function.
	 * @param \WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	public function sort_post_authors( array $args, $field_instance ): array {
		$allowed   = array( 'id', 'name' );
		$order_by  = $field_instance->get_sub_field_value( 'post_author_order_by' );
		$order_dir = $field_instance->get_sub_field_value( 'post_author_order_dir' );

		if ( in_array( $order_by, $allowed, true ) ) {
			$args['orderby'] = $order_by;
		}

		if ( 'asc' === $order_dir ) {
			$args['order'] = 'ASC';
		} else {
			$args['order'] = 'DESC';
		}

		return $args;
	}
}
