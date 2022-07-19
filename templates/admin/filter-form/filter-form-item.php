<?php
/**
 * The filter form item template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/filter-form
 * @author     wptools.io
 */

/**
 * @var array  $for_tmpl     Determines if render the tmpl version or not.
 * @var string $filter_title The filter title.
 * @var string $filter_id    The filter id.
 * @var string $filter_key   The filter key.
 * @var string $edit_link    The filter edit link.
 */

$filter_title = $for_tmpl ? '{{{data.title}}}' : $filter_title;
$filter_id    = $for_tmpl ? '{{{data.id}}}' : $filter_id;
$filter_key   = $for_tmpl ? '{{{data.key}}}' : $filter_key;
$edit_link    = $for_tmpl ? '{{{data.edit_link}}}' : $edit_link;
?>

<div class="widget">
	<div class="widget-top">
		<div class="widget-title ui-sortable-handle">
			<h3>
				<?php echo esc_html( $filter_title ); ?>
				<span class="filter-key"><?php echo esc_html( $filter_key ); ?></span>
			</h3>
		</div>
		<div class="widget-action-buttons">
			<a href="<?php echo $edit_link; ?>" class="button-link" target="_blank">
				<span class="dashicons dashicons-edit-page"></span>
			</a>
			<button type="button" class="button-link button-link-delete widget-control-remove">
				<span class="dashicons dashicons-trash"></span>
			</button>
		</div>
	</div>
	<div class="widget-inside">
		<input type="hidden" name="filter_id[]" class="filter-id" value="<?php echo esc_attr( $filter_id ); ?>">
	</div>
</div>
