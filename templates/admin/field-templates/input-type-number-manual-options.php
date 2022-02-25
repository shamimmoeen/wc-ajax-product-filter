<?php
/**
 * @var array $instance
 */

$number_manual_options = isset( $instance['number_manual_options'] ) ? $instance['number_manual_options'] : '';
?>

<div class="column-start number-manual-options-table<?php echo $number_manual_options ? ' has-options' : ''; ?>">
	<p><?php esc_html_e( 'Add the options that will be available to this field, each option must have a min, max value and a label.', 'wc-ajax-product-filter' ); ?></p>

	<div class="manual-options-table-header">
		<div><?php esc_html_e( 'Min Value', 'wc-ajax-product-filter' ); ?></div>
		<div><?php esc_html_e( 'Max Value', 'wc-ajax-product-filter' ); ?></div>
		<div><?php esc_html_e( 'Label', 'wc-ajax-product-filter' ); ?></div>
	</div>

	<div class="manual-options-table-body">
		<div class="manual-options-table-body-rows">
			<?php
			if ( $number_manual_options ) {
				$utils = new WCAPF_Pro_Product_Filter_Utils();

				foreach ( $number_manual_options as $number_manual_option ) {
					$min_value = isset( $number_manual_option[0] ) ? $number_manual_option[0] : '';
					$max_value = isset( $number_manual_option[1] ) ? $number_manual_option[1] : '';
					$label     = isset( $number_manual_option[2] ) ? $number_manual_option[2] : '';

					$utils->number_manual_option_row( $min_value, $max_value, $label );
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
			<button type="button" class="button add-number-option">
				<?php esc_html_e( 'Add Option', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
		<div>
			<button type="button" class="button clear-all-number-options">
				<?php esc_html_e( 'Clear All Options', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
	</div>
</div>
