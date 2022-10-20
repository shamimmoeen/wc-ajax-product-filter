<?php
/**
 * The api utility class.
 *
 * TODO: Maybe delete.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_API_Utils class.
 *
 * @since 4.0.0
 */
class WCAPF_API_Utils {

	/**
	 * Gets the filters.
	 *
	 * @return array
	 */
	public static function get_filters() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'nopaging'    => true,
			// 'posts_per_page' => 3,
			'post_status' => 'any',
			'fields'      => 'ids',
		);

		$filters = get_posts( $args );

		$filters_data = array();

		foreach ( $filters as $filter_id ) {
			$filters_data[] = self::get_filter_data( $filter_id );
		}

		return $filters_data;
	}

	/**
	 * Gets the filter data for given id.
	 *
	 * @param int $id The filter id.
	 *
	 * @return array
	 */
	public static function get_filter_data( $id ) {
		$field_data = get_post_meta( $id, '_field_data', true );

		return array(
			'id'            => $id,
			'field_key'     => $field_data['field_key'],
			'type'          => $field_data['type'],
			'taxonomy'      => isset( $field_data['taxonomy'] ) ? $field_data['taxonomy'] : '',
			'meta_key'      => isset( $field_data['meta_key'] ) ? $field_data['meta_key'] : '',
			'post_property' => isset( $field_data['post_property'] ) ? $field_data['post_property'] : '',
			'title'         => get_the_title( $id ),
		);
	}

	/**
	 * TODO: We should remove the $unparsed_field_data param.
	 *
	 * @param array  $field_data
	 * @param string $field_type
	 * @param string $filter_key
	 * @param int    $post_id
	 * @param array  $unparsed_field_data
	 *
	 * @return array
	 */
	public static function get_parsed_field(
		$field_data,
		$field_type,
		$filter_key,
		$post_id,
		$unparsed_field_data = array()
	) {
		$float_fields = apply_filters(
			'wcapf_sub_fields_type_float',
			array( 'min_value', 'max_value', 'step' )
		);

		$absint_fields = apply_filters(
			'wcapf_sub_fields_type_absint',
			array( 'decimal_places' )
		);

		$array_fields = apply_filters( 'wcapf_sub_fields_type_array', array( 'include_user_roles' ) );

		$parsed_field = array();

		foreach ( $field_data as $field_key => $field_value ) {
			if ( in_array( $field_key, $float_fields ) ) {
				$_field_value = floatval( $field_value );

				if ( 'step' === $field_key && ! $_field_value ) {
					$_field_value = 1;
				}
			} elseif ( in_array( $field_key, $absint_fields ) ) {
				$_field_value = absint( $field_value );
			} elseif ( in_array( $field_key, $array_fields ) ) {
				$_field_value = $field_value ? array_map( 'sanitize_text_field', $field_value ) : array();
			} else {
				$space_allowed = array( 'value_prefix', 'value_postfix', 'values_separator' );

				// Preserve spaces in values separator.
				if ( in_array( $field_key, $space_allowed ) ) {
					$field_value = str_replace( ' ', '&nbsp;', $field_value );
				}

				$_field_value = sanitize_text_field( $field_value );

				if ( 'decimal_separator' === $field_key && ! $_field_value ) {
					$_field_value = '.';
				}
			}

			$parsed_field[ $field_key ] = $_field_value;
		}

		$parsed_field['type'] = $field_type;

		// Parse the product status options.
		if ( isset( $field_data['product_status_options'] ) ) {
			$product_status_options = $field_data['product_status_options'];

			$statuses = WCAPF_Helper::get_product_status_options();

			if ( $product_status_options ) {
				$decode  = rawurldecode( $product_status_options );
				$options = json_decode( $decode, true );
				$options = is_array( $options ) ? $options : array();

				$parsed_options = array();

				foreach ( $options as $option ) {
					$value = sanitize_text_field( $option['value'] );
					$label = wp_kses_post( $option['label'] );

					if ( ! strlen( $value ) ) {
						continue;
					}

					if ( ! strlen( $label ) ) {
						$label = isset( $statuses[ $value ] ) ? $statuses[ $value ] : $value;
					}

					$parsed_option    = array_merge( $option, array( 'label' => $label ) );
					$parsed_options[] = $parsed_option;
				}

				$parsed_field['product_status_options'] = $parsed_options;
			}
		}

		// Set default label for the 'Clear All' button in active filters field.
		if ( isset( $parsed_field['clear_all_button_label'] ) && empty( $parsed_field['clear_all_button_label'] ) ) {
			$parsed_field['clear_all_button_label'] = __( 'Clear All', 'wc-ajax-product-filter' );
		}

		// Set default label for the reset filters button.
		if ( isset( $parsed_field['reset_button_label'] ) && empty( $parsed_field['reset_button_label'] ) ) {
			$parsed_field['reset_button_label'] = __( 'Reset', 'wc-ajax-product-filter' );
		}

		// Store the field key as sanitized.
		$parsed_field['field_key'] = $filter_key;

		// Store the post id in the field data.
		$parsed_field['field_id'] = $post_id;

		// Visibility rules.
		$enable_visibility_rules = isset( $_POST['enable_visibility_rules'] ) ? $_POST['enable_visibility_rules'] : '';
		$visibility_rules        = isset( $_POST['visibility_rules'] ) ? $_POST['visibility_rules'] : '';

		$decode           = rawurldecode( $visibility_rules );
		$visibility_rules = json_decode( $decode, true );
		$visibility_rules = is_array( $visibility_rules ) ? $visibility_rules : array();

		$parsed_field['enable_visibility_rules'] = $enable_visibility_rules;
		$parsed_field['visibility_rules']        = $visibility_rules;

		if ( $unparsed_field_data ) {
			$_field_data = $unparsed_field_data;
		} else {
			$_field_data = $field_data;
		}

		return apply_filters( 'wcapf_parse_form_field_data', $parsed_field, $_field_data );
	}

	/**
	 * Validates the filter data.
	 *
	 * @param string $filter_type The filter type.
	 * @param string $filter_key  The filter key.
	 * @param string $filter_id   The filter id.
	 *
	 * @return int
	 */
	public static function validate_filter( $filter_type, $filter_key, $filter_id ) {
		$error_code = 0;

		$filter_types_with_key_required = WCAPF_Helper::field_types_with_key_required();

		if ( ! $filter_type ) { // Filter is required.
			$error_code = 20;
		} elseif ( ! in_array( $filter_type, self::available_filter_types() ) ) { // Invalid filter type.
			$error_code = 21;
		} elseif ( in_array( $filter_type, $filter_types_with_key_required ) ) {
			if ( ! $filter_key ) { // Filter key required.
				$error_code = 22;
			} elseif ( self::is_filter_key_already_in_use( $filter_id, $filter_key ) ) { // Filter key is already in use.
				$error_code = 23;
			} elseif ( self::taxonomy_exists_for_filter_key( $filter_key ) ) {
				$error_code = 24;
			}
		}

		return $error_code;
	}

	public static function available_filter_types() {
		return array(
			'active-filters',
			'category',
			'tag',
			'attribute',
			'price',
			'rating',
			'product-status',
			'post-property',
			'custom-taxonomy',
			'post-meta',
			'sort-by',
			'per-page',
			'reset-button',
		);
	}

	public static function is_filter_key_already_in_use( $post_id, $filter_key ) {
		$args = array(
			'post_type'      => 'wcapf-filter',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'post__not_in'   => array( $post_id ),
			'fields'         => 'ids',
			'meta_query'     => array(
				array(
					'key'   => '_filter_key',
					'value' => $filter_key,
				),
			),
		);

		return get_posts( $args );
	}

	/**
	 * Checks if taxonomy exists with the filter key.
	 *
	 * @param string $filter_key The filter key.
	 *
	 * @return bool
	 */
	public static function taxonomy_exists_for_filter_key( $filter_key ) {
		return taxonomy_exists( $filter_key );
	}

	public static function get_error_message_from_code( $error_code ) {
		$error_code    = intval( $error_code );
		$error_message = '';

		if ( 20 === $error_code ) {
			$error_message = __( 'Filter is required.', 'wc-ajax-product-filter' );
		} elseif ( 21 === $error_code ) {
			$error_message = __( 'Invalid filter type.', 'wc-ajax-product-filter' );
		} elseif ( 22 === $error_code ) {
			$error_message = __( 'Filter key is required.', 'wc-ajax-product-filter' );
		} elseif ( 23 === $error_code ) {
			$error_message = __( 'The filter key is already in use on another filter.', 'wc-ajax-product-filter' );
		} elseif ( 24 === $error_code ) {
			$error_message = __( 'There is a taxonomy exists with the filter key.', 'wc-ajax-product-filter' );
		}

		return $error_message;
	}

	public static function get_initial_filter_keys() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'nopaging'    => true,
			'post_status' => 'any',
			'fields'      => 'ids',
		);

		$filter_ids        = get_posts( $args );
		$used_keys         = array();
		$used_keys_by_type = array();

		$variable_filter_types_data = array(
			'attribute'       => 'taxonomy',
			'custom-taxonomy' => 'taxonomy',
			'post-meta'       => 'meta_key',
			'post-property'   => 'post_property',
		);

		$variable_filter_types = array_keys( $variable_filter_types_data );

		foreach ( $filter_ids as $id ) {
			$filter_data = get_post_meta( $id, '_field_data', true );
			$filter_key  = $filter_data['field_key'];
			$filter_type = $filter_data['type'];

			if ( ! $filter_key ) {
				continue;
			}

			if ( ! in_array( $filter_key, $used_keys ) ) {
				$used_keys[] = $filter_key;
			}

			if ( in_array( $filter_type, $variable_filter_types ) ) {
				$sub_type = $filter_data[ $variable_filter_types_data[ $filter_type ] ];

				$used_keys_by_type[ $filter_type ][ $sub_type ] = $filter_key;
			} else {
				$used_keys_by_type[ $filter_type ] = $filter_key;
			}
		}

		$available_filter_types = self::available_filter_types();

		$initial_filter_keys = array();

		$default_filters_keys_data = array(
			'category'       => '_product_cat',
			'tag'            => '_product_tag',
			'price'          => '_price',
			'rating'         => '_rating',
			'product-status' => '_status',
			'sort-by'        => '_sort_by',
			'per-page'       => '_per_page',
		);

		foreach ( $available_filter_types as $filter_type ) {
			if ( 'active-filters' === $filter_type || 'reset-button' === $filter_type ) {
				continue;
			}

			if ( in_array( $filter_type, $variable_filter_types ) ) {
				$sub = $used_keys_by_type[ $filter_type ];

				if ( ! $sub ) {
					continue;
				}

				foreach ( $sub as $type => $key ) {
					$default = '_' . sanitize_title( $type );
					$unique  = self::generate_unique_filter_key( $default, $used_keys );

					$initial_filter_keys[ $filter_type ][ $type ] = $unique;
				}
			} else {
				$default = $default_filters_keys_data[ $filter_type ];

				if ( array_key_exists( $filter_type, $used_keys_by_type ) ) {
					$initial_filter_keys[ $filter_type ] = self::generate_unique_filter_key( $default, $used_keys );
				} else {
					$initial_filter_keys[ $filter_type ] = $default;
				}
			}
		}

		return $initial_filter_keys;
	}

	/**
	 * @param string $default
	 * @param array  $used_keys
	 *
	 * @return string
	 */
	public static function generate_unique_filter_key( $default, $used_keys ) {
		// Find the maximum suffix so we can ensure uniqueness.
		$max_suffix = 1;

		$results = array();

		foreach ( $used_keys as $used_key ) {
			if ( false !== stripos( $used_key, $default ) ) {
				$results[] = $used_key;
			}
		}

		foreach ( $results as $result ) {
			// Pull a numerical suffix off the slug after the last underscore.
			$suffix = intval( substr( $result, strrpos( $result, '_' ) + 1 ) );
			if ( $suffix > $max_suffix ) {
				$max_suffix = $suffix;
			}
		}

		return $default . '_' . ( $max_suffix + 1 );
	}

}
