/**
 * The search form field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

( function( $ ) {

	const $searchForm = $( '#search-form' );

	/**
	 * Disables the slider and range option at display_type if the value type is text.
	 */
	function initDisplayTypeField( el ) {
		const $subField         = $( el );
		const valueTypeValue    = $subField.val();
		const $field            = $subField.closest( '.wcapf-form-field' );
		const $displayTypeField = $field.find( '.wcapf-form-sub-field-display_type select' );
		const displayTypeValue  = $displayTypeField.val();

		$displayTypeField.children( 'option' ).removeAttr( 'disabled' );

		if ( 'text' !== valueTypeValue ) {
			return;
		}

		const dependantOptions = 'option[value="slider"], option[value="range"]';

		$displayTypeField.children( dependantOptions ).attr( 'disabled', 'disabled' );

		if ( 'slider' === displayTypeValue || 'range' === displayTypeValue ) {
			$displayTypeField.prop( 'selectedIndex', 0 ).change();
		}
	}

	function initDisplayTypeFields() {
		const $valueTypes = $searchForm.find( '.wcapf-form-sub-field-value_type select' );

		$valueTypes.each(
			function() {
				initDisplayTypeField( this );
			}
		);
	}

	initDisplayTypeFields();

	$searchForm.on(
		'change',
		'.wcapf-form-sub-field-value_type select',
		function() {
			initDisplayTypeField( this );
		}
	);

	/**
	 * Hides the use_select2 field if the value of display_type field is not 'dropdown'.
	 */
	function initUseSelect2Field( el ) {
		const $subField        = $( el );
		const displayTypeValue = $subField.val();
		const $field           = $subField.closest( '.wcapf-form-field' );
		const $useSelect2Field = $field.find( '.wcapf-form-sub-field-use_select2' );

		if ( 'dropdown' === displayTypeValue ) {
			$useSelect2Field.show();
		} else {
			$useSelect2Field.hide();
		}
	}

	function initUseSelect2Fields() {
		const $valueTypes = $searchForm.find( '.wcapf-form-sub-field-display_type select' );

		$valueTypes.each(
			function() {
				initUseSelect2Field( this );
			}
		);
	}

	initUseSelect2Fields();

	$searchForm.on(
		'change',
		'.wcapf-form-sub-field-display_type select',
		function() {
			initUseSelect2Field( this );
		}
	);

	/**
	 * Hides the enable_multiple field if not appropriate.
	 */
	function initEnableMultipleFilterField( el ) {
		const $subField                  = $( el );
		const displayTypeValue           = $subField.val();
		const $field                     = $subField.closest( '.wcapf-form-field' );
		const $enableMultipleFilterField = $field.find( '.wcapf-form-sub-field-enable_multiple' );
		const $enableMultipleFieldInput  = $enableMultipleFilterField.find( 'input' );
		const enableMultiple             = $enableMultipleFieldInput.is( ':checked' );
		const validDisplayTypes          = [ 'list', 'dropdown', 'cloud', 'range' ];

		if ( validDisplayTypes.includes( displayTypeValue ) ) {
			$enableMultipleFilterField.show();
		} else {
			$enableMultipleFilterField.hide();

			if ( enableMultiple ) {
				$enableMultipleFieldInput.prop( 'checked', false ).change();
			}
		}
	}

	function initEnableMultipleFilterFields() {
		const $valueTypes = $searchForm.find( '.wcapf-form-sub-field-display_type select' );

		$valueTypes.each(
			function() {
				initEnableMultipleFilterField( this );
			}
		);
	}

	initEnableMultipleFilterFields();

	$searchForm.on(
		'change',
		'.wcapf-form-sub-field-display_type select',
		function() {
			initEnableMultipleFilterField( this );
		}
	);

	/**
	 * Hides the query_type field if not appropriate.
	 */
	function initQueryTypeField( el ) {
		const $subField       = $( el );
		const enableMultiple  = $subField.is( ':checked' );
		const $field          = $subField.closest( '.wcapf-form-field' );
		const $queryTypeField = $field.find( '.wcapf-form-sub-field-query_type' );

		if ( enableMultiple ) {
			$queryTypeField.show();
		} else {
			$queryTypeField.hide();
		}
	}

	function initQueryTypeFields() {
		const $valueTypes = $searchForm.find( '.wcapf-form-sub-field-enable_multiple input' );

		$valueTypes.each(
			function() {
				initQueryTypeField( this );
			}
		);
	}

	initQueryTypeFields();

	$searchForm.on(
		'change',
		'.wcapf-form-sub-field-enable_multiple input',
		function() {
			initQueryTypeField( this );
		}
	);

}( jQuery ) );
