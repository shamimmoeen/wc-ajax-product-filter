<?php
/**
 * The template to show the active filters.
 */

/**
 * @var string $layout               The layout, simple or extended.
 * @var array  $all_filters          All active filters array.
 * @var string $clear_btn_title      The clear all button title.
 * @var string $empty_filter_message No filter found message.
 */

$helper = new WCAPF_Helper;

$classes = 'wcapf-active-filters';
$classes .= $all_filters && ! $clear_btn_title ? ' no-clear-button' : '';
?>

<div class="<?php echo esc_attr( $classes ); ?>">
	<?php if ( 'simple' === $layout ) : ?>
		<?php if ( $all_filters ) : ?>
			<div class="active-items">
				<?php
				foreach ( $all_filters as $filter_key => $filter_data ) {
					echo $helper::get_active_filters_markup( $filter_data, $filter_key, $layout );
				}
				?>
			</div>
		<?php endif; ?>
	<?php else: ?>
		<?php
		foreach ( $all_filters as $filter_key => $filter_data ) {
			$filter_id = isset( $filter_data['filter_id'] ) ? $filter_data['filter_id'] : '';

			echo '<div class="wcapf-active-filter-group">';

			if ( $filter_id ) {
				echo '<h5>' . get_the_title( $filter_id ) . '</h5>';
			}

			echo '<div class="active-items">';

			echo $helper::get_active_filters_markup( $filter_data, $filter_key, $layout );

			echo '</div></div>';
		}
		?>
	<?php endif; ?>

	<?php if ( ! $all_filters ) : ?>
		<div class="empty-filter-message"><?php echo esc_html( $empty_filter_message ); ?></div>
	<?php endif; ?>

	<?php
	if ( $all_filters ) {
		echo $helper::get_reset_filters_button_markup( $clear_btn_title, 'a' );
	}
	?>
</div>
