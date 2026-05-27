<?php
/**
 * Base class for form elements.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Element
 * @author     Mainul Hassan
 */

namespace WCAPF\Element;

use WCAPF\FormFilter;
use WCAPF\QueryBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Holds an element's stored configuration and the shared helpers every element
 * needs: its request key, configured settings and the shopper's selection.
 */
abstract class AbstractElement implements Element {

	/**
	 * The element's stored configuration.
	 *
	 * @var FormFilter
	 */
	protected $field;

	/**
	 * The query builder used to assemble SQL fragments.
	 *
	 * @var QueryBuilder
	 */
	protected $query_builder;

	/**
	 * Constructor.
	 *
	 * @param array $entry The stored filter entry.
	 */
	public function __construct( array $entry ) {
		$this->field         = new FormFilter( $entry );
		$this->query_builder = new QueryBuilder();
	}

	/**
	 * The element's request key.
	 *
	 * @return string
	 */
	public function key(): string {
		return (string) $this->field->filter_key;
	}

	/**
	 * A configured value from the element's stored settings.
	 *
	 * @param string $name     The setting name.
	 * @param mixed  $fallback The value to use when the setting is unset.
	 *
	 * @return mixed
	 */
	protected function setting( $name, $fallback = '' ) {
		$value = $this->field->get_sub_field_value( $name );

		return '' === $value ? $fallback : $value;
	}

	/**
	 * The raw selected value for this element from the current request, or an
	 * empty string when the element has no selection.
	 *
	 * @return string
	 */
	protected function selected_value(): string {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$url = isset( $_SERVER['QUERY_STRING'] ) ? wp_unslash( $_SERVER['QUERY_STRING'] ) : '';
		parse_str( $url, $query );

		$key = $this->field->filter_key;

		if ( ! isset( $query[ $key ] ) ) {
			return '';
		}

		return sanitize_text_field( $query[ $key ] );
	}
}
