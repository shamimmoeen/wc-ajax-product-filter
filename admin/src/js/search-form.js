/**
 * The search form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

const totalFieldInstances = jQuery( '#total_field_instances' );

const searchForm = jQuery( '#search-form' );

/**
 * Assign a unique id by replacing the placeholder id.
 */
function removePlaceholder( uniqueId, elements, attr ) {
	elements.each(
		function() {
			const element = jQuery( this );

			const oldValue = element.attr( attr );
			const newValue = oldValue.replace( '%%', uniqueId );

			element.attr( attr, newValue );
		}
	);
}

/**
 * Insert the field's subfields.
 */
function insertFieldSubFields( ui ) {
	// Insert the field's subfields if not already inserted.
	if ( ! ui.item.hasClass( 'sub-fields-ready' ) ) {
		const type      = ui.item.attr( 'data-field-type' );
		const uniqueId  = parseInt( totalFieldInstances.val() );
		const fieldType = 'wcapf-form-field-' + type;

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		// Increment the value of total field instances.
		totalFieldInstances.val( uniqueId + 1 );

		const template = wp.template( fieldType );
		const rendered = template();
		const wrapper  = ui.item.find( '.widget-content' );

		wrapper.prepend( rendered );

		// Update the for attributes of the labels.
		removePlaceholder( uniqueId, ui.item.find( 'label[for^="wcapf-input-"]' ), 'for' );

		// Update the ids of the input elements.
		removePlaceholder( uniqueId, ui.item.find( '*[id^="wcapf-input-"]' ), 'id' );

		// Update the names of the input elements.
		removePlaceholder( uniqueId, ui.item.find( '*[id^="wcapf-input-"]' ), 'name' );

		// Update the position value.
		removePlaceholder( uniqueId, ui.item.find( '*[id^="wcapf-input-position-"]' ), 'value' );

		ui.item.addClass( 'sub-fields-ready' );
	}
}

/**
 * Update the form field's position after sort.
 *
 * @source https://stackoverflow.com/a/14736775
 */
function updateFieldsPosition() {
	const inputs  = searchForm.find( '*[id^="wcapf-input-position-"]' );
	const nbElems = inputs.length;

	inputs.each(
		function( idx ) {
			jQuery( this ).val( nbElems - ( nbElems - idx ) );
		}
	);
}

/**
 * Make the field ready, remove styles comes from jquery-ui-sortable plugin, insert the field's subfields etc.
 */
function makeFieldReady( e, ui ) {
	// Remove styles comes from jquery-ui-sortable plugin.
	ui.item.removeAttr( 'style' );

	insertFieldSubFields( ui );

	updateFieldsPosition();

	const toggleBtn = ui.item.find( '.widget-action' );

	// Expand the form field after sort.
	if ( 'false' === toggleBtn.attr( 'aria-expanded' ) ) {
		toggleBtn.trigger( 'click' );
	}
}

/**
 * Instantiate sortable for the form fields.
 */
function sortable( identifier ) {
	const container = jQuery( identifier );

	container.sortable(
		{
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.widget-top',
			cancel: '.widget-title-action',
			items: '.widget',
			placeholder: 'widget-placeholder',
			connectWith: '#search-form-wrapper',
			stop: makeFieldReady,
			start: function( e, ui ) {
				// If it is getting appended to the wrong place, then force it into the right container.
				ui.placeholder.appendTo( ui.placeholder.parent().find( '.inside #search-form-wrapper' ) );
			}
		}
	);
}

sortable( '#search-form' );

/**
 * Run function when drag starts.
 */
function onDragStart() {
	searchForm.addClass( 'ui-drop-active' );
}

/**
 * Run function at drag stop.
 */
function onDragStop() {
	searchForm.removeClass( 'ui-drop-active' );
}

/**
 * Initialize draggable for the form fields.
 */
jQuery( '#available-fields .widget' ).draggable(
	{
		connectToSortable: '#search-form',
		helper: 'clone',
		start: onDragStart,
		stop: onDragStop,
	}
);

/**
 * Toggle the form field.
 */
function toggleField( e ) {
	const target       = e.target;
	const widget       = jQuery( this ).closest( '.widget' );
	const toggleBtn    = widget.find( '.widget-action' );
	const inside       = widget.children( '.widget-inside' );
	const isExpand     = toggleBtn.attr( 'aria-expanded' );
	const toggleExpand = 'true' === isExpand ? 'false' : 'true';

	toggleBtn.attr( 'aria-expanded', toggleExpand );
	jQuery( inside ).slideToggle(
		'fast',
		function() {
			widget.toggleClass( 'open' );
			searchForm.trigger( 'widget-closed', [ target ] );
		}
	);
}

searchForm.on( 'click', '.widget-top', toggleField );
searchForm.on( 'click', '.widget-control-close', toggleField );

/**
 * Focus the form field's expand button.
 */
function focusField( e, target ) {
	if ( target.classList.contains( 'widget-control-close' ) ) {
		const widget = jQuery( target ).closest( '.widget' );
		const action = widget.find( '.widget-action' );

		action.attr( 'aria-expanded', 'false' ).focus();
	}
}

searchForm.on( 'widget-closed', focusField );

/**
 * Remove the field.
 */
function removeField() {
	const widget = jQuery( this ).closest( '.widget' );

	jQuery( widget ).slideUp(
		'fast',
		function() {
			widget.remove();
			updateFieldsPosition();
		}
	);
}

searchForm.on( 'click', '.widget-control-remove', removeField );

/**
 * Store the initial form data into a variable so that we can compare it when leaving the page.
 */
let initialFormState = searchForm.serializeArray();

/**
 * Show message after form submission.
 */
function showMessage( message, type = 'success' ) {
	const element = jQuery( '<p class="' + type + '">' + message + '</p>' );
	const wrapper = jQuery( '.wcapf-message-wrapper' );

	if ( ! wrapper.is( ':empty' ) ) {
		return;
	}

	jQuery( wrapper ).html( element ).slideDown( 'fast' );

	setTimeout(
		function() {
			jQuery( wrapper ).slideUp( 'fast' );
			wrapper.html( '' );
		},
		3000
	);
}

/**
 * Save the search form.
 */
function saveForm() {
	const button   = jQuery( this );
	const formData = searchForm.serializeArray();

	button.attr( 'disabled', 'disabled' );

	function okCallback( message ) {
		button.removeAttr( 'disabled' );

		// Update the initial form data after successfully saving the form.
		initialFormState = formData;

		showMessage( message );
	}

	function errCallback( message ) {
		button.removeAttr( 'disabled' );
		showMessage( message, 'error' );
	}

	// https://stackoverflow.com/a/59181252
	wp.ajax.post( formData ).done( okCallback ).fail( errCallback );
}

jQuery( '#postbox-container-1' ).on( 'click', 'button', saveForm );

/**
 * Show alert on leave if the form is dirty.
 */
// window.onbeforeunload = function() {
// 	const newFormState = searchForm.serializeArray();
//
// 	const isFormDirty = ! _.isEqual( newFormState, initialFormState );
//
// 	if ( isFormDirty ) {
// 		return '';
// 	}
// };
