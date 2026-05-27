<?php
/**
 * Capability for an element that narrows the product set.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Element
 * @author     Mainul Hassan
 */

namespace WCAPF\Element;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Implemented by filter elements: they contribute SQL clauses for the active
 * selection and list their own option items to render.
 */
interface Filterable {

	/**
	 * The chosen-filter data (join, where, values, active filters) for the
	 * element's active selection in the current request.
	 *
	 * @return array
	 */
	public function clauses(): array;

	/**
	 * The option items to render for this filter.
	 *
	 * @return array
	 */
	public function items(): array;
}
