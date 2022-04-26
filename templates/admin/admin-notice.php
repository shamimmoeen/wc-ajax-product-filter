<?php
/**
 * The admin notice template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

/**
 * @var string $msg_type The message type.
 * @var string $message  The message.
 */

if ( 'error' === $msg_type ) {
	$notice_classes = 'notice notice-error is-dismissible';
} else {
	$notice_classes = 'notice notice-success is-dismissible';
}

if ( ! $message ) {
	return;
}
?>

<div id="message" class="<?php echo esc_attr( $notice_classes ); ?>">
	<p><?php echo esc_html( $message ); ?></p>
</div>
