<?php
/**
 * @var string $filter_key
 * @var string $range_min_value
 * @var string $range_max_value
 * @var string $min_value
 * @var string $max_value
 * @var string $step
 * @var string $value_prefix
 * @var string $value_postfix
 * @var string $values_separator
 */

$input_name = $filter_key . '[]';

$_attrs = array();

$_attrs[] = 'data-range-min-value="' . $range_min_value . '"';
$_attrs[] = 'data-range-max-value="' . $range_max_value . '"';
$_attrs[] = 'data-filter-key="' . $filter_key . '"';

$attrs = implode( ' ', $_attrs );
?>

<div class="wcapf-range-number" <?php echo $attrs; ?>>
	<?php if ( $value_prefix ) : ?>
		<span class="wcapf-range-prefix"><?php echo esc_html( $value_prefix ); ?></span>
	<?php endif; ?>

	<label>
		<input
			type="number"
			class="min-value"
			<?php echo 'step="' . esc_attr( $step ) . '"' ?>
			<?php echo 'min="' . esc_attr( $range_min_value ) . '"'; ?>
			<?php echo 'max="' . esc_attr( $range_max_value ) . '"'; ?>
			name="<?php echo esc_attr( $input_name ); ?>"
			value="<?php echo esc_attr( $min_value ); ?>"
			autocomplete="off"
		>
	</label>

	<?php if ( $value_postfix ) : ?>
		<span class="wcapf-range-postfix"><?php echo esc_html( $value_postfix ); ?></span>
	<?php endif; ?>

	<?php if ( $values_separator ) : ?>
		<span class="wcapf-range-separator"><?php echo esc_html( $values_separator ); ?></span>
	<?php endif; ?>

	<?php if ( $value_prefix ) : ?>
		<span class="wcapf-range-prefix"><?php echo esc_html( $value_prefix ); ?></span>
	<?php endif; ?>

	<label>
		<input
			type="number"
			class="max-value"
			<?php echo 'step="' . esc_attr( $step ) . '"' ?>
			<?php echo 'min="' . esc_attr( $range_min_value ) . '"'; ?>
			<?php echo 'max="' . esc_attr( $range_max_value ) . '"'; ?>
			name="<?php echo esc_attr( $input_name ); ?>"
			value="<?php echo esc_attr( $max_value ); ?>"
			autocomplete="off"
		>
	</label>

	<?php if ( $value_postfix ) : ?>
		<span class="wcapf-range-postfix"><?php echo esc_html( $value_postfix ); ?></span>
	<?php endif; ?>
</div>
