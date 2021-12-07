/**
 * The widget's backend scripts.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

console.log( 'hello world!' );

function displayType() {
	console.log( 'changed' );
}

jQuery( document ).on( 'change', '.wcapf-widget-field-display_type input[type="checkbox"]', displayType );

function logMyName( name ) {
	console.log( 'name', name );
}
