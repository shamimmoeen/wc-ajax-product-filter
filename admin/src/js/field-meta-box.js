/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

	$( '#available_fields' ).on( 'change', '[name="_active_field"]', function() {
		const $this      = $( this );
		const _fieldType = $this.val();
		const fieldName  = $this.attr( 'data-field-name' );

		if ( ! _fieldType ) {
			return;
		}

		const fieldType = 'wcapf-form-field-' + _fieldType;

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const template         = wp.template( fieldType );
		const rendered         = template();
		const fieldDataWrapper = fieldWrapper.find( '#field_data' );
		const fieldNameWrapper = fieldWrapper.find( '.postbox-header h2' );
		const fieldInside      = fieldWrapper.find( '.inside' );

		fieldWrapper.removeClass( 'hidden' );

		fieldDataWrapper.attr( 'data-field-type', _fieldType );
		fieldNameWrapper.html( fieldName );
		fieldInside.html( rendered );

		fieldWrapper.trigger( 'field_added' );
	} );

} );
