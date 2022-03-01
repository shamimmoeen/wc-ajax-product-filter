<?php
/**
 * TODO: Move to pro.
 *
 * @var array $instance
 */

$manual_options = isset( $instance['manual_options'] ) ? $instance['manual_options'] : '';
?>

<div class="column-start manual-options-table<?php echo $manual_options ? ' has-options' : ''; ?>">
	<p><?php esc_html_e( 'Add the options that will be available to this field, each option must have a value and a label.', 'wc-ajax-product-filter' ); ?></p>

	<div class="manual-options-table-header">
		<div><?php esc_html_e( 'Value', 'wc-ajax-product-filter' ); ?></div>
		<div><?php esc_html_e( 'Label', 'wc-ajax-product-filter' ); ?></div>
	</div>

	<div class="manual-options-table-body">
		<div class="manual-options-table-body-rows">
			<?php
			if ( $manual_options ) {
				$utils = new WCAPF_Pro_Product_Filter_Utils();

				foreach ( $manual_options as $manual_option ) {
					$value = isset( $manual_option[0] ) ? $manual_option[0] : '';
					$label = isset( $manual_option[1] ) ? $manual_option[1] : '';

					$utils->text_manual_option_row( $value, $label );
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
			<button type="button" class="button add-option">
				<?php esc_html_e( 'Add Option', 'wc-ajax-product-filter' ); ?>
			</button>
			<button type="button" class="button browse-values">
				<?php esc_html_e( 'Browse Values', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
		<div>
			<button type="button" class="button clear-all-options">
				<?php esc_html_e( 'Clear All Options', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
	</div>
</div>
