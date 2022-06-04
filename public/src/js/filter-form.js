/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     Mainul Hassan Main
 */

const wcapf_params = wcapf_params || {
	'filter_input_delay': '',
	'chosen_lib_search_threshold': '',
	'shop_loop_container': '',
	'not_found_container': '',
	'pagination_container': '', // todo
	'sorting_control': '', // todo
	'scroll_to_top': '', // todo
	'scroll_to_top_offset': '', // todo
	'custom_scripts': '',
};

jQuery( document ).ready(
	function( $ ) {

		const rangeValuesSeparator = '~';

		// return false if wcapf_params variable is not found
		if ( typeof wcapf_params === 'undefined' ) {
			return false;
		}

		const _delay = parseInt( wcapf_params.filter_input_delay );
		const delay  = _delay >= 0 ? _delay : 800;

		// store fields' id and filter information
		const fields = {};

		const $wcapfSingleFilters      = $( '.wcapf-single-filter' );
		const $wcapfNavFilters         = $( '.wcapf-nav-filter' );
		const $wcapfNumberRangeFilters = $( '.wcapf-number-range-filter' );

		$wcapfSingleFilters.each(
			function() {
				const $field         = $( this );
				const id             = $field.attr( 'data-id' );
				const $wrapper       = $field.children( 'div' );
				const filterKey      = $wrapper.attr( 'data-filter-key' );
				const multipleFilter = parseInt( $wrapper.attr( 'data-multiple-filter' ) );

				fields[ id ] = {
					filterKey: filterKey,
					multipleFilter: multipleFilter
				};
			}
		);

		// Initialize jQuery chosen library
		function initChosen() {
			if ( ! jQuery().chosen ) {
				return;
			}

			$wcapfNavFilters.find( '.wcapf-chosen-select' ).each( function() {
				const $this   = $( this );
				const options = {};

				const noResultsMessage = $this.attr( 'data-no-results-message' );

				if ( noResultsMessage ) {
					options[ 'no_results_text' ] = noResultsMessage;
				}

				const searchThreshold = parseInt( wcapf_params.chosen_lib_search_threshold );

				if ( searchThreshold ) {
					options[ 'disable_search_threshold' ] = searchThreshold;
				}

				$this.chosen( options );
			} );
		}

		initChosen();

		// Initialize hierarchy accordion
		function initHierarchyAccordion() {
			$wcapfNavFilters.find( '.hierarchy-accordion-toggle' ).on( 'click', function() {
				$( this ).toggleClass( 'active' );
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

		// Initialize noUISlider
		function initNoUISlider() {
			if ( 'undefined' === typeof noUiSlider ) {
				return;
			}

			$wcapfNumberRangeFilters.find( '.wcapf-range-slider' ).each( function() {
				const $item = $( this );

				const filterKey = $item.attr( 'data-filter-key' );
				const $slider   = $item.find( '.wcapf-noui-slider' );

				// If slider is already initialized then don't reinitialize again.
				if ( $slider.hasClass( 'wcapf-noui-target' ) ) {
					return;
				}

				const sliderId          = $slider.attr( 'id' );
				const displayValuesAs   = $item.attr( 'data-display-values-as' );
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
					const minValue = number_format( values[ 0 ], decimalPlaces, decimalSeparator, thousandSeparator );
					const maxValue = number_format( values[ 1 ], decimalPlaces, decimalSeparator, thousandSeparator );

					if ( 'plain_text' === displayValuesAs ) {
						$minValue.html( minValue );
						$maxValue.html( maxValue );
					} else {
						$minValue.val( minValue );
						$maxValue.val( maxValue );
					}

					$( 'body' ).trigger( 'wcapf-nouislider-update', [ $item, values ] );
				} );

				function filterProductsAccordingToSlider( values ) {
					const $body = $( 'body' );

					$body.trigger( 'wcapf-nouislider-before-filter-products', [ $item, values ] );

					const minValue = parseFloat( values[ 0 ] );
					const maxValue = parseFloat( values[ 1 ] );

					if ( minValue === rangeMinValue && maxValue === rangeMaxValue ) {
						const query = wcapfRemoveQueryStringParameter( filterKey );
						history.pushState( {}, '', query );
					} else {
						const filterValString = minValue + rangeValuesSeparator + maxValue;
						wcapfUpdateQueryStringParameter( filterKey, filterValString );
					}

					// filter products
					wcapfFilterProducts();

					$body.trigger( 'wcapf-nouislider-after-filter-products', [ $item, values ] );
				}

				slider.noUiSlider.on( 'set', function( values ) {
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

		function initDatepicker() {
			if ( ! jQuery().datepicker ) {
				return;
			}

			const $wcapfDateFilters = $( '.wcapf-date-range-filter' );
			const $wcapfDateFilter  = $wcapfDateFilters.find( '.wcapf-date-input' );

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

		// show a loading indicator
		function wcapfBeforeUpdate() {
			$( 'body' ).trigger( 'wcapf_before_update_filters' );
		}

		// scroll to top
		function wcapfAfterUpdate() {
			initChosen();
			initHierarchyAccordion();
			initNoUISlider();
			initDatepicker();

			$( 'body' ).trigger( 'wcapf_after_update_filters' );
		}

		// filter the products
		function wcapfFilterProducts( forceReRender = false ) {
			wcapfBeforeUpdate();

			$.get(
				window.location.href,
				function( data ) {
					const $data = $( data );

					const $shopLoopContainer = $data.find( wcapf_params.shop_loop_container );
					const $notFoundContainer = $data.find( wcapf_params.not_found_container );

					// replace fields' data with new data
					$.each(
						fields,
						function( id ) {
							const fieldID    = '[data-id="' + id + '"]';
							const $field     = $( fieldID );
							const _field     = $data.find( fieldID );
							const fieldClass = $( _field ).attr( 'class' );

							// When called from history back or forward request then rerender all fields.
							if ( forceReRender ) {

								// update class
								$field.attr( 'class', fieldClass );

								// update field
								$field.html( _field.html() );

							} else {

								// Selectively rerender the fields.
								if ( $field.hasClass( 'wcapf-nav-filter' ) ) {

									// update class
									$field.attr( 'class', fieldClass );

									// update field
									$field.html( _field.html() );

								}

							}
						}
					);

					// replace old shop loop with new one
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

					wcapfAfterUpdate();

					// todo
					// reinitialize ordering
					// wcapfInitOrder();

					// todo
					// reinitialize dropdown filter
					// wcapfDropDownFilter();

					// run scripts after shop loop undated
					if ( typeof wcapf_params.custom_scripts !== 'undefined' && wcapf_params.custom_scripts.length > 0 ) {
						eval( wcapf_params.custom_scripts );
					}
				}
			);
		}

		// URL Parser
		function wcapfGetUrlVars( url ) {
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
		function wcapfFixPagination() {
			let url                = window.location.href;
			const params           = wcapfGetUrlVars( url );
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
		function wcapfUpdateQueryStringParameter( key, value, pushHistory, url ) {
			if ( typeof pushHistory === 'undefined' ) {
				pushHistory = true;
			}

			if ( typeof url === 'undefined' ) {
				url = wcapfFixPagination();
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
		function wcapfRemoveQueryStringParameter( filterKey, url ) {
			if ( typeof url === 'undefined' ) {
				url = wcapfFixPagination();
			}

			const oldParams         = wcapfGetUrlVars( url );
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
		function wcapfMakeParameters( filterKey, filterValue, forceRerender = false, url ) {
			const valueSeparator = ',';

			let params, nextValues, emptyValue = false;

			if ( typeof url !== 'undefined' ) {
				params = wcapfGetUrlVars( url );
			} else {
				params = wcapfGetUrlVars();
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
				wcapfUpdateQueryStringParameter( filterKey, nextValues );
			} else {
				const query = wcapfRemoveQueryStringParameter( filterKey );
				history.pushState( {}, '', query );
			}

			// filter products
			wcapfFilterProducts( forceRerender );
		}

		function wcapfSingleFilter( filterKey, filterValue ) {
			const params = wcapfGetUrlVars();
			let query;

			if ( typeof params[ filterKey ] !== 'undefined' && params[ filterKey ] === filterValue ) {
				query = wcapfRemoveQueryStringParameter( filterKey );
			} else {
				query = wcapfUpdateQueryStringParameter( filterKey, filterValue, false );
			}

			// update url
			history.pushState( {}, '', query );

			// filter products
			wcapfFilterProducts();
		}

		// The main function to handle the filter request
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
				const query = wcapfRemoveQueryStringParameter( filterKey );
				history.pushState( {}, '', query );

				// filter products
				wcapfFilterProducts();

				return;
			}

			if ( multipleFilter ) {
				wcapfMakeParameters( filterKey, filterValue );
			} else {
				wcapfSingleFilter( filterKey, filterValue );
			}
		}

		// handle the filter request for list fields
		$wcapfNavFilters.on(
			'change',
			'.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterValue = $item.val();

				handleFilterRequest( $item, filterValue );
			}
		);

		// TODO: Use a combination of label, checkbox and radio
		// handle the filter request for labeled item
		$wcapfNavFilters.on(
			'click',
			'.wcapf-labeled-nav .item',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterValue = $item.attr( 'data-value' );

				handleFilterRequest( $item, filterValue );
			}
		);

		// handle the filter request for display type select fields
		$wcapfNavFilters.on(
			'change',
			'select',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterValue = $item.val();

				const $field    = $item.closest( '.wcapf-single-filter' );
				const fieldID   = $field.attr( 'data-id' );
				const fieldData = fields[ fieldID ];
				const filterKey = fieldData.filterKey;

				if ( ! filterValue.length ) {
					const query = wcapfRemoveQueryStringParameter( filterKey );
					history.pushState( {}, '', query );
				} else {
					const filterValString = filterValue.toString();
					wcapfUpdateQueryStringParameter( filterKey, filterValString );
				}

				// filter products
				wcapfFilterProducts();
			}
		);

		// handle the filter request for range number
		$wcapfNumberRangeFilters.on(
			'input',
			'.wcapf-range-number .min-value, .wcapf-range-number .max-value',
			function( event ) {
				event.preventDefault();

				const $item = $( this );

				// Clear any previously set timer before setting a fresh one
				clearTimeout( $item.data( 'timer' ) );

				$item.data( 'timer', setTimeout( function() {
					$item.removeData( 'timer' );

					const $rangeNumber  = $item.closest( '.wcapf-range-number' );
					const filterKey     = $rangeNumber.attr( 'data-filter-key' );
					const rangeMinValue = $rangeNumber.attr( 'data-range-min-value' );
					const rangeMaxValue = $rangeNumber.attr( 'data-range-max-value' );
					let minValue        = $rangeNumber.find( '.min-value' ).val();
					let maxValue        = $rangeNumber.find( '.max-value' ).val();

					// Force the minValue not to be empty.
					if ( ! minValue.length ) {
						minValue = rangeMinValue;

						$rangeNumber.find( '.min-value' ).val( minValue );
					}

					// Force the maxValue not to be empty.
					if ( ! maxValue.length ) {
						maxValue = rangeMaxValue;

						$rangeNumber.find( '.max-value' ).val( maxValue );
					}

					// Force the minValue not to go below the rangeMinValue.
					if ( parseFloat( minValue ) < parseFloat( rangeMinValue ) ) {
						minValue = rangeMinValue;

						$rangeNumber.find( '.min-value' ).val( minValue );
					}

					// Force the minValue not to go up the rangeMaxValue.
					if ( parseFloat( minValue ) > parseFloat( rangeMaxValue ) ) {
						minValue = rangeMaxValue;

						$rangeNumber.find( '.min-value' ).val( minValue );
					}

					// Force the maxValue not to go up the rangeMaxValue.
					if ( parseFloat( maxValue ) > parseFloat( rangeMaxValue ) ) {
						maxValue = rangeMaxValue;

						$rangeNumber.find( '.max-value' ).val( maxValue );
					}

					// Force the maxValue not to go below the minValue.
					if ( parseFloat( minValue ) > parseFloat( maxValue ) ) {
						maxValue = minValue;

						$rangeNumber.find( '.max-value' ).val( maxValue );
					}

					if ( minValue === rangeMinValue && maxValue === rangeMaxValue ) {
						const query = wcapfRemoveQueryStringParameter( filterKey );
						history.pushState( {}, '', query );
					} else {
						const filterValString = minValue + rangeValuesSeparator + maxValue;
						wcapfUpdateQueryStringParameter( filterKey, filterValString );
					}

					// filter products
					wcapfFilterProducts();
				}, delay ) );
			}
		);

		// handle removing the active filters
		$wcapfNavFilters.on(
			'click',
			'.wcapf-active-filters .item',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterKey   = $item.attr( 'data-filter-key' );
				const filterValue = $item.attr( 'data-value' );

				wcapfMakeParameters( filterKey, filterValue, true );
			}
		);

		function resetFilters( $button ) {
			const _filterKeys = $button.attr( 'data-keys' );

			if ( ! _filterKeys ) {
				return;
			}

			const filterKeys = _filterKeys.split( ',' );

			let query = '';

			$.each( filterKeys, function( i, filterKey ) {
				if ( query ) {
					query = wcapfRemoveQueryStringParameter( filterKey, query );
				} else {
					query = wcapfRemoveQueryStringParameter( filterKey );
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

			// filter products
			wcapfFilterProducts( true );
		}

		// clear all filters
		$wcapfNavFilters.on(
			'click',
			'.wcapf-active-filters .wcapf-reset-filters-btn',
			function( event ) {
				event.preventDefault();

				const $button = $( this );

				resetFilters( $button );
			}
		);

		// reset filters
		$wcapfNavFilters.on(
			'click',
			'.wcapf-reset-filters-btn',
			function( event ) {
				event.preventDefault();

				const $button = $( this );

				resetFilters( $button );
			}
		);

		function filterByDate( $input ) {
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
						wcapfUpdateQueryStringParameter( filterKey, filterValue );
					} else {
						const query = wcapfRemoveQueryStringParameter( filterKey );
						history.pushState( {}, '', query );
					}

					// filter products
					wcapfFilterProducts();
				}, delay ) );
			}
		}

		// history back and forward request handling
		$( window ).bind( 'popstate', function() {
			// filter products
			wcapfFilterProducts( true );
		} );

	}
);
