<?php
/**
 * The settings page's sidebar template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

$wcapf_tab = WCAPF_Helper::get_current_tab();
?>

<div class="postbox">
	<div class="postbox-header">
		<h2><?php esc_html_e( 'Action', 'wc-ajax-product-filter' ); ?></h2>
	</div>
	<div class="inside">
		<p>
			<?php
			if ( 'search-form' === $wcapf_tab ) {
				esc_html_e( 'Save the search form.', 'wc-ajax-product-filter' );
			} else {
				esc_html_e( 'Save the settings.', 'wc-ajax-product-filter' );
			}
			?>
		</p>
		<button type="button" class="button button-primary">
			<?php esc_html_e( 'Save', 'wc-ajax-product-filter' ); ?>
		</button>
	</div>
</div>
