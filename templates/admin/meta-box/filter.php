<?php
/**
 * The filter meta box template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box
 * @author     wptools.io
 */

/**
 * @var array  $available_fields  The available fields.
 * @var string $field_type        The active field type.
 * @var string $active_field_name The active field name.
 * @var array  $field_data        The active field data.
 */
?>

<nav id="meta-box-nav-tab" class="nav-tab-wrapper wp-clearfix">
	<a role="button" class="nav-tab nav-tab-active" data-for="general">
		<?php esc_html_e( 'Filter UI', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="visibility-rules">
		<?php esc_html_e( 'Visibility Rules', 'wc-ajax-product-filter' ); ?>
	</a>
</nav>

<div class="tab-content tab-general">
	<?php
	WCAPF_Template_Loader::get_instance()->load(
		'admin/meta-box/tab-content/filter-ui',
		array(
			'available_fields'  => $available_fields,
			'field_type'        => $field_type,
			'active_field_name' => $active_field_name,
			'field_data'        => $field_data,
		)
	);
	?>
</div>

<div class="tab-content tab-content-alt tab-visibility-rules">
	<?php WCAPF_Template_Loader::get_instance()->load( 'admin/meta-box/tab-content/visibility-rules' ); ?>
</div>
