<?php
/**
 * The filter form meta box template.
 *
 * @since      3.0.1
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/filter-form
 * @author     wptools.io
 */

/**
 * @var array $available_filters The available filters.
 * @var array $filter_ids        The filter ids.
 */

?>

<nav class="nav-tab-wrapper wp-clearfix filter-form-menu" aria-label="Filter Form Menu">
	<a role="button" class="nav-tab nav-tab-active" data-for="general">
		<?php esc_html_e( 'Filter Form', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="settings">
		<?php esc_html_e( 'Settings', 'wc-ajax-product-filter' ); ?>
	</a>
	<a role="button" class="nav-tab" data-for="customize">
		<?php esc_html_e( 'Customize', 'wc-ajax-product-filter' ); ?>
	</a>
</nav>

<br>

<?php
WCAPF_Template_Loader::get_instance()->load(
	'admin/filter-form/tab/general',
	array(
		'available_filters' => $available_filters,
		'filter_ids'        => $filter_ids,
	)
);

WCAPF_Template_Loader::get_instance()->load(
	'admin/filter-form/tab/settings',
	array(
		'available_filters' => $available_filters,
		'filter_ids'        => $filter_ids,
	)
);

WCAPF_Template_Loader::get_instance()->load(
	'admin/filter-form/tab/customize',
	array(
		'available_filters' => $available_filters,
		'filter_ids'        => $filter_ids,
	)
);
