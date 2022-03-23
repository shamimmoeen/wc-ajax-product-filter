/**
 * Manual Options' table function.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

/**
 * @param tableIdentifier
 * @param valueIdentifier
 * @param rowTemplateId
 * @param rowDefaultOptions
 */
function initManualOptionsTable( tableIdentifier, valueIdentifier, rowTemplateId, rowDefaultOptions = {} ) {
	const $ = jQuery;

	const $searchForm = $( '#search-form' );

	const fieldIdentifier = '.wcapf-form-field';
	const rowsIdentifier  = '.field-table-body-rows';
	const rowIdentifier   = '.row-item';

	function initSortableTable( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerOptionsChange( $field );
			}
		} ).disableSelection();
	}

	const tableRowsIdentifier = tableIdentifier + ' ' + rowsIdentifier;

	// Init the sortable table after page loads.
	initSortableTable( $searchForm.find( tableRowsIdentifier ) );

	// Init the sortable table after the field is added.
	$searchForm.on( 'field_added', function( e, ui ) {
		initSortableTable( $( ui.item.find( tableRowsIdentifier ) ) );
	} );

	function triggerOptionsChange( $field ) {
		const $valueHolder = $field.find( valueIdentifier );
		const $rows        = $field.find( tableRowsIdentifier );
		const _rows        = [];

		$rows.find( '.row-item' ).each( function( i, _item ) {
			const $item = $( _item );
			const obj   = {};

			$item.find( '[data-name]' ).each( function( fieldIndex, field ) {
				const $field = $( field );
				const name   = $field.attr( 'data-name' );

				obj[ name ] = $field.val();
			} );

			_rows.push( obj );
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	function triggerRemoveOption( $field ) {
		const $optionsTable = $field.find( tableIdentifier );
		const tableRows     = $field.find( tableRowsIdentifier ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	// Remove Option
	const removeBtnIdentifier = tableIdentifier + ' .remove-option';

	$searchForm.on( 'click', removeBtnIdentifier, function() {
		const $item  = $( this ).closest( rowIdentifier );
		const $field = $item.closest( fieldIdentifier );

		triggerRemoveOption( $field );

		$item.remove();

		triggerOptionsChange( $field );
	} );

	// Clear All Options
	const clearOptionsBtnIdentifier = tableIdentifier + ' .clear-options';

	$searchForm.on( 'click', clearOptionsBtnIdentifier, function() {
		const $field = $( this ).closest( fieldIdentifier );

		$field.find( tableRowsIdentifier ).empty();

		triggerRemoveOption( $field );
		triggerOptionsChange( $field );
	} );

	// Add New Option
	const addOptionBtnIdentifier = tableIdentifier + ' .add-option';

	$searchForm.on( 'click', addOptionBtnIdentifier, function() {
		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + rowTemplateId ).length ) {
			return;
		}

		const $field = $( this ).closest( fieldIdentifier );

		const template = wp.template( rowTemplateId );
		const rendered = template( rowDefaultOptions );
		const $table   = $field.find( tableIdentifier );
		const $rows    = $field.find( tableRowsIdentifier );

		$rows.append( rendered );

		triggerOptionsChange( $field );

		$searchForm.trigger( 'new_option_added', [ $field ] );

		if ( ! $table.hasClass( 'has-options' ) ) {
			$table.addClass( 'has-options' );
		}
	} );

	// Trigger options change when the text fields get changed.
	const textFieldsIdentifier = tableRowsIdentifier + ' input[type="text"]';

	$searchForm.on( 'input', textFieldsIdentifier, function() {
		const $field = $( this ).closest( fieldIdentifier );

		triggerOptionsChange( $field );
	} );

	// Trigger options change when the select fields get changed.
	let selectFieldsIdentifier = tableRowsIdentifier + ' select';

	$searchForm.on( 'change', selectFieldsIdentifier, function() {
		const $field = $( this ).closest( fieldIdentifier );

		triggerOptionsChange( $field );
	} );

	// Trigger options change when value is added from modal.
	$searchForm.on( 'trigger_options_table', function( e, tableId, $field ) {
		if ( tableId === tableIdentifier ) {
			triggerOptionsChange( $field );
		}
	} );

}
