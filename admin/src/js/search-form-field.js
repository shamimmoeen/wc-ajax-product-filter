/**
 * The search form field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const $searchForm = $( '#search-form' );

	// Override no-results-message, all-items-label field's toggle visibility when text display type is changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			const $noResults     = $field.find( '.wcapf-form-sub-field-chosen_no_results_message' );
			const $allItemsLabel = $field.find( '.wcapf-form-sub-field-all_items_label' );
			const useChosen      = $field.find( '.wcapf-form-sub-field-use_chosen input' ).is( ':checked' );

			if ( useChosen && ( 'select' === value || 'multi-select' === value ) ) {
				$noResults.show();
			} else {
				$noResults.hide();
			}

			if ( ( 'radio' === value || 'select' === value ) || ( 'multi-select' === value && useChosen ) ) {
				$allItemsLabel.show();
			} else {
				$allItemsLabel.hide();
			}
		}
	} );

	// Override no-results-message, all-items-label field's toggle visibility when text use chosen is changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-use_chosen input' === handler ) {
			const $noResults     = $field.find( '.wcapf-form-sub-field-chosen_no_results_message' );
			const $allItemsLabel = $field.find( '.wcapf-form-sub-field-all_items_label' );
			const displayType    = $field.find( '.wcapf-form-sub-field-display_type select' ).val();

			if ( '1' === value && ( 'select' === displayType || 'multi-select' === displayType ) ) {
				$noResults.show();
			} else {
				$noResults.hide();
			}

			if (
				( '1' === value && 'multi-select' === displayType )
				|| ( 'radio' === displayType || 'select' === displayType )
			) {
				$allItemsLabel.show();
			} else {
				$allItemsLabel.hide();
			}
		}
	} );

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
