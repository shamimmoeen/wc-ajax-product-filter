<?php
/**
 * The visibility rules meta box template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

if ( 'wcapf-filter' === get_post_type() ) {
	$data = get_post_meta( get_the_ID(), '_field_data', true );

	$reset_filter_visibility_rules = '';
} else {
	$data = get_post_meta( get_the_ID(), '_form_data', true );

	$reset_filter_visibility_rules = isset( $data['reset_filter_visibility_rules'] )
		? $data['reset_filter_visibility_rules']
		: '';
}

$enable_visibility_rules = isset( $data['enable_visibility_rules'] ) ? $data['enable_visibility_rules'] : '';
$visibility_rules        = isset( $data['visibility_rules'] ) ? $data['visibility_rules'] : array();

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

<div class="tab-content-alt">
	<p class="description">
		<?php
		if ( 'wcapf-filter' === get_post_type() ) {
			esc_html_e( 'Create a set of rules to determine which page will display this filter.', 'wc-ajax-product-filter' );
		} else {
			esc_html_e( 'Create a set of rules to determine which page will display this filter form.', 'wc-ajax-product-filter' );
		}
		?>
	</p>
	<div class="visibility-rules-meta-box">
		<div class="wcapf-form-field">
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
						id="enable_visibility_rules"
						value="1"
						<?php checked( $enable_visibility_rules, '1' ); ?>
					>
				</div>
			</div>

			<div
				class="wcapf-form-sub-field visibility-rules-field<?php echo ! $enable_visibility_rules ? ' disabled' : ''; ?>"
			>
				<div class="wcapf-form-sub-field-label">
					<?php
					if ( 'wcapf-filter' === get_post_type() ) {
						esc_html_e( 'Show the filter if', 'wc-ajax-product-filter' );
					} else {
						esc_html_e( 'Show the filter form if', 'wc-ajax-product-filter' );
					}
					?>
				</div>
				<div class="wcapf-wrapper">
					<div class="visibility-rules">
						<div class="visibility-rules-group">
							<?php
							if ( $visibility_rules ) {
								foreach ( $visibility_rules as $visibility_rule ) {
									WCAPF_Template_Loader::get_instance()->load(
										'admin/visibility-rules/single-line-rule',
										array( 'taxonomies' => $taxonomies, 'rules' => $visibility_rule )
									);
								}
							} else {
								WCAPF_Template_Loader::get_instance()->load(
									'admin/visibility-rules/single-line-rule',
									array( 'taxonomies' => $taxonomies, 'rules' => array() )
								);
							}
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

			<?php if ( 'wcapf-form' === get_post_type() ) : ?>
				<div class="wcapf-form-sub-field reset-filter-visibility-rules">
					<div class="wcapf-form-sub-field-label">
						<label for="reset_filter_visibility_rules">
							<?php esc_html_e( 'Reset filter visibility rules', 'wc-ajax-product-filter' ); ?>
						</label>
					</div>
					<div class="wcapf-wrapper">
						<input
							type="checkbox"
							name="reset_filter_visibility_rules"
							id="reset_filter_visibility_rules"
							value="1"
							<?php checked( $reset_filter_visibility_rules, '1' ); ?>
						>
					</div>
				</div>
			<?php endif; ?>
		</div>

		<?php $_visibility_rules = rawurlencode( json_encode( $visibility_rules ) ); ?>

		<input
			type="hidden"
			id="visibility_rules"
			name="visibility_rules"
			value="<?php echo $_visibility_rules; ?>"
		>
	</div>
</div>
