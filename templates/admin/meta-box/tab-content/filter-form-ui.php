<?php
/**
 * The filter form ui template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box/tab-content
 * @author     wptools.io
 */

/**
 * @var array $available_filters The available filters.
 * @var array $filter_ids        The filter ids.
 */
?>

<div class="postbox">
	<div class="postbox-header">
		<h2><?php esc_html_e( 'Available Filters', 'wc-ajax-product-filter' ); ?></h2>
	</div>
	<div class="inside">
		<?php wp_nonce_field( 'save_filter_form_meta_data', 'wcapf_filter_form_meta_box_nonce' ); ?>

		<?php if ( $available_filters ) : ?>
			<div class="available-filters-dropdown">
				<p class="description">
					<?php
					esc_html_e(
						'Select a filter and click on the add button to start building the form.',
						'wc-ajax-product-filter'
					);
					?>
				</p>

				<div class="inner">
					<label>
						<select id="available-filters-dropdown">
							<option value="" data-title="">
								<?php esc_html_e( '-- Chose Filter --', 'wc-ajax-product-filter' ); ?>
							</option>
							<?php foreach ( $available_filters as $filter_id ) : ?>
								<?php
								$title = get_the_title( $filter_id );
								$label = $title;

								$field_data = get_post_meta( $filter_id, '_field_data', true );
								$filter_key = isset( $field_data['field_key'] ) ? $field_data['field_key'] : '';
								$edit_link  = get_edit_post_link( $filter_id );

								if ( $filter_key ) {
									$label .= ': ' . $filter_key;
								}

								$disabled = in_array( $filter_id, $filter_ids ) ? 'disabled="disabled"' : '';
								?>
								<option
									value="<?php echo esc_attr( $filter_id ); ?>"
									data-title="<?php echo $title; ?>"
									data-filter-key="<?php echo $filter_key; ?>"
									data-edit-link="<?php echo $edit_link; ?>"
									<?php echo $disabled; ?>
								>
									<?php echo esc_html( $label ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</label>
					<button
						type="button"
						id="add-filter-to-form-btn"
						class="button button-primary"
						disabled="disabled"
					>
						<?php esc_html_e( 'Add', 'wc-ajax-product-filter' ); ?>
					</button>
				</div>
			</div>
		<?php else: ?>
			<p class="description">
				<?php
				/** @noinspection HtmlUnknownTarget */
				printf(
					__(
						'We have not found any filter, <a href="%1$s">create a filter</a> before creating the form.',
						'wc-ajax-product-filter'
					),
					admin_url( 'post-new.php?post_type=wcapf-filter' )
				);
				?>
			</p>
		<?php endif; ?>
	</div>
</div>

<?php if ( $available_filters ) : ?>
	<div id="form_data_wrapper">
		<div id="form_data" class="postbox">
			<div class="postbox-header">
				<h2><?php esc_html_e( 'Form Filters', 'wc-ajax-product-filter' ); ?></h2>
			</div>

			<div class="inside">
				<p class="description">
					<?php
					esc_html_e( 'Build your form by adding filters into this area.', 'wc-ajax-product-filter' );
					?>
				</p>

				<div id="filter-form-items">
					<?php
					if ( $filter_ids ) {
						foreach ( $filter_ids as $filter_id ) {
							$filter_title = get_the_title( $filter_id );
							$field_data   = get_post_meta( $filter_id, '_field_data', true );
							$filter_key   = isset( $field_data['field_key'] ) ? $field_data['field_key'] : '';
							$edit_link    = get_edit_post_link( $filter_id );

							WCAPF_Template_Loader::get_instance()->load(
								'admin/meta-box/filter-form-item',
								array(
									'for_tmpl'     => false,
									'filter_title' => $filter_title,
									'filter_id'    => $filter_id,
									'filter_key'   => $filter_key,
									'edit_link'    => $edit_link,
								)
							);
						}
					}
					?>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
