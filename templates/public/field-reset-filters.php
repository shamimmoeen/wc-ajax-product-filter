<?php
/**
 * The template to show a button to reset the filters.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     wptools.io
 */

/**
 * @var string $button_label The reset button label.
 */
?>

<div class="wcapf-reset-filters">
	<?php echo WCAPF_Helper::get_reset_filters_button_markup( $button_label ); ?>
</div>
