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

		const template = wp.template( 'wcapf-filter-form-item' );
		const rendered = template( { title: filterTitle, id: filterId, key: filterKey } );

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
	 * Toggle the filter.
	 */
	function toggleFilter( e ) {
		const target       = e.target;
		const widget       = $( this ).closest( '.widget' );
		const toggleBtn    = widget.find( '.widget-action' );
		const inside       = widget.children( '.widget-inside' );
		const isExpand     = toggleBtn.attr( 'aria-expanded' );
		const toggleExpand = 'true' === isExpand ? 'false' : 'true';

		toggleBtn.attr( 'aria-expanded', toggleExpand );
		$( inside ).slideToggle(
			'fast',
			function() {
				widget.toggleClass( 'open' );
				formData.trigger( 'widget-closed', [ target ] );
			}
		);
	}

	formData.on( 'click', '.widget-top', toggleFilter );
	formData.on( 'click', '.widget-control-close', toggleFilter );

	/**
	 * Focus the form field's expand button.
	 */
	function focusField( e, target ) {
		if ( target.classList.contains( 'widget-control-close' ) ) {
			const widget = $( target ).closest( '.widget' );
			const action = widget.find( '.widget-action' );

			action.attr( 'aria-expanded', 'false' ).focus();
		}
	}

	formData.on( 'widget-closed', focusField );

	/**
	 * Remove the field.
	 */
	function removeField() {
		const widget = $( this ).closest( '.widget' );

		$( widget ).slideUp(
			'fast',
			function() {
				widget.remove();
			}
		);
	}

	formData.on( 'click', '.widget-control-remove', removeField );

	/**
	 * Filter form menu.
	 */
	const $filterFormNavItem = $( '.filter-form-menu .nav-tab' );

	$filterFormNavItem.on( 'click', function() {
		const $this    = $( this );
		const $content = $( '.tab-' + $this.attr( 'data-for' ) );

		$filterFormNavItem.removeClass( 'nav-tab-active' );
		$this.addClass( 'nav-tab-active' );

		$( '.tab-content' ).hide();
		$content.show();
	} );

} );
