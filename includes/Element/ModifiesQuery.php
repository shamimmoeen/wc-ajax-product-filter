<?php
/**
 * Capability for an element that reorders or paginates the product query.
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
 * Implemented by control elements (sort-by, per-page): they adjust the product
 * query rather than narrowing the result set.
 */
interface ModifiesQuery {

	/**
	 * Applies the element's adjustment to the given query.
	 *
	 * @param \WP_Query $query The product query.
	 *
	 * @return void
	 */
	public function modify( \WP_Query $query ): void;
}
