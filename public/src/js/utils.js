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
