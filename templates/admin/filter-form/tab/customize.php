<?php
/**
 * The filter form settings tab content.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/filter-form/tab
 * @author     wptools.io
 */

?>

<div class="tab-content tab-customize">

	<div id="wcapf-form-customize">
		<div id="customize-control">

			<div class="nav-menu-vertical">
				<a role="button" data-for="#nav-form"><?php esc_html_e( 'Form', 'wc-ajax-product-filter' ); ?></a>
				<a role="button" data-for="#nav-filter"><?php esc_html_e( 'Filter', 'wc-ajax-product-filter' ); ?></a>
				<a role="button" data-for="#nav-heading"><?php esc_html_e( 'Heading', 'wc-ajax-product-filter' ); ?></a>
				<a role="button" data-for="#nav-body"><?php esc_html_e( 'Body', 'wc-ajax-product-filter' ); ?></a>
			</div>

			<div class="nav-content">
				<div id="nav-form">The control for form</div>
				<div id="nav-filter">The control for filter</div>
				<div id="nav-heading">The control for heading</div>
				<div id="nav-body">The control for body</div>
			</div>

		</div>
		<div id="form-preview">

		</div>
	</div>

</div>
