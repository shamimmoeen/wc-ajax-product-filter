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
	 * The product status option placeholder template.
	 *
	 * @return void
	 */
	public function product_status_option_placeholder_template() {
		$this->product_status_option_markup( true );
	}

	/**
	 * The product status option row markup.
	 *
	 * @param bool  $is_placeholder Determines if return the placeholder template or not.
	 * @param array $data           The template data.
	 *
	 * @return void
	 */
	private function product_status_option_markup( $is_placeholder, $data = array() ) {
		if ( $is_placeholder ) {
			$value = '{{ data.value }}';
			$label = '{{ data.label }}';
		} else {
			$value = isset( $data['value'] ) ? sanitize_text_field( $data['value'] ) : '';
			$label = isset( $data['label'] ) ? sanitize_text_field( $data['label'] ) : '';
		}

		WCAPF_Template_Loader::get_instance()->load(
			'admin/field-templates/product-status-option-row',
			array(
				'value' => $value,
				'label' => $label,
			)
		);
	}

	/**
	 * The product status option row.
	 *
	 * @param string $value The value.
	 * @param string $label The label.
	 *
	 * @return void
	 */
	public function product_status_option_row( $value = '', $label = '' ) {
		$data = array(
			'value' => $value,
			'label' => $label,
		);

		$this->product_status_option_markup( false, $data );
	}

}
