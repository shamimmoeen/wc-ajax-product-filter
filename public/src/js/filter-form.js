/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     wptools.io
 */

const wcapf_params = wcapf_params || {
	'is_rtl': '',
	'filter_input_delay': '',
	'chosen_display_selected_options': '',
	'chosen_no_results_text': '',
	'chosen_options_none_text': '',
	'search_box_in_default_orderby': '',
	'chosen_lib_search_threshold': '', // todo
	'preserve_hierarchy_accordion_state': '',
	'preserve_soft_limit_state': '',
	'enable_animation_for_filter_accordion': '',
	'filter_accordion_animation_speed': '',
	'filter_accordion_animation_easing': '',
	'enable_animation_for_hierarchy_accordion': '',
	'hierarchy_accordion_animation_speed': '',
	'hierarchy_accordion_animation_easing': '',
	'restore_focus_after_filtering': '',
	'loading_overlay_options': '',
	'scroll_to_top_speed': '',
	'scroll_to_top_easing': '',
	'immediate_scroll_on_paginate': '',
	'is_mobile': '',
	'use_tippyjs': '',
	'shop_loop_container': '',
	'not_found_container': '',
	'enable_pagination_via_ajax': '',
	'pagination_container': '',
	'sorting_control': '',
	'attach_chosen_on_sorting': '',
	'loading_animation': '',
	'scroll_window': '',
	'scroll_window_for': '',
	'scroll_window_when': '',
	'scroll_window_custom_element': '',
	'scroll_to_top_offset': '',
	'disable_scroll_animation': '',
	'update_document_title': '',
	'for_preview': '',
};

jQuery( document ).ready( function( $ ) {

	return;

	const $body = $( 'body' );

	const rangeValuesSeparator = '~';

	const _delay = parseInt( wcapf_params.filter_input_delay );
	const delay  = _delay >= 0 ? _delay : 800;

	// Store fields' id and filter information.
	const fields = {};

	const wcapfSingleFilterSelector      = '.wcapf-single-filter';
	const wcapfNavFilterSelector         = '.wcapf-nav-filter';
	const wcapfNumberRangeFilterSelector = '.wcapf-number-range-filter';
	const wcapfDateFilterSelector        = '.wcapf-date-range-filter';

	const $wcapfSingleFilters      = $( wcapfSingleFilterSelector );
	const $wcapfNavFilters         = $( wcapfNavFilterSelector );
	const $wcapfNumberRangeFilters = $( wcapfNumberRangeFilterSelector );
	const $wcapfDateFilters        = $( wcapfDateFilterSelector );

	$wcapfSingleFilters.each( function() {
		const $field         = $( this );
		const id             = $field.attr( 'data-id' );
		const $wrapper       = $field.find( '.wcapf-field-inner > div' );
		const filterKey      = $wrapper.attr( 'data-filter-key' );
		const multipleFilter = parseInt( $wrapper.attr( 'data-multiple-filter' ) );

		fields[ id ] = {
			filterKey: filterKey,
			multipleFilter: multipleFilter
		};
	} );

	// Initialize jQuery chosen library.
	function initChosen() {
		if ( ! jQuery().chosen ) {
			return;
		}

		let $root;

		if ( wcapf_params.for_preview ) {
			$root = $( wcapfNavFilterSelector );
		} else {
			$root = $wcapfNavFilters;
		}

		$root.find( '.wcapf-chosen-select' ).each( function() {
			const $this   = $( this );
			const options = {
				inherit_select_classes: true,
				inherit_option_classes: true,
			};

			if ( wcapf_params.is_rtl ) {
				options[ 'rtl' ] = true;
			}

			const noResultsMessage = $this.attr( 'data-no-results-message' );

			if ( noResultsMessage ) {
				options[ 'no_results_text' ] = noResultsMessage;
			}

			// options[ 'disable_search' ] = true;

			const searchThreshold = parseInt( wcapf_params.chosen_lib_search_threshold );

			if ( searchThreshold ) {
				// options[ 'disable_search_threshold' ] = searchThreshold;
			}

			// options[ 'display_selected_options' ] = false;

			// minimumResultsForSearch: 20

			// options['minimumResultsForSearch'] = -1;

			$this.chosen( options );
		} );
	}

	initChosen();

	// Initialize hierarchy accordion.
	function initHierarchyAccordion() {
		let $root;

		if ( wcapf_params.for_preview ) {
			$root = $( wcapfNavFilterSelector );
		} else {
			$root = $wcapfNavFilters;
		}

		function toggleAccordion( $el ) {
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
		}

		$root.find( '.wcapf-hierarchy-accordion-toggle' ).on( 'click', function() {
			toggleAccordion( $( this ) );
		} );

		$root.find( '.wcapf-hierarchy-accordion-toggle' ).on( 'keydown', function( e ) {
			if ( e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar' ) {
				// Prevent the default action to stop scrolling when space is pressed
				e.preventDefault();

				toggleAccordion( $( this ) );
			}
		} );
	}

	initHierarchyAccordion();

	/**
	 * @source https://stackoverflow.com/a/34141813
	 *
	 * @param number
	 * @param decimals
	 * @param dec_point
	 * @param thousands_sep
	 *
	 * @returns {string}
	 */
	function number_format( number, decimals, dec_point, thousands_sep ) {
		// Strip all characters but numerical ones.
		number = ( number + '' ).replace( /[^\d+\-Ee.]/g, '' );

		const n    = ! isFinite( +number ) ? 0 : +number;
		const prec = ! isFinite( +decimals ) ? 0 : Math.abs( decimals );
		const sep  = ( typeof thousands_sep === 'undefined' ) ? ',' : thousands_sep;
		const dec  = ( typeof dec_point === 'undefined' ) ? '.' : dec_point;

		let s;

		const toFixedFix = function( n, prec ) {
			const k = Math.pow( 10, prec );
			return '' + Math.round( n * k ) / k;
		};

		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = ( prec ? toFixedFix( n, prec ) : '' + Math.round( n ) ).split( '.' );

		if ( s[ 0 ].length > 3 ) {
			s[ 0 ] = s[ 0 ].replace( /\B(?=(?:\d{3})+(?!\d))/g, sep );
		}

		if ( ( s[ 1 ] || '' ).length < prec ) {
			s[ 1 ] = s[ 1 ] || '';
			s[ 1 ] += new Array( prec - s[ 1 ].length + 1 ).join( '0' );
		}

		return s.join( dec );
	}

	// Initialize noUISlider.
	function initNoUISlider() {
		if ( 'undefined' === typeof noUiSlider ) {
			return;
		}

		let $root;

		if ( wcapf_params.for_preview ) {
			$root = $( wcapfNumberRangeFilterSelector );
		} else {
			$root = $wcapfNumberRangeFilters;
		}

		$root.find( '.wcapf-range-slider' ).each( function() {
			const $item = $( this );

			// TODO: Remove filter key.
			const filterKey = $item.attr( 'data-filter-key' );
			const $slider   = $item.find( '.wcapf-noui-slider' );

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
	}

	initNoUISlider();

	function filterByDate( $input ) {
		if ( wcapf_params.for_preview ) {
			return;
		}

		const $wcapfDateFilter = $input.closest( '.wcapf-date-input' );
		const filterKey        = $wcapfDateFilter.attr( 'data-filter-key' );
		const isRange          = $wcapfDateFilter.attr( 'data-is-range' );

		let filterValue = '';
		let runFilter   = false;

		// Clear any previously set timer before setting a fresh one
		clearTimeout( $wcapfDateFilter.data( 'timer' ) );

		if ( isRange ) {
			const from = $wcapfDateFilter.find( '.date-from-input' ).val();
			const to   = $wcapfDateFilter.find( '.date-to-input' ).val();

			if ( from && to ) {
				filterValue = from + rangeValuesSeparator + to;
				runFilter   = true;
			} else if ( ! from && ! to ) {
				runFilter = true;
			}
		} else {
			const from = $wcapfDateFilter.find( '.date-from-input' ).val();

			if ( from ) {
				filterValue = from;
				runFilter   = true;
			} else {
				runFilter = true;
			}
		}

		if ( runFilter ) {
			$wcapfDateFilter.data( 'timer', setTimeout( function() {
				$wcapfDateFilter.removeData( 'timer' );

				if ( filterValue ) {
					updateQueryStringParameter( filterKey, filterValue );
				} else {
					const query = removeQueryStringParameter( filterKey );
					history.pushState( {}, '', query );
				}

				filterProducts();
			}, delay ) );
		}
	}

	function initDatepicker() {
		if ( ! jQuery().datepicker ) {
			return;
		}

		let $root;

		if ( wcapf_params.for_preview ) {
			$root = $( wcapfDateFilterSelector );
		} else {
			$root = $wcapfDateFilters;
		}

		const $wcapfDateFilter = $root.find( '.wcapf-date-input' );

		const format        = $wcapfDateFilter.attr( 'data-date-format' );
		const yearDropdown  = $wcapfDateFilter.attr( 'data-date-picker-year-dropdown' );
		const monthDropdown = $wcapfDateFilter.attr( 'data-date-picker-month-dropdown' );

		const $from = $wcapfDateFilter.find( '.date-from-input' );
		const $to   = $wcapfDateFilter.find( '.date-to-input' );

		$from.datepicker( {
			dateFormat: format,
			changeYear: yearDropdown,
			changeMonth: monthDropdown,
		} );

		$to.datepicker( {
			dateFormat: format,
			changeYear: yearDropdown,
			changeMonth: monthDropdown,
		} );

		$from.on( 'change', function() {
			const $input = $( this );
			filterByDate( $input );
		} );

		$to.on( 'change', function() {
			const $input = $( this );
			filterByDate( $input );
		} );
	}

	initDatepicker();

	function initDefaultOrderBy() {
		// Attach chosen.
		if ( wcapf_params.attach_chosen_on_sorting ) {
			if ( jQuery().chosen ) {
				$body.find( '.woocommerce-ordering select.orderby' ).chosen( {
					'disable_search_threshold': 15,
				} );
			}
		}

		if ( ! wcapf_params.sorting_control ) {
			$body.find( '.woocommerce-ordering' ).each( function() {
				const $orderingForm = $( this );

				$orderingForm.on( 'change', 'select.orderby', function() {
					$orderingForm.submit();
				} );
			} );

			return;
		}

		// todo: check if ajax disabled.
		$body.find( '.woocommerce-ordering' ).each( function() {
			const $orderingForm = $( this );

			$orderingForm.on( 'submit', function( e ) {
				e.preventDefault();
			} );

			$orderingForm.on( 'change', 'select.orderby', function( e ) {
				e.preventDefault();

				const order      = $( this ).val();
				const filter_key = 'orderby';

				updateQueryStringParameter( filter_key, order );
				filterProducts();
			} );
		} );
	}

	initDefaultOrderBy();

	function updateProductsCountResult( $results ) {
		const selector = '.woocommerce-result-count';

		if ( $( wcapf_params.shop_loop_container ).find( selector ).length ) {
			return;
		}

		const newProductCount = $results.find( selector ).html();

		$body.find( selector ).html( newProductCount );
	}

	function showLoadingAnimation() {
		if ( ! wcapf_params.loading_animation ) {
			return;
		}

		$.LoadingOverlay( 'show', wcapf_params.loading_overlay_options );
	}

	function disableNoUiSliders() {
		if ( 'undefined' === typeof noUiSlider ) {
			return;
		}

		$wcapfNumberRangeFilters.find( '.wcapf-noui-slider' ).each( function( e, element ) {
			element.setAttribute( 'disabled', true );
		} );
	}

	function disableLabels() {
		const selectors = '.wcapf-labeled-nav .item, .wcapf-active-filters .item';

		// TODO: Add disabled attribute.
		$wcapfSingleFilters.find( selectors ).addClass( 'disabled' );
	}

	function disableInputs() {
		if ( ! wcapf_params.disable_inputs_while_fetching_results ) {
			return;
		}

		const inputs = 'input, select';

		$wcapfSingleFilters.find( inputs ).attr( 'disabled', 'disabled' );
		$wcapfSingleFilters.find( inputs ).trigger( 'chosen:updated' );

		disableNoUiSliders();
		disableLabels();
	}

	function enableNoUiSliders() {
		if ( 'undefined' === typeof noUiSlider ) {
			return;
		}

		$wcapfNumberRangeFilters.find( '.wcapf-noui-slider' ).each( function( e, element ) {
			element.removeAttribute( 'disabled' );
		} );
	}

	function enableInputs() {
		if ( ! wcapf_params.disable_inputs_while_fetching_results ) {
			return;
		}

		const inputs = 'input';

		$wcapfNumberRangeFilters.find( inputs ).removeAttr( 'disabled' );
		$wcapfDateFilters.find( inputs ).removeAttr( 'disabled' );

		enableNoUiSliders();
	}

	function resetLoadingAnimation() {
		if ( ! wcapf_params.loading_animation ) {
			return;
		}

		$.LoadingOverlay( 'hide' );
	}

	function scrollTo() {
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
	}

	// Things are done before fetching the products like showing a loading indicator.
	function beforeFetchingProducts() {
		disableInputs();
		showLoadingAnimation();

		if ( 'immediately' === wcapf_params.scroll_window_when ) {
			scrollTo();
		}

		$body.trigger( 'wcapf_before_fetching_products' );
	}

	function beforeUpdatingProducts( $results ) {
		resetLoadingAnimation();

		$body.trigger( 'wcapf_before_updating_products', [ $results ] );
	}

	// Things are done after applying the filter like scroll to top.
	function afterUpdatingProducts( $results ) {
		initChosen();
		initHierarchyAccordion();
		initNoUISlider();
		initDatepicker();
		initDefaultOrderBy();
		updateProductsCountResult( $results );
		enableInputs();

		if ( 'after' === wcapf_params.scroll_window_when ) {
			scrollTo();
		}

		$body.trigger( 'wcapf_after_updating_products', [ $results ] );
	}

	// The main filter function.
	function filterProducts( forceReRender = false ) {
		if ( wcapf_params.for_preview ) {
			return;
		}

		beforeFetchingProducts();

		$.get( window.location.href, function( data ) {
			const $data = $( data );

			// Replace the fields' data with new data.
			$.each( fields, function( id ) {
				const fieldID    = '[data-id="' + id + '"]';
				const $field     = $( fieldID );
				const $inner     = $field.find( '.wcapf-field-inner' );
				const _field     = $data.find( fieldID );
				let fieldClasses = $( _field ).attr( 'class' );

				// Preserve hierarchy accordion state.
				if ( wcapf_params.preserve_hierarchy_accordion_state ) {
					if ( $field.hasClass( 'hierarchy-accordion' ) ) {
						$field.find( '.hierarchy-accordion-toggle.active' ).each( function() {
							const itemValue      = $( this ).parent().children( 'input' ).val();
							const toggleSelector = 'input[value="' + itemValue + '"] ~ .hierarchy-accordion-toggle';
							const ulSelector     = 'input[value="' + itemValue + '"] ~ ul';
							const _classes       = 'hierarchy-accordion-toggle active';

							_field.find( toggleSelector ).attr( 'class', _classes );
							_field.find( ulSelector ).show();
						} );
					}
				}

				const _html = _field.find( '.wcapf-field-inner' ).html();

				// Show soft limit items.
				const softLimitSelector = 'show-hidden-items';

				if ( $field.hasClass( softLimitSelector ) ) {
					if ( ! _field.hasClass( softLimitSelector ) ) {
						fieldClasses += ' ' + softLimitSelector;
					}
				} else {
					fieldClasses = fieldClasses.replace( softLimitSelector, '' );
				}

				// Update the field's class.
				$field.attr( 'class', fieldClasses.trim() );

				// When called from history back or forward request then rerender all fields.
				if ( forceReRender ) {

					// update field
					$inner.html( _html );

				} else {

					// Selectively rerender the fields.
					if ( $field.hasClass( 'wcapf-nav-filter' ) ) {

						// update field
						$inner.html( _html );

					}

				}

				$field.trigger( 'wcapf-field-updated', [ _field ] );
			} );

			beforeUpdatingProducts( $data );

			// Replace old shop loop with new one.
			const $shopLoopContainer = $data.find( wcapf_params.shop_loop_container );
			const $notFoundContainer = $data.find( wcapf_params.not_found_container );

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

			afterUpdatingProducts( $data );
		} );
	}

	// URL Parser
	function getUrlVars( url ) {
		let vars = {}, hash;

		if ( typeof url === 'undefined' ) {
			url = window.location.href;
		}

		url = url.replaceAll( '%2C', ',' );

		const hashes  = url.slice( url.indexOf( '?' ) + 1 ).split( '&' );
		const hLength = hashes.length;

		for ( let i = 0; i < hLength; i++ ) {
			hash = hashes[ i ].split( '=' );

			vars[ hash[ 0 ] ] = hash[ 1 ];
		}

		return vars;
	}

	// everytime we apply the filter we set the current page to 1
	function fixPagination() {
		let url                = window.location.href;
		const params           = getUrlVars( url );
		const currentPageInUrl = parseInt( url.replace( /.+\/page\/(\d+)+/, '$1' ) );

		if ( currentPageInUrl ) {
			if ( currentPageInUrl > 1 ) {
				url = url.replace( /page\/(\d+)/, 'page/1' );
			}
		} else if ( typeof params[ 'paged' ] !== 'undefined' ) {
			const currentPageInParams = parseInt( params[ 'paged' ] );

			if ( currentPageInParams > 1 ) {
				url = url.replace( 'paged=' + currentPageInParams, 'paged=1' );
			}
		}

		return url;
	}

	// update query string for categories, meta etc..
	function updateQueryStringParameter( key, value, pushHistory, url ) {
		if ( typeof pushHistory === 'undefined' ) {
			pushHistory = true;
		}

		if ( typeof url === 'undefined' ) {
			url = fixPagination();
		}

		const re        = new RegExp( '([?&])' + key + '=.*?(&|$)', 'i' );
		const separator = url.indexOf( '?' ) !== -1 ? '&' : '?';
		let urlWithQuery;

		if ( url.match( re ) ) {
			urlWithQuery = url.replace( re, '$1' + key + '=' + value + '$2' );
		} else {
			urlWithQuery = url + separator + key + '=' + value;
		}

		if ( pushHistory === true ) {
			return history.pushState( {}, '', urlWithQuery );
		} else {
			return urlWithQuery;
		}
	}

	// remove parameter from url
	function removeQueryStringParameter( filterKey, url ) {
		if ( typeof url === 'undefined' ) {
			url = fixPagination();
		}

		const oldParams         = getUrlVars( url );
		const oldParamsLength   = Object.keys( oldParams ).length;
		const startPosition     = url.indexOf( '?' );
		const filterKeyPosition = url.indexOf( filterKey );
		let cleanUrl, cleanQuery;

		if ( oldParamsLength > 1 ) {
			if ( ( filterKeyPosition - startPosition ) > 1 ) {
				cleanUrl = url.replace( '&' + filterKey + '=' + oldParams[ filterKey ], '' );
			} else {
				cleanUrl = url.replace( filterKey + '=' + oldParams[ filterKey ] + '&', '' );
			}

			const newParams = cleanUrl.split( '?' );
			cleanQuery      = '?' + newParams[ 1 ];
		} else {
			cleanQuery = url.replace( '?' + filterKey + '=' + oldParams[ filterKey ], '' );
		}

		return cleanQuery;
	}

	// take the key and value and make query
	function makeParameters( filterKey, filterValue, forceRerender = false, url ) {
		const valueSeparator = ',';

		let params, nextValues, emptyValue = false;

		if ( typeof url !== 'undefined' ) {
			params = getUrlVars( url );
		} else {
			params = getUrlVars();
		}

		if ( typeof params[ filterKey ] != 'undefined' ) {
			const prevValues      = params[ filterKey ];
			const prevValuesArray = prevValues.split( valueSeparator );

			if ( prevValues.length > 0 ) {
				const found = $.inArray( filterValue, prevValuesArray );

				if ( found >= 0 ) {
					// Element was found, remove it.
					prevValuesArray.splice( found, 1 );

					if ( prevValuesArray.length === 0 ) {
						emptyValue = true;
					}
				} else {
					// Element was not found, add it.
					prevValuesArray.push( filterValue );
				}

				if ( prevValuesArray.length > 1 ) {
					nextValues = prevValuesArray.join( valueSeparator );
				} else {
					nextValues = prevValuesArray;
				}
			} else {
				nextValues = filterValue;
			}
		} else {
			nextValues = filterValue;
		}

		// update url and query string
		if ( ! emptyValue ) {
			updateQueryStringParameter( filterKey, nextValues );
		} else {
			const query = removeQueryStringParameter( filterKey );
			history.pushState( {}, '', query );
		}

		filterProducts( forceRerender );
	}

	function singleFilter( filterKey, filterValue ) {
		const params = getUrlVars();
		let query;

		if ( typeof params[ filterKey ] !== 'undefined' && params[ filterKey ] === filterValue ) {
			query = removeQueryStringParameter( filterKey );
		} else {
			query = updateQueryStringParameter( filterKey, filterValue, false );
		}

		// update url
		history.pushState( {}, '', query );

		filterProducts();
	}

	// Handle the pagination request via ajax.
	if ( wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container ) {
		const $container = $( wcapf_params.shop_loop_container );
		const selector   = wcapf_params.pagination_container + ' a';

		// todo: check if ajax disabled.
		if ( $container.length ) {
			$container.on( 'click', selector, function( e ) {
				e.preventDefault();

				const location = $( this ).attr( 'href' );

				history.pushState( {}, '', location );

				filterProducts();
			} );
		}
	}

	// The function to handle the common filter requests.
	function handleFilterRequest( $item, filterValue ) {
		const $field         = $item.closest( '.wcapf-single-filter' );
		const fieldID        = $field.attr( 'data-id' );
		const fieldData      = fields[ fieldID ];
		const filterKey      = fieldData.filterKey;
		const multipleFilter = fieldData.multipleFilter;

		if ( ! filterKey ) {
			return;
		}

		if ( ! filterValue.length ) {
			const query = removeQueryStringParameter( filterKey );
			history.pushState( {}, '', query );

			filterProducts();

			return;
		}

		if ( multipleFilter ) {
			makeParameters( filterKey, filterValue );
		} else {
			singleFilter( filterKey, filterValue );
		}
	}

	function requestFilter( url ) {
		if ( ! url ) {
			return;
		}

		// window.location.href = url;

		// TODO: Filter the products conditionally.
		// filterProducts();
	}

	// Handle the filter request for list field.
	$wcapfNavFilters.on(
		'change',
		'.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]',
		function( event ) {
			event.preventDefault();

			const $item = $( this );

			requestFilter( $item.data( 'url' ) );
		}
	);

	// Handle the filter request for labeled item.
	$wcapfNavFilters.on( 'click', '.wcapf-labeled-nav .item:not(.disabled)', function( event ) {
		event.preventDefault();

		const $item = $( this );

		requestFilter( $item.data( 'url' ) );
	} );

	// Handle the filter request for display type select fields.
	$wcapfNavFilters.on( 'change', 'select', function( event ) {
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

		requestFilter( url );
	} );

	/**
	 * Handle the filter request for range number.
	 */
	const rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';

	// TODO: Maybe use 'change' event.
	$wcapfNumberRangeFilters.on( 'input', rangeNumberSelectors, function( event ) {
		event.preventDefault();

		const $item = $( this );

		const $rangeNumber      = $item.closest( '.wcapf-range-number' );
		const formatNumbers     = $rangeNumber.attr( 'data-format-numbers' );
		const rangeMinValue     = parseFloat( $rangeNumber.attr( 'data-range-min-value' ) );
		const rangeMaxValue     = parseFloat( $rangeNumber.attr( 'data-range-max-value' ) );
		const decimalPlaces     = $rangeNumber.attr( 'data-decimal-places' );
		const thousandSeparator = $rangeNumber.attr( 'data-thousand-separator' );
		const decimalSeparator  = $rangeNumber.attr( 'data-decimal-separator' );

		// Clear any previously set timer before setting a fresh one
		clearTimeout( $item.data( 'timer' ) );

		function getValue( floatValue ) {
			if ( formatNumbers ) {
				return number_format( floatValue, decimalPlaces, decimalSeparator, thousandSeparator );
			}

			return floatValue;
		}

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

			if ( minValue === rangeMinValue && maxValue === rangeMaxValue ) {
				// Remove range filter.
				requestFilter( $rangeNumber.data( 'clear-filter-url' ) );
			} else {
				// Add range filter.
				const url = $rangeNumber.data( 'url' ).replace( '%1s', minValue ).replace( '%2s', maxValue );
				requestFilter( url );
			}
		}, delay ) );
	} );

	// Handle removing the active filters.
	$wcapfNavFilters.on( 'click', '.wcapf-active-filters .item:not(.disabled)', function( event ) {
		event.preventDefault();

		const $item       = $( this );
		const filterKey   = $item.attr( 'data-filter-key' );
		const filterValue = $item.attr( 'data-value' );

		makeParameters( filterKey, filterValue, true );
	} );

	function resetFilters( $button ) {
		const _filterKeys = $button.attr( 'data-keys' );

		if ( ! _filterKeys ) {
			return;
		}

		const filterKeys = _filterKeys.split( ',' );

		let query = '';

		$.each( filterKeys, function( i, filterKey ) {
			if ( query ) {
				query = removeQueryStringParameter( filterKey, query );
			} else {
				query = removeQueryStringParameter( filterKey );
			}
		} );

		// Empty query causes issue(doesn't remove the filter keys from the url),
		// this is why we are setting the page url as query.
		if ( ! query ) {
			const prevUrl = window.location.href;
			const newUrl  = prevUrl.split( '?' );

			query = newUrl[ 0 ];
		}

		history.pushState( {}, '', query );

		filterProducts( true );
	}

	// Clear/Reset all filters.
	$body.on( 'wcapf-reset-filters', function( e, $button ) {
		resetFilters( $button );
	} );

	$body.on( 'click', '.wcapf-reset-filters-btn', function() {
		const $button = $( this );

		resetFilters( $button );
	} );

	$wcapfNavFilters.on( 'click', '.wcapf-reset-filters-btn', function( event ) {
		event.preventDefault();

		const $button = $( this );

		$body.trigger( 'wcapf-reset-filters', [ $button ] );
	} );

	$wcapfSingleFilters.on( 'wcapf-clear-filter', function() {
		const $field    = $( this );
		const fieldID   = $field.attr( 'data-id' );
		const fieldData = fields[ fieldID ];
		const filterKey = fieldData.filterKey;

		const query = removeQueryStringParameter( filterKey );
		history.pushState( {}, '', query );

		filterProducts( true );
	} );

	// Run ajax filter when browser history changes (user goes back or forward).
	if ( $( wcapf_params.shop_loop_container ).length || $( wcapf_params.not_found_container ).length ) {
		if ( wcapf_params.apply_filters_on_browser_history_change ) {
			$( window ).bind( 'popstate', function() {
				filterProducts( true );
			} );
		}
	}

	// The hook that manually run the ajax filters (can be useful for other plugins).
	$body.on( 'wcapf-run-filter-products', function( e, forceReRender ) {
		filterProducts( forceReRender );
	} );

	// The hook that reinitialize the filter widgets (to show the preview in the backend).
	$body.on( 'init_filter_widgets', function() {
		initChosen();
		initHierarchyAccordion();
		initNoUISlider();
		initDatepicker();
	} );

	/**
	 * Make it compatible with other plugins.
	 */
	$body.on( 'wcapf_after_updating_products', function() {
		// woo-variation-swatches
		$( document ).trigger( 'woo_variation_swatches_pro_init' );
	} );
} );
