<?php
/**
 * The product filter utility class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Product_Filter_Utils class.
 *
 * @since 3.0.0
 */
class WCAPF_Product_Filter_Utils {

	/**
	 * Gets the filter keys.
	 *
	 * @return array
	 */
	public static function get_taxonomy_filter_keys() {
		$keys = array(
			'product_cat' => array(
				'and' => 'product-cata',
				'or'  => 'product-cato',
			),
			'product_tag' => array(
				'and' => 'product-taga',
				'or'  => 'product-tago',
			),
		);

		$attribute_taxonomies = wc_get_attribute_taxonomies();

		foreach ( $attribute_taxonomies as $attribute_taxonomy ) {
			$name     = $attribute_taxonomy->attribute_name;
			$taxonomy = wc_attribute_taxonomy_name( $name );

			$keys[ $taxonomy ] = array(
				'and' => 'attra-' . $name,
				'or'  => 'attro-' . $name,
			);
		}

		return apply_filters( 'wcapf_taxonomy_filter_keys', $keys );
	}

	/**
	 * Gets the chosen filter values.
	 *
	 * @param array $keys  The filter keys.
	 * @param array $query The url query.
	 *
	 * @return array
	 */
	public static function get_chosen_filter_values( $keys, $query ) {
		$and_query_key     = $keys['and'];
		$or_query_key      = $keys['or'];
		$between_query_key = isset( $keys['between'] ) ? $keys['between'] : ''; // To filter by ranges.
		$value_separator   = ','; // TODO: Use a filter.

		$values     = '';
		$filter_key = '';
		$query_type = '';

		if ( isset( $query[ $and_query_key ] ) ) {
			$filter_key = $and_query_key;
			$values     = $query[ $and_query_key ];
			$query_type = 'and';
		} elseif ( isset( $query[ $or_query_key ] ) ) {
			$filter_key = $or_query_key;
			$values     = $query[ $or_query_key ];
			$query_type = 'or';
		} elseif ( isset( $query[ $between_query_key ] ) ) {
			$filter_key = $between_query_key;
			$values     = $query[ $between_query_key ];
			$query_type = 'between';
		}

		// Check if we have any string(including 0) in the url.
		if ( ! strlen( $values ) ) {
			return array();
		}

		$filter_values = explode( $value_separator, $values );

		return array( $filter_values, $filter_key, $query_type );
	}

	/**
	 * Combine the values of an associative array.
	 *
	 * @param string $query_type The query type.
	 * @param array  $values     The associative array of values.
	 *
	 * @return array|false|mixed
	 */
	public static function combine_values( $query_type, $values ) {
		$combined = array();

		if ( ! $values ) {
			return $combined;
		}

		if ( 2 > count( $values ) ) {
			return reset( $values );
		}

		if ( 'or' === $query_type ) {
			$combined = call_user_func_array( 'array_merge', $values );
		} else {
			$combined = call_user_func_array( 'array_intersect', $values );
		}

		return $combined;
	}

	/**
	 * Gets the product status options.
	 *
	 * @return array
	 */
	public static function get_product_status_options() {
		$options = array(
			'featured' => __( 'Featured', 'wc-ajax-product-filter' ),
			'on_sale'  => __( 'On sale', 'wc-ajax-product-filter' ),
		);

		return apply_filters( 'wcapf_product_status_options', $options );
	}

	/**
	 * The product status option row markup.
	 *
	 * @param array $data The template data.
	 *
	 * @return void
	 */
	public function product_status_option_markup( $data = array() ) {
		WCAPF_Template_Loader::get_instance()->load( 'admin/field-templates/product-status-option-row', $data );
	}

}
