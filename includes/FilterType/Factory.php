<?php
/**
 * Resolves a filter type to the class that handles it.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/FilterType
 * @author     Mainul Hassan
 */

namespace WCAPF\FilterType;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Maps a filter-type string to its handler class. Pro and third parties add or
 * override entries through the wcapf_filter_types filter.
 */
class Factory {

	/**
	 * The filter-type string to handler-class map.
	 *
	 * @return array
	 */
	public static function types() {
		$types = array(
			'taxonomy' => Taxonomy::class,
		);

		/**
		 * Filters the registered filter types.
		 *
		 * Add a type with $types['my-type'] = My_Type::class, or override a
		 * built-in type by re-assigning its key.
		 *
		 * @param array $types Map of filter-type string => handler class name.
		 */
		return apply_filters( 'wcapf_filter_types', $types );
	}

	/**
	 * Builds the handler for the given field, or null when the type has no handler.
	 *
	 * @param \WCAPF\FormFilter   $field         The field instance.
	 * @param \WCAPF\QueryBuilder $query_builder The query builder.
	 *
	 * @return \WCAPF\FilterType\AbstractFilterType|null
	 */
	public static function make( \WCAPF\FormFilter $field, \WCAPF\QueryBuilder $query_builder ) {
		$types = self::types();
		$type  = $field->filter_type;

		if ( ! isset( $types[ $type ] ) ) {
			return null;
		}

		$class = $types[ $type ];

		return new $class( $field, $query_builder );
	}
}
