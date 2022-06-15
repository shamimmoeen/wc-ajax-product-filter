/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

	// Hierarchical field's toggle visibility when text display type is changed.
	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			const $hrFields       = $field.find( '.hierarchical-fields' );
			const $hierarchical   = $field.find( '.wcapf-form-sub-field-hierarchical' );
			const useHierarchical = $hierarchical.find( 'input' ).is( ':checked' );
			const $hrAccordion    = $field.find( '.wcapf-form-sub-field-enable_hierarchy_accordion' );

			if ( 'checkbox' === value || 'radio' === value ) {
				$hrFields.show();

				if ( useHierarchical ) {
					$hrAccordion.show();
				} else {
					$hrAccordion.hide();
				}
			} else if ( 'select' === value || 'multi-select' === value ) {
				$hrFields.show();
				$hrAccordion.hide();
			} else {
				$hrFields.hide();
			}
		}
	} );

	// Hierarchical accordion field toggle visibility when show hierarchy is changed.
	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-hierarchical input' === handler ) {
			const displayType  = $field.find( '.wcapf-form-sub-field-display_type select' ).val();
			const $hrAccordion = $field.find( '.wcapf-form-sub-field-enable_hierarchy_accordion' );

			if ( '1' === value ) {
				if ( 'checkbox' === displayType || 'radio' === displayType ) {
					$hrAccordion.show();
				} else {
					$hrAccordion.hide();
				}
			} else {
				$hrAccordion.hide();
			}
		}
	} );

	// Override no-results-message, all-items-label field's toggle visibility when text display type is changed.
	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			const $noResults     = $field.find( '.wcapf-form-sub-field-chosen_no_results_message' );
			const $allItemsLabel = $field.find( '.wcapf-form-sub-field-all_items_label' );
			const useChosen      = $field.find( '.wcapf-form-sub-field-use_chosen input' ).is( ':checked' );

			if ( useChosen && ( 'select' === value || 'multi-select' === value ) ) {
				$noResults.show();
			} else {
				$noResults.hide();
			}

			if ( ( 'radio' === value || 'select' === value ) || ( 'multi-select' === value && useChosen ) ) {
				$allItemsLabel.show();
			} else {
				$allItemsLabel.hide();
			}
		}
	} );

	// Override no-results-message, all-items-label field's toggle visibility when text use chosen is changed.
	fieldWrapper.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-use_chosen input' === handler ) {
			const $noResults     = $field.find( '.wcapf-form-sub-field-chosen_no_results_message' );
			const $allItemsLabel = $field.find( '.wcapf-form-sub-field-all_items_label' );
			const displayType    = $field.find( '.wcapf-form-sub-field-display_type select' ).val();

			if ( '1' === value && ( 'select' === displayType || 'multi-select' === displayType ) ) {
				$noResults.show();
			} else {
				$noResults.hide();
			}

			if (
				( '1' === value && 'multi-select' === displayType )
				|| ( 'radio' === displayType || 'select' === displayType )
			) {
				$allItemsLabel.show();
			} else {
				$allItemsLabel.hide();
			}
		}
	} );

} );
