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

	// Media uploader.
	$( '.upload-image-button' ).click( function( e ) {
		e.preventDefault();

		const $button    = $( this );
		const $wrapper   = $button.closest( '.media-upload' );
		const modalTitle = $button.attr( 'data-modal-title' );

		const image = wp.media( { title: modalTitle, multiple: false } )
			.open()
			.on( 'select', function() {
				const uploadedImage = image.state().get( 'selection' ).first();
				const imageData     = uploadedImage.toJSON();

				const { thumbnail } = imageData.sizes;
				let imageUrl;

				if ( thumbnail ) {
					imageUrl = imageData.sizes.thumbnail.url;
				} else {
					imageUrl = imageData.url;
				}

				$wrapper.find( '.image-id' ).val( imageData.id );
				$wrapper.find( '.image-src' ).attr( 'src', imageUrl );
				$wrapper.removeClass( 'no-image' );
			} );
	} );

	$( '.remove-image-button' ).on( 'click', function( e ) {
		e.preventDefault();

		const $button  = $( this );
		const $wrapper = $button.closest( '.media-upload' );

		$wrapper.find( '.image-id' ).val( '' );
		$wrapper.find( '.image-src' ).attr( 'src', '' );
		$wrapper.addClass( 'no-image' );
	} );

	// Toggle loading image field.
	function toggleLoadingImage( value ) {
		const $selector = $( '.settings-table-loading_image' );

		if ( value ) {
			$selector.show();
		} else {
			$selector.hide();
		}
	}

	const $enableLoadingOverlay = $( '#loading_animation' );

	let enableLoadingOverlay = false;

	if ( $enableLoadingOverlay.is( ':checked' ) ) {
		enableLoadingOverlay = true;
	}

	toggleLoadingImage( enableLoadingOverlay );

	$enableLoadingOverlay.on( 'change', function() {
		let _enableLoadingOverlay = false;

		if ( $( this ).is( ':checked' ) ) {
			_enableLoadingOverlay = true;
		}

		toggleLoadingImage( _enableLoadingOverlay );
	} );

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
			$( '.scroll-window-dependent-fields, .settings-table-scroll_to_top_offset' ).show();
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
