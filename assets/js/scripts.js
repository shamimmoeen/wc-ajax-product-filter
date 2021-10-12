var wcapf_params = wcapf_params || {
	'shop_loop_container': '',
	'not_found_container': '',
	'pagination_container': '',
	'overlay_bg_color': '',
	'sorting_control': '',
	'scroll_to_top': '',
	'scroll_to_top_offset': '',
	'custom_scripts': ''
};

jQuery( document ).ready( function( $ ) {

	// return false if wcapf_params variable is not found
	if ( typeof wcapf_params === 'undefined' ) {
		return false;
	}

	// store widgets' id and filter information
	var widgets = {};

	var $wcapfTermFilter = $( '.wcapf-ajax-term-filter' );

	$wcapfTermFilter.each( function() {
		var $widget = $( this ),
			id = $widget.attr( 'id' ),
			$wrapper = $widget.children( 'div' ),
			filterKey = $wrapper.attr( 'data-filter-key' ),
			multipleFilter = parseInt( $wrapper.attr( 'data-multiple-filter' ) );

		widgets[ id ] = {
			filterKey: filterKey,
			multipleFilter: multipleFilter
		};
	} );

	// show a loading indicator
	function wcapfBeforeUpdate() {
	}

	// scroll to top
	function wcapfAfterUpdate() {
	}

	// filter the products
	function wcapfFilterProducts() {
		wcapfBeforeUpdate();

		$.get( window.location.href, function( data ) {
			var $data = $( data ),
				$shopLoopContainer = $data.find( wcapf_params.shop_loop_container ),
				$notFoundContainer = $data.find( wcapf_params.not_found_container );

			// replace widgets' data with new data
			$.each( widgets, function( id ) {
				var widgetID = '#' + id,
					$widget = $( widgetID ),
					_widget = $data.find( widgetID ),
					widgetClass = $( _widget ).attr( 'class' );

				// update class
				$widget.attr( 'class', widgetClass );

				// update widget
				$widget.html( _widget.html() );
			} );

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
		} );
	}

	// URL Parser
	function wcapfGetUrlVars( url ) {
		var vars = {}, hash;

		if ( typeof url === 'undefined' ) {
			url = window.location.href;
		}

		var hashes = url.slice( url.indexOf( '?' ) + 1 ).split( '&' );

		for ( var i = 0; i < hashes.length; i++ ) {
			hash = hashes[ i ].split( '=' );
			vars[ hash[ 0 ] ] = hash[ 1 ];
		}

		return vars;
	}

	// everytime we apply the filter we set the current page to 1
	function wcapfFixPagination() {
		var url = window.location.href,
			params = wcapfGetUrlVars( url ),
			currentPageInUrl = parseInt( url.replace( /.+\/page\/([0-9]+)+/, '$1' ) );

		if ( currentPageInUrl ) {
			if ( currentPageInUrl > 1 ) {
				url = url.replace( /page\/([0-9]+)/, 'page/1' );
			}
		} else if ( typeof params[ 'paged' ] !== 'undefined' ) {
			var currentPageInParams = parseInt( params[ 'paged' ] );

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

		var re = new RegExp( '([?&])' + key + '=.*?(&|$)', 'i' ),
			separator = url.indexOf( '?' ) !== -1 ? '&' : '?',
			urlWithQuery;

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

		var oldParams = wcapfGetUrlVars( url ),
			oldParamsLength = Object.keys( oldParams ).length,
			startPosition = url.indexOf( '?' ),
			filterKeyPosition = url.indexOf( filterKey ),
			cleanUrl,
			cleanQuery;

		if ( oldParamsLength > 1 ) {
			if ( ( filterKeyPosition - startPosition ) > 1 ) {
				cleanUrl = url.replace( '&' + filterKey + '=' + oldParams[ filterKey ], '' );
			} else {
				cleanUrl = url.replace( filterKey + '=' + oldParams[ filterKey ] + '&', '' );
			}

			var newParams = cleanUrl.split( '?' );
			cleanQuery = '?' + newParams[ 1 ];
		} else {
			cleanQuery = url.replace( '?' + filterKey + '=' + oldParams[ filterKey ], '' );
		}

		return cleanQuery;
	}

	// take the key and value and make query
	function wcapfMakeParameters( filterKey, filterValue, url ) {
		var params, nextValues, emptyValue = false;

		if ( typeof url !== 'undefined' ) {
			params = wcapfGetUrlVars( url );
		} else {
			params = wcapfGetUrlVars();
		}

		if ( typeof params[ filterKey ] != 'undefined' ) {
			var prevValues = params[ filterKey ],
				prevValuesArray = prevValues.split( ',' );

			if ( prevValues.length > 0 ) {
				var found = $.inArray( filterValue, prevValuesArray );

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
			var query = wcapfRemoveQueryStringParameter( filterKey );
			history.pushState( {}, '', query );
		}

		// filter products
		wcapfFilterProducts();
	}

	function wcapfSingleFilter( filterKey, filterValue ) {
		var params = wcapfGetUrlVars(),
			query;

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

	// handle the filter request
	$wcapfTermFilter.on( 'click', '.item', function( event ) {
		event.preventDefault();

		var $item = $( this ),
			filterValue = $item.attr( 'data-filter-id' ),
			$widget = $item.closest( '.widget' ),
			widgetId = $widget.attr( 'id' ),
			widgetData = widgets[ widgetId ];

		if ( ! filterValue || ! widgetData ) {
			return;
		}

		var filterKey = widgetData.filterKey,
			multipleFilter = widgetData.multipleFilter;

		if ( multipleFilter ) {
			wcapfMakeParameters( filterKey, filterValue );
		} else {
			wcapfSingleFilter( filterKey, filterValue );
		}
	} );

} );
