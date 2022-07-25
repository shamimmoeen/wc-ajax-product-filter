/**
 * Filter form meta box.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */

jQuery( document ).ready( function( $ ) {

	const formData      = $( '#form_data' );
	const $dropdown     = $( '#available-filters-dropdown' );
	const $addFilterBtn = $( '#add-filter-to-form-btn' );

	$dropdown.on( 'change', function() {
		const $this = $( this );
		const value = $this.val();

		if ( value ) {
			$addFilterBtn.removeAttr( 'disabled' );
		} else {
			$addFilterBtn.attr( 'disabled', 'disabled' );
		}
	} );

	/**
	 * Add filter to form.
	 */
	$addFilterBtn.on( 'click', function() {
		const $selected = $dropdown.find( 'option:selected' );
		const filterId  = $selected.val();

		if ( ! filterId.length ) {
			return;
		}

		const filterTitle = $selected.attr( 'data-title' );
		const filterKey   = $selected.attr( 'data-filter-key' );
		const editLink    = $selected.attr( 'data-edit-link' );

		const template = wp.template( 'wcapf-filter-form-item' );
		const rendered = template( { title: filterTitle, id: filterId, key: filterKey, edit_link: editLink } );

		formData.find( '#filter-form-items' ).prepend( rendered );

		$dropdown.prop( 'selectedIndex', 0 );
		$dropdown.find( 'option[value="' + filterId + '"]' ).attr( 'disabled', 'disabled' );
		$dropdown.trigger( 'change' );
	} );

	/**
	 * Make the filters sortable.
	 */
	function sortable( identifier ) {
		const container = $( identifier );

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
			}
		);
	}

	sortable( '#form_data' );

	/**
	 * Remove the field.
	 */
	function removeField() {
		const widget   = $( this ).closest( '.widget' );
		const filterId = widget.find( '.filter-id' ).val();

		$( widget ).slideUp(
			'fast',
			function() {
				$dropdown.find( 'option[value="' + filterId + '"]' ).removeAttr( 'disabled' );
				widget.remove();
			}
		);
	}

	formData.on( 'click', '.widget-control-remove', removeField );

	/**
	 * Toggle accordion default state.
	 */
	$( '#enable_accordion' ).on( 'change', function() {
		const $fields = $( '.accordion-default-state' );

		if ( 'yes' === $( this ).val() ) {
			$fields.removeClass( 'disabled' );
		} else {
			$fields.addClass( 'disabled' );
		}
	} );

} );
