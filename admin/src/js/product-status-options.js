/**
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const $searchForm = $( '#search-form' );

	function triggerProductStatusOptionsChange( $field ) {
		const $valueHolder  = $field.find( '.wcapf-form-sub-field-product_status_options input' );
		const $optionsTable = $field.find( '.product-status-options-table' );
		const $rows         = $optionsTable.find( '.manual-options-table-body-rows' );
		const _rows         = [];

		$rows.find( '.item' ).each( function( i, _item ) {
			const $item = $( _item );
			const value = $item.find( '.option_value' ).val();
			const label = $item.find( '.option_label' ).val();

			if ( value ) {
				_rows.push( [ value, label ] );
			}
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	function initSortableForProductStatusOptions( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerProductStatusOptionsChange( $field );
			}
		} ).disableSelection();
	}

	// Sort Manual Options
	initSortableForProductStatusOptions( $searchForm.find( '.product-status-options-table .manual-options-table-body-rows' ) );

	$searchForm.on( 'field_added', function( e, ui ) {
		// Init Sortable for the manual options.
		initSortableForProductStatusOptions( $( ui.item.find( '.manual-options-table-body-rows' ) ) );
	} );

	function triggerRemoveProductStatusOption( $field ) {
		const $optionsTable = $field.find( '.product-status-options-table' );
		const tableRows     = $optionsTable.find( '.manual-options-table-body-rows' ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	// Remove Single Number Option
	$searchForm.on( 'click', '.remove-product-status-option', function() {
		const $item  = $( this ).closest( '.item' );
		const $field = $item.closest( '.wcapf-form-field' );

		triggerRemoveProductStatusOption( $field );

		$item.remove();

		triggerProductStatusOptionsChange( $field );
	} );

	// Clear All Options
	$searchForm.on( 'click', '.clear-all-product-status-options', function() {
		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $optionsTable = $field.find( '.product-status-options-table' );

		$optionsTable.find( '.manual-options-table-body-rows' ).empty();

		triggerRemoveProductStatusOption( $field );

		triggerProductStatusOptionsChange( $field );
	} );

	// Add New Option
	$searchForm.on( 'click', '.add-product-status-option', function() {
		const fieldType = 'wcapf-product-status-option';

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const $field = $( this ).closest( '.wcapf-form-field' );

		const template = wp.template( fieldType );
		const rendered = template( { value: '', label: '' } );
		const $wrapper = $field.find( '.product-status-options-table' );
		const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

		$rows.append( rendered );

		triggerProductStatusOptionsChange( $field );

		if ( ! $wrapper.hasClass( 'has-options' ) ) {
			$wrapper.addClass( 'has-options' );
		}
	} );

	$searchForm.on( 'input', '.product-status-options-table input[type="text"]', function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerProductStatusOptionsChange( $field );
	} );

	$searchForm.on( 'change', '.product-status-options-table .option_value', function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerProductStatusOptionsChange( $field );
	} );

} );
