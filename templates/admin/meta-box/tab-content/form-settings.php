<?php
/**
 * The form settings template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box/tab-content
 * @author     wptools.io
 */

$data = get_post_meta( get_the_ID(), '_form_data', true );

?>

<div class="wcapf-form-field">
	<div class="wcapf-form-sub-field show-form-title">
		<div class="wcapf-form-sub-field-label">
			<label for="show_form_title">
				<?php esc_html_e( 'Show form title', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<input type="checkbox" name="show_form_title" id="show_form_title" value="1">
		</div>
	</div>

	<div class="wcapf-form-sub-field wcapf-form-sub-field-radio wcapf-form-sub-field-radio-row form-submission">
		<div class="wcapf-form-sub-field-label">
			<label for="form_submission">
				<?php esc_html_e( 'Form submission', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<div>
				<label>
					<input type="radio" name="form_submission" id="form_submission" value="immediate">
					<?php esc_html_e( 'Immediate', 'wc-ajax-product-filter' ); ?>
				</label>
			</div>
			<div>
				<label>
					<input type="radio" name="form_submission" id="form_submission_submit_btn" value="submit_btn">
					<?php esc_html_e( 'Using a submit button', 'wc-ajax-product-filter' ); ?>
				</label>
			</div>
		</div>
	</div>

	<div class="wcapf-form-sub-field use-ajax">
		<div class="wcapf-form-sub-field-label">
			<label for="use_ajax">
				<?php esc_html_e( 'Disable ajax submission', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<input type="checkbox" name="use_ajax" id="use_ajax" value="1">
		</div>
	</div>
</div>
