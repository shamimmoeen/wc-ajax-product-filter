/**
 * The time since options of date field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const $searchForm = $( '#search-form' );

	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-date_display_type select' === handler ) {
			const $dateUIGroup     = $field.find( '.date-ui-group' );
			const $timePeriodGroup = $field.find( '.time-period-group' );

			if ( 'input_date' === value || 'input_date_range' === value ) {
				$dateUIGroup.show();
				$timePeriodGroup.hide();
			} else {
				$dateUIGroup.hide();
				$timePeriodGroup.show();
			}
		}
	} );

	function triggerTimePeriodOptionsChange( $field ) {
		const $valueHolder  = $field.find( '.wcapf-form-sub-field-time_period_options input' );
		const $optionsTable = $field.find( '.time-period-options-table' );
		const $rows         = $optionsTable.find( '.manual-options-table-body-rows' );
		const _rows         = [];

		$rows.find( '.time-period-item' ).each( function( i, _item ) {
			const $item             = $( _item );
			const value             = $item.find( '.option_value' ).val();
			const label             = $item.find( '.option_label' ).val();
			const difference_type   = $item.find( '.difference_type' ).val();
			const difference_amount = $item.find( '.difference_amount' ).val();
			const difference_unit   = $item.find( '.difference_unit' ).val();

			if ( value ) {
				_rows.push( [ value, label, difference_type, difference_amount, difference_unit ] );
			}
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	function initSortableForTimePeriodOptions( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerTimePeriodOptionsChange( $field );
			}
		} ).disableSelection();
	}

	// Sort Manual Options
	initSortableForTimePeriodOptions( $searchForm.find( '.time-period-options-table .manual-options-table-body-rows' ) );

	$searchForm.on( 'field_added', function( e, ui ) {
		// Init Sortable for the manual options.
		initSortableForTimePeriodOptions( $( ui.item.find( '.manual-options-table-body-rows' ) ) );
	} );

	function triggerRemoveTimePeriodOption( $field ) {
		const $optionsTable = $field.find( '.time-period-options-table' );
		const tableRows     = $optionsTable.find( '.manual-options-table-body-rows' ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	// Remove Single Number Option
	$searchForm.on( 'click', '.remove-time-period-option', function() {
		const $item  = $( this ).closest( '.time-period-item' );
		const $field = $item.closest( '.wcapf-form-field' );

		triggerRemoveTimePeriodOption( $field );

		$item.remove();

		triggerTimePeriodOptionsChange( $field );
	} );

	// Clear All Options
	$searchForm.on( 'click', '.clear-all-time-period-options', function() {
		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $optionsTable = $field.find( '.time-period-options-table' );

		$optionsTable.find( '.manual-options-table-body-rows' ).empty();

		triggerRemoveTimePeriodOption( $field );

		triggerTimePeriodOptionsChange( $field );
	} );

	// Add New Option
	$searchForm.on( 'click', '.add-time-period-option', function() {
		const fieldType = 'wcapf-time-period-option';

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const $field = $( this ).closest( '.wcapf-form-field' );

		const options = {
			value: '',
			label: '',
			difference_type: '',
			difference_amount: '1',
			difference_unit: '',
		};

		const template = wp.template( fieldType );
		const rendered = template( options );
		const $wrapper = $field.find( '.time-period-options-table' );
		const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

		$rows.append( rendered );

		triggerTimePeriodOptionsChange( $field );

		if ( ! $wrapper.hasClass( 'has-options' ) ) {
			$wrapper.addClass( 'has-options' );
		}
	} );

	const rowInputs = '.time-period-options-table input[type="text"],' +
		' .time-period-options-table .option_value,' +
		' .time-period-options-table .difference_type,' +
		' .time-period-options-table .difference_unit';

	$searchForm.on( 'input', rowInputs, function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerTimePeriodOptionsChange( $field );
	} );

	$searchForm.on( 'change', '.time-period-item .option_value', function() {
		const $periodOption     = $( this );
		const periodOption      = $periodOption.val();
		const $periodOptionItem = $periodOption.closest( '.time-period-item' );
		const $customPeriod     = $periodOptionItem.find( '.custom-time-period' );

		if ( 'custom' === periodOption ) {
			$customPeriod.slideDown();
		} else {
			$customPeriod.slideUp();
		}
	} );

} );
