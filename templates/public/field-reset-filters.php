<?php
/**
 * The template to show a button to reset the filters.
 */

/**
 * @var string $btn_title The button title.
 */

$btn_title = $btn_title ?: __( 'Reset', 'wc-ajax-product-filter' );
?>

<div class="wcapf-reset-filters">
	<?php echo WCAPF_Helper::get_reset_filters_button_markup( $btn_title ); ?>
</div>
