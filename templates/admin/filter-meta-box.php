<?php
/**
 * The filter meta box template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

/**
 * @var array  $available_fields  The available fields.
 * @var string $field_type        The active field type.
 * @var string $active_field_name The active field name.
 * @var array  $field_data        The active field data.
 */
?>

<div id="filter-admin-ui">
	<div class="cols-with-preview">
		<div class="cols-ui">
			<div id="titlediv">
				<input
					type="text"
					name="filter_title"
					id="title"
					placeholder="<?php esc_attr_e( 'Add title', 'wc-ajax-product-filter' ); ?>"
					value="<?php the_title(); ?>"
				>
			</div>

			<nav id="filter-nav-tab" class="nav-tab-wrapper wp-clearfix" data-active-nav="customize">
				<a role="button" class="nav-tab" data-for="general">
					<?php esc_html_e( 'Filter UI', 'wc-ajax-product-filter' ); ?>
				</a>
				<a role="button" class="nav-tab" data-for="settings">
					<?php esc_html_e( 'Visibility Rules', 'wc-ajax-product-filter' ); ?>
				</a>
				<a role="button" class="nav-tab nav-tab-active" data-for="customize">
					<?php esc_html_e( 'Customize', 'wc-ajax-product-filter' ); ?>
				</a>
			</nav>

			<div id="poststuff" class="not-hidden">
				<div id="available_fields" class="postbox">
					<div class="postbox-header">
						<h2><?php esc_html_e( 'Available Filters', 'wc-ajax-product-filter' ); ?></h2>
					</div>
					<div class="inside">
						<?php wp_nonce_field( 'save_filter_meta_data', 'wcapf_meta_box_nonce' ); ?>
						<p class="description">
							<?php
							esc_html_e(
								'Select any of these filters to start building the filter.',
								'wc-ajax-product-filter'
							);
							?>
						</p>
						<div class="available-fields">
							<?php foreach ( $available_fields as $field_key => $field_name ) : ?>
								<label class="available-field">
									<input
										type="radio"
										name="_active_field"
										value="<?php echo esc_attr( $field_key ); ?>"
										data-field-name="<?php echo esc_attr( $field_name ); ?>"
										<?php echo $field_key === $field_type ? 'checked="checked"' : ''; ?>
									>
									<span><?php echo esc_html( $field_name ); ?></span>
								</label>
							<?php endforeach; ?>
						</div>
					</div>
				</div>

				<div id="chosen_field_wrapper" class="<?php echo ! $field_type ? ' hidden' : ''; ?>">
					<div id="field_data" class="postbox" data-field-type="<?php echo esc_attr( $field_type ); ?>">
						<div class="postbox-header">
							<h2><?php echo esc_html( $active_field_name ); ?></h2>
						</div>
						<div class="inside">
							<?php
							if ( $field_type ) {
								WCAPF_Helper::render_field_form_by_instance( $field_data );
							}
							?>
						</div>
					</div>
				</div>
			</div>

			<div>

			</div>
		</div><!-- .cols-ui -->
		<div class="cols-preview">
			<div class="preview-wrapper">
				<div class="preview-header">
					<h2><?php esc_html_e( 'Preview', 'wc-ajax-product-filter' ); ?></h2>
				</div>
				<div class="preview-inner">

					<iframe src="http://wcfilter-2.test/shop/" width="100%" height="300px"></iframe>

<!--					<div class="wcapf-single-filter wcapf-nav-filter wcapf-attribute-filter" data-id="71"><h4-->
<!--							class="wcapf-field-title">Size</h4>-->
<!--						<div class="wcapf-field-inner">-->
<!--							<div class="wcapf-labeled-nav display-type-label show-count" data-multiple-filter="0"-->
<!--								 data-filter-key="_size">-->
<!--								<div class="item" data-value="25" tabindex="0">Large<span class="count">1</span></div>-->
<!--								<div class="item" data-value="26" tabindex="0">Medium<span class="count">1</span></div>-->
<!--								<div class="item" data-value="27" tabindex="0">Small<span class="count">1</span></div>-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->

				</div>
			</div>
		</div><!-- .cols-preview -->
	</div>
</div>

