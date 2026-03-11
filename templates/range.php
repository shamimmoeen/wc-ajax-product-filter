<?php
/**
 * The template to show the range slider filter.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     wptools.io
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $filter_id
 * @var string $filter_key
 * @var string $display_type
 * @var string $display_values_as
 * @var string $alignment
 * @var string $input_type_number
 * @var string $min_value
 * @var string $max_value
 * @var string $range_min_value
 * @var string $range_max_value
 * @var string $step
 * @var string $value_prefix
 * @var string $value_postfix
 * @var string $values_separator
 * @var string $text_before_min_value
 * @var string $text_before_max_value
 * @var string $format_numbers
 * @var string $decimal_places
 * @var string $thousand_separator
 * @var string $decimal_separator
 * @var string $slider_id
 * @var string $slider_style
 * @var string $filter_url
 * @var string $clear_filter_url
 * @var string $range_value_unit
 * @var string $range_unit_position
 * @var string $range_data_attributes_markup
 * @var string $range_input_type
 * @var bool   $range_show_as_spinbox
 * @var string $range_spinbox_attributes
 * @var string $range_formatted_min_value
 * @var string $range_formatted_max_value
 * @var string $range_outer_classes
 * @var string $range_inner_classes
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<div
	class="<?php echo esc_attr( $range_outer_classes ); ?>"
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Attributes are prepared and escaped in WCAPF_Helper::prepare_range_filter_args(). ?>
	<?php echo $range_data_attributes_markup; ?>
>
	<div class="<?php echo esc_attr( $range_inner_classes ); ?>">
		<span class="wcapf-range-start">
			<?php if ( $text_before_min_value ) : ?>
				<span class="wcapf-min-value-prefix"><?php echo wp_kses_post( $text_before_min_value ); ?></span>
			<?php endif; ?>

			<?php if ( 'left' === $range_unit_position && ! $range_show_as_spinbox ) : ?>
				<span class="wcapf-range-unit"><?php echo esc_html( $range_value_unit ); ?></span>
			<?php endif; ?>

			<?php if ( 'plain_text' === $display_values_as ) : ?>
				<span class="min-value"><?php echo esc_html( $range_formatted_min_value ); ?></span>
			<?php else : ?>
				<input
					type="<?php echo esc_attr( $range_input_type ); ?>"
					class="min-value"
					id="<?php echo esc_attr( $filter_key ); ?>-<?php echo esc_attr( $filter_id ); ?>-min"
					value="<?php echo esc_attr( $range_formatted_min_value ); ?>"
					autocomplete="off"
					<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Attributes are prepared and escaped in WCAPF_Helper::prepare_range_filter_args(). ?>
					<?php echo $range_spinbox_attributes; ?>
				>
			<?php endif; ?>

			<?php if ( 'right' === $range_unit_position && ! $range_show_as_spinbox ) : ?>
				<span class="wcapf-range-unit"><?php echo esc_html( $range_value_unit ); ?></span>
			<?php endif; ?>
		</span>

		<?php if ( $values_separator ) : ?>
			<span class="wcapf-range-separator"><?php echo wp_kses_post( $values_separator ); ?></span>
		<?php endif; ?>

		<span class="wcapf-range-end">
			<?php if ( $text_before_max_value ) : ?>
				<span class="wcapf-max-value-prefix"><?php echo wp_kses_post( $text_before_max_value ); ?></span>
			<?php endif; ?>

			<?php if ( 'left' === $range_unit_position && ! $range_show_as_spinbox ) : ?>
				<span class="wcapf-range-unit"><?php echo esc_html( $range_value_unit ); ?></span>
			<?php endif; ?>

			<?php if ( 'plain_text' === $display_values_as ) : ?>
				<span class="max-value"><?php echo esc_html( $range_formatted_max_value ); ?></span>
			<?php else : ?>
				<input
					type="<?php echo esc_attr( $range_input_type ); ?>"
					class="max-value"
					id="<?php echo esc_attr( $filter_key ); ?>-<?php echo esc_attr( $filter_id ); ?>-max"
					value="<?php echo esc_attr( $range_formatted_max_value ); ?>"
					autocomplete="off"
					<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Attributes are prepared and escaped in WCAPF_Helper::prepare_range_filter_args(). ?>
					<?php echo $range_spinbox_attributes; ?>
				>
			<?php endif; ?>

			<?php if ( 'right' === $range_unit_position && ! $range_show_as_spinbox ) : ?>
				<span class="wcapf-range-unit"><?php echo esc_html( $range_value_unit ); ?></span>
			<?php endif; ?>
		</span>
	</div>

	<?php if ( 'range_slider' === $display_type ) : ?>
		<div id="<?php echo esc_attr( $slider_id ); ?>" class="wcapf-noui-slider"></div>
	<?php endif; ?>
</div>
