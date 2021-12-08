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
				<div class="available-field <?php echo esc_attr( $wcapf_field_key ); ?>">
					<h4><?php echo esc_html( $wcapf_field ); ?></h4>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>

<div id="search-form" class="postbox">
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
			<div class="available-field"><h4>Hello</h4></div>
			<div class="available-field"><h4>World</h4></div>
		</div>
	</div>
</div>
