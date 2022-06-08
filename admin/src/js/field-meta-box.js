/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

const fieldStates = {};

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );

	function storeFieldState() {
		const fieldType = fieldWrapper.find( '#field_data' ).attr( 'data-field-type' );

		if ( ! fieldType ) {
			return;
		}

		const fieldValues = {};

		fieldWrapper.find( '[name]:not(.manual_options)' ).each( function() {
			const $input = $( this );
			const type   = $input.attr( 'type' );
			const name   = $input.attr( 'name' );

			if ( 'checkbox' === type || 'radio' === type ) {
				if ( $input.is( ':checked' ) ) {
					fieldValues[ name ] = $input.val();
				}
			} else {
				fieldValues[ name ] = $input.val();
			}
		} );

		if ( fieldWrapper.find( '.manual_options' ) ) {
			const raw = fieldWrapper.find( '.manual_options' ).val();

			if ( raw ) {
				fieldValues[ 'manual_options' ] = raw;
			}
		}

		fieldStates[ fieldType ] = fieldValues;
	}

	// Store the initial field state.
	storeFieldState();

	fieldWrapper.find( '[name]' ).on( 'change', function() {
		storeFieldState();
	} );

	function applyFieldState( fieldType ) {
		const fieldState = fieldStates[ fieldType ];

		fieldWrapper.find( '[name]' ).each( function() {
			const $input = $( this );
			const type   = $input.attr( 'type' );
			const name   = $input.attr( 'name' );
			const value  = fieldState[ name ];

			if ( 'checkbox' === type || 'radio' === type ) {
				if ( name in fieldState ) {
					// Add 'checked' attribute.
					fieldWrapper
						.find( '[name="' + name + '"][value="' + value + '"]' )
						.attr( 'checked', 'checked' );
				} else {
					// Remove 'checked' attribute.
					fieldWrapper.find( '[name="' + name + '"]' ).removeAttr( 'checked' );
				}
			} else {
				$input.val( value );
			}
		} );

		// Process the manual options.
		if ( 'manual_options' in fieldState ) {
			const raw = fieldState[ 'manual_options' ];

			if ( ! raw ) {
				return;
			}

			const $rawInput = fieldWrapper.find( '.manual_options' );

			$rawInput.val( raw );

			const manualOptions = JSON.parse( decodeURIComponent( raw ) );

			if ( ! manualOptions ) {
				return;
			}

			const tableIdentifier = $rawInput.attr( 'data-table' );
			const rowTemplateId   = $rawInput.attr( 'data-tmpl' );

			// Bail out if no tmpl found for the type.
			if ( ! jQuery( '#tmpl-' + rowTemplateId ).length ) {
				return;
			}

			const fieldIdentifier = '.wcapf-form-field';
			const rowsIdentifier  = '.field-table-body-rows';
			const rowIdentifier   = '.row-item';

			const $field = fieldWrapper.find( fieldIdentifier );
			const $table = $field.find( tableIdentifier );
			const $rows  = $table.find( rowsIdentifier );

			$.each( manualOptions, function( i, option ) {
				const template = wp.template( rowTemplateId );

				let rowDefaultOptions = {};

				if ( '.manual-options-table' === tableIdentifier ) {
					rowDefaultOptions = {
						'value': '',
						'label': '',
					};
				}

				const rendered = template( rowDefaultOptions );

				$rows.append( rendered );

				const $lastRow = $rows.find( rowIdentifier ).last();

				$lastRow.find( '[data-name]' ).each( function() {
					const $this = $( this );
					const name  = $this.attr( 'data-name' );
					const value = option[ name ];

					$this.val( value );

					if ( 'image_url' === name && value ) {
						$lastRow.find( '.wp-image-picker-container' ).addClass( 'active' );
						$lastRow.find( 'img' ).attr( 'src', value );
					}
				} );
			} );

			$table.addClass( 'has-options' );

			fieldWrapper.trigger( 'new_option_added', [ $field ] );
		}
	}

	$( '#available_fields' ).on( 'change', '[name="_active_field"]', function() {
		const $this      = $( this );
		const _fieldType = $this.val();
		const fieldName  = $this.attr( 'data-field-name' );

		if ( ! _fieldType ) {
			return;
		}

		const fieldType = 'wcapf-form-field-' + _fieldType;

		// Bail out if no tmpl found for the type.
		if ( ! jQuery( '#tmpl-' + fieldType ).length ) {
			return;
		}

		const template         = wp.template( fieldType );
		const rendered         = template();
		const fieldDataWrapper = fieldWrapper.find( '#field_data' );
		const fieldNameWrapper = fieldWrapper.find( '.postbox-header h2' );
		const fieldInside      = fieldWrapper.find( '.inside' );

		fieldWrapper.removeClass( 'hidden' );

		fieldDataWrapper.attr( 'data-field-type', _fieldType );
		fieldNameWrapper.html( fieldName );
		fieldInside.html( rendered );

		// If already found the field state then apply it, otherwise store it.
		if ( _fieldType in fieldStates ) {
			applyFieldState( _fieldType );
		} else {
			storeFieldState();
		}

		fieldWrapper.trigger( 'field_added' );

		fieldWrapper.find( '[name]' ).on( 'change', function() {
			storeFieldState();
		} );
	} );

} );
