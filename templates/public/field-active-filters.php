<?php
/**
 * The template to show the active filters.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     wptools.io
 */

/**
 * @var WCAPF_Field_Instance $field_instance       The field instance.
 * @var string               $layout               The layout, simple or extended.
 * @var array                $all_filters          All active filters array.
 * @var string               $clear_all_btn_label  The clear all button label.
 * @var string               $empty_filter_message No filter found message.
 */

$use_custom_title = $field_instance->use_custom_title;

$helper = new WCAPF_Helper;
?>

<div class="wcapf-active-filters active-filter-layout-<?php echo esc_attr( $layout ); ?>">
	<?php if ( 'simple' === $layout ) : ?>
		<?php if ( $all_filters ) : ?>
			<div class="active-items">
				<?php
				foreach ( $all_filters as $filter_data ) {
					$filter_key = isset( $filter_data['filter_key'] ) ? $filter_data['filter_key'] : '';

					echo $helper::get_active_filters_markup( $filter_data, $filter_key, $layout, $use_custom_title );
				}
				?>
			</div>
		<?php endif; ?>
	<?php else: ?>
		<?php
		foreach ( $all_filters as $filter_key => $filter_data ) {
			$filter_id    = isset( $filter_data['filter_id'] ) ? $filter_data['filter_id'] : '';
			$custom_title = isset( $filter_data['custom_title'] ) ? $filter_data['custom_title'] : '';

			echo '<div class="wcapf-active-filter-group">';

			if ( $use_custom_title && $custom_title ) {
				echo '<h5>' . esc_html( $custom_title ) . '</h5>';
			} elseif ( $filter_id ) {
				echo '<h5>' . get_the_title( $filter_id ) . '</h5>';
			}

			echo '<div class="active-items">';

			echo $helper::get_active_filters_markup( $filter_data, $filter_key, $layout, $use_custom_title );

			echo '</div></div>';
		}
		?>
	<?php endif; ?>

	<?php if ( ! $all_filters ) : ?>
		<div class="active-items">
			<div class="empty-filter-message"><?php echo esc_html( $empty_filter_message ); ?></div>
		</div>
	<?php endif; ?>
</div>

<?php
// 'Clear All' button.
$enable_clear_btn = $field_instance->get_sub_field_value( 'enable_clear_all_button' );

if ( $all_filters && $enable_clear_btn ) {
	echo '<span class="clear-all-button-wrapper">';
	echo $helper::get_reset_filters_button_markup( $clear_all_btn_label, 'a' );
	echo '</span>';
}
?>
