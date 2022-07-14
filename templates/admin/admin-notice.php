<?php
/**
 * The admin notice template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

/**
 * @var string $msg_type       The message type.
 * @var string $message        The message.
 * @var string $is_dismissible Determines if the notice is dismissible or not.
 */

$is_dismissible = ! isset( $is_dismissible ) || $is_dismissible;

$notice_classes = array( 'notice' );

if ( 'error' === $msg_type ) {
	$notice_classes[] = 'notice-error';
} elseif ( 'warning' === $msg_type ) {
	$notice_classes[] = 'notice-warning';
} elseif ( 'info' === $msg_type ) {
	$notice_classes[] = 'notice-info';
} else {
	$notice_classes[] = 'notice-success';
}

if ( $is_dismissible ) {
	$notice_classes[] = 'is-dismissible';
}

$notice_classes = implode( ' ', $notice_classes );

if ( ! $message ) {
	return;
}
?>

<div id="message" class="<?php echo esc_attr( $notice_classes ); ?>">
	<p><?php echo wp_kses_post( $message ); ?></p>
</div>
