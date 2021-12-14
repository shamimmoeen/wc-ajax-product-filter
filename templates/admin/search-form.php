<?php
/**
 * The search form template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

?>

<div class="postbox">
	<div class="postbox-header">
		<h2><?php esc_html_e( 'Available Fields', 'wc-ajax-product-filter' ); ?></h2>
	</div>
	<div class="inside">
		<p class="description">
			<?php
			printf(
				/* translators: The area where the search form fields exist. */
				esc_html__(
					'Drag any of these fields into the %1$s to start building your search form.',
					'wc-ajax-product-filter'
				),
				'<strong>' . esc_html__( 'Search Form UI', 'wc-ajax-product-filter' ) . '</strong>'
			);
			?>
		</p>

		<div id="available-fields">
			<?php foreach ( WCAPF_Helper::available_search_fields() as $wcapf_field_key => $wcapf_field ) : ?>
				<?php
				WCAPF_Template_Loader::get_instance()->load(
					'admin/form-field',
					array(
						'field_key'  => $wcapf_field_key,
						'field_name' => $wcapf_field,
					)
				)
				?>
			<?php endforeach; ?>
		</div>
	</div>
</div>

<form id="search-form" class="postbox" method="post">
	<div class="postbox-header">
		<h2><?php esc_html_e( 'Search Form UI', 'wc-ajax-product-filter' ); ?></h2>
	</div>
	<div class="inside">
		<p class="description">
			<?php
			printf(
				/* translators: The area where the search form fields exist. */
				esc_html__(
					'Build your search form by dragging %1$s into this area.',
					'wc-ajax-product-filter'
				),
				'<strong>' . esc_html__( 'Available Fields', 'wc-ajax-product-filter' ) . '</strong>'
			);
			?>
		</p>

		<div id="search-form-wrapper">
			<?php WCAPF_Helper::render_form_fields(); ?>
		</div>

		<input
			type="hidden"
			id="total_field_instances"
			name="total_field_instances"
			value="<?php echo esc_attr( count( WCAPF_Helper::get_form_config() ) ); ?>"
		>
		<input type="hidden" name="action" value="wcapf_save_form">
	</div>
</form>
