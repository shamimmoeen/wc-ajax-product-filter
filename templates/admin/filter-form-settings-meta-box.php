<?php
/**
 * The filter form settings meta box template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

?>

<div class="postbox">
	<div class="postbox-header">
		<h2><?php esc_html_e( 'Filter Settings', 'wc-ajax-product-filter' ); ?></h2>
	</div>
	<div class="inside">
		<p class="description"><?php esc_html_e( 'These will override the filter settings.', 'wc-ajax-product-filter' ); ?></p>

		<div class="wcapf-form-field">
			<div class="wcapf-form-sub-field show-title">
				<div class="wcapf-form-sub-field-label">
					<label for="show_title">
						<?php esc_html_e( 'Show Title', 'wc-ajax-product-filter' ); ?>
					</label>
				</div>
				<div class="wcapf-wrapper">
					<input type="checkbox" name="show_title" id="show_title">
				</div>
			</div>

			<div class="wcapf-form-sub-field enable-accordion">
				<div class="wcapf-form-sub-field-label">
					<label for="enable_accordion">
						<?php esc_html_e( 'Enable Accordion', 'wc-ajax-product-filter' ); ?>
					</label>
				</div>
				<div class="wcapf-wrapper">
					<input type="checkbox" name="enable_accordion" id="enable_accordion">
				</div>
			</div>

			<div class="wcapf-form-sub-field show-clear-button">
				<div class="wcapf-form-sub-field-label">
					<label for="show_clear_button">
						<?php esc_html_e( 'Show Clear Button', 'wc-ajax-product-filter' ); ?>
					</label>
				</div>
				<div class="wcapf-wrapper">
					<input type="checkbox" name="show_clear_button" id="show_clear_button">
				</div>
			</div>
		</div>
	</div>
</div>
