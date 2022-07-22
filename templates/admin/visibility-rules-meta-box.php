<?php
/**
 * The visibility rules meta box template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

$form_data = get_post_meta( get_the_ID(), '_form_data', true );

$hide_on                 = isset( $form_data['hide_on'] ) ? $form_data['hide_on'] : array();
$enable_visibility_rules = isset( $form_data['enable_visibility_rules'] ) ? $form_data['enable_visibility_rules'] : '';
$visibility_rules        = isset( $form_data['visibility_rules'] ) ? $form_data['visibility_rules'] : array();

// The list of all public taxonomies registered for post type product.
$_taxonomies = get_taxonomies(
	array(
		'object_type' => array( 'product' ),
		'public'      => true,
	)
);

$taxonomies = array();

foreach ( $_taxonomies as $taxonomy ) {
	$terms = get_terms( array( 'taxonomy' => $taxonomy, 'hide_empty' => false ) );

	if ( ! $terms ) {
		continue;
	}

	$taxonomy_data = get_taxonomy( $taxonomy );

	$taxonomies[ $taxonomy ] = $taxonomy_data->label;
}
?>

<div class="visibility-rules-meta-box">
	<div class="wcapf-form-field">
		<div class="wcapf-form-sub-field hide-on-field">
			<div class="wcapf-form-sub-field-label">
				<?php esc_html_e( 'Hide on', 'wc-ajax-product-filter' ); ?>
			</div>
			<div class="wcapf-wrapper">
				<label>
					<input
						type="checkbox"
						name="hide_on[]"
						value="mobile"
						<?php echo in_array( 'mobile', $hide_on ) ? 'checked="checked"' : ''; ?>
					>
					<?php esc_html_e( 'Mobile', 'wc-ajax-product-filter' ); ?>
				</label>
				<label>
					<input
						type="checkbox"
						name="hide_on[]"
						value="tablet"
						<?php echo in_array( 'tablet', $hide_on ) ? 'checked="checked"' : ''; ?>
					>
					<?php esc_html_e( 'Tablet', 'wc-ajax-product-filter' ); ?>
				</label>
				<label>
					<input
						type="checkbox"
						name="hide_on[]"
						value="desktop"
						<?php echo in_array( 'desktop', $hide_on ) ? 'checked="checked"' : ''; ?>
					>
					<?php esc_html_e( 'Desktop', 'wc-ajax-product-filter' ); ?>
				</label>
			</div>
		</div>

		<div class="wcapf-form-sub-field enable-visibility-rules-field">
			<div class="wcapf-form-sub-field-label">
				<label for="enable_visibility_rules">
					<?php esc_html_e( 'Enable visibility rules', 'wc-ajax-product-filter' ); ?>
				</label>
			</div>
			<div class="wcapf-wrapper">
				<input
					type="checkbox"
					name="enable_visibility_rules"
					id="enable_visibility_rules" value="1"
					<?php checked( $enable_visibility_rules, '1' ); ?>
				>
			</div>
		</div>

		<div
			class="wcapf-form-sub-field visibility-rules-field<?php echo ! $enable_visibility_rules ? ' disabled' : ''; ?>"
		>
			<div class="wcapf-form-sub-field-label">
				<?php esc_html_e( 'Show the filter form if', 'wc-ajax-product-filter' ); ?>
			</div>
			<div class="wcapf-wrapper">
				<div class="visibility-rules">
					<div class="visibility-rules-group">
						<?php
						WCAPF_Template_Loader::get_instance()->load(
							'admin/visibility-rules/single-line-rule',
							array( 'taxonomies' => $taxonomies )
						);
						?>
					</div>

					<p>
						<button class="button button-secondary button-small add-new-rule-btn" type="button">
							<?php esc_html_e( 'Add rule group', 'wc-ajax-product-filter' ); ?>
						</button>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
