<?php
/**
 * todo
 */

/**
 * @var string $value The value.
 * @var string $label The label.
 */

$options = WCAPF_Product_Filter_Utils::get_product_status_options();
?>

<div class="item">
	<div><span class="dashicons dashicons-move move-options-handler"></span></div>
	<div>
		<label>
			<select class="option_value">
				<?php foreach ( $options as $option_key => $option_label ) : ?>
					<option value="<?php echo esc_attr( $option_key ); ?>"<?php selected( $value, $option_key ); ?>>
						<?php echo esc_html( $option_label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</label>
	</div>
	<div>
		<label>
			<input
				type="text"
				class="option_label"
				value="<?php echo esc_attr( $label ); ?>"
				autocomplete="off"
			>
		</label>
	</div>
	<div>
		<button type="button" class="button-link remove-product-status-option">
			<?php esc_html_e( 'Remove', 'wc-ajax-product-filter' ); ?>
		</button>
	</div>
</div>
