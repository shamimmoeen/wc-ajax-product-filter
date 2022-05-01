<?php
/**
 * Generate product prices template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

$helper = new WCAPF_Helper;

$show = $helper::store_is_in_tax_inclusive_mode() || $helper::store_is_in_tax_exclusive_mode();
?>

<?php if ( $show ) : ?>
	<form id="generate-product-prices" method="post">
		<h3>
			<?php esc_html_e( 'Generate product prices according to the tax configuration', 'wc-ajax-product-filter' ); ?>
		</h3>

		<p>
			<?php esc_html_e( 'Whenever the tax configuration is changed you need to regenerate the product prices. The process may take a little while, so please be patient during the process and don\'t leave this page. Click the below button to start the process.', 'wc-ajax-product-filter' ); ?>
		</p>

		<input type="hidden" name="action" value="generate_product_prices">
		<?php wp_nonce_field( 'generate_product_prices_nonce', 'generate_product_prices_nonce_field' ); ?>

		<button class="button button-primary">
			<?php esc_html_e( 'Start', 'wc-ajax-product-filter' ); ?>
		</button>

		<p class="success-message"></p>
		<p class="error-message"></p>

		<div class="progress-stat">
			<div class="progressbar">
				<div></div>
			</div>
			<div class="progress-info">
				<?php
				printf(
					__( '<span class="count">%d</span> of <span class="total">%d</span> done', 'wc-ajax-product-filter' ),
					0,
					0
				);
				?>
			</div>
		</div>
	</form>
<?php endif; ?>
