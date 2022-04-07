<?php
/**
 * WCAPF_Filter_Type_Price class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter_Type_Price class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Type_Price extends WCAPF_Filter_Type {

	/**
	 * Post meta
	 *
	 * @var string
	 */
	protected $post_meta;

	/**
	 * Hide empty
	 *
	 * @var bool
	 */
	protected $hide_empty;

	/**
	 * Filter key
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * The way to get the options
	 *
	 * @var string
	 */
	protected $get_options;

	/**
	 * The constructor.
	 *
	 * @param array $field_data The field data.
	 */
	public function __construct( $field_data ) {
		$this->set_properties( $field_data );
	}

	/**
	 * Sets the properties.
	 *
	 * @param array $field_data The field data.
	 *
	 * @return void
	 */
	private function set_properties( $field_data ) {
		$this->filter_key  = 'price';
		$this->post_meta   = '_price';
		$this->get_options = isset( $field_data['get_options'] ) ? $field_data['get_options'] : '';

		$this->hide_empty = false;

		if ( isset( $field_data['hide_empty'] ) ) {
			if ( $field_data['hide_empty'] ) {
				$this->hide_empty = true;
			}
		}
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @source https://wordpress.stackexchange.com/a/54795
	 *
	 * @return string
	 */
	public function get_db_min_price() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MIN( CAST( meta_value as UNSIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			$this->post_meta
		);

		return $wpdb->get_var( $query );
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @source https://wordpress.stackexchange.com/a/54795
	 *
	 * @return string
	 */
	public function get_db_max_price() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MAX( CAST( meta_value as UNSIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			$this->post_meta
		);

		return $wpdb->get_var( $query );
	}

	/**
	 * Prepare the terms for the taxonomy.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		return array();
	}

}
