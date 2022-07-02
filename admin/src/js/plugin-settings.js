/**
 * Plugin settings form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	if ( ! $( 'body' ).hasClass( 'wcapf-filter_page_wcapf-settings' ) ) {
		return;
	}

	// Toggle pagination fields.
	function enablePagination( value ) {
		const $selector = $( '.settings-table-pagination_container' );

		if ( value ) {
			$selector.show();
		} else {
			$selector.hide();
		}
	}

	const $enablePagination = $( '#enable_pagination_via_ajax' );

	let enablePaginationOnLoad = false;

	if ( $enablePagination.is( ':checked' ) ) {
		enablePaginationOnLoad = true;
	}

	enablePagination( enablePaginationOnLoad );

	$enablePagination.on( 'change', function() {
		let _enablePagination = false;

		if ( $( this ).is( ':checked' ) ) {
			_enablePagination = true;
		}

		enablePagination( _enablePagination );
	} );

	// Toggle scroll window fields.
	function scrollWindow( value ) {
		const dependentFields = '.scroll-window-dependent-fields,' +
			'.scroll-window-custom-element-input,' +
			'.settings-table-scroll_to_top_offset';

		if ( 'none' === value ) {
			$( dependentFields ).hide();
		} else if ( 'results' === value ) {
			$( '.scroll-window-dependent-fields, .settings-table-scroll_to_top_offset' ).show();
			$( '.scroll-window-custom-element-input' ).hide();
		} else if ( 'custom' === value ) {
			$( '.scroll-window-custom-element-input' ).show();
		} else {
			$( dependentFields ).show();
		}
	}

	const $scrollWindow = $( '#scroll_window' );

	scrollWindow( $scrollWindow.val() );

	$scrollWindow.on( 'change', function() {
		const value = $( this ).val();

		scrollWindow( value );
	} );

} );
