<?php
/**
 * Product status options template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/field-templates
 * @author     wptools.io
 */

/**
 * @var array $instance
 */

$product_status_options = isset( $instance['product_status_options'] ) ? $instance['product_status_options'] : '';
?>

<div class="column-start field-table product-status-options-table<?php echo $product_status_options ? ' has-options' : ''; ?>">
	<h4 class="no-top-margin"><?php esc_html_e( 'Options', 'wc-ajax-product-filter' ); ?></h4>

	<p><?php esc_html_e( 'Add the options that will be available to this field.', 'wc-ajax-product-filter' ); ?></p>

	<div class="field-table-header">
		<div class="status-column"><?php esc_html_e( 'Status', 'wc-ajax-product-filter' ); ?></div>
		<div class="label-column"><?php esc_html_e( 'Label', 'wc-ajax-product-filter' ); ?></div>
	</div>

	<div class="field-table-body">
		<div class="field-table-body-rows">
			<?php
			if ( $product_status_options ) {
				foreach ( $product_status_options as $product_status_option ) {
					WCAPF_Helper::product_status_option_markup( $product_status_option );
				}
			}
			?>
		</div>
		<div class="no-options-found">
			<?php esc_html_e( 'There are no options.', 'wc-ajax-product-filter' ); ?>
		</div>
	</div>

	<div class="field-table-footer">
		<div>
			<button type="button" class="button add-option">
				<?php esc_html_e( 'Add Option', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
		<div>
			<button type="button" class="button clear-options">
				<?php esc_html_e( 'Clear All Options', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
	</div>
</div>
