<?php
/**
 * The template to show the range slider filter.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     wptools.io
 */

/**
 * @var string $filter_key
 * @var string $min_value
 * @var string $max_value
 * @var string $range_min_value
 * @var string $range_max_value
 * @var string $step
 * @var string $value_prefix
 * @var string $value_postfix
 * @var string $values_separator
 * @var string $decimal_places
 * @var string $thousand_separator
 * @var string $decimal_separator
 * @var string $slider_id
 * @var string $display_values_as
 * @var string $align_at_the_end
 */

$input_name = $filter_key . '[]';

$_attrs = array();

$_attrs[] = 'data-range-min-value="' . $range_min_value . '"';
$_attrs[] = 'data-range-max-value="' . $range_max_value . '"';
$_attrs[] = 'data-filter-key="' . $filter_key . '"';
$_attrs[] = 'data-min-value="' . $min_value . '"';
$_attrs[] = 'data-max-value="' . $max_value . '"';
$_attrs[] = 'data-step="' . $step . '"';
$_attrs[] = 'data-decimal-places="' . $decimal_places . '"';
$_attrs[] = 'data-thousand-separator="' . $thousand_separator . '"';
$_attrs[] = 'data-decimal-separator="' . $decimal_separator . '"';
$_attrs[] = 'data-display-values-as="' . $display_values_as . '"';

$attrs = implode( ' ', $_attrs );

$wrapper_classes = 'range-wrapper';

$wrapper_classes .= ' display-values-as-' . $display_values_as;
$wrapper_classes .= $align_at_the_end ? ' align-values-end-without-separator' : '';
?>

<div class="wcapf-range-slider" <?php echo $attrs; ?>>
	<div class="<?php echo esc_attr( $wrapper_classes ); ?>">
		<span class="wcapf-range-start">
			<?php if ( $value_prefix ) : ?>
				<span class="wcapf-range-prefix"><?php echo esc_html( $value_prefix ); ?></span>
			<?php endif; ?>

			<?php if ( 'plain_text' === $display_values_as ) : ?>
				<span class="min-value"><?php echo esc_html( $min_value ); ?></span>
			<?php else: ?>
				<label>
					<input
						type="text"
						class="min-value"
						name="<?php echo esc_attr( $input_name ); ?>"
						value="<?php echo esc_attr( $min_value ); ?>"
						autocomplete="off"
					>
				</label>
			<?php endif; ?>

			<?php if ( $value_postfix ) : ?>
				<span class="wcapf-range-postfix"><?php echo esc_html( $value_postfix ); ?></span>
			<?php endif; ?>
		</span>

		<?php if ( $values_separator ) : ?>
			<span class="wcapf-range-separator"><?php echo esc_html( $values_separator ); ?></span>
		<?php endif; ?>

		<span class="wcapf-range-end">
			<?php if ( $value_prefix ) : ?>
				<span class="wcapf-range-prefix"><?php echo esc_html( $value_prefix ); ?></span>
			<?php endif; ?>

			<?php if ( 'plain_text' === $display_values_as ) : ?>
				<span class="max-value"><?php echo esc_html( $max_value ); ?></span>
			<?php else: ?>
				<label>
					<input
						type="text"
						class="max-value"
						name="<?php echo esc_attr( $input_name ); ?>"
						value="<?php echo esc_attr( $max_value ); ?>"
						autocomplete="off"
					>
				</label>
			<?php endif; ?>

			<?php if ( $value_postfix ) : ?>
				<span class="wcapf-range-postfix"><?php echo esc_html( $value_postfix ); ?></span>
			<?php endif; ?>
		</span>
	</div>

	<div id="<?php echo esc_attr( $slider_id ); ?>" class="wcapf-noui-slider"></div>
</div>
