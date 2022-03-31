/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     Mainul Hassan Main
 */

const wcapf_params = wcapf_params || {
	'shop_loop_container': '',
	'not_found_container': '',
	'pagination_container': '',
	'overlay_bg_color': '',
	'sorting_control': '',
	'scroll_to_top': '',
	'scroll_to_top_offset': '',
	'custom_scripts': ''
};

jQuery( document ).ready(
	function( $ ) {

		// return false if wcapf_params variable is not found
		if ( typeof wcapf_params === 'undefined' ) {
			return false;
		}

		// store fields' id and filter information
		const fields = {};

		const $wcapfTermFilter = $( '.wcapf-ajax-term-filter' );

		$wcapfTermFilter.each(
			function() {
				const $field         = $( this );
				const id             = $field.attr( 'id' );
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

			$wcapfTermFilter.find( '.wcapf-chosen-select' ).each( function() {
				const $this   = $( this );
				const options = {};

				const noResultsMessage = $this.attr( 'data-no-results-message' );

				if ( noResultsMessage ) {
					options[ 'no_results_text' ] = noResultsMessage;
				}

				$this.chosen( options );
			} );
		}

		initChosen();

		// Initialize hierarchy accordion
		function initHierarchyAccordion() {
			$wcapfTermFilter.find( '.hierarchy-accordion-toggle' ).on( 'click', function() {
				$( this ).toggleClass( 'active' );
			} );
		}

		initHierarchyAccordion();

		// show a loading indicator
		function wcapfBeforeUpdate() {
		}

		// scroll to top
		function wcapfAfterUpdate() {
			initChosen();
			initHierarchyAccordion();
		}

		// filter the products
		function wcapfFilterProducts() {
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
							const fieldID    = '#' + id;
							const $field     = $( fieldID );
							const _field     = $data.find( fieldID );
							const fieldClass = $( _field ).attr( 'class' );

							// update class
							$field.attr( 'class', fieldClass );

							// update field
							$field.html( _field.html() );
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

					// reinitialize ordering
					// wcapfInitOrder();

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
			const currentPageInUrl = parseInt( url.replace( /.+\/page\/([0-9]+)+/, '$1' ) );

			if ( currentPageInUrl ) {
				if ( currentPageInUrl > 1 ) {
					url = url.replace( /page\/([0-9]+)/, 'page/1' );
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
		function wcapfMakeParameters( filterKey, filterValue, url ) {
			let params, nextValues, emptyValue = false;

			if ( typeof url !== 'undefined' ) {
				params = wcapfGetUrlVars( url );
			} else {
				params = wcapfGetUrlVars();
			}

			if ( typeof params[ filterKey ] != 'undefined' ) {
				const prevValues      = params[ filterKey ];
				const prevValuesArray = prevValues.split( ',' );

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
						nextValues = prevValuesArray.join( ',' );
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
			wcapfFilterProducts();
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
			const $field         = $item.closest( '.wcapf-field-filter-form' );
			const fieldID        = $field.attr( 'id' );
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
		$wcapfTermFilter.on(
			'change',
			'.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterValue = $item.val();

				handleFilterRequest( $item, filterValue );
			}
		);

		// handle the filter request for labeled item
		$wcapfTermFilter.on(
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
		$wcapfTermFilter.on(
			'change',
			'select',
			function( event ) {
				event.preventDefault();

				const $item       = $( this );
				const filterValue = $item.val();

				const $field    = $item.closest( '.wcapf-field-filter-form' );
				const fieldID   = $field.attr( 'id' );
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

		// history back and forward request handling
		$( window ).bind( 'popstate', function() {
			// filter products
			wcapfFilterProducts();
		} );

	}
);
