<?php
/**
 * The reset-button component element.
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
 * Renders the "reset filters" button.
 */
class ResetButton extends AbstractElement {

	/**
	 * The admin grouping category.
	 *
	 * @return string
	 */
	public static function category(): string {
		return 'component';
	}

	/**
	 * Outputs the reset-button markup.
	 *
	 * @return void
	 */
	public function render(): void {
		$args = wcapf()->active_filters->prepare_reset_button_args(
			array(
				'unique_id'   => $this->field->filter_id,
				'btn_label'   => wcapf()->settings->reset_button_label(),
				'show_always' => $this->field->get_sub_field_value( 'show_if_empty' ),
			)
		);

		\WCAPF_Template_Loader::get_instance()->load( 'reset-button', $args );
	}
}
