<?php
/**
 * The template to show the active filters.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/public
 * @author     Mainul Hassan
 */

/**
 * Template variables passed from the template loader.
 *
 * @var string $filter_title         The title.
 * @var bool   $show_filter_title    Determines if we show the title.
 * @var string $filter_layout        Determines the active filters' layout, possible values are simple, extended.
 * @var string $filter_empty_message No filter applied message.
 * @var string $clear_all_btn_label  The clear all button label.
 * @var string $clear_all_btn_layout The clear all button layout.
 * @var bool   $show_clear_btn       Whether to show the clear filter button in heading or not.
 * @var array  $all_filters          The active filter items.
 * @var int    $total_filters        The total number of active filters.
 * @var string $filter_unique_id     The unique ID for the container.
 * @var string $filter_classes       The CSS classes for the container.
 * @var string $filter_inner_classes The CSS classes for the inner wrapper.
 * @var string $reset_btn_class      The CSS class for the reset button.
 * @var bool   $filter_should_render Whether the inner content should render.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! wcapf()->compat->found_wcapf() ) {
	return;
}

?>

<div class="<?php echo esc_attr( $filter_classes ); ?>" data-id="<?php echo esc_attr( $filter_unique_id ); ?>">
	<?php if ( $filter_should_render ) : ?>
		<div class="<?php echo esc_attr( $filter_inner_classes ); ?>">
			<?php
			WCAPF_Template_Loader::get_instance()->load(
				'filter-title',
				array(
					'show_title'          => $show_filter_title,
					'filter_title'        => $filter_title,
					'title_for'           => 'active-filters',
					'show_clear_btn'      => $show_clear_btn,
					'title_classes'       => 'wcapf-filter-title',
					'filter_key'          => '',
					'help_text'           => '',
					'enable_accordion'    => false,
					'is_expanded'         => false,
					'accordion_header_id' => '',
					'accordion_panel_id'  => '',
				)
			);
			?>

			<div class="wcapf-filter-inner">
				<div class="wcapf-active-filter-items-wrapper">
					<?php if ( $all_filters ) : ?>
						<?php if ( 'simple' === $filter_layout ) : ?>
							<div class="wcapf-active-filter-items">
								<?php
								$wcapf_loop_index = 0;

								foreach ( $all_filters as $wcapf_filter_data ) {
									++$wcapf_loop_index;
									$wcapf_loop_class = ( $wcapf_loop_index === $total_filters ) ? 'last-item' : '';

									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo wcapf()->active_filters->markup( $wcapf_filter_data, $wcapf_loop_class );
								}

								if ( 'inline' === $clear_all_btn_layout ) {
									echo '<div class="wcapf-reset-filters-btn-wrapper">';
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									echo wcapf()->active_filters->reset_button_markup( $clear_all_btn_label, $reset_btn_class );
									echo '</div>';
								}
								?>
							</div>
						<?php else : ?>
							<?php
							foreach ( $all_filters as $wcapf_filter_data ) {
								$wcapf_filter_id = isset( $wcapf_filter_data['filter_id'] ) ?
									$wcapf_filter_data['filter_id'] : '';

								echo '<div class="wcapf-active-filter-group">';

								if ( $wcapf_filter_id ) {
									echo '<h5>' . esc_html( get_the_title( $wcapf_filter_id ) ) . '</h5>';
								}

								echo '<div class="active-items">';

								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								echo wcapf()->active_filters->markup( $wcapf_filter_data );

								echo '</div></div>';
							}
							?>
						<?php endif; ?>
					<?php endif; ?>

					<?php if ( ! $all_filters && $filter_empty_message ) : ?>
						<div class="empty-filter-message"><?php echo esc_html( $filter_empty_message ); ?></div>
					<?php endif; ?>

					<?php
					// 'Clear All' button.
					if ( $all_filters && $clear_all_btn_label && 'inline' !== $clear_all_btn_layout && ! $show_clear_btn ) {
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo wcapf()->active_filters->reset_button_markup( $clear_all_btn_label, $reset_btn_class );
					}
					?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>
