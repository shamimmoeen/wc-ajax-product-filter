/**
 * The post meta field.
 *
 * @since      1.0.0
 * @package    wc-ajax-product-filter-pro
 * @subpackage wc-ajax-product-filter-pro/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const $searchForm = $( '#search-form' );

	return;

	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-custom-taxonomy select' === handler ) {
			const params           = window[ 'wcapf_admin_params' ];
			const hierarchicalData = params[ 'taxonomy_hierarchical_data' ];

			if ( ! hierarchicalData ) {
				return;
			}

			const isHierarchical   = hierarchicalData[ value ];
			const $dependantFields = $field.find(
				'.wcapf-form-sub-field-hierarchical, .wcapf-form-sub-field-show_children_only'
			);

			if ( isHierarchical ) {
				$dependantFields.show();
			} else {
				$dependantFields.hide();
			}
		}
	} );

	function initSortableForManualOptions( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerManualOptionsChange( $field );
			}
		} ).disableSelection();
	}

	// Sort Manual Options
	initSortableForManualOptions( $searchForm.find( '.manual-options-table .manual-options-table-body-rows' ) );

	$searchForm.on( 'field_added', function( e, ui ) {
		// Init Sortable for the manual options.
		initSortableForManualOptions( $( ui.item.find( '.manual-options-table-body-rows' ) ) );
	} );

	function triggerRemoveOption( $field ) {
		const $optionsTable = $field.find( '.manual-options-table' );
		const tableRows     = $optionsTable.find( '.manual-options-table-body-rows' ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	// Remove Single Option
	$searchForm.on( 'click', '.remove-option', function() {
		const $item  = $( this ).closest( '.item' );
		const $field = $item.closest( '.wcapf-form-field' );

		triggerRemoveOption( $field );

		$item.remove();

		triggerManualOptionsChange( $field );
	} );

	// Clear All Options
	$searchForm.on( 'click', '.clear-all-options', function() {
		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $optionsTable = $field.find( '.manual-options-table' );

		$optionsTable.find( '.manual-options-table-body-rows' ).empty();

		triggerRemoveOption( $field );

		triggerManualOptionsChange( $field );
	} );

	// Add New Option
	$searchForm.on( 'click', '.add-option', function() {
		const fieldType = 'wcapf-post-meta-option';

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const $field = $( this ).closest( '.wcapf-form-field' );

		const template = wp.template( fieldType );
		const rendered = template( { value: '', label: '' } );
		const $wrapper = $field.find( '.manual-options-table' );
		const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

		$rows.append( rendered );

		if ( ! $wrapper.hasClass( 'has-options' ) ) {
			$wrapper.addClass( 'has-options' );
		}
	} );

	const $postMetaOptionsModal = $( '.post-meta-options-modal' );
	const $noKeyFoundMessage    = $postMetaOptionsModal.find( '.no-key-found-message' );
	const $postMetaModalLoader  = $postMetaOptionsModal.find( '.post-meta-options-loader' );
	const $postMetaOptions      = $postMetaOptionsModal.find( '.post-meta-options' );
	const $postMetaModalFooter  = $postMetaOptionsModal.find( '.wcapf-modal-footer' );

	const postMetaOptionsModalInstance = $postMetaOptionsModal.remodal( {
		hashTracking: false,
	} );

	let $postMetaField = null;

	function resetPostMetaModal() {
		$postMetaOptions.html( '' );
		$postMetaModalLoader.removeClass( 'active' );
		$noKeyFoundMessage.removeClass( 'active' );
		$postMetaModalFooter.removeClass( 'active' );
		$postMetaOptionsModal.find( '.replace-current-options' ).prop( 'checked', false );
	}

	// Browse Values
	$searchForm.on( 'click', '.browse-values', function() {
		resetPostMetaModal();

		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $inputMetaKey = $field.find( '.wcapf-form-sub-field-meta_key select' );
		const metaKey       = $inputMetaKey.val();

		if ( ! metaKey ) {
			$noKeyFoundMessage.addClass( 'active' );
		} else {
			$noKeyFoundMessage.removeClass( 'active' );
		}

		postMetaOptionsModalInstance.open();
		$postMetaField = $field;

		if ( ! metaKey ) {
			return;
		}

		// Show the loading animation.
		$postMetaModalLoader.addClass( 'active' );

		/**
		 * Ajax's success function.
		 *
		 * @param response
		 */
		function okCallback( response ) {
			// Hide the loading animation.
			$postMetaModalLoader.removeClass( 'active' );
			$postMetaModalFooter.addClass( 'active' );

			$postMetaOptions.html( response );
		}

		/**
		 * Ajax's error function.
		 *
		 * @param message
		 */
		function errCallback( message ) {
			console.log( 'error', message );

			// Hide the loading animation.
			$postMetaModalLoader.removeClass( 'active' );
		}

		const formData = {
			key: metaKey,
			action: 'wcapf_get_meta_options',
		}

		// https://stackoverflow.com/a/59181252
		wp.ajax.post( formData ).done( okCallback ).fail( errCallback );
	} );

	/**
	 * Reset the post meta option's modal when modal gets closed.
	 */
	$( document ).on( 'closed', $postMetaOptionsModal, function() {
		resetPostMetaModal();
		$postMetaField = null;
	} );

	// Unselect all values.
	$postMetaOptionsModal.on( 'click', '.select-none', function() {
		$postMetaOptions.find( '[type="checkbox"]' ).prop( 'checked', false );
	} );

	// Select all values.
	$postMetaOptionsModal.on( 'click', '.select-all', function() {
		$postMetaOptions.find( '[type="checkbox"]' ).prop( 'checked', true );
	} );

	function triggerManualOptionsChange( $postMetaField ) {
		const $valueHolder  = $postMetaField.find( '.wcapf-form-sub-field-manual_options input' );
		const $optionsTable = $postMetaField.find( '.manual-options-table' );
		const $rows         = $optionsTable.find( '.manual-options-table-body-rows' );
		const _rows         = [];

		$rows.find( '.item' ).each( function( i, _item ) {
			const $item = $( _item );
			const value = $item.find( '.option_value' ).val();
			const label = $item.find( '.option_label' ).val();

			if ( value && label ) {
				_rows.push( [ value, label ] );
			}
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	// Add selected options.
	$postMetaOptionsModal.on( 'click', '.add-options', function() {
		const $options = $postMetaOptions.find( '[type="checkbox"]' );
		let isReplace  = false;
		let rows       = '';

		if ( $postMetaModalFooter.find( '.replace-current-options' ).is( ':checked' ) ) {
			isReplace = true;
		}

		if ( $options ) {
			const fieldType = 'wcapf-post-meta-option';

			$.each( $options, function( i, input ) {
				const $input = $( input );
				const value  = $input.val();

				if ( $input.is( ':checked' ) ) {
					const template = wp.template( fieldType );
					const rendered = template( { value, label: value } );

					rows += rendered;
				}
			} );
		}

		if ( rows ) {
			const $wrapper = $postMetaField.find( '.manual-options-table' );
			const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

			if ( isReplace ) {
				$rows.html( rows );
			} else {
				$rows.append( rows );
			}

			if ( ! $wrapper.hasClass( 'has-options' ) ) {
				$wrapper.addClass( 'has-options' );
			}

			triggerManualOptionsChange( $postMetaField );
		}

		postMetaOptionsModalInstance.close();
	} );

	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-get_options input' === handler ) {
			const $selectElm       = $field.find( '.wcapf-form-sub-field-options_order_by select' );
			const orderBy          = $selectElm.val();
			const dependantOptions = 'option[value="label"]';

			if ( 'automatically' === value ) {
				$selectElm.children( dependantOptions ).attr( 'disabled', 'disabled' );

				if ( 'label' === orderBy ) {
					$selectElm.prop( 'selectedIndex', 1 ).change();
				}
			} else {
				$selectElm.children( dependantOptions ).removeAttr( 'disabled' );
			}
		}
	} );

	function disableOrderByOptions( $elm ) {
		const value                = $elm.val();
		const $wrapper             = $elm.closest( '.wcapf-post-meta-order-options-field' );
		const $orderDirectionField = $wrapper.find( '.wcapf-form-sub-field-options_order_dir select' );
		const $orderTypeField      = $wrapper.find( '.wcapf-form-sub-field-options_order_type select' );

		if ( 'none' === value ) {
			$orderDirectionField.attr( 'disabled', 'disabled' );
			$orderTypeField.attr( 'disabled', 'disabled' );
		} else {
			$orderDirectionField.removeAttr( 'disabled' );
			$orderTypeField.removeAttr( 'disabled' );
		}
	}

	$searchForm.find( '.wcapf-form-sub-field-options_order_by select' ).each( function() {
		const $this = $( this );

		disableOrderByOptions( $this );
	} );

	$searchForm.on( 'change', '.wcapf-form-sub-field-options_order_by select', function() {
		const $this = $( this );

		disableOrderByOptions( $this );
	} );

	$searchForm.on( 'input', '.manual-options-table input[type="text"]', function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerManualOptionsChange( $field );
	} );

	/**
	 * Value type 'Number'
	 */

	function initSortableForNumberManualOptions( $selector ) {
		$selector.sortable( {
			opacity: 0.8,
			revert: false,
			cursor: 'move',
			axis: 'y',
			handle: '.move-options-handler',
			placeholder: 'widget-placeholder',
			update: function( e ) {
				const $field = $( e.target ).closest( '.wcapf-form-field' );

				triggerNumberManualOptionsChange( $field );
			}
		} ).disableSelection();
	}

	// Sort Number Manual Options
	initSortableForNumberManualOptions( $searchForm.find( '.number-manual-options-table .manual-options-table-body-rows' ) );

	$searchForm.on( 'field_added', function( e, ui ) {
		// Init Sortable for the number manual options.
		initSortableForNumberManualOptions( $( ui.item.find( '.manual-options-table-body-rows' ) ) );
	} );

	function triggerRemoveNumberOption( $field ) {
		const $optionsTable = $field.find( '.number-manual-options-table' );
		const tableRows     = $optionsTable.find( '.manual-options-table-body-rows' ).children();

		if ( 2 > tableRows.length ) {
			$optionsTable.removeClass( 'has-options' );
		}
	}

	function triggerNumberManualOptionsChange( $postMetaField ) {
		const $valueHolder  = $postMetaField.find( '.wcapf-form-sub-field-number_manual_options input' );
		const $optionsTable = $postMetaField.find( '.number-manual-options-table' );
		const $rows         = $optionsTable.find( '.manual-options-table-body-rows' );
		const _rows         = [];

		$rows.find( '.item' ).each( function( i, _item ) {
			const $item     = $( _item );
			const min_value = $item.find( '.option_min_value' ).val();
			const max_value = $item.find( '.option_max_value' ).val();
			const label     = $item.find( '.option_label' ).val();

			if ( min_value && max_value && label ) {
				_rows.push( [ min_value, max_value, label ] );
			}
		} );

		const rawValues = encodeURIComponent( JSON.stringify( _rows ) );
		$valueHolder.val( rawValues );
	}

	// Remove Single Number Option
	$searchForm.on( 'click', '.remove-number-option', function() {
		const $item  = $( this ).closest( '.item' );
		const $field = $item.closest( '.wcapf-form-field' );

		triggerRemoveNumberOption( $field );

		$item.remove();

		triggerNumberManualOptionsChange( $field );
	} );

	// Clear All Options
	$searchForm.on( 'click', '.clear-all-number-options', function() {
		const $field        = $( this ).closest( '.wcapf-form-field' );
		const $optionsTable = $field.find( '.number-manual-options-table' );

		$optionsTable.find( '.manual-options-table-body-rows' ).empty();

		triggerRemoveNumberOption( $field );

		triggerNumberManualOptionsChange( $field );
	} );

	// Add New Option
	$searchForm.on( 'click', '.add-number-option', function() {
		const fieldType = 'wcapf-post-meta-type-number-option';

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const $field = $( this ).closest( '.wcapf-form-field' );

		const template = wp.template( fieldType );
		const rendered = template( { value: '', label: '' } );
		const $wrapper = $field.find( '.number-manual-options-table' );
		const $rows    = $wrapper.find( '.manual-options-table-body-rows' );

		$rows.append( rendered );

		if ( ! $wrapper.hasClass( 'has-options' ) ) {
			$wrapper.addClass( 'has-options' );
		}
	} );

	$searchForm.on( 'input', '.number-manual-options-table input[type="text"]', function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerNumberManualOptionsChange( $field );
	} );

	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-number_display_type select' === handler ) {
			const $getOptions         = $field.find( '.number-get-options' );
			const $autoOptions        = $field.find( '.number-automatic-options' );
			const $manualOptionsTable = $field.find( '.number-manual-options-table' );
			const $elm                = $field.find( handler );
			const displayType         = $elm.val();

			if ( 'range_slider' === displayType || 'range_number' === displayType ) {
				$getOptions.hide();
				$manualOptionsTable.addClass( 'force-hide' );
				$autoOptions.addClass( 'force-show' );
			} else {
				$getOptions.show();
				$manualOptionsTable.removeClass( 'force-hide' );
				$autoOptions.removeClass( 'force-show' );
			}
		}
	} );

	// function toggleNumberMinValueField( $elm ) {
	// 	const $field     = $elm.closest( '.wcapf-form-field' );
	// 	const $textField = $field.find( '.wcapf-form-sub-field-min_value input[type="text"]' );
	//
	// 	if ( $elm.is( ':checked' ) ) {
	// 		$textField.attr( 'disabled', 'disabled' );
	// 	} else {
	// 		$textField.removeAttr( 'disabled' );
	// 	}
	// }
	//
	// $searchForm.find( '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]' ).each( function() {
	// 	const $this = $( this );
	//
	// 	toggleNumberMinValueField( $this );
	// } );
	//
	// $searchForm.on( 'click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function() {
	// 	const $this = $( this );
	//
	// 	toggleNumberMinValueField( $this );
	// } );
	//
	// function toggleNumberMaxValueField( $elm ) {
	// 	const $field     = $elm.closest( '.wcapf-form-field' );
	// 	const $textField = $field.find( '.wcapf-form-sub-field-max_value input[type="text"]' );
	//
	// 	if ( $elm.is( ':checked' ) ) {
	// 		$textField.attr( 'disabled', 'disabled' );
	// 	} else {
	// 		$textField.removeAttr( 'disabled' );
	// 	}
	// }
	//
	// $searchForm.find( '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]' ).each( function() {
	// 	const $this = $( this );
	//
	// 	toggleNumberMaxValueField( $this );
	// } );
	//
	// $searchForm.on( 'click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function() {
	// 	const $this = $( this );
	//
	// 	toggleNumberMaxValueField( $this );
	// } );

	// Toggle soft limit fields when display type is changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-display_type select' === handler ) {
			const $softLimitFields = $field.find( '.soft-limit-fields' );
			const $valueTypeField  = $field.find( '.wcapf-form-sub-field-value_type select' );
			const valueType        = $valueTypeField.val();
			const displayTypes     = [ 'checkbox', 'radio' ];

			if ( $valueTypeField.length ) {
				if ( 'text' === valueType ) {
					if ( displayTypes.includes( value ) ) {
						$softLimitFields.show();
					} else {
						$softLimitFields.hide();
					}
				}
			} else {
				if ( displayTypes.includes( value ) ) {
					$softLimitFields.show();
				} else {
					$softLimitFields.hide();
				}
			}
		}
	} );

	// Toggle soft limit fields when number display type is changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-number_display_type select' === handler ) {
			const $softLimitFields = $field.find( '.soft-limit-fields' );
			const $valueTypeField  = $field.find( '.wcapf-form-sub-field-value_type select' );
			const valueType        = $valueTypeField.val();
			const displayTypes     = [ 'range_checkbox', 'range_radio' ];

			if ( $valueTypeField.length ) {
				if ( 'number' === valueType ) {
					if ( displayTypes.includes( value ) ) {
						$softLimitFields.show();
					} else {
						$softLimitFields.hide();
					}
				}
			} else {
				if ( displayTypes.includes( value ) ) {
					$softLimitFields.show();
				} else {
					$softLimitFields.hide();
				}
			}
		}
	} );

	// Toggle soft limit fields when value type is changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-value_type select' === handler ) {
			const $softLimitFields = $field.find( '.soft-limit-fields' );

			const $numberDisplayTypeField = $field.find( '.wcapf-form-sub-field-number_display_type select' );
			const numberDisplayType       = $numberDisplayTypeField.val();
			const numberDisplayTypes      = [ 'range_checkbox', 'range_radio' ];

			const $textDisplayTypeField = $field.find( '.wcapf-form-sub-field-display_type select' );
			const textDisplayType       = $textDisplayTypeField.val();
			const textDisplayTypes      = [ 'checkbox', 'radio' ];

			if ( 'number' === value ) {
				if ( numberDisplayTypes.includes( numberDisplayType ) ) {
					$softLimitFields.show();
				} else {
					$softLimitFields.hide();
				}
			} else if ( 'text' === value ) {
				if ( textDisplayTypes.includes( textDisplayType ) ) {
					$softLimitFields.show();
				} else {
					$softLimitFields.hide();
				}
			} else if ( 'date' === value ) {
				$softLimitFields.hide();
			} else {
				$softLimitFields.hide();
			}
		}
	} );

	// Set the value type when post property changed.
	$searchForm.on( 'after_toggle_request', function( e, handler, value, $field ) {
		if ( '.wcapf-form-sub-field-post_property select' === handler ) {
			const $valueType       = $field.find( '.wcapf-form-sub-field-value_type select' );
			const params           = window[ 'wcapf_admin_params' ];
			const postPropertyData = params[ 'post_property_data' ];

			if ( ! postPropertyData ) {
				return;
			}

			let valueType = postPropertyData[ value ];

			if ( ! valueType ) {
				valueType = '';
			}

			$valueType.val( valueType ).change();
		}
	} );

} );
