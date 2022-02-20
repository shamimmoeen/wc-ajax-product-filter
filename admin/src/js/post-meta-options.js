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
	initSortableForManualOptions( $searchForm.find( '.manual-options-table-body-rows' ) );

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
		const $field = $( this ).closest( '.wcapf-form-field' );

		$field.find( '.manual-options-table-body-rows' ).empty();

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
		const $rows        = $postMetaField.find( '.manual-options-table-body-rows' );
		const $valueHolder = $postMetaField.find( '.wcapf-form-sub-field-manual_options input' );
		const _rows        = [];

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
			const $rows    = $postMetaField.find( '.manual-options-table-body-rows' );

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

	$searchForm.on( 'input', '.manual-options-table-body-rows input[type="text"]', function() {
		const $field = $( this ).closest( '.wcapf-form-field' );

		triggerManualOptionsChange( $field );
	} );

} );
