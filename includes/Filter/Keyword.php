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

	/**
	 * Renders the keyword search box.
	 *
	 * @return void
	 */
	public function render(): void {
		$this->before_filter();

		$placeholder = wcapf()->settings->get(
			'keyword_filter_placeholder',
			__( 'Search products', 'wc-ajax-product-filter' )
		);
		$value       = wcapf()->active_filters->applied_keyword();
		$with_cross  = true;

		$show_title     = $this->field->get_sub_field_value( 'show_title' );
		$show_clear_btn = $this->field->get_sub_field_value( 'show_clear_btn' );

		// Don't show the cross icon to clear the input when a clear button is enabled in the heading.
		if ( $show_title && $show_clear_btn ) {
			$with_cross = false;
		}

		$url_builder = new \WCAPF\UrlBuilder( $this->filter_key );

		printf(
			'<div class="wcapf-keyword-filter-wrapper" data-filter-url="%1$s" data-clear-filter-url="%2$s">',
			esc_url( $url_builder->get_filter_url_with_placeholder() ),
			esc_url( $url_builder->get_clear_filter_url() )
		);

		$search_box_classes = 'wcapf-search-box with-icon icon-right';

		if ( $with_cross ) {
			$search_box_classes .= ' with-cross';
		}

		\WCAPF_Template_Loader::get_instance()->load(
			'search-box',
			array(
				'placeholder'        => $placeholder,
				'value'              => $value,
				'icon_position'      => 'right',
				'with_cross'         => $with_cross,
				'search_box_classes' => $search_box_classes,
			)
		);

		echo '</div>';

		$this->after_filter();
	}
}
