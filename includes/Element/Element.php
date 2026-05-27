<?php
/**
 * Contract for a form element.
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
 * A form holds elements of three categories — filters, controls and components.
 * Behavior is expressed through capability interfaces (Filterable, ModifiesQuery),
 * not the category; the category only drives the admin grouping.
 */
interface Element {

	/**
	 * The element's request key.
	 *
	 * @return string
	 */
	public function key(): string;

	/**
	 * Outputs the element's frontend markup.
	 *
	 * @return void
	 */
	public function render(): void;

	/**
	 * The admin grouping category: 'filter', 'control' or 'component'.
	 *
	 * @return string
	 */
	public static function category(): string;
}
