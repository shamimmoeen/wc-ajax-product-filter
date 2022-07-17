<?php
/**
 * The filter form settings tab content.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/filter-form/tab
 * @author     wptools.io
 */

?>

<div class="tab-content tab-settings">
	<p><?php esc_html_e( 'These settings will override the filter settings.', 'wc-ajax-product-filter' ); ?></p>

	<table class="form-table">
		<tbody>
			<tr>
				<th scope="row">
					<label for="show_title">Show Title</label>
				</th>
				<td>
					<input type="checkbox" name="show_title" id="show_title">
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="enable_accordion">Enable Accordion</label>
				</th>
				<td>
					<input type="checkbox" name="enable_accordion" id="enable_accordion">
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="soft_limit">Soft Limit</label>
				</th>
				<td>
					<input type="checkbox" name="soft_limit" id="soft_limit">
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label for="show_clear_button">Show Clear Button</label>
				</th>
				<td>
					<input type="checkbox" name="show_clear_button" id="show_clear_button">
				</td>
			</tr>
		</tbody>
	</table>
</div>
