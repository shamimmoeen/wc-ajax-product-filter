/**
 * Meta box common scripts.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */

jQuery( document ).ready( function( $ ) {

	/**
	 * Filter nav tab.
	 */
	const $filterNavTab     = $( '#filter-nav-tab' );
	const $filterNavTabItem = $( '#filter-nav-tab .nav-tab' );

	$filterNavTabItem.on( 'click', function() {
		const $this      = $( this );
		const identifier = $this.attr( 'data-for' );
		const $content   = $( '.tab-' + identifier );

		$filterNavTabItem.removeClass( 'nav-tab-active' );
		$filterNavTab.attr( 'data-active-nav', identifier );
		$this.addClass( 'nav-tab-active' );

		$( '.tab-content' ).hide();
		$content.show();
	} );

	/**
	 * Toggle visibility rules.
	 */
	$( '#enable_visibility_rules' ).on( 'change', function() {
		const $fields = $( '.visibility-rules-field' );

		if ( $( this ).is( ':checked' ) ) {
			$fields.removeClass( 'disabled' );
		} else {
			$fields.addClass( 'disabled' );
		}
	} );

} );
