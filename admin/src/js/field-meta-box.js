/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

jQuery( document ).ready( function( $ ) {

	const fieldWrapper = $( '#chosen_field_wrapper' );
	const fieldInput   = '[name]:not(.manual_options)';
	const fieldStates  = {};

	function storeFieldState() {
		const fieldType = fieldWrapper.find( '#field_data' ).attr( 'data-field-type' );

		if ( ! fieldType ) {
			return;
		}

		const fieldValues = {};

		fieldWrapper.find( fieldInput ).each( function() {
			const $input = $( this );
			const type   = $input.attr( 'type' );
			const name   = $input.attr( 'name' );
			const value  = $input.val();

			if ( 'checkbox' === type || 'radio' === type ) {
				if ( $input.is( ':checked' ) ) {
					fieldValues[ name ] = value;
				}
			} else {
				fieldValues[ name ] = value;
			}
		} );

		// Handle manual options.
		const manualOptions = {};

		fieldWrapper.find( '.manual_options' ).each( function() {
			const $input = $( this );
			const name   = $input.attr( 'name' );

			manualOptions[ name ] = $input.val();
		} );

		fieldValues[ 'manual_options' ] = manualOptions;

		fieldStates[ fieldType ] = fieldValues;
	}

	function updateFieldState( $elm ) {
		const fieldType  = fieldWrapper.find( '#field_data' ).attr( 'data-field-type' );
		const fieldState = fieldStates[ fieldType ];

		const name  = $elm.attr( 'name' );
		const type  = $elm.attr( 'type' );
		const value = $elm.val();

		if ( $elm.hasClass( 'manual_options' ) ) {
			const manual_options = fieldState[ 'manual_options' ] || {};

			manual_options[ name ] = value;

			fieldState[ 'manual_options' ] = manual_options;
		} else {
			if ( 'checkbox' === type || 'radio' === type ) {
				const $input = fieldWrapper.find( '[name="' + name + '"]' );

				if ( $input.is( ':checked' ) ) {
					fieldState[ name ] = value;
				} else {
					delete fieldState[ name ];
				}
			} else {
				fieldState[ name ] = value;
			}
		}
	}

	// Store the initial field state.
	storeFieldState();

	fieldWrapper.find( '[name]' ).on( 'change', function() {
		const $this = $( this );

		updateFieldState( $this );
	} );

	function applyFieldState( fieldType ) {
		const fieldState = fieldStates[ fieldType ];

		fieldWrapper.find( fieldInput ).each( function() {
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
			const rawOptions = fieldState[ 'manual_options' ];

			$.each( rawOptions, function( inputName, raw ) {
				const $rawInput = fieldWrapper.find( '[name="' + inputName + '"]' );

				$rawInput.val( raw );

				const manualOptions = JSON.parse( decodeURIComponent( raw ) );

				if ( ! manualOptions.length ) {
					return;
				}

				const tableIdentifier = $rawInput.attr( 'data-table' );
				const rowTemplateId   = $rawInput.attr( 'data-tmpl' );

				// Bail out if no tmpl found for the type.
				if ( ! jQuery( '#tmpl-' + rowTemplateId ).length ) {
					return;
				}

				const rowsIdentifier = '.field-table-body-rows';
				const rowIdentifier  = '.row-item';

				const $table = fieldWrapper.find( tableIdentifier );
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
			} );

			const $field = fieldWrapper.find( '.wcapf-form-field' );

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
			const $this = $( this );

			updateFieldState( $this );
		} );
	} );

} );
