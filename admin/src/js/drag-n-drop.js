/**
 * Drag and drop the search form fields.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

/**
 * Make the fields sortable.
 */
function makeSortable( identifier ) {
	const container = jQuery( identifier );

	container.sortable(
		{
			opacity: 0.6,
			revert: false,
			cursor: 'move',
			// handle: '.widget-top',
			// cancel: '.widget-title-action,h3,.sidebar-description',
			items: '.available-field',
			placeholder: 'widget-placeholder',
			connectWith: '#search-form-wrapper',
			stop: function( e, ui ) {
				console.log( 'sort stop', ui );
			},
			over: function() {
			},
			out: function() {
			},
			start: function( e, ui ) {
				ui.item.attr( 'data-dragging', '1' );
				ui.item.find( '.widget-inside' ).stop( true, true ).hide();
				//if(!ui.placeholder.parent().hasClass("inside"))
				//{//if it is getting appended to the wrong place, then force it in to the right container :)
				console.log( 'sort start', ui );
				ui.placeholder.appendTo( ui.placeholder.parent().find( '.inside #search-form-wrapper' ) );
			},
			receive: function( ev, ui ) {
			},
			change: function( e, ui ) {
			}
		}
	);
}

makeSortable( '#search-form' );

const searchForm = jQuery( '#search-form' );

function dragStart() {
	searchForm.addClass( 'ui-drop-active' );
}

function dragStop( event, ui ) {
	searchForm.removeClass( 'ui-drop-active' );
	console.log( 'drop stop', ui );
}

jQuery( '#available-fields .available-field' ).draggable(
	{
		connectToSortable: '#search-form',
		helper: 'clone',
		start: dragStart,
		stop: dragStop,
	}
);
