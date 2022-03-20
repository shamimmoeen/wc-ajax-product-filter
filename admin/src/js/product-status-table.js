/**
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function() {

	const tableIdentifier = '.product-status-options-table';
	const valueIdentifier = '.wcapf-form-sub-field-product_status_options input';
	const rowTemplateId   = 'wcapf-product-status-option';

	initManualOptionsTable( tableIdentifier, valueIdentifier, rowTemplateId );

} );
