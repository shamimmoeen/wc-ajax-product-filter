( function( $, window ) {

	const _delay = parseInt( wcapf_params.filter_input_delay );
	const delay  = _delay >= 0 ? _delay : 800;

	const $body = $( 'body' );

	const instanceIds = [];

	$( '.wcapf-filter-form' ).each( function() {
		instanceIds.push( $( this ).data( 'id' ) );
	} );

	window.WCAPF = window.WCAPF || {};

	window.WCAPF = {
		initCombobox: function() {
			if ( ! jQuery().chosenWCAPF ) {
				return;
			}

			const options = {
				inherit_select_classes: true,
				inherit_option_classes: true,
				no_results_text: wcapf_params.chosen_no_results_text,
				options_none_text: wcapf_params.chosen_options_none_text,
			};

			if ( wcapf_params.is_rtl ) {
				options[ 'rtl' ] = true;
			}

			$body.find( '.wcapf-chosen' ).each( function() {
				const $this = $( this );

				// If hierarchy enabled then we show the selected options.
				if ( $this.hasClass( 'has-hierarchy' ) ) {
					options[ 'display_selected_options' ] = true;
				} else {
					options[ 'display_selected_options' ] = wcapf_params.chosen_display_selected_options;
				}

				$this.chosenWCAPF( options );
			} );

			// Attach chosen for default orderby.
			if ( wcapf_params.attach_chosen_on_sorting ) {
				let disableSearch = true;

				if ( wcapf_params.search_box_in_default_orderby ) {
					disableSearch = false;
				}

				options[ 'disable_search' ] = disableSearch;

				$body.find( '.woocommerce-ordering select.orderby' ).chosenWCAPF( options );
			}
		},
		initHierarchyToggle: function() {
			const toggleAccordion = ( $el ) => {
				// Check to see if the button is pressed
				const pressed = $el.attr( 'aria-pressed' ) === 'true';

				// Change aria-pressed to the opposite state
				$el.attr( 'aria-pressed', ! pressed );

				const $child = $el.closest( 'li' ).children( 'ul' );

				// TODO: Default should be no animation.
				if ( wcapf_params.enable_animation_for_hierarchy_accordion ) {
					$child.slideToggle(
						wcapf_params.hierarchy_accordion_animation_speed,
						wcapf_params.hierarchy_accordion_animation_easing
					);
				} else {
					$child.toggle();
				}
			};

			const $toggleBtn = $body.find( '.wcapf-hierarchy-accordion-toggle' );

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
		updateProductsCountResult: function( $response ) {
			const selector = '.woocommerce-result-count';

			if ( $( wcapf_params.shop_loop_container ).find( selector ).length ) {
				return;
			}

			const newProductCount = $response.find( selector ).html();

			$body.find( selector ).html( newProductCount );
		},
		showLoadingAnimation: function() {
			if ( ! wcapf_params.loading_animation ) {
				return;
			}

			$.LoadingOverlay( 'show', wcapf_params.loading_overlay_options );
		},
		resetLoadingAnimation: function() {
			if ( ! wcapf_params.loading_animation ) {
				return;
			}

			$.LoadingOverlay( 'hide' );
		},
		scrollTo: function() {
			if ( 'none' === wcapf_params.scroll_window ) {
				return;
			}

			const scrollFor = wcapf_params.scroll_window_for;
			const isMobile  = wcapf_params.is_mobile;
			let proceed     = false;

			if ( 'mobile' === scrollFor && isMobile ) {
				proceed = true;
			} else if ( 'desktop' === scrollFor && ! isMobile ) {
				proceed = true;
			} else if ( 'both' === scrollFor ) {
				proceed = true;
			}

			if ( ! proceed ) {
				return;
			}

			let adjustingOffset, offset;

			if ( wcapf_params.scroll_to_top_offset ) {
				adjustingOffset = parseInt( wcapf_params.scroll_to_top_offset );
			}

			let container;

			if ( $( wcapf_params.shop_loop_container ).length ) {
				container = wcapf_params.shop_loop_container;
			} else if ( $( wcapf_params.not_found_container ).length ) {
				container = wcapf_params.not_found_container;
			}

			if ( 'custom' === wcapf_params.scroll_window ) {
				container = wcapf_params.scroll_window_custom_element;
			}

			const $container = $( container );

			if ( $container.length ) {
				offset = $container.offset().top - adjustingOffset;

				if ( offset < 0 ) {
					offset = 0;
				}

				$( 'html, body' ).stop().animate(
					{ scrollTop: offset },
					wcapf_params.scroll_to_top_speed,
					wcapf_params.scroll_to_top_easing
				);
			}
		},
		// Things are done before fetching the products like showing a loading indicator.
		beforeFetchingProducts: function() {
			WCAPF.showLoadingAnimation();

			if ( 'immediately' === wcapf_params.scroll_window_when ) {
				WCAPF.scrollTo();
			}

			$body.trigger( 'wcapf_before_fetching_products' );
		},
		beforeUpdatingProducts: function( $response ) {
			WCAPF.resetLoadingAnimation();

			$body.trigger( 'wcapf_before_updating_products', [ $response ] );
		},
		afterUpdatingProducts: function( $response ) {
			WCAPF.updateProductsCountResult( $response );

			// Reinitialize wcapf.
			WCAPF.init();

			if ( 'after' === wcapf_params.scroll_window_when ) {
				WCAPF.scrollTo();
			}

			// Trigger the document ready event.
			$( document ).trigger( 'ready' );

			$body.trigger( 'wcapf_after_updating_products', [ $response ] );
		},
		filterProducts: function() {
			WCAPF.beforeFetchingProducts();

			$.ajax( {
				url: window.location.href,
				success: function( response ) {
					const $response = $( response );

					/**
					 * Update document title.
					 *
					 * @source https://stackoverflow.com/a/7599562
					 */
					document.title = $response.filter( 'title' ).text();

					for ( const id of instanceIds ) {
						const instanceId = '[data-id="' + id + '"]';
						const $instance  = $( instanceId );

						$instance.html( $response.find( instanceId ).html() );
					}

					WCAPF.beforeUpdatingProducts( $response );

					// Replace old shop loop with new one.
					const $shopLoopContainer = $response.find( wcapf_params.shop_loop_container );
					const $notFoundContainer = $response.find( wcapf_params.not_found_container );

					if ( wcapf_params.shop_loop_container === wcapf_params.not_found_container ) {
						$( wcapf_params.shop_loop_container ).html( $shopLoopContainer.html() );
					} else {
						if ( $( wcapf_params.not_found_container ).length ) {
							if ( $shopLoopContainer.length ) {
								$( wcapf_params.not_found_container ).html( $shopLoopContainer.html() );
							} else if ( $notFoundContainer.length ) {
								$( wcapf_params.not_found_container ).html( $notFoundContainer.html() );
							}
						} else if ( $( wcapf_params.shop_loop_container ).length ) {
							if ( $shopLoopContainer.length ) {
								$( wcapf_params.shop_loop_container ).html( $shopLoopContainer.html() );
							} else if ( $notFoundContainer.length ) {
								$( wcapf_params.shop_loop_container ).html( $notFoundContainer.html() );
							}
						}
					}

					WCAPF.afterUpdatingProducts( $response );
				}
			} );
		},
		requestFilter: function( url ) {
			if ( ! url ) {
				return;
			}

			const hostname = location.hostname;

			// TODO: Remove from production build.
			if ( 'localhost' === hostname ) {
				url = url.replace( 'http://wcfilter-2.test', '//localhost:3001' );
			}

			// window.location.href = url;

			history.pushState( {}, '', url );

			WCAPF.filterProducts();
		},
		initRangeSlider: function() {
			if ( 'undefined' === typeof noUiSlider ) {
				return;
			}

			$body.find( '.wcapf-range-slider' ).each( function() {
				const $item   = $( this );
				const $slider = $item.find( '.wcapf-noui-slider' );

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
						minValue = numberFormat( values[ 0 ], decimalPlaces, decimalSeparator, thousandSeparator );
						maxValue = numberFormat( values[ 1 ], decimalPlaces, decimalSeparator, thousandSeparator );
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
					const _minValue = parseFloat( values[ 0 ] );
					const _maxValue = parseFloat( values[ 1 ] );

					// If value is not changed then don't proceed.
					if ( _minValue === minValue && _maxValue === maxValue ) {
						return;
					}

					if ( _minValue === rangeMinValue && _maxValue === rangeMaxValue ) {
						// Remove range filter.
						WCAPF.requestFilter( $item.data( 'clear-filter-url' ) );
					} else {
						// Add range filter.
						const url = $item.data( 'url' ).replace( '%1s', _minValue ).replace( '%2s', _maxValue );
						WCAPF.requestFilter( url );
					}
				}

				slider.noUiSlider.on( 'change', function( values ) {
					filterProductsAccordingToSlider( values );
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
		initDefaultOrderBy: function() {
			if ( ! wcapf_params.sorting_control ) {
				$body.find( '.woocommerce-ordering' ).each( function() {
					const $orderingForm = $( this );

					$orderingForm.on( 'change', 'select.orderby', function() {
						$orderingForm.submit();
					} );
				} );

				return;
			}

			$body.find( '.woocommerce-ordering' ).each( function() {
				const $orderingForm = $( this );

				$orderingForm.on( 'submit', function( e ) {
					e.preventDefault();
				} );

				$orderingForm.on( 'change', 'select.orderby', function( e ) {
					e.preventDefault();

					const order = $( this ).val();

					const url = new URL( window.location );
					url.searchParams.set( 'orderby', order );

					WCAPF.requestFilter( getOrderByUrl( url.href ) );
				} );
			} );
		},
		handleNumberInputFilters: function() {
			const rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';

			$body.on( 'input', rangeNumberSelectors, function( event ) {
				event.preventDefault();

				const $item = $( this );

				const $rangeNumber      = $item.closest( '.wcapf-range-number' );
				const formatNumbers     = $rangeNumber.attr( 'data-format-numbers' );
				const rangeMinValue     = parseFloat( $rangeNumber.attr( 'data-range-min-value' ) );
				const rangeMaxValue     = parseFloat( $rangeNumber.attr( 'data-range-max-value' ) );
				const oldMinValue       = parseFloat( $rangeNumber.attr( 'data-min-value' ) );
				const oldMaxValue       = parseFloat( $rangeNumber.attr( 'data-max-value' ) );
				const decimalPlaces     = $rangeNumber.attr( 'data-decimal-places' );
				const thousandSeparator = $rangeNumber.attr( 'data-thousand-separator' );
				const decimalSeparator  = $rangeNumber.attr( 'data-decimal-separator' );

				// Clear any previously set timer before setting a fresh one
				clearTimeout( $item.data( 'timer' ) );

				const getValue = ( floatValue ) => {
					if ( formatNumbers ) {
						return numberFormat( floatValue, decimalPlaces, decimalSeparator, thousandSeparator );
					}

					return floatValue;
				};

				$item.data( 'timer', setTimeout( function() {
					$item.removeData( 'timer' );

					let minValue = parseFloat( $rangeNumber.find( '.min-value' ).val() );
					let maxValue = parseFloat( $rangeNumber.find( '.max-value' ).val() );

					// Force the minValue not to be empty.
					if ( isNaN( minValue ) ) {
						minValue = rangeMinValue;

						$rangeNumber.find( '.min-value' ).val( getValue( minValue ) );
					} else {
						$rangeNumber.find( '.min-value' ).val( getValue( minValue ) );
					}

					// Force the maxValue not to be empty.
					if ( isNaN( maxValue ) ) {
						maxValue = rangeMaxValue;

						$rangeNumber.find( '.max-value' ).val( getValue( maxValue ) );
					} else {
						$rangeNumber.find( '.max-value' ).val( getValue( maxValue ) );
					}

					// Force the minValue not to go below the rangeMinValue.
					if ( minValue < rangeMinValue ) {
						minValue = rangeMinValue;

						$rangeNumber.find( '.min-value' ).val( getValue( minValue ) );
					}

					// Force the minValue not to go up the rangeMaxValue.
					if ( minValue > rangeMaxValue ) {
						minValue = rangeMaxValue;

						$rangeNumber.find( '.min-value' ).val( getValue( minValue ) );
					}

					// Force the maxValue not to go up the rangeMaxValue.
					if ( maxValue > rangeMaxValue ) {
						maxValue = rangeMaxValue;

						$rangeNumber.find( '.max-value' ).val( getValue( maxValue ) );
					}

					// Force the maxValue not to go below the minValue.
					if ( minValue > maxValue ) {
						maxValue = minValue;

						$rangeNumber.find( '.max-value' ).val( getValue( maxValue ) );
					}

					// If value is not changed then don't proceed.
					if ( minValue === oldMinValue && maxValue === oldMaxValue ) {
						return;
					}

					if ( minValue === rangeMinValue && maxValue === rangeMaxValue ) {
						// Remove range filter.
						WCAPF.requestFilter( $rangeNumber.data( 'clear-filter-url' ) );
					} else {
						// Add range filter.
						const url = $rangeNumber.data( 'url' ).replace( '%1s', minValue ).replace( '%2s', maxValue );
						WCAPF.requestFilter( url );
					}
				}, delay ) );
			} );
		},
		handleListFilters: function() {
			const inputs = '.wcapf-list-wrapper [type="checkbox"],.wcapf-list-wrapper [type="radio"]';

			$body.on( 'change', inputs, function( event ) {
				event.preventDefault();

				const $item = $( this );

				WCAPF.requestFilter( $item.data( 'url' ) );
			} );
		},
		handleDropdownFilters: function() {
			$body.on( 'change', '.wcapf-dropdown-wrapper select', function( event ) {
				event.preventDefault();

				const $select        = $( this );
				const values         = $select.val();
				const filterURL      = $select.data( 'url' );
				const clearFilterURL = $select.data( 'clear-filter-url' );
				let url;

				if ( values.length ) {
					url = filterURL.replace( '%s', values.toString() );
				} else {
					url = clearFilterURL;
				}

				WCAPF.requestFilter( url );
			} );
		},
		handlePagination: function() {
			if ( wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container ) {
				const $container = $( wcapf_params.shop_loop_container );
				const selector   = wcapf_params.pagination_container + ' a';

				if ( $container.length ) {
					$container.on( 'click', selector, function( e ) {
						e.preventDefault();

						const href = $( this ).attr( 'href' );

						WCAPF.requestFilter( href );
					} );
				}
			}
		},
		init: function() {
			WCAPF.initCombobox();
			WCAPF.initDefaultOrderBy();
			WCAPF.initHierarchyToggle();
			WCAPF.initRangeSlider();
		}
	};

}( jQuery, window ) );

( function( $, WCAPF ) {

	WCAPF.init();
	WCAPF.handleListFilters();
	WCAPF.handleDropdownFilters();
	WCAPF.handleNumberInputFilters();
	WCAPF.handlePagination();

}( jQuery, window.WCAPF ) );
