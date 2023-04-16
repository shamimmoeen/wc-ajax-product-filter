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
 * @var string $location             Determines where we are showing the active filters. Available options are:
 *                                   inside-form, before-products.
 * @var string $show_title           Determines if we show the title.
 * @var string $title                The title.
 * @var string $show_clear_btn       Whether to show the clear filter button in heading or not.
 * @var string $clear_all_btn_label  The clear all button label.
 * @var string $empty_message        No filter applied message.
 */

$location = isset( $location ) ? $location : 'inside-form';
$title    = isset( $title ) ? $title : '';

$helper = new WCAPF_Helper;

$all_filters = $helper::get_active_filters_data( true );

$clear_all_btn_label = isset( $clear_all_btn_label ) ? $clear_all_btn_label : '';
$show_clear_btn      = isset( $show_clear_btn ) && $show_clear_btn;
$empty_message       = isset( $empty_message ) ? $empty_message : '';

$unique_id = wp_unique_id( 'af-' );
$classes   = array( 'wcapf-active-filters', 'wcapf-active-filters-' . $unique_id );
$classes[] = 'location-' . $location;

$reset_btn_class = 'wcapf-reset-filters-btn';

$continue = true;

if ( ! $all_filters && ! $empty_message ) {
	$continue = false;
}

if ( ! $title ) {
	$show_title = false;
}

if ( ! $show_title ) {
	$show_clear_btn = false;
}

$inner_classes = array( 'wcapf-filter' );

if ( $show_clear_btn && $all_filters ) {
	$inner_classes[] = 'filter-active';
}
?>

<div class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" data-id="<?php echo esc_attr( $unique_id ); ?>">
	<?php if ( $continue ): ?>
		<div class="<?php echo esc_attr( implode( ' ', $inner_classes ) ); ?>">
			<?php
			WCAPF_Template_Loader::get_instance()->load(
				'filter-title',
				array(
					'show_title'     => $show_title,
					'filter_title'   => $title,
					'title_for'      => 'active-filters',
					'show_clear_btn' => $show_clear_btn,
				)
			);
			?>

			<div class="wcapf-filter-inner">
				<div class="wcapf-active-filter-items-wrapper">
					<?php if ( $all_filters ) : ?>
						<div class="wcapf-active-filter-items">
							<?php
							$index = 0;
							$class = '';

							$filters_data = array();

							foreach ( $all_filters as $filter ) {
								$active_filters = isset( $filter['active_filters'] ) ? $filter['active_filters'] : array();

								foreach ( $active_filters as $value => $label ) {
									$filter['active_filters'] = array( $value => $label );

									$filters_data[] = $filter;
								}
							}

							$total = count( $filters_data );

							foreach ( $filters_data as $filter_data ) {
								$index ++;

								if ( $index === $total ) {
									$class = 'last-item';
								}

								echo $helper::get_active_filter_markup( $filter_data, $class );
							}

							if ( 'before-products' === $location ) {
								echo '<div class="wcapf-reset-filters-btn-wrapper">';
								echo $helper::get_reset_button_markup( $clear_all_btn_label, $reset_btn_class );
								echo '</div>';
							}
							?>
						</div>
					<?php endif; ?>

					<?php if ( ! $all_filters && $empty_message ) : ?>
						<div class="empty-filter-message"><?php echo esc_html( $empty_message ); ?></div>
					<?php endif; ?>

					<?php
					// 'Clear All' button.
					if ( $all_filters && $clear_all_btn_label && 'before-products' !== $location && ! $show_clear_btn ) {
						echo $helper::get_reset_button_markup( $clear_all_btn_label, $reset_btn_class );
					}
					?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>
