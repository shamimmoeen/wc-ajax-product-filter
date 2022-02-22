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

	const dependantData = [
		{
			'handler': '.wcapf-form-sub-field-value_type select',
			'handlerType': 'select',
			'event': 'change',
			'dependant': [
				{
					'selector': '.input-type-text-fields',
					'value': [ 'text' ],
				},
				{
					'selector': '.input-type-number-fields',
					'value': [ 'number' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-display_type select',
			'handlerType': 'select',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-query_type',
					'value': [ 'checkbox', 'multi-select' ],
				},
				{
					'selector': '.wcapf-form-sub-field-all_items_label',
					'value': [ 'radio', 'select' ],
				},
				{
					'selector': '.wcapf-form-sub-field-use_chosen',
					'value': [ 'select', 'multi-select' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-use_chosen input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-chosen_no_results_message',
					'value': [ '1' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-get_options input',
			'handlerType': 'radio',
			'event': 'change',
			'dependant': [
				{
					'selector': '.manual-options-table',
					'value': [ 'manual_entry' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-number_display_type select',
			'handlerType': 'select',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-number_range_slider_display_values_as',
					'value': [ 'range_slider' ],
				},
				{
					'selector': '.number-decimal-fields',
					'value': [ 'range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_checkbox_query_type',
					'value': [ 'range_checkbox', 'range_multiselect' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
					'value': [ 'range_radio', 'range_select' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_use_chosen',
					'value': [ 'range_select', 'range_multiselect' ],
				},
				{
					'selector': '.number_range_col2_sub_fields',
					'value': [ 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-number_range_use_chosen input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-number_range_chosen_no_results_message',
					'value': [ '1' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-number_get_options input',
			'handlerType': 'radio',
			'event': 'change',
			'dependant': [
				{
					'selector': '.number-automatic-options',
					'value': [ 'automatically' ],
				},
				{
					'selector': '.number-manual-options-table',
					'value': [ 'manual_entry' ],
				},
			],
		},
	];

	function _triggerInputTypeTextDisplayTypeChange( value, $field ) {
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

	function _triggerInputTypeNumberDisplayTypeChange( value, $field ) {
		const $noResults     = $field.find( '.wcapf-form-sub-field-number_range_chosen_no_results_message' );
		const $allItemsLabel = $field.find( '.wcapf-form-sub-field-number_range_select_all_items_label' );
		const useChosen      = $field.find( '.wcapf-form-sub-field-number_range_use_chosen input' ).is( ':checked' );

		if ( useChosen && ( 'range_select' === value || 'range_multiselect' === value ) ) {
			$noResults.show();
		} else {
			$noResults.hide();
		}

		if ( ( 'range_radio' === value || 'range_select' === value ) || ( 'range_multiselect' === value && useChosen ) ) {
			$allItemsLabel.show();
		} else {
			$allItemsLabel.hide();
		}
	}

	function _triggerInputTypeTextUseSelectChange( value, $field ) {
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

	function _triggerInputTypeNumberUseSelectChange( value, $field ) {
		const $noResults     = $field.find( '.wcapf-form-sub-field-number_range_chosen_no_results_message' );
		const $allItemsLabel = $field.find( '.wcapf-form-sub-field-number_range_select_all_items_label' );
		const displayType    = $field.find( '.wcapf-form-sub-field-number_display_type select' ).val();

		if ( '1' === value && ( 'range_select' === displayType || 'range_multiselect' === displayType ) ) {
			$noResults.show();
		} else {
			$noResults.hide();
		}

		if (
			( '1' === value && 'range_multiselect' === displayType )
			|| ( 'range_radio' === displayType || 'range_select' === displayType )
		) {
			$allItemsLabel.show();
		} else {
			$allItemsLabel.hide();
		}
	}

	function _handleToggleRequest( data, currentSelector, value ) {
		const $field      = currentSelector.closest( '.wcapf-form-field' );
		const handler     = data[ 'handler' ];
		const handlerType = data[ 'handlerType' ];
		const dependant   = data[ 'dependant' ];

		let _value = value;

		if ( 'checkbox' === handlerType ) {
			_value = currentSelector.is( ':checked' ) ? '1' : '0';
		}

		if ( 'radio' === handlerType ) {
			_value = $field.find( handler + ':checked' ).val();
		}

		$.each( dependant, function( id, d ) {
			const $selector   = $field.find( d[ 'selector' ] );
			const validValues = d[ 'value' ];

			if ( validValues.includes( _value ) ) {
				$selector.show();
			} else {
				$selector.hide();
			}
		} );

		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			_triggerInputTypeTextDisplayTypeChange( _value, $field );
		}

		if ( '.wcapf-form-sub-field-use_chosen input' === handler ) {
			_triggerInputTypeTextUseSelectChange( _value, $field );
		}

		if ( '.wcapf-form-sub-field-number_display_type select' === handler ) {
			_triggerInputTypeNumberDisplayTypeChange( _value, $field );
		}

		if ( '.wcapf-form-sub-field-number_range_use_chosen input' === handler ) {
			_triggerInputTypeNumberUseSelectChange( _value, $field );
		}

		$searchForm.trigger( 'after_toggle_request', [ handler, _value, $field ] );
	}

	function handleToggleRequest( data, currentSelector, value ) {
		if ( null === currentSelector ) {
			const handler  = data[ 'handler' ];
			const $handler = $( handler );

			$.each( $handler, function() {
				const _this  = $( this );
				const _value = _this.val();
				_handleToggleRequest( data, _this, _value );
			} );
		} else {
			_handleToggleRequest( data, currentSelector, value );
		}
	}

	function setupSearchForm( inital = false ) {
		$.each( dependantData, function( i, data ) {
			const handler = data[ 'handler' ];
			const event   = data[ 'event' ];

			handleToggleRequest( data, null, null );

			if ( inital ) {
				$searchForm.on( event, handler, function() {
					const _this  = $( this );
					const _value = $( this ).val();
					handleToggleRequest( data, _this, _value );
				} );
			}
		} );
	}

	setupSearchForm( true );

	$searchForm.on( 'field_added', function() {
		// Toggle the visibility of subfields.
		setupSearchForm();
	} );

} );
