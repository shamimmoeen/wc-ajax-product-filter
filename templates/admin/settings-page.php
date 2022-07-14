<?php
/**
 * The settings page template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

$wcapf_settings_instance = WCAPF_Settings_Page::get_instance();

$msg_code = isset( $_GET['message'] ) ? sanitize_text_field( $_GET['message'] ) : '';
?>

<div class="wrap">
	<h1 class="wp-heading-inline">
		<?php esc_html_e( 'Settings', 'wc-ajax-product-filter' ); ?>
	</h1>

	<hr class="wp-header-end">

	<?php $wcapf_settings_instance->render_settings_form_submission_messages( $msg_code ); ?>

	<form method="post">
		<?php if ( has_filter( $wcapf_settings_instance->get_option_name() ) ): ?>
			<p>
				<span class="dashicons dashicons-info"></span>
				<?php esc_html_e( 'Filter has been applied and that may modify the settings below.', 'wc-ajax-product-filter' ); ?>
			</p>
		<?php endif ?>

		<table class="form-table">
			<?php $wcapf_settings_instance->render_settings_fields(); ?>
		</table>

		<?php
		wp_nonce_field( 'wcapf_settings_save_nonce', 'wcapf_settings_nonce_field' );
		submit_button();
		?>
	</form>
</div>
