<?php
/**
 * The api utility class.
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
		$filters      = self::get_filter_ids();
		$filters_data = array();

		foreach ( $filters as $filter_id ) {
			$filters_data[] = self::get_filter_data( $filter_id );
		}

		return $filters_data;
	}

	public static function get_filter_ids( $post_status = 'any' ) {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'nopaging'    => true,
			'post_status' => $post_status,
			'fields'      => 'ids',
		);

		return get_posts( $args );
	}

	/**
	 * Gets the filter data for given id.
	 *
	 * @param int $id The filter id.
	 *
	 * @return array
	 */
	public static function get_filter_data( $id ) {
		$filter_data = get_post_meta( $id, '_field_data', true );

		return array(
			'id'            => absint( $id ),
			'field_key'     => isset( $filter_data['field_key'] ) ? $filter_data['field_key'] : '',
			'type'          => isset( $filter_data['type'] ) ? $filter_data['type'] : '',
			'taxonomy'      => isset( $filter_data['taxonomy'] ) ? $filter_data['taxonomy'] : '',
			'meta_key'      => isset( $filter_data['meta_key'] ) ? $filter_data['meta_key'] : '',
			'post_property' => isset( $filter_data['post_property'] ) ? $filter_data['post_property'] : '',
			'title'         => get_the_title( $id ),
		);
	}

	/**
	 * Gets the overridden columns used in form ui.
	 *
	 * @return string[]
	 */
	public static function get_filter_overridden_columns() {
		return array(
			'show_title'              => '',
			'enable_accordion'        => '',
			'accordion_default_state' => 'expanded',
			'show_clear_button'       => '',
		);
	}

	/**
	 * Parse the filter data to be saved into the database.
	 *
	 * TODO: We should remove the $unparsed_field_data param when removing the classic view completely.
	 *
	 * @param array  $field_data          The field/filter data.
	 * @param string $field_type          The field/filter type.
	 * @param string $filter_key          The filter key.
	 * @param int    $post_id             The post id.
	 * @param array  $unparsed_field_data The field raw data.
	 *
	 * @return array
	 */
	public static function parse_filter_data(
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
				$options = WCAPF_Helper::retrieve_manual_options_array( $product_status_options );

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
	 * @param string $post_id     The post id.
	 *
	 * @return int
	 */
	public static function validate_filter( $filter_type, $filter_key, $post_id ) {
		$error_code = 0;

		$filter_types_with_key_required = WCAPF_Helper::field_types_with_key_required();

		if ( ! $filter_type ) { // Filter is required.
			$error_code = 20;
		} elseif ( ! in_array( $filter_type, self::available_filter_types() ) ) { // Invalid filter type.
			$error_code = 21;
		} elseif ( in_array( $filter_type, $filter_types_with_key_required ) ) {
			if ( ! $filter_key ) { // Filter key required.
				$error_code = 22;
			} elseif ( self::is_filter_key_already_in_use( $post_id, $filter_key ) ) { // Filter key is already in use.
				$error_code = 23;
			} elseif ( self::taxonomy_exists_for_filter_key( $filter_key ) ) {
				$error_code = 24;
			}
		}

		return $error_code;
	}

	/**
	 * List of all filter types.
	 *
	 * @return string[]
	 */
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

	/**
	 * Checks if the given filter key is in use on another filter.
	 *
	 * @param int    $post_id    The post id.
	 * @param string $filter_key The filter key.
	 *
	 * @return int[]
	 */
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
	 * Checks if taxonomy exists with the given filter key.
	 *
	 * @param string $filter_key The filter key.
	 *
	 * @return bool
	 */
	public static function taxonomy_exists_for_filter_key( $filter_key ) {
		return taxonomy_exists( $filter_key );
	}

	/**
	 * Gets the error message for the given error code.
	 *
	 * @param int $error_code The error code.
	 *
	 * @return string
	 */
	public static function get_error_message_from_code( $error_code ) {
		$error_code    = intval( $error_code );
		$error_message = '';

		if ( 20 === $error_code ) {
			$error_message = __( 'Filter type is required.', 'wc-ajax-product-filter' );
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

	/**
	 * Returns an array of the filter keys that we'll suggest as default for different filter types.
	 *
	 * @return array
	 */
	public static function get_initial_filter_keys() {
		list( $used_keys, $used_keys_by_type ) = self::get_used_filter_keys_data();

		$variable_filter_types  = array_keys( self::variable_filter_types_data() );
		$available_filter_types = self::available_filter_types();

		$initial_filter_keys = array();

		$default_filters_keys_data = self::default_filter_keys_data();

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

	private static function get_used_filter_keys_data() {
		$filter_ids        = self::get_filter_ids();
		$used_keys         = array();
		$used_keys_by_type = array();

		$variable_filter_types_data = self::variable_filter_types_data();
		$variable_filter_types      = array_keys( $variable_filter_types_data );

		foreach ( $filter_ids as $id ) {
			$filter_data = get_post_meta( $id, '_field_data', true );
			$filter_key  = isset( $filter_data['field_key'] ) ? $filter_data['field_key'] : '';
			$filter_type = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

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

		return array( $used_keys, $used_keys_by_type );
	}

	private static function variable_filter_types_data() {
		return array(
			'attribute'       => 'taxonomy',
			'custom-taxonomy' => 'taxonomy',
			'post-meta'       => 'meta_key',
			'post-property'   => 'post_property',
		);
	}

	private static function default_filter_keys_data() {
		return array(
			'category'       => '_product_cat',
			'tag'            => '_product_tag',
			'price'          => '_price',
			'rating'         => '_rating',
			'product-status' => '_status',
			'sort-by'        => '_sort_by',
			'per-page'       => '_per_page',
		);
	}

	/**
	 * Generates a unique filter key for the given prefix.
	 *
	 * @param string $prefix    The default filter key.
	 * @param array  $used_keys An array containing the already used filter keys.
	 *
	 * @return string
	 */
	private static function generate_unique_filter_key( $prefix, $used_keys ) {
		// Find the maximum suffix so we can ensure uniqueness.
		$max_suffix = 1;

		$results = array();

		foreach ( $used_keys as $used_key ) {
			if ( false !== stripos( $used_key, $prefix ) ) {
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

		return $prefix . '_' . ( $max_suffix + 1 );
	}

	/**
	 * Duplicate filter.
	 *
	 * @param int $post_id The post id to be duplicated.
	 *
	 * @return int|WP_Error
	 */
	public static function duplicate_filter( $post_id ) {
		$post_arr = array(
			'post_title'  => get_the_title( $post_id ) . ' ' . __( '(Copy)', 'wc-ajax-product-filter' ),
			'post_type'   => 'wcapf-filter',
			'post_status' => 'publish',
		);

		$new_post_id = wp_insert_post( $post_arr, true );

		if ( is_wp_error( $new_post_id ) ) {
			return $new_post_id;
		}

		$filter_data = get_post_meta( $post_id, '_field_data', true );
		$filter_type = $filter_data['type'];

		if ( 'active-filters' === $filter_type || 'reset-button' === $filter_type ) {
			$new_filter_key = '';
		} else {
			$variable_filter_types_data = self::variable_filter_types_data();
			$default_filter_keys_data   = self::default_filter_keys_data();
			$variable_filter_types      = array_keys( $variable_filter_types_data );

			if ( in_array( $filter_type, $variable_filter_types ) ) {
				$sub      = $variable_filter_types_data[ $filter_type ];
				$property = $filter_data[ $sub ];
				$default  = '_' . sanitize_title( $property );
			} else {
				$default = $default_filter_keys_data[ $filter_type ];
			}

			list( $used_keys ) = self::get_used_filter_keys_data();

			$new_filter_key = self::generate_unique_filter_key( $default, $used_keys );
		}

		$new_filter_data = $filter_data;

		$new_filter_data['field_key'] = $new_filter_key;
		$new_filter_data['field_id']  = $new_post_id;

		update_post_meta( $new_post_id, '_field_data', $new_filter_data );
		update_post_meta( $new_post_id, '_filter_key', $new_filter_key );

		return $new_post_id;
	}

	/**
	 * Gets the dummy active filters.
	 *
	 * @return array[]
	 */
	public static function get_dummy_active_filters() {
		$rating = '<i class="wcapf-icon-star-full"></i>';
		$rating .= '<i class="wcapf-icon-star-full"></i>';
		$rating .= '<i class="wcapf-icon-star-full"></i>';
		$rating .= '<i class="wcapf-icon-star-full"></i>';
		$rating .= '<i class="wcapf-icon-star-empty"></i>';

		return array(
			'_sort_by'      => array(
				'filter_type'    => 'sort-by',
				'filter_key'     => '_sort_by',
				'filter_id'      => '1',
				'custom_title'   => __( 'Sort by', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'min_price-asc' => __( 'Min Price', 'wc-ajax-product-filter' ),
				),
			),
			'_product_cat'  => array(
				'filter_type'    => '_product_cat',
				'filter_key'     => '_product_cat',
				'filter_id'      => '2',
				'custom_title'   => __( 'Category', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'16' => __( 'Clothing', 'wc-ajax-product-filter' ),
					'17' => __( 'Tshirts', 'wc-ajax-product-filter' ),
				),
			),
			'_product_type' => array(
				'filter_type'    => '_product_type',
				'filter_key'     => '_product_type',
				'filter_id'      => '3',
				'custom_title'   => __( 'Product Type', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'4' => __( 'Variable', 'wc-ajax-product-filter' ),
				),
			),
			'_rating'       => array(
				'filter_type'    => '_rating',
				'filter_key'     => '_rating',
				'filter_id'      => '4',
				'custom_title'   => __( 'Rating', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'4' => $rating,
				),
			),
			'_vendor'       => array(
				'filter_type'    => '_vendor',
				'filter_key'     => '_vendor',
				'filter_id'      => '5',
				'custom_title'   => __( 'Vendor', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'1' => __( 'Jeffrey', 'wc-ajax-product-filter' ),
				),
			),
			'_pa_color'     => array(
				'filter_type'    => 'attribute',
				'filter_key'     => '_pa_color',
				'filter_id'      => '6',
				'custom_title'   => __( 'Color', 'wc-ajax-product-filter' ),
				'active_filters' => array(
					'yellow' => __( 'Yellow', 'wc-ajax-product-filter' ),
				),
			),
		);
	}

	/**
	 * Parse the filter visibility rules before saving into the database.
	 *
	 * @param array $visibility_rules The visibility rules data.
	 *
	 * @return array
	 */
	public static function parse_visibility_rules( $visibility_rules ) {
		$media_screens = isset( $visibility_rules['media_screens'] ) ? $visibility_rules['media_screens'] : array();
		$enable_rules  = isset( $visibility_rules['enable_rules'] ) ? $visibility_rules['enable_rules'] : '';
		$_rules        = isset( $visibility_rules['rules'] ) ? $visibility_rules['rules'] : array();
		$rules         = array();

		$parsed = array();

		if ( $media_screens ) {
			$parsed['media_screens'] = array_map( 'sanitize_text_field', $media_screens );
		}

		foreach ( $_rules as $_and_rules ) {
			$and_rules = array();

			foreach ( $_and_rules as $_or_rule ) {
				$group = isset( $_or_rule['group'] ) ? $_or_rule['group'] : '';

				if ( ! $group ) {
					continue;
				}

				$or_rule = array();

				if ( 'archive' === $group ) {
					$compare = isset( $_or_rule['compare'] ) ? $_or_rule['compare'] : array();
					$value   = isset( $compare['value'] ) ? $compare['value'] : '';

					if ( $value ) {
						$or_rule = array_merge( $_or_rule, array( 'compare' => $value ) );
					}
				} else {
					$or_rule = $_or_rule;
				}

				if ( $or_rule ) {
					$and_rules[] = $or_rule;
				}
			}

			if ( $and_rules ) {
				$rules[] = $and_rules;
			}
		}

		$parsed['enable_rules'] = $enable_rules;
		$parsed['rules']        = $rules;

		return $parsed;
	}

	/**
	 * Prepare the filter visibility rules for react ui.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return array
	 */
	public static function prepare_filter_visibility_rules( $post_id ) {
		$visibility_rules = get_post_meta( $post_id, '_field_visibility_rules', true );
		$media_screens    = isset( $visibility_rules['media_screens'] ) ? $visibility_rules['media_screens'] : array();
		$enable_rules     = isset( $visibility_rules['enable_rules'] ) ? $visibility_rules['enable_rules'] : '';
		$_rules           = isset( $visibility_rules['rules'] ) ? $visibility_rules['rules'] : array();
		$rules            = array();

		foreach ( $_rules as $_and_rules ) {
			$and_rules = array();

			foreach ( $_and_rules as $_or_rule ) {
				$group   = isset( $_or_rule['group'] ) ? $_or_rule['group'] : '';
				$rule    = isset( $_or_rule['rule'] ) ? $_or_rule['rule'] : '';
				$compare = isset( $_or_rule['compare'] ) ? $_or_rule['compare'] : '';

				$or_rule = array();

				if ( 'archive' === $group ) {
					$term = get_term( $compare );

					if ( $term ) {
						$term_data = array(
							'value' => $term->term_id,
							'label' => $term->name,
						);

						$or_rule = array_merge( $_or_rule, array( 'compare' => $term_data ) );
					}
				} elseif ( 'filter' === $group ) {
					$filter = get_post( $rule );

					if ( $filter && 'wcapf-filter' === $filter->post_type && 'publish' === $filter->post_status ) {
						$or_rule = $_or_rule;
					}
				} elseif ( 'page' === $group ) {
					$or_rule = $_or_rule;
				}

				if ( $or_rule ) {
					$and_rules[] = $or_rule;
				}
			}

			if ( $and_rules ) {
				$rules[] = $and_rules;
			}
		}

		return array(
			'media_screens' => $media_screens,
			'enable_rules'  => $enable_rules,
			'rules'         => $rules,
		);
	}

	/**
	 * Gets the visibility rules data for react UI.
	 *
	 * @return array[][]
	 */
	public static function get_visibility_rules_data() {
		// The list of all public taxonomies registered for post type product.
		$_taxonomies = get_taxonomies(
			array(
				'object_type' => array( 'product' ),
				'public'      => true,
			),
			'objects'
		);

		$taxonomies = array();

		foreach ( $_taxonomies as $taxonomy ) {
			$label = $taxonomy->labels->singular_name;
			$name  = $taxonomy->name;

			$taxonomies[] = array(
				'label' => $label,
				'value' => $name,
				'group' => 'archive',
			);
		}

		$_filters = WCAPF_API_Utils::get_filter_ids( 'publish' );
		$filters  = array();

		foreach ( $_filters as $filter_id ) {
			$filter_data = get_post_meta( $filter_id, '_field_data', true );
			$type        = isset( $filter_data['type'] ) ? $filter_data['type'] : '';

			if ( 'active-filters' === $type || 'reset-button' === $type ) {
				continue;
			}

			$filters[] = array(
				'label' => get_the_title( $filter_id ),
				'value' => $filter_id,
				'group' => 'filter',
			);
		}

		$operators = array(
			array(
				'label' => __( 'equal', 'wc-ajax-product-filter' ),
				'value' => 'equal',
			),
			array(
				'label' => __( 'not equal', 'wc-ajax-product-filter' ),
				'value' => 'not-equal',
			),
		);

		$page = array(
			'label' => __( 'Page', 'wc-ajax-product-filter' ),
			'value' => 'page',
			'group' => 'page',
		);

		return array(
			'operators'  => $operators,
			'page'       => $page,
			'taxonomies' => $taxonomies,
			'filters'    => $filters,
		);
	}

	/**
	 * Gets the forms.
	 *
	 * @return array
	 */
	public static function get_forms() {
		$args = array(
			'post_type'   => 'wcapf-form',
			'nopaging'    => true,
			'post_status' => 'publish',
			'fields'      => 'ids',
		);

		$posts = get_posts( $args );
		$forms = array();

		foreach ( $posts as $post_id ) {
			$forms[] = self::get_form_data( $post_id );
		}

		return $forms;
	}

	/**
	 * Gets the form data for given id.
	 *
	 * @param int $id The form id.
	 *
	 * @return array
	 */
	public static function get_form_data( $id ) {
		return array(
			'id'    => $id,
			'title' => get_the_title( $id ),
		);
	}

	/**
	 * Duplicate form.
	 *
	 * @param int $post_id The post id to be duplicated.
	 *
	 * @return int|WP_Error
	 */
	public static function duplicate_form( $post_id ) {
		$post_arr = array(
			'post_title'  => get_the_title( $post_id ) . ' ' . __( '(Copy)', 'wc-ajax-product-filter' ),
			'post_type'   => 'wcapf-form',
			'post_status' => 'publish',
		);

		$new_post_id = wp_insert_post( $post_arr, true );

		if ( is_wp_error( $new_post_id ) ) {
			return $new_post_id;
		}

		$new_form_data = get_post_meta( $post_id, '_form_data', true );

		update_post_meta( $new_post_id, '_form_data', $new_form_data );

		return $new_post_id;
	}

}
