/**
 * The number ui options.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const $searchForm = $( '#search-form' );

	/**
	 * Toggle disabled attribute of min-value field for number type.
	 */
	function toggleNumberMinValueField( $elm ) {
		const $field     = $elm.closest( '.wcapf-form-field' );
		const $textField = $field.find( '.wcapf-form-sub-field-min_value input[type="text"]' );

		if ( $elm.is( ':checked' ) ) {
			$textField.attr( 'disabled', 'disabled' );
		} else {
			$textField.removeAttr( 'disabled' );
		}
	}

	$searchForm.find( '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]' ).each( function() {
		const $this = $( this );

		toggleNumberMinValueField( $this );
	} );

	$searchForm.on(
		'click',
		'.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]',
		function() {
			const $this = $( this );

			toggleNumberMinValueField( $this );
		}
	);

	/**
	 * Toggle disabled attribute of max-value field for number type.
	 */
	function toggleNumberMaxValueField( $elm ) {
		const $field     = $elm.closest( '.wcapf-form-field' );
		const $textField = $field.find( '.wcapf-form-sub-field-max_value input[type="text"]' );

		if ( $elm.is( ':checked' ) ) {
			$textField.attr( 'disabled', 'disabled' );
		} else {
			$textField.removeAttr( 'disabled' );
		}
	}

	$searchForm.find( '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]' ).each( function() {
		const $this = $( this );

		toggleNumberMaxValueField( $this );
	} );

	$searchForm.on(
		'click',
		'.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]',
		function() {
			const $this = $( this );

			toggleNumberMaxValueField( $this );
		}
	);

} );
