/**
 * The toggle visibility scripts.
 *
 * NOTE: These scripts must be located at the very bottom of the combined scripts.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

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
				{
					'selector': '.input-type-date-fields',
					'value': [ 'date' ],
				},
				{
					'selector': '.value-decimal-fields',
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
				{
					'selector': '.wcapf-form-sub-field-use_category_images',
					'value': [ 'image' ],
				},
				{
					'selector': '.wcapf-form-sub-field-enable_multiple_filter',
					'value': [ 'label', 'color', 'image' ],
				},
				{
					'selector': '.column-group-custom_appearance',
					'value': [ 'color', 'image' ],
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
			'handler': '.wcapf-form-sub-field-hierarchical input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-value_decimal input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-value_decimal_places',
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
					'selector': '.column-group-meta_key_manual_options',
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
					'selector': '.wcapf-form-sub-field-align_values_at_the_end',
					'value': [ 'range_slider' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_query_type',
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
					'selector': '.wcapf-form-sub-field-number_range_enable_multiple_filter',
					'value': [ 'range_label' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_show_count',
					'value': [ 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label' ],
				},
				{
					'selector': '.wcapf-form-sub-field-number_range_hide_empty',
					'value': [ 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label' ],
				},
				{
					'selector': '.number-decimal-fields',
					'value': [ 'range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label' ],
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
		{
			'handler': '.wcapf-form-sub-field-date_display_type select',
			'handlerType': 'select',
			'event': 'change',
			'dependant': [
				{
					'selector': '.date-to-ui-options',
					'value': [ 'input_date_range' ],
				},
				{
					'selector': '.wcapf-form-sub-field-date_format',
					'value': [ 'input_date', 'input_date_range' ],
				},
				{
					'selector': '.wcapf-form-sub-field-show_date_inputs_inline',
					'value': [ 'input_date_range' ],
				},
				{
					'selector': '.date-picker-fields',
					'value': [ 'input_date', 'input_date_range' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_query_type',
					'value': [ 'time_period_checkbox', 'time_period_multiselect' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_select_all_items_label',
					'value': [ 'time_period_radio', 'time_period_select' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_use_chosen',
					'value': [ 'time_period_select', 'time_period_multiselect' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_enable_multiple_filter',
					'value': [ 'time_period_label' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_show_count',
					'value': [ 'time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label' ],
				},
				{
					'selector': '.wcapf-form-sub-field-time_period_hide_empty',
					'value': [ 'time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-time_period_use_chosen input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-time_period_chosen_no_results_message',
					'value': [ '1' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-enable_soft_limit input',
			'handlerType': 'radio',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-soft_limit',
					'value': [ 'enable' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-taxonomy select',
			'handlerType': 'select',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-custom-taxonomy select',
			'handlerType': 'select',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-meta_key select',
			'handlerType': 'select',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-post_property select',
			'handlerType': 'select',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-limit_options select',
			'handlerType': 'select',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-parent_term',
					'value': [ 'child' ],
				},
				{
					'selector': '.wcapf-form-sub-field-limit_values_by_id',
					'value': [ 'include', 'exclude' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-enable_accordion input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-accordion_default_state',
					'value': [ '1' ],
				},
				{
					'selector': '.wcapf-form-sub-field-move_clear_filters_button_in_accordion_heading',
					'value': [ '1' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-enable_multiple_filter input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-use_category_images input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-number_range_enable_multiple_filter input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-time_period_enable_multiple_filter input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-show_if_empty input',
			'handlerType': 'checkbox',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-empty_filter_message',
					'value': [ '1' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-show_title input',
			'handlerType': 'checkbox',
			'event': 'change',
		},
		{
			'handler': '.wcapf-form-sub-field-enable_active_filters_soft_limit input',
			'handlerType': 'radio',
			'event': 'change',
			'dependant': [
				{
					'selector': '.active-filters-soft-limit-fields',
					'value': [ 'enable' ],
				},
			],
		},
		{
			'handler': '.wcapf-form-sub-field-active_filters_layout input',
			'handlerType': 'radio',
			'event': 'change',
			'dependant': [
				{
					'selector': '.wcapf-form-sub-field-soft_limit',
					'value': [ 'simple' ],
				},
				{
					'selector': '.wcapf-form-sub-field-soft_limit_filter_groups',
					'value': [ 'extended' ],
				},
			],
		},
	];

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

		fieldWrapper.trigger( 'after_toggle_request', [ handler, _value, $field ] );
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

	function setupField( inital = false ) {
		$.each( dependantData, function( i, data ) {
			const handler = data[ 'handler' ];
			const event   = data[ 'event' ];

			handleToggleRequest( data, null, null );

			if ( inital ) {
				fieldWrapper.on( event, handler, function() {
					const _this  = $( this );
					const _value = $( this ).val();
					handleToggleRequest( data, _this, _value );
				} );

				if ( ! $( fieldWrapper ).hasClass( 'loaded' ) ) {
					$( fieldWrapper ).addClass( 'loaded' );

					fieldWrapper.trigger( 'field_added' );
				}
			}
		} );
	}

	setupField( true );

	fieldWrapper.on( 'field_added', function() {
		// Toggle the visibility of subfields.
		setupField();
	} );

} );
