<?php
/**
 * The template for displaying the walker menu item count.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/
 * @author     wptools.io
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $count              The item count.
 * @var string $screen_reader_text The translated screen reader text.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<span class="wcapf-nav-item-count"><span aria-hidden="true"><?php echo esc_html( $count ); ?></span><span class="screen-reader-text"><?php echo esc_html( $screen_reader_text ); ?></span></span>
