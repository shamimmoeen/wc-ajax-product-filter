<?php
/**
 * The active-filters component element.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Component
 * @author     Mainul Hassan
 */

namespace WCAPF\Component;

use WCAPF\Element\AbstractElement;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the active-filters bar: the chips for the current selection plus the
 * optional title and clear-all button.
 */
class ActiveFilters extends AbstractElement {

	/**
	 * The admin grouping category.
	 *
	 * @return string
	 */
	public static function category(): string {
		return 'component';
	}

	/**
	 * Outputs the active-filters markup.
	 *
	 * @return void
	 */
	public function render(): void {
		$args = wcapf()->active_filters->prepare_args(
			array(
				'unique_id'            => $this->field->filter_id,
				'title'                => $this->field->get_sub_field_value( 'title' ),
				'show_title'           => $this->field->get_sub_field_value( 'show_title' ),
				'layout'               => $this->field->get_sub_field_value( 'active_filters_layout' ),
				'empty_message'        => $this->field->get_sub_field_value( 'empty_filter_message' ),
				'show_clear_btn'       => $this->field->get_sub_field_value( 'show_clear_btn' ),
				'clear_all_btn_label'  => wcapf()->settings->clear_all_button_label(),
				'clear_all_btn_layout' => $this->field->get_sub_field_value( 'clear_all_btn_layout' ),
			)
		);

		\WCAPF_Template_Loader::get_instance()->load( 'active-filters', $args );
	}
}
