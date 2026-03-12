<?php
/**
 * The template for displaying the walker menu item.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $item_name          The item name.
 * @var string $item_count         The item count.
 * @var bool   $show_count         Whether to show the count.
 * @var string $item_attr          The search data attribute string.
 * @var string $screen_reader_text The translated screen reader text.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<span class="wcapf-filter-item-label"
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $item_attr;
	?>
>
	<span class="wcapf-nav-item-text"><?php echo wp_kses_post( $item_name ); ?></span>

	<?php
	if ( $show_count ) {
		WCAPF_Template_Loader::get_instance()->load(
			'menu-item-count',
			array(
				'count'              => $item_count,
				'screen_reader_text' => $screen_reader_text,
			)
		);
	}
	?>
</span>
