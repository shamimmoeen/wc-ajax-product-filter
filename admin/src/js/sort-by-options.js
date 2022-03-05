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

	function triggerSortByOptionsChange( $field ) {
		const $valueHolder  = $field.find( '.wcapf-form-sub-field-sort_by_options input' );
		const $optionsTable = $field.find( '.sort-by-options-table' );
		const $rows         = $optionsTable.find( '.manual-options-table-body-rows' );
		const _rows         = [];

		$rows.find( '.sort-option-item' ).each( function( i, _item ) {
			const $item          = $( _item );
			const value          = $item.find( '.option_value' ).val();
			const direction      = $item.find( '.option_direction' ).val();
			const label          = $item.find( '.option_label' ).val();
			const meta_key       = $item.find( '.option_meta_key' ).val();
			const meta_sort_type = $item.find( '.option_meta_sort_type' ).val();

			if ( value ) {
				_rows.push( [ value, direction, label, meta_key, meta_sort_type ] );
			}
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	function initSortableForSortByOptions( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerSortByOptionsChange( $field );
			}
		} ).disableSelection();
	}

	// Sort Manual Options
	initSortableForSortByOptions( $searchForm.find( '.sort-by-options-table .manual-options-table-body-rows' ) );

	$searchForm.on( 'field_added', function( e, ui ) {
		// Init Sortable for the manual options.
		initSortableForSortByOptions( $( ui.item.find( '.manual-options-table-body-rows' ) ) );
	} );

	function triggerRemoveSortByOption( $field ) {
		const $optionsTable = $field.find( '.sort-by-options-table' );
		const tableRows     = $optionsTable.find( '.manual-options-table-body-rows' ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	// Remove Single Number Option
	$searchForm.on( 'click', '.remove-sort-by-option', function() {
		const $item  = $( this ).closest( '.sort-option-item' );
		const $field = $item.closest( '.wcapf-form-field' );

		triggerRemoveSortByOption( $field );

		$item.remove();

		triggerSortByOptionsChange( $field );
	} );

	// Clear All Options
	$searchForm.on( 'click', '.clear-all-sort-by-options', function() {
		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $optionsTable = $field.find( '.sort-by-options-table' );

		$optionsTable.find( '.manual-options-table-body-rows' ).empty();

		triggerRemoveSortByOption( $field );

		triggerSortByOptionsChange( $field );
	} );

	// Add New Option
	$searchForm.on( 'click', '.add-sort-by-option', function() {
		const fieldType = 'wcapf-sort-by-option';

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const $field = $( this ).closest( '.wcapf-form-field' );

		const template = wp.template( fieldType );
		const rendered = template( { value: '', direction: '', label: '' } );
		const $wrapper = $field.find( '.sort-by-options-table' );
		const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

		$rows.append( rendered );

		triggerSortByOptionsChange( $field );

		if ( ! $wrapper.hasClass( 'has-options' ) ) {
			$wrapper.addClass( 'has-options' );
		}
	} );

	const rowInputs = '.sort-by-options-table input[type="text"],' +
		' .sort-by-options-table .option_value,' +
		' .sort-by-options-table .option_direction,' +
		' .sort-by-options-table .option_meta_key,' +
		' .sort-by-options-table .option_meta_sort_type';

	$searchForm.on( 'input', rowInputs, function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerSortByOptionsChange( $field );
	} );

	$searchForm.on( 'change', '.sort-option-item .option_value', function() {
		const $sortOption     = $( this );
		const sortOption      = $sortOption.val();
		const $sortOptionItem = $sortOption.closest( '.sort-option-item' );
		const $metaData       = $sortOptionItem.find( '.meta-data' );

		if ( 'meta_value' === sortOption ) {
			$metaData.slideDown();
		} else {
			$metaData.slideUp();
		}
	} );

} );
