<?php
/**
 * The search box template.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     wptools.io
 */

/**
 * @var string $placeholder   The input field placeholder text.
 * @var string $icon_position Determines the icon position, left or right side.
 */

$classes = 'wcapf-search-box';

if ( 'left' === $icon_position || 'right' === $icon_position ) {
	$classes .= ' with-icon icon-' . $icon_position;
}
?>

<div class="<?php echo esc_attr( $classes ); ?>">
	<?php if ( 'left' === $icon_position || 'right' === $icon_position ): ?>
		<span class="wcapf-search-icon">
			<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="3.5 .5 18 18" width="18">
				<g fill="none"
				   stroke="currentColor"
				   stroke-miterlimit="10"
				   stroke-width="2"
				>
					<circle cx="10.5" cy="7.5" r="6" />
					<path d="m20.531 17.531-6.031-6.031" />
				</g>
			</svg>
		</span>
	<?php endif; ?>
	<input type="text" placeholder="<?php echo esc_attr( $placeholder ); ?>">
</div>
