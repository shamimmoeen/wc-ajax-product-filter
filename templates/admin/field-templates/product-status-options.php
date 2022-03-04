<?php
/**
 * @var array $instance
 */

$product_status_options = isset( $instance['product_status_options'] ) ? $instance['product_status_options'] : '';
?>

<div class="column-start product-status-options-table<?php echo $product_status_options ? ' has-options' : ''; ?>">
	<h4 class="no-top-margin"><?php esc_html_e( 'Options', 'wc-ajax-product-filter' ); ?></h4>

	<p><?php esc_html_e( 'Add the options that will be available to this field.', 'wc-ajax-product-filter' ); ?></p>

	<div class="manual-options-table-header">
		<div><?php esc_html_e( 'Status', 'wc-ajax-product-filter' ); ?></div>
		<div><?php esc_html_e( 'Label', 'wc-ajax-product-filter' ); ?></div>
	</div>

	<div class="manual-options-table-body">
		<div class="manual-options-table-body-rows">
			<?php
			if ( $product_status_options ) {
				$utils = new WCAPF_Product_Filter_Utils();

				foreach ( $product_status_options as $number_manual_option ) {
					$value = isset( $number_manual_option[0] ) ? $number_manual_option[0] : '';
					$label = isset( $number_manual_option[1] ) ? $number_manual_option[1] : '';

					$utils->product_status_option_row( $value, $label );
				}
			}
			?>
		</div>
		<div class="no-options-found">
			<?php esc_html_e( 'There are no options.', 'wc-ajax-product-filter' ); ?>
		</div>
	</div>

	<div class="manual-options-table-footer">
		<div>
			<button type="button" class="button add-product-status-option">
				<?php esc_html_e( 'Add Option', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
		<div>
			<button type="button" class="button clear-all-product-status-options">
				<?php esc_html_e( 'Clear All Options', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
	</div>
</div>
