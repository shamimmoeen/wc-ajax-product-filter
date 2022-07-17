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
 */

$filter_title = $for_tmpl ? '{{{data.title}}}' : $filter_title;
$filter_id    = $for_tmpl ? '{{{data.id}}}' : $filter_id;
$filter_key   = $for_tmpl ? '{{{data.key}}}' : $filter_key;
?>

<div class="widget">
	<div class="widget-top">
		<div class="widget-title-action">
			<button type="button" class="widget-action hide-if-no-js" aria-expanded="false">
				<span class="toggle-indicator" aria-hidden="true"></span>
			</button>
		</div>
		<div class="widget-title ui-sortable-handle">
			<h3>
				<?php echo esc_html( $filter_title ); ?>
				<span class="filter-key"><?php echo esc_html( $filter_key ); ?></span>
			</h3>
		</div>
	</div>
	<div class="widget-inside">
		<div class="widget-content">
			<?php do_action( 'wcapf_filter_form_item_inner_content', $filter_id ); ?>
			<input type="hidden" name="filter_id[]" value="<?php echo esc_attr( $filter_id ); ?>">
		</div>

		<div class="widget-control-actions">
			<div class="alignleft">
				<button type="button" class="button-link button-link-delete widget-control-remove">
					<?php esc_html_e( 'Delete', 'wc-ajax-product-filter' ); ?>
				</button>
				<span class="widget-control-close-wrapper">
					|
					<button type="button" class="button-link widget-control-close">
						<?php esc_html_e( 'Done', 'wc-ajax-product-filter' ); ?>
					</button>
				</span>
			</div>
			<br class="clear">
		</div>
	</div>
</div>
