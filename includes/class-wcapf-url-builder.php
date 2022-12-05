<?php
/**
 * The filter url builder class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_URL_Builder class.
 *
 * @since 4.0.0
 */
class WCAPF_URL_Builder {

	private $filter_keys;

	private $filter_key;

	/**
	 * @var bool|mixed
	 */
	private $enable_multiple;

	private $base_url;

	private $query_vars;

	public function __construct( $filter_key, $enable_multiple = false ) {
		global $wcapf_filter_keys;

		$this->filter_keys     = $wcapf_filter_keys;
		$this->filter_key      = $filter_key;
		$this->enable_multiple = $enable_multiple;
		$this->base_url        = $this->base_url();
		$this->query_vars      = $this->set_query();
	}

	/**
	 * Returns the base url.
	 *
	 * @return string
	 */
	private function base_url() {
		global $wcapf_form;

		return $wcapf_form['base_url'];
	}

	/**
	 * Sets the query vars after sorting.
	 *
	 * @return array
	 */
	private function set_query() {
		$vars = $_GET;

		// We need to preserve the order of active filter key.
		if ( ! isset( $vars[ $this->filter_key ] ) ) {
			$vars[ $this->filter_key ] = array();
		}

		// Sort the filter keys in query.
		$sorted = array();

		foreach ( $this->filter_keys as $filter_key ) {
			if ( ! isset( $vars[ $filter_key ] ) ) {
				continue;
			}

			$sorted[ $filter_key ] = $vars[ $filter_key ];
			unset( $vars[ $filter_key ] );
		}

		return array_merge( $sorted, $vars );
	}

	/**
	 * Gets the filter url.
	 *
	 * @param $value
	 * @param $is_active
	 *
	 * @return string
	 */
	public function get_filter_url( $value, $is_active ) {
		// If no value is provided then we need to remove the filter key from url.
		if ( ! $value ) {
			return $this->url_without_current_filter();
		}

		$values = $this->active_values();

		if ( $this->enable_multiple ) {
			if ( $is_active ) {
				// Remove.
				$values = array_diff( $values, array( $value ) );

				if ( ! $values ) {
					return $this->url_without_current_filter();
				}
			} else {
				// Add.
				$values[] = $value;
			}
		} else {
			if ( $is_active ) {
				return $this->url_without_current_filter();
			}

			$values = array( $value );
		}

		$vars = $this->query_vars;

		$vars[ $this->filter_key ] = implode( ',', $values );

		return add_query_arg( $vars, $this->base_url );
	}

	/**
	 * @return string
	 */
	private function url_without_current_filter() {
		$vars = $this->query_vars;

		if ( isset( $vars[ $this->filter_key ] ) ) {
			unset( $vars[ $this->filter_key ] );
		}

		return add_query_arg( $vars, $this->base_url );
	}

	private function active_values() {
		$value = isset( $_GET[ $this->filter_key ] ) ? $_GET[ $this->filter_key ] : '';

		return $value ? explode( ',', $value ) : array();
	}

	/**
	 * @return string
	 */
	public function get_dropdown_url() {
		$vars = $this->query_vars;

		$vars[ $this->filter_key ] = '%s';

		return add_query_arg( $vars, $this->base_url );
	}

	/**
	 * @return string
	 */
	public function get_range_url() {
		$vars = $this->query_vars;

		$vars[ $this->filter_key ] = '%1s~%2s';

		return add_query_arg( $vars, $this->base_url );
	}

	/**
	 * @return string
	 */
	public function get_clear_filter_url() {
		$vars = $this->query_vars;

		unset( $vars[ $this->filter_key ] );

		return add_query_arg( $vars, $this->base_url );
	}

}
