<?php
/**
 * The template to show the range number filter.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     wptools.io
 */

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
 * @var string $filter_url
 * @var string $clear_filter_url
 */

$input_name = $filter_key . '[]';

$_attrs = array();

$_attrs[] = 'data-range-min-value="' . $range_min_value . '"';
$_attrs[] = 'data-range-max-value="' . $range_max_value . '"';
$_attrs[] = 'data-filter-key="' . $filter_key . '"';
$_attrs[] = 'data-url="' . esc_url( $filter_url ) . '"';
$_attrs[] = 'data-clear-filter-url="' . esc_url( $clear_filter_url ) . '"';

$attrs = implode( ' ', $_attrs );
?>

<div class="wcapf-range-number" <?php echo $attrs; ?>>
	<div class="range-wrapper">
		<span class="wcapf-range-start">
			<?php if ( $value_prefix ) : ?>
				<span class="wcapf-range-prefix"><?php echo wp_kses_post( $value_prefix ); ?></span>
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
				<span class="wcapf-range-postfix"><?php echo wp_kses_post( $value_postfix ); ?></span>
			<?php endif; ?>
		</span>

		<?php if ( $values_separator ) : ?>
			<span class="wcapf-range-separator"><?php echo wp_kses_post( $values_separator ); ?></span>
		<?php endif; ?>

		<span class="wcapf-range-end">
			<?php if ( $value_prefix ) : ?>
				<span class="wcapf-range-prefix"><?php echo wp_kses_post( $value_prefix ); ?></span>
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
				<span class="wcapf-range-postfix"><?php echo wp_kses_post( $value_postfix ); ?></span>
			<?php endif; ?>
		</span>
	</div>
</div>
