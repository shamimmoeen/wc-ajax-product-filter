/**
 * Taxonomy's default field key.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-taxonomy select' === handler ) {
			const $fieldKey = $field.find( '.wcapf-form-sub-field-field_key' );

			$fieldKey.find( 'input[type="text"]' ).val( value );
		}
	} );

} );
