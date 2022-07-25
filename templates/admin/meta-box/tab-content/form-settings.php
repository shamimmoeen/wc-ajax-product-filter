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
	<div class="wcapf-form-sub-field show-title">
		<div class="wcapf-form-sub-field-label">
			<label for="show_title">
				<?php esc_html_e( 'Disable auto submission', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<input type="checkbox" name="" id="">
		</div>
	</div>
</div>
