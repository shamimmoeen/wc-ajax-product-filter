/**
 * Visibility rules.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */

jQuery( document ).ready( function( $ ) {

	const $visibilityRules = $( '.visibility-rules' );

	// Change the value dropdown according to the selected rule.
	$visibilityRules.on( 'change', '.rule', function() {
		const _this = $( this );
		const rule  = _this.val();
		const $row  = _this.closest( 'tr' );

		$row.find( '.value select' ).removeClass( 'active' );
		$row.find( '.for-' + rule ).addClass( 'active' );

		$visibilityRules.trigger( 'visibility_rules_changed' );
	} );

	// Add and clause.
	$visibilityRules.on( 'click', '.add-and-clause-btn', function() {
		const _this         = $( this );
		const andClauses    = _this.closest( 'tbody' );
		const lastAndClause = andClauses.children().last().clone();

		lastAndClause.find( 'select.rule' ).prop( 'selectedIndex', 0 );
		lastAndClause.find( 'select.operator' ).prop( 'selectedIndex', 0 );
		lastAndClause.find( '.value select' ).removeClass( 'active' );
		lastAndClause.find( '.value select:first-child' ).addClass( 'active' );

		andClauses.append( lastAndClause );

		$visibilityRules.trigger( 'visibility_rules_changed' );
	} );

	// Adds a new rule group
	$visibilityRules.on( 'click', '.add-new-rule-btn', function() {
		const _this                    = $( this );
		const visibilityRules          = _this.closest( '.visibility-rules' );
		const visibilityRulesGroup     = visibilityRules.find( '.visibility-rules-group' );
		const lastVisibilityRulesGroup = visibilityRulesGroup.children().last().clone();
		const lastVisibilityRule       = lastVisibilityRulesGroup.find( 'tbody' ).children().last().clone();

		lastVisibilityRule.find( 'select.rule' ).prop( 'selectedIndex', 0 );
		lastVisibilityRule.find( 'select.operator' ).prop( 'selectedIndex', 0 );
		lastVisibilityRule.find( '.value select' ).removeClass( 'active' );
		lastVisibilityRule.find( '.value select:first-child' ).addClass( 'active' );

		lastVisibilityRulesGroup.find( 'tbody' ).html( lastVisibilityRule );
		visibilityRulesGroup.append( lastVisibilityRulesGroup );

		$visibilityRules.trigger( 'visibility_rules_changed' );
	} );

	// Removes a rule group
	$visibilityRules.on( 'click', '.remove-single-line-rule-btn', function() {
		const _this          = $( this );
		const rulesGroup     = _this.closest( '.visibility-rules-group' );
		const singleLineRule = _this.closest( '.single-line-rule' );
		const tbody          = _this.closest( 'tbody' );
		const tr             = _this.closest( 'tr' );

		let canRemoveFromTBody = false;
		let canRemoveFromGroup = false;

		if ( tbody.children().length > 1 ) {
			canRemoveFromTBody = true;
		}

		if ( rulesGroup.children().length > 1 ) {
			canRemoveFromGroup = true;
		}

		if ( ! canRemoveFromTBody && ! canRemoveFromGroup ) {
			return;
		}

		tr.remove();

		if ( ! tbody.children().length ) {
			singleLineRule.remove();
		}

		$visibilityRules.trigger( 'visibility_rules_changed' );
	} );

	$visibilityRules.on( 'change', '.operator, .value select', function() {
		$visibilityRules.trigger( 'visibility_rules_changed' );
	} );

	// Gets the visibility rules(and, or clauses)  as array.
	function getVisibilityRules() {
		const singleLineRules = $visibilityRules.find( '.single-line-rule' );
		const rules           = [];

		singleLineRules.each( function( key, singleLineRule ) {
			const tbody      = $( singleLineRule ).find( 'tbody' );
			const andClauses = [];

			tbody.children().each( function( index, _andClause ) {
				const andClause = $( _andClause );
				const rule      = andClause.find( 'select.rule' ).val();
				const operator  = andClause.find( 'select.operator' ).val();
				const value     = andClause.find( '.value select.active' ).val();

				andClauses.push( [ rule, operator, value ] );
			} );

			rules.push( andClauses );
		} );

		return rules;
	}

	$visibilityRules.on( 'visibility_rules_changed', function() {
		const rules     = getVisibilityRules();
		const rawValues = encodeURIComponent( JSON.stringify( rules ) );

		$( '#visibility_rules' ).val( rawValues );
	} );

} );
