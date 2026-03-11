<?php
/**
 * The template for the reset button.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     wptools.io
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $reset_btn_label     The button label.
 * @var string $reset_unique_id     The unique ID for the container.
 * @var string $reset_classes       The CSS classes for the container.
 * @var bool   $reset_should_render Whether the inner content should render.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! WCAPF_Helper::found_wcapf() ) {
	return;
}

?>

<div class="<?php echo esc_attr( $reset_classes ); ?>" data-id="<?php echo esc_attr( $reset_unique_id ); ?>">
	<?php if ( $reset_should_render ) : ?>
		<div class="wcapf-filter">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo WCAPF_Helper::get_reset_button_markup( $reset_btn_label );
			?>
		</div>
	<?php endif; ?>
</div>
