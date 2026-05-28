<?php
/**
 * Frontend filter form renderer.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

namespace WCAPF;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the configured filter form on the frontend. Each filter entry resolves
 * to an Element through the registry; the element owns its own rendering.
 */
class Form {

	/**
	 * The form array.
	 *
	 * @var array
	 */
	protected $form;

	/**
	 * Initializes the form instance.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->form = $this->retrieve_form();
	}

	/**
	 * Retrieves the current form data from the global the plugin prepared.
	 *
	 * @return array
	 */
	protected function retrieve_form() {
		global $wcapf_form;

		return $wcapf_form;
	}

	/**
	 * Renders the filter form: outputs the wrapper and delegates each filter
	 * entry to its element.
	 *
	 * @return void
	 */
	public function render_form() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$form_id      = isset( $this->form['form_id'] ) ? $this->form['form_id'] : '';
		$form_classes = 'wcapf-form wcapf-form-' . sanitize_html_class( $form_id );

		printf(
			'<form class="%1$s" data-id="%2$s" novalidate>',
			esc_attr( $form_classes ),
			esc_attr( $form_id )
		);

		do_action( 'wcapf_before_form_filters', $form_id );

		$filters = isset( $this->form['filters'] ) ? $this->form['filters'] : array();
		$filters = apply_filters( 'wcapf_form_filters', $filters, $this->form );

		foreach ( $filters as $filter ) {
			$field_data = isset( $filter['field'] ) ? $filter['field'] : array();

			if ( empty( $field_data ) || ! is_array( $field_data ) ) {
				continue;
			}

			$element = Element\Registry::resolve( $field_data );

			if ( $element ) {
				$element->render();
			}
		}

		if ( wcapf()->settings->is_debug_mode_enabled() ) {
			$this->render_debug_footer( $form_id, $filters );
		}

		do_action( 'wcapf_after_form_filters', $form_id );

		echo '</form><!-- .wcapf-filter-form -->';

		$this->set_done();
	}

	/**
	 * Outputs the debug-mode footer: an edit link when filters exist, or a
	 * "form is empty" message otherwise.
	 *
	 * @param int   $form_id Form post ID.
	 * @param array $filters Filter entries.
	 *
	 * @return void
	 */
	private function render_debug_footer( $form_id, $filters ) {
		$edit_url = wcapf()->admin_url->form_edit( $form_id );

		if ( ! $filters ) {
			$message = sprintf(
				/* translators: %s: Form edit URL. */
				__(
					'The form is empty. Please add some filters by editing the form <a href="%s">here</a>.',
					'wc-ajax-product-filter'
				),
				esc_url( $edit_url )
			);

			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped inside wcapf()->settings->debug_message().
			echo wcapf()->settings->debug_message( $message );
		} else {
			printf(
				'<p><a href="%1$s">%2$s</a></p>',
				esc_url( $edit_url ),
				esc_html__( 'Edit form', 'wc-ajax-product-filter' )
			);
		}
	}

	/**
	 * Determines whether the form can be rendered. Prevents rendering when the
	 * form data is missing or when the form has already been rendered.
	 *
	 * @return bool
	 */
	private function should_we_proceed() {
		if ( ! $this->form ) {
			return false;
		}

		if ( isset( $this->form['rendered'] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Marks the current form as rendered so a second render is a no-op.
	 *
	 * @return void
	 */
	protected function set_done() {
		global $wcapf_form;

		$wcapf_form['rendered'] = true;
	}
}
