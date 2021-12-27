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

		return apply_filters( 'wcapf_filter_keys', $keys );
	}

	/**
	 * Gets the filter keys for the product price filter.
	 * 
	 * TODO: Refactor this.
	 *
	 * @return string[][]
	 */
	public static function get_price_filter_keys() {
		$key = '_price';

		return array(
			$key => array(
				'and' => $key . 'a',
				'or'  => $key . 'o',
			),
		);
	}

}
