<?php
/**
 * The filter settings template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box/tab-content
 * @author     wptools.io
 */

$data = get_post_meta( get_the_ID(), '_form_data', true );

$show_title              = isset( $data['show_title'] ) ? $data['show_title'] : '';
$enable_accordion        = isset( $data['enable_accordion'] ) ? $data['enable_accordion'] : '';
$accordion_default_state = isset( $data['accordion_default_state'] ) ? $data['accordion_default_state'] : '';
$show_clear_button       = isset( $data['show_clear_button'] ) ? $data['show_clear_button'] : '';

$show_accordion_default_state_field = false;

if ( 'yes' === $enable_accordion ) {
	$show_accordion_default_state_field = true;
}
?>

<p class="description"><?php esc_html_e( 'These will override the filter settings.', 'wc-ajax-product-filter' ); ?></p>

<div class="wcapf-form-field">
	<div class="wcapf-form-sub-field show-title">
		<div class="wcapf-form-sub-field-label">
			<label for="show_title">
				<?php esc_html_e( 'Show Title', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<select name="show_title" id="show_title">
				<option value="do_not_override" <?php selected( $show_title, 'do_not_override' ); ?>>
					<?php esc_html_e( 'Do not override', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="yes" <?php selected( $show_title, 'yes' ); ?>>
					<?php esc_html_e( 'Yes', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="no" <?php selected( $show_title, 'no' ); ?>>
					<?php esc_html_e( 'No', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</div>
	</div>

	<div class="wcapf-form-sub-field enable-accordion">
		<div class="wcapf-form-sub-field-label">
			<label for="enable_accordion">
				<?php esc_html_e( 'Enable Accordion', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<select name="enable_accordion" id="enable_accordion">
				<option value="do_not_override" <?php selected( $enable_accordion, 'do_not_override' ); ?>>
					<?php esc_html_e( 'Do not override', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="yes" <?php selected( $enable_accordion, 'yes' ); ?>>
					<?php esc_html_e( 'Yes', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="no" <?php selected( $enable_accordion, 'no' ); ?>>
					<?php esc_html_e( 'No', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</div>
	</div>

	<div
		class="wcapf-form-sub-field accordion-default-state<?php echo ! $show_accordion_default_state_field ? ' disabled' : ''; ?>"
	>
		<div class="wcapf-form-sub-field-label">
			<label for="accordion_default_state">
				<?php esc_html_e( 'Accordion default state', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<select name="accordion_default_state" id="accordion_default_state">
				<option
					value="do_not_override"
					<?php selected( $accordion_default_state, 'do_not_override' ); ?>
				>
					<?php esc_html_e( 'Do not override', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="expanded" <?php selected( $accordion_default_state, 'expanded' ); ?>>
					<?php esc_html_e( 'Expanded', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="collapsed" <?php selected( $accordion_default_state, 'collapsed' ); ?>>
					<?php esc_html_e( 'Collapsed', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</div>
	</div>

	<div class="wcapf-form-sub-field show-clear-button">
		<div class="wcapf-form-sub-field-label">
			<label for="show_clear_button">
				<?php esc_html_e( 'Show Clear Button', 'wc-ajax-product-filter' ); ?>
			</label>
		</div>
		<div class="wcapf-wrapper">
			<select name="show_clear_button" id="show_clear_button">
				<option value="do_not_override" <?php selected( $show_clear_button, 'do_not_override' ); ?>>
					<?php esc_html_e( 'Do not override', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="yes" <?php selected( $show_clear_button, 'yes' ); ?>>
					<?php esc_html_e( 'Yes', 'wc-ajax-product-filter' ); ?>
				</option>
				<option value="no" <?php selected( $show_clear_button, 'no' ); ?>>
					<?php esc_html_e( 'No', 'wc-ajax-product-filter' ); ?>
				</option>
			</select>
		</div>
	</div>
</div>
