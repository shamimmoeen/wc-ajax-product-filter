<?php
/**
 * The search form field template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

/**
 * Available data for the field template.
 *
 * @var string $field_key
 * @var string $field_name
 * @var array  $field_instance
 */

$wcapf_field_classes = 'widget ' . $field_key;

if ( isset( $field_instance ) ) {
	$wcapf_field_classes .= ' sub-fields-ready';
}
?>

<div class="<?php echo esc_attr( $wcapf_field_classes ); ?>" data-field-type="<?php echo esc_attr( $field_key ); ?>">
	<div class="widget-top">
		<div class="widget-title-action">
			<button type="button" class="widget-action" aria-expanded="false">
				<span class="toggle-indicator" aria-hidden="true"></span>
			</button>
		</div>
		<div class="widget-title ui-sortable-handle">
			<h3><?php echo esc_html( $field_name ); ?></h3>
		</div>
	</div>

	<div class="widget-inside">

		<div class="widget-content">
			<?php
			if ( isset( $field_instance ) ) {
				WCAPF_Helper::render_field_form_by_instance( $field_instance );
			}
			?>

			<div class="widget-control-actions">
				<button type="button" class="button-link button-link-delete widget-control-remove">
					<?php esc_html_e( 'Delete', 'wc-ajax-product-filter' ); ?>
				</button>
				|
				<button type="button" class="button-link widget-control-close">
					<?php esc_html_e( 'Done', 'wc-ajax-product-filter' ); ?>
				</button>
			</div>
		</div>

	</div>
</div>
