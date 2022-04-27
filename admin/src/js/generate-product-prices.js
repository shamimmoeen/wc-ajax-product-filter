/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	function generateProductPrices( $form, data ) {
		const $progressWrapper = $form.find( '.progress-stat' ),
			  $progressbar     = $progressWrapper.find( '.progressbar > div' ),
			  $progressCount   = $progressWrapper.find( '.count' ),
			  $progressTotal   = $progressWrapper.find( '.total' ),
			  $submitBtn       = $form.find( '.button' ),
			  $successMessage  = $form.find( '.success-message' ),
			  $errorMessage    = $form.find( '.error-message' );

		const wcapf_params = window[ 'wcapf_admin_params' ];
		const ajaxurl      = wcapf_params[ 'ajaxurl' ];

		$.ajax( {
			url: ajaxurl,
			type: 'POST',
			dataType: 'json',
			data: data,
			success: function( response ) {
				const message       = response.message;
				const _data         = response.data;
				const status        = _data[ 'status' ];
				const page          = _data[ 'page' ];
				const count         = _data[ 'count' ];
				const percentage    = _data[ 'percentage' ];
				const totalProducts = _data[ 'total_products' ];

				if ( response.success === 'true' ) {
					$progressCount.html( count );
					$progressbar.css( 'width', percentage + '%' );

					if ( ! $progressWrapper.hasClass( 'active' ) ) {
						$progressWrapper.addClass( 'active' );
					}

					if ( status === 'incomplete' ) {
						$progressTotal.html( totalProducts );

						data[ 'page' ]  = page;
						data[ 'count' ] = count;

						generateProductPrices( $form, data );
					} else {
						setTimeout( function() {
							$progressWrapper.removeClass( 'active' );
							$progressbar.css( 'width', '0' );
							$submitBtn.removeAttr( 'disabled' );
							$successMessage.html( message );
						}, 1500 );
					}
				} else {
					$submitBtn.removeAttr( 'disabled' );
					$errorMessage.html( message );
				}
			}
		} ).fail( function( response ) {
			$progressWrapper.removeClass( 'active' );
			$progressbar.css( 'width', '0' );
			$submitBtn.removeAttr( 'disabled' );

			if ( window.console && window.console.log ) {
				console.log( response );
			}
		} );
	}

	$( '.wrap' ).on( 'submit', '#generate-product-prices', function( e ) {
		e.preventDefault();

		const $form            = $( this ),
			  $progressWrapper = $form.find( '.progress-stat' ),
			  $progressbar     = $progressWrapper.find( '.progressbar > div' ),
			  $submitBtn       = $form.find( '.button' ),
			  $successMessage  = $form.find( '.success-message' ),
			  $errorMessage    = $form.find( '.error-message' ),
			  data             = $form.serializeObject();

		$progressbar.css( 'width', '0' );
		$successMessage.html( '' );
		$errorMessage.html( '' );
		$submitBtn.attr( 'disabled', 'disabled' );

		generateProductPrices( $form, data );
	} );

} );
