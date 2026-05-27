<?php
/**
 * Resolves a stored filter entry to its element instance.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Element
 * @author     Mainul Hassan
 */

namespace WCAPF\Element;

use WCAPF\Filter;
use WCAPF\FormFilter;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Maps a stored filter entry to the element that handles it. Pro and third
 * parties add or override elements through the wcapf_element filter.
 */
class Registry {

	/**
	 * Builds the element for the given stored entry, or null when its type has
	 * no element.
	 *
	 * @param array $entry The stored filter entry.
	 *
	 * @return Element|null
	 */
	public static function resolve( array $entry ) {
		$field = new FormFilter( $entry );

		$element = null;

		switch ( $field->filter_type ) {
			case 'taxonomy':
				$element = 'rating' === $field->type
					? new Filter\Rating( $entry )
					: new Filter\Taxonomy( $entry );
				break;

			case 'product-status':
				$element = new Filter\ProductStatus( $entry );
				break;

			case 'post-author':
				$element = new Filter\PostAuthor( $entry );
				break;

			case 'keyword':
				$element = new Filter\Keyword( $entry );
				break;

			case 'price':
				$element = new Filter\Price( $entry );
				break;

			case 'post-meta':
				$element = new Filter\PostMeta( $entry );
				break;
		}

		/**
		 * Filters the resolved element for a stored filter entry.
		 *
		 * Return a different Element to override a built-in type, or build one
		 * for a custom type when the core switch returns null.
		 *
		 * @param Element|null $element The resolved element, or null for an unknown type.
		 * @param array        $entry   The stored filter entry.
		 */
		return apply_filters( 'wcapf_element', $element, $entry );
	}
}
