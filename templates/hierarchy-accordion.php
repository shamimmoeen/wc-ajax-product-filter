<?php
/**
 * The hierarchy accordion template.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     wptools.io
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $is_active  Determines if the accordion is expanded.
 * @var string $aria_label The ARIA label for screen readers.
 * @var string $unique_id  The unique identifier for the accordion.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<span
	class="wcapf-hierarchy-accordion-toggle"
	role="button"
	aria-pressed="<?php echo esc_attr( $is_active ); ?>"
	tabindex="0"
	aria-label="<?php echo esc_attr( $aria_label ); ?>"
	data-id="<?php echo esc_attr( $unique_id ); ?>"
></span>
