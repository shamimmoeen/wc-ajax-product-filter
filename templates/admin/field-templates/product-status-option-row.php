<?php
/**
 * Product status option row template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/field-templates
 * @author     wptools.io
 */

/**
 * @var string $value
 * @var string $label
 */

$value = isset( $value ) ? $value : '';
$label = isset( $label ) ? $label : '';

$options = WCAPF_Helper::get_product_status_options();
?>
<div class="row-item">
	<div class="item">
		<div><span class="dashicons dashicons-move move-options-handler"></span></div>

		<div class="status-column">
			<label>
				<select data-name="value">
					<?php foreach ( $options as $option_key => $option_label ) : ?>
						<option
							value="<?php echo esc_attr( $option_key ); ?>"
							<?php selected( $value, $option_key ); ?>
						>
							<?php echo esc_html( $option_label ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</label>
		</div>

		<div class="label-column">
			<label>
				<input
					type="text"
					data-name="label"
					value="<?php echo esc_attr( $label ); ?>"
					autocomplete="off"
				>
			</label>
		</div>

		<div>
			<button type="button" class="button-link remove-option">
				<?php esc_html_e( 'Remove', 'wc-ajax-product-filter' ); ?>
			</button>
		</div>
	</div>
</div>
