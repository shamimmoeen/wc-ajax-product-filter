( function( $, window ) {

	const _delay = parseInt( wcapf_params.filter_input_delay );
	const delay  = _delay >= 0 ? _delay : 800;

	const $body = $( 'body' );

	const instanceIds = [];

	$( '.wcapf-filter' ).each( function() {
		instanceIds.push( $( this ).data( 'id' ) );
	} );

	let focusedElm;

	window.tippyInstances = [];

	window.WCAPF = window.WCAPF || {};

	window.WCAPF = {
		handleFilterAccordion: function() {
			const toggleAccordion = ( $el ) => {
				// Check to see if the accordion is opened
				const pressed = $el.attr( 'aria-expanded' ) === 'true';

				// Change aria-expanded to the opposite state
				$el.attr( 'aria-expanded', ! pressed );

				const $filterInner = $el.closest( '.wcapf-filter' ).children( '.wcapf-filter-inner' );

				if ( wcapf_params.enable_animation_for_filter_accordion ) {
					$filterInner.slideToggle(
						wcapf_params.filter_accordion_animation_speed,
						wcapf_params.filter_accordion_animation_easing
					);
				} else {
					$filterInner.toggle();
				}
			};

			$body.on( 'click', '.wcapf-filter-accordion-trigger', function( e ) {
				e.stopPropagation();

				toggleAccordion( $( this ) );
			} );

			$body.on( 'click', '.wcapf-filter-title.has-accordion', function() {
				const $trigger = $( this ).find( '.wcapf-filter-accordion-trigger' );

				toggleAccordion( $trigger );
			} );
		},
		handleHierarchyToggle: function() {
			const toggleAccordion = ( $el ) => {
				// Check to see if the button is pressed
				const pressed = $el.attr( 'aria-pressed' ) === 'true';

				// Change aria-pressed to the opposite state
				$el.attr( 'aria-pressed', ! pressed );

				const $child = $el.closest( 'li' ).children( 'ul' );

				if ( wcapf_params.enable_animation_for_hierarchy_accordion ) {
					$child.slideToggle(
						wcapf_params.hierarchy_accordion_animation_speed,
						wcapf_params.hierarchy_accordion_animation_easing
					);
				} else {
					$child.toggle();
				}
			};

			$body
				.on( 'click', '.wcapf-hierarchy-accordion-toggle', function() {
					toggleAccordion( $( this ) );
				} )
				.on( 'keydown', '.wcapf-hierarchy-accordion-toggle', function( e ) {
					if ( e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar' ) {
						// Prevent the default action to stop scrolling when space is pressed
						e.preventDefault();

						toggleAccordion( $( this ) );
					}
				} );
		},
		handleSoftLimit: function() {
			const toggleFilterOptions = ( $el ) => {
				// Check to see if the button is pressed
				const pressed = $el.attr( 'aria-pressed' ) === 'true';

				// Change aria-pressed to the opposite state
				$el.attr( 'aria-pressed', ! pressed );

				const $listWrapper = $el.closest( '.wcapf-list-wrapper' );

				if ( pressed ) {
					$listWrapper.removeClass( 'show-hidden-options' );
				} else {
					$listWrapper.addClass( 'show-hidden-options' );
				}
			};

			$body
				.on( 'click', '.wcapf-soft-limit-trigger', function() {
					toggleFilterOptions( $( this ) );
				} )
				.on( 'keydown', '.wcapf-soft-limit-trigger', function( e ) {
					if ( e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar' ) {
						// Prevent the default action to stop scrolling when space is pressed
						e.preventDefault();

						toggleFilterOptions( $( this ) );
					}
				} );
		},
		handleSearchFilterOptions: function() {
			$body.on( 'input', '.wcapf-search-box input[type="text"]', function() {
				const $that   = $( this );
				const $inner  = $that.closest( '.wcapf-filter-inner' );
				const $filter = $inner.closest( '.wcapf-filter' );

				const softLimitEnabled = $filter.hasClass( 'has-soft-limit' );
				const softLimitToggle  = $filter.find( '.wcapf-soft-limit-wrapper' );
				const visibleOptions   = parseInt( $filter.attr( 'data-visible-options' ) );

				const keyword = $that.val();

				if ( ! keyword.length ) {
					let index = 0;
					$filter.removeClass( 'search-active' );

					$.each( $inner.find( '.wcapf-filter-options > li' ), function() {
						index++;

						const $filterItem = $( this );
						$filterItem.removeClass( 'keyword-matched' );

						if ( softLimitEnabled ) {
							if ( index > visibleOptions ) {
								$filterItem.addClass( 'wcapf-filter-option-hidden' );
							} else {
								$filterItem.removeClass( 'wcapf-filter-option-hidden' );
							}
						}
					} );

					if ( softLimitEnabled ) {
						softLimitToggle.removeAttr( 'style' );
					}

					return;
				}

				let index = 0;
				$filter.addClass( 'search-active' );

				$.each( $inner.find( '.wcapf-filter-options > li' ), function() {
					const $filterItem = $( this );
					const label       = $filterItem.find( '.wcapf-filter-item-label' ).data( 'label' );

					if ( label.toLowerCase().includes( keyword.toLowerCase() ) ) {
						$filterItem.addClass( 'keyword-matched' );

						if ( softLimitEnabled ) {
							index++;

							if ( index > visibleOptions ) {
								$filterItem.addClass( 'wcapf-filter-option-hidden' );
							} else {
								$filterItem.removeClass( 'wcapf-filter-option-hidden' );
							}
						}
					} else {
						$filterItem.removeClass( 'keyword-matched' );
					}
				} );

				if ( softLimitEnabled ) {
					if ( index <= visibleOptions ) {
						softLimitToggle.hide();
					}
				}
			} );
		},
		updateProductsCountResult: function( $response ) {
			const $container = $( wcapf_params.shop_loop_container );
			const selector   = '.woocommerce-result-count';
			const newCount   = $response.find( selector ).html();

			$body.find( selector ).each( function() {
				const $el = $( this );

				if ( ! $container.has( $el ).length ) {
					$el.html( newCount );
				}
			} );
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
		scrollTo: function( triggeredBy ) {
			if ( 'none' === wcapf_params.scroll_window ) {
				return;
			}

			const allowed    = [];
			const scrollWhen = wcapf_params.scroll_window_when;

			if ( 'all' === scrollWhen ) {
				allowed.push( 'filter' );
				allowed.push( 'paginate' );
			} else {
				allowed.push( scrollWhen );
			}

			if ( ! allowed.includes( triggeredBy ) ) {
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

				if ( wcapf_params.disable_scroll_animation ) {
					window.scrollTo( { top: offset } );
				} else {
					$( 'html, body' ).stop().animate(
						{ scrollTop: offset },
						wcapf_params.scroll_to_top_speed,
						wcapf_params.scroll_to_top_easing
					);
				}
			}
		},
		// Things are done before fetching the products like showing the loading indicator.
		beforeFetchingProducts: function( triggeredBy ) {
			// Track the current element focus.
			focusedElm = document.activeElement;

			WCAPF.showLoadingAnimation();

			// Scroll into view on paginate.
			if ( 'paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate ) {
				WCAPF.scrollTo( triggeredBy );
			}

			$body.trigger( 'wcapf_before_fetching_products', [ triggeredBy ] );
		},
		destroyTippyInstances: function() {
			if ( wcapf_params.use_tippyjs ) {
				// @source https://github.com/atomiks/tippyjs/issues/473
				tippyInstances.forEach( instance => {
					instance.destroy();
				} );
				tippyInstances.length = 0; // clear it
			}
		},
		// Things are done before updating the products like hiding the loading indicator.
		beforeUpdatingProducts: function( $response, triggeredBy ) {
			WCAPF.resetLoadingAnimation();

			// Maybe good for performance.
			WCAPF.destroyTippyInstances();

			$body.trigger( 'wcapf_before_updating_products', [ $response, triggeredBy ] );
		},
		afterUpdatingProducts: function( $response, triggeredBy ) {
			WCAPF.updateProductsCountResult( $response );

			// Restore the focus (Maybe restoring the focus in mobile device isn't good).
			if ( wcapf_params.restore_focus_after_filtering && ! wcapf_params.is_mobile ) {
				if ( document.body !== focusedElm ) {
					if ( focusedElm.id ) {
						$( `#${ focusedElm.id }` ).focus();
					}
				}
			}

			// Reinitialize wcapf.
			WCAPF.init();

			// Scroll into view.
			if ( 'paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate ) {
				// Do nothing because it already happened.
			} else {
				WCAPF.scrollTo( triggeredBy );
			}

			// Trigger events.
			$( document ).trigger( 'ready' );
			$( window ).trigger( 'scroll' );
			$( window ).trigger( 'resize' );

			$body.trigger( 'wcapf_after_updating_products', [ $response, triggeredBy ] );
		},
		filterProducts: function( triggeredBy = 'filter' ) {
			WCAPF.beforeFetchingProducts( triggeredBy );

			$.ajax( {
				url: window.location.href,
				success: function( response ) {
					const $response = $( response );

					WCAPF.beforeUpdatingProducts( $response, triggeredBy );

					/**
					 * Update document title.
					 *
					 * @source https://stackoverflow.com/a/7599562
					 */
					document.title = $response.filter( 'title' ).text();

					// Update the instances.
					for ( const id of instanceIds ) {
						const instanceId     = '[data-id="' + id + '"]';
						const $instance      = $( instanceId );
						const $inner         = $instance.find( '.wcapf-filter-inner' );
						const _instance      = $response.find( instanceId );
						let _instanceClasses = $( _instance ).attr( 'class' );

						// Preserve hierarchy accordion state.
						if ( wcapf_params.preserve_hierarchy_accordion_state ) {
							if ( $instance.hasClass( 'has-hierarchy-accordion' ) ) {
								$instance.find( '.wcapf-hierarchy-accordion-toggle' ).each( function() {
									const $el = $( this );
									const id  = $el.data( 'id' );

									const toggleSelector = `.wcapf-hierarchy-accordion-toggle[data-id="${ id }"]`;

									// Check to see if the accordion is opened
									const pressed = $el.attr( 'aria-pressed' ) === 'true';

									if ( pressed ) {
										_instance.find( toggleSelector ).attr( 'aria-pressed', 'true' );
										_instance.find( toggleSelector ).closest( 'li' ).children( 'ul' ).show();
									} else {
										_instance.find( toggleSelector ).attr( 'aria-pressed', 'false' );
										_instance.find( toggleSelector ).closest( 'li' ).children( 'ul' ).hide();
									}
								} );
							}
						}

						// Preserve soft limit state.
						if ( wcapf_params.preserve_soft_limit_state ) {
							if ( $instance.hasClass( 'has-soft-limit' ) ) {
								const $listWrapper = $instance.find( '.wcapf-list-wrapper' );

								if ( $listWrapper.hasClass( 'show-hidden-options' ) ) {
									_instance.find( '.wcapf-list-wrapper' ).addClass( 'show-hidden-options' );
									_instance.find( '.wcapf-soft-limit-trigger' ).attr( 'aria-pressed', 'true' );
								} else {
									_instance.find( '.wcapf-list-wrapper' ).removeClass( 'show-hidden-options' );
									_instance.find( '.wcapf-soft-limit-trigger' ).attr( 'aria-pressed', 'false' );
								}
							}
						}

						// Update clear filter button url.
						const clearBtnSelector = '.wcapf-filter-clear-btn';
						const clearFilterUrl   = _instance.find( clearBtnSelector ).attr( 'data-clear-filter-url' );
						$instance.find( clearBtnSelector ).attr( 'data-clear-filter-url', clearFilterUrl );

						// Update the instance classes.
						$instance.attr( 'class', _instanceClasses.trim() );

						const _html = _instance.find( '.wcapf-filter-inner' ).html();

						// Finally update the instance.
						$inner.html( _html );

						$instance.trigger( 'wcapf-filter-updated', [ _instance ] );
					}

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

					WCAPF.afterUpdatingProducts( $response, triggeredBy );
				}
			} );
		},
		requestFilter: function( url, triggeredBy = 'filter' ) {
			if ( ! url ) {
				return;
			}

			const hostname = location.hostname;

			// TODO: Remove from production build.
			if ( 'localhost' === hostname ) {
				url = url.replace( 'http://wcfilter-2.test', '//localhost:3001' );
			}

			// window.location.href = url;

			history.pushState( { wcapf: true }, '', url );

			WCAPF.filterProducts( triggeredBy );
		},
		handleNumberInputFilters: function() {
			const rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';

			$body.on( 'input', rangeNumberSelectors, function() {
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
			const nativeInputs = '.list-type-native [type="checkbox"],' +
				'.list-type-native [type="radio"],' +
				'.list-type-custom-checkbox [type="checkbox"]';

			$body.on( 'change', nativeInputs, function() {
				WCAPF.requestFilter( $( this ).data( 'url' ) );
			} );

			const customRadioSelector = '.list-type-custom-radio';

			$body.on( 'change', customRadioSelector + ' [type="checkbox"]', function() {
				// https://stackoverflow.com/a/5839924
				$( this )
					.closest( customRadioSelector )
					.find( '[type="checkbox"]' ).not( this )
					.prop( 'checked', false );

				WCAPF.requestFilter( $( this ).data( 'url' ) );
			} );
		},
		handleDropdownFilters: function() {
			$body.on( 'change', '.wcapf-dropdown-wrapper select', function() {
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

						WCAPF.requestFilter( href, 'paginate' );
					} );
				}
			}
		},
		handleDefaultOrderby: function() {
			if ( ! wcapf_params.sorting_control ) {
				// Submit the orderby form when value is changed.
				$body.on( 'change', '.woocommerce-ordering select.orderby', function() {
					$( this ).closest( 'form' ).trigger( 'submit' );
				} );

				return;
			}

			// Prevent the auto submission of the orderby form.
			$body.on( 'submit', '.woocommerce-ordering', function() {
				return false;
			} );

			// Handle the filter request via ajax when the orderby value is changed.
			$body.on( 'change', '.woocommerce-ordering select.orderby', function() {
				const order = $( this ).val();

				const url = new URL( window.location );
				url.searchParams.set( 'orderby', order );

				WCAPF.requestFilter( getOrderByUrl( url.href ) );

				return false;
			} );
		},
		handleResetFilters: function() {
			$body.on( 'click', '.wcapf-reset-filters-btn', function() {
				console.log( 'reset all filters' );
			} );
		},
		// TODO: Move to pro
		handleClearFilter: function() {
			$body
				.on( 'click', '.wcapf-filter-clear-btn', function( e ) {
					e.stopPropagation();

					WCAPF.requestFilter( $( this ).attr( 'data-clear-filter-url' ) );
				} )
				.on( 'keydown', '.wcapf-filter-clear-btn', function( e ) {
					if ( e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar' ) {
						// Prevent the default action to stop scrolling when space is pressed
						e.preventDefault();
						e.stopPropagation();

						WCAPF.requestFilter( $( this ).attr( 'data-clear-filter-url' ) );
					}
				} );
		},
		handleFilterTooltip: function() {
			if ( 'function' !== typeof tippy ) {
				return;
			}

			if ( ! wcapf_params.use_tippyjs ) {
				return;
			}

			tippy( '.wcapf-filter-tooltip', {
				placement: 'top',
				content( reference ) {
					return reference.getAttribute( 'data-content' );
				},
				allowHTML: true,
			} );
		},
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

				$minValue.on( 'input', function() {
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

				$maxValue.on( 'input', function() {
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
		initFilterOptionTooltip: function() {
			if ( 'function' !== typeof tippy ) {
				return;
			}

			if ( ! wcapf_params.use_tippyjs ) {
				return;
			}

			const tooltipPositions = [ 'top', 'right', 'bottom', 'left' ];

			tooltipPositions.forEach( function( tooltipPosition ) {
				const identifier = 'data-wcapf-tooltip-' + tooltipPosition;

				const instances = tippy( '[' + identifier + ']', {
					placement: tooltipPosition,
					content( reference ) {
						return reference.getAttribute( identifier );
					}
				} );

				window.tippyInstances = tippyInstances.concat( instances );
			} );
		},
		init: function() {
			WCAPF.initCombobox();
			WCAPF.initRangeSlider();
			WCAPF.initFilterOptionTooltip();
		}
	};

	// Handle the popstate event(browser's back/forward)
	window.addEventListener( 'popstate', function( e ) {
		if ( null !== e.state && e.state.hasOwnProperty( 'wcapf' ) ) {
			WCAPF.filterProducts( 'popstate' );
		}
	} );

	// @source https://stackoverflow.com/a/33004917
	if ( 'scrollRestoration' in history ) {
		history.scrollRestoration = 'manual';
	}

}( jQuery, window ) );

( function( $, WCAPF ) {

	WCAPF.init();

	WCAPF.handleFilterAccordion();
	WCAPF.handleHierarchyToggle();
	WCAPF.handleSoftLimit();
	WCAPF.handleSearchFilterOptions();

	WCAPF.handleListFilters();
	WCAPF.handleDropdownFilters();
	WCAPF.handleNumberInputFilters();
	WCAPF.handlePagination();
	WCAPF.handleDefaultOrderby();

	WCAPF.handleResetFilters();
	WCAPF.handleClearFilter();

	WCAPF.handleFilterTooltip();

}( jQuery, window.WCAPF ) );
