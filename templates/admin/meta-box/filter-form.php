<?php
/**
 * The filter form meta box template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box
 * @author     wptools.io
 */

/**
 * @var array $available_filters The available filters.
 * @var array $filter_ids        The filter ids.
 */

?>

<nav id="meta-box-nav-tab" class="nav-tab-wrapper wp-clearfix">
	<a role="button" class="nav-tab nav-tab-active" data-for="general">
		<?php esc_html_e( 'Filter Form UI', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="filter-settings">
		<?php esc_html_e( 'Filter Settings', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="form-settings">
		<?php esc_html_e( 'Form Settings', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="visibility-rules">
		<?php esc_html_e( 'Visibility Rules', 'wc-ajax-product-filter' ); ?>
	</a>
</nav>

<div class="tab-content tab-general">
	<?php
	WCAPF_Template_Loader::get_instance()->load(
		'admin/meta-box/tab-content/filter-form-ui',
		array(
			'available_filters' => $available_filters,
			'filter_ids'        => $filter_ids,
		)
	);
	?>
</div>

<div class="tab-content tab-content-alt tab-filter-settings">
	<?php WCAPF_Template_Loader::get_instance()->load( 'admin/meta-box/tab-content/filter-settings' ); ?>
</div>

<div class="tab-content tab-content-alt tab-form-settings">
	<?php WCAPF_Template_Loader::get_instance()->load( 'admin/meta-box/tab-content/form-settings' ); ?>
</div>

<div class="tab-content tab-content-alt tab-visibility-rules">
	<?php WCAPF_Template_Loader::get_instance()->load( 'admin/meta-box/tab-content/visibility-rules' ); ?>
</div>
