( function( $, window ) {

	window.WCAPF = window.WCAPF || {};

	window.WCAPF = {
		attachCombobox: function() {
			if ( ! jQuery().chosen ) {
				return;
			}

			const $dropdownFilters = $( 'body' ).find( '.wcapf-chosen-select' );

			$dropdownFilters.each( function() {
				const options = {
					inherit_select_classes: true,
					inherit_option_classes: true,
					no_results_text: wcapf_params.chosen_no_results_text,
				};

				if ( wcapf_params.is_rtl ) {
					options[ 'rtl' ] = true;
				}

				$( this ).chosen( options );
			} );
		},
		attachHierarchyToggle: function() {
			const toggleAccordion = ( $el ) => {
				// Check to see if the button is pressed
				const pressed = $el.attr( 'aria-pressed' ) === 'true';

				// Change aria-pressed to the opposite state
				$el.attr( 'aria-pressed', ! pressed );

				const $child = $el.closest( 'li' ).children( 'ul' );

				$child.toggle();
			};

			const $toggleBtn = $( 'body' ).find( '.wcapf-hierarchy-accordion-toggle' );

			$toggleBtn.on( 'click', function() {
				toggleAccordion( $( this ) );
			} );

			$toggleBtn.on( 'keydown', function( e ) {
				if ( e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar' ) {
					// Prevent the default action to stop scrolling when space is pressed
					e.preventDefault();

					toggleAccordion( $( this ) );
				}
			} );
		},
		attachRangeSlider: function() {
			if ( 'undefined' === typeof noUiSlider ) {
				return;
			}

			const $body = $( 'body' );

			$body.find( '.wcapf-range-slider' ).each( function() {
				const $item = $( this );

				const $slider = $item.find( '.wcapf-noui-slider' );

				// If slider is already initialized then don't reinitialize again.
				if ( $slider.hasClass( 'wcapf-noui-target' ) ) {
					return;
				}

				const sliderId          = $slider.attr( 'id' );
				const displayValuesAs   = $item.attr( 'data-display-values-as' );
				const formatNumbers     = $item.attr( 'data-format-numbers' );
				const rangeMinValue     = parseFloat( $item.attr( 'data-range-min-value' ) );
				const rangeMaxValue     = parseFloat( $item.attr( 'data-range-max-value' ) );
				const step              = parseFloat( $item.attr( 'data-step' ) );
				const decimalPlaces     = $item.attr( 'data-decimal-places' );
				const thousandSeparator = $item.attr( 'data-thousand-separator' );
				const decimalSeparator  = $item.attr( 'data-decimal-separator' );
				const minValue          = parseFloat( $item.attr( 'data-min-value' ) );
				const maxValue          = parseFloat( $item.attr( 'data-max-value' ) );
				const $minValue         = $item.find( '.min-value' );
				const $maxValue         = $item.find( '.max-value' );

				const slider = document.getElementById( sliderId );

				noUiSlider.create( slider, {
					start: [ minValue, maxValue ],
					step,
					connect: true,
					cssPrefix: 'wcapf-noui-',
					range: {
						'min': rangeMinValue,
						'max': rangeMaxValue,
					}
				} );

				slider.noUiSlider.on( 'update', function( values ) {
					let minValue;
					let maxValue;

					if ( formatNumbers ) {
						minValue = number_format( values[ 0 ], decimalPlaces, decimalSeparator, thousandSeparator );
						maxValue = number_format( values[ 1 ], decimalPlaces, decimalSeparator, thousandSeparator );
					} else {
						minValue = parseFloat( values[ 0 ] );
						maxValue = parseFloat( values[ 1 ] );
					}

					if ( 'plain_text' === displayValuesAs ) {
						$minValue.html( minValue );
						$maxValue.html( maxValue );
					} else {
						$minValue.val( minValue );
						$maxValue.val( maxValue );
					}

					$body.trigger( 'wcapf-nouislider-update', [ $item, values ] );
				} );

				function filterProductsAccordingToSlider( values ) {
					if ( wcapf_params.for_preview ) {
						return;
					}

					const minValue = parseFloat( values[ 0 ] );
					const maxValue = parseFloat( values[ 1 ] );

					if ( minValue === rangeMinValue && maxValue === rangeMaxValue ) {
						// Remove range filter.
						requestFilter( $item.data( 'clear-filter-url' ) );
					} else {
						// Add range filter.
						const url = $item.data( 'url' ).replace( '%1s', minValue ).replace( '%2s', maxValue );
						requestFilter( url );
					}
				}

				slider.noUiSlider.on( 'change', function( values ) {
					// Clear any previously set timer before setting a fresh one
					clearTimeout( $item.data( 'timer' ) );

					$item.data( 'timer', setTimeout( function() {
						$item.removeData( 'timer' );

						filterProductsAccordingToSlider( values );
					}, delay ) );
				} );

				$minValue.on( 'input', function( event ) {
					event.preventDefault();

					const $input = $( this );

					// Clear any previously set timer before setting a fresh one
					clearTimeout( $input.data( 'timer' ) );

					$input.data( 'timer', setTimeout( function() {
						$input.removeData( 'timer' );

						const minValue = $input.val();

						slider.noUiSlider.set( [ minValue, null ] );

						filterProductsAccordingToSlider( slider.noUiSlider.get() );
					}, delay ) );
				} );

				$maxValue.on( 'input', function( event ) {
					event.preventDefault();

					const $input = $( this );

					// Clear any previously set timer before setting a fresh one
					clearTimeout( $input.data( 'timer' ) );

					$input.data( 'timer', setTimeout( function() {
						$input.removeData( 'timer' );

						const maxValue = $input.val();

						slider.noUiSlider.set( [ null, maxValue ] );

						filterProductsAccordingToSlider( slider.noUiSlider.get() );
					}, delay ) );
				} );
			} );
		},
		init: function() {
			window.WCAPF.attachCombobox();

			window.WCAPF.attachHierarchyToggle();

			window.WCAPF.attachRangeSlider();
		}
	};

}( jQuery, window ) );

( function( $, WCAPF ) {

	WCAPF.init();

}( jQuery, window.WCAPF ) );
