/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			const $queryType        = $field.find( '.wcapf-form-sub-field-query_type' );
			const validDisplayTypes = [ 'label', 'color', 'image' ];

			if ( validDisplayTypes.includes( value ) ) {
				const $multipleFilter = $field.find( '.wcapf-form-sub-field-enable_multiple_filter input' );

				if ( $multipleFilter.is( ':checked' ) ) {
					$queryType.show();
				} else {
					$queryType.hide();
				}
			}
		}
	} );

	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-enable_multiple_filter input' === handler ) {
			const $queryType        = $field.find( '.wcapf-form-sub-field-query_type' );
			const $displayType      = $field.find( '.wcapf-form-sub-field-display_type select' );
			const displayType       = $displayType.val();
			const validDisplayTypes = [ 'label', 'color', 'image' ];

			if ( validDisplayTypes.includes( displayType ) ) {
				if ( '1' === value ) {
					$queryType.show();
				} else {
					$queryType.hide();
				}
			}
		}
	} );

} );
