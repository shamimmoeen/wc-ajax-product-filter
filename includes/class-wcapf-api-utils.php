<?php
/**
 * The api utility class.
 *
 * TODO: Maybe delete.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_API_Utils class.
 *
 * @since 4.0.0
 */
class WCAPF_API_Utils {

	/**
	 * Gets the filter data for given id.
	 *
	 * @param int $id The filter id.
	 *
	 * @return array
	 */
	public static function get_filter_data( $id ) {
		$field_data = get_post_meta( $id, '_field_data', true );

		return array(
			'id'            => $id,
			'field_key'     => $field_data['field_key'],
			'type'          => $field_data['type'],
			'taxonomy'      => isset( $field_data['taxonomy'] ) ? $field_data['taxonomy'] : '',
			'meta_key'      => isset( $field_data['meta_key'] ) ? $field_data['meta_key'] : '',
			'post_property' => isset( $field_data['post_property'] ) ? $field_data['post_property'] : '',
			'title'         => get_the_title( $id ),
		);
	}

	/**
	 * Gets the filters.
	 *
	 * @return array
	 */
	public static function get_filters() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'nopaging'    => true,
			// 'posts_per_page' => 3,
			'post_status' => 'any',
			'fields'      => 'ids',
		);

		$filters = get_posts( $args );

		$filters_data = array();

		foreach ( $filters as $filter_id ) {
			$filters_data[] = self::get_filter_data( $filter_id );
		}

		return $filters_data;
	}

}
