<?php
/**
 * The keyword filter element.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Filter
 * @author     Mainul Hassan
 */

namespace WCAPF\Filter;

use WCAPF\Element\Filterable;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filters products by a search keyword. It contributes no JOIN/WHERE of its own;
 * the keyword is fed into the product query's search term (see Shop::set_query).
 */
class Keyword extends AbstractFilter implements Filterable {

	/**
	 * Builds the chosen-filter data for the active keyword.
	 *
	 * @return array
	 */
	public function clauses(): array {
		$value = $this->selected_value();

		$prefix = wcapf()->settings->keyword_filter_prefix();

		return array(
			'values'         => array( $value ),
			'filter_key'     => $this->filter_key,
			'filter_id'      => $this->field->filter_id,
			'active_filters' => array( $value => $prefix . ' ' . $value ),
		);
	}

	/**
	 * The keyword filter renders an input box, not an option list.
	 *
	 * @return array
	 */
	public function items(): array {
		return array();
	}
}
