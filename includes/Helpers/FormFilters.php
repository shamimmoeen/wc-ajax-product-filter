<?php
/**
 * Form-filters write helper.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Validates and persists React-admin form data as wcapf-filter posts under a
 * parent wcapf-form. HTTP-agnostic: when validation fails, it returns the
 * error list instead of calling wp_send_json_error — the caller (admin-ajax
 * handler today, REST controller tomorrow) decides how to surface the errors.
 */
class FormFilters {

	/**
	 * Validates and saves form filters.
	 *
	 * On validation failure, the method returns an empty filters list and a
	 * non-empty errors list without writing anything. On success, the saved
	 * filters are returned and the errors list is empty.
	 *
	 * @param array $form_filters Raw filter data from the admin UI or migration.
	 * @param int   $form_id      Parent wcapf-form post ID.
	 * @param bool  $migrate      Whether the filters are being migrated from v3.
	 *
	 * @return array{0: array, 1: array} Tuple of [saved filters, errors].
	 */
	public function save( $form_filters, $form_id, $migrate = false ) {
		$possible_types = wcapf()->api->filter_types();
		$valid_types    = wp_list_pluck( $possible_types, 'value' );
		$filter_types   = array();
		$filters        = array();
		$errors         = array();

		if ( empty( $form_filters ) || ! is_array( $form_filters ) ) {
			return array( $filters, $errors );
		}

		// Validation pass: collect errors before persisting anything.
		foreach ( $form_filters as $filter_order => $filter ) {
			list(
				,
				,
				$post_name,
				$type,
				$taxonomy,
				$meta_key,
				) = $this->get_filter_data( $filter );

			list( , $error_data ) = $this->filter_key(
				$type,
				$possible_types,
				$taxonomy,
				$filter,
				$post_name,
				$meta_key,
				$filter_order
			);

			if ( $error_data ) {
				$errors[] = $error_data;
			}
		}

		if ( $errors ) {
			return array( array(), $errors );
		}

		// Persist pass.
		foreach ( $form_filters as $filter_order => $filter ) {
			$is_new       = isset( $filter['isNew'] ) ? $filter['isNew'] : '';
			$unique_index = isset( $filter['uniqueIndex'] ) ? $filter['uniqueIndex'] : '';

			list(
				$filter_title,
				$filter_id,
				$post_name,
				$type,
				$taxonomy,
				$meta_key,
				$component
				) = $this->get_filter_data( $filter );

			if ( ! in_array( $type, $valid_types, true ) ) {
				continue;
			}

			if ( 'taxonomy' === $type && ! $taxonomy ) {
				continue;
			} elseif ( 'post-meta' === $type && ! $meta_key ) {
				continue;
			} elseif ( 'component' === $type && ! $component ) {
				continue;
			}

			list( $post_name, , $filter_type_data ) = $this->filter_key(
				$type,
				$possible_types,
				$taxonomy,
				$filter,
				$post_name,
				$meta_key,
				$filter_order
			);

			if ( 'taxonomy' === $type ) {
				$taxonomy = isset( $filter['taxonomy'] ) ? sanitize_text_field( $filter['taxonomy'] ) : '';

				if ( ! $taxonomy ) {
					continue;
				}

				$filter_type = $type . '>' . $taxonomy;
			} elseif ( 'post-meta' === $type ) {
				$meta_key = isset( $filter['meta_key'] ) ? sanitize_text_field( $filter['meta_key'] ) : '';

				if ( ! $meta_key ) {
					continue;
				}

				$filter_type = $type . '>' . $meta_key;
			} elseif ( 'component' === $type ) {
				$filter_type = $type . '>' . $component;
			} else {
				$filter_type = $type;
			}

			// Don't add same filter type in a form multiple times.
			if ( in_array( $filter_type, $filter_types, true ) ) {
				$post_status = 'draft';
			} else {
				$post_status = 'publish';

				// When migrating we'll keep the existing post_status.
				if ( $migrate && ! empty( $filter['post_status'] ) ) {
					$post_status = sanitize_text_field( $filter['post_status'] );

					unset( $filter['post_status'] );
				}
			}

			if ( 'component' !== $type ) {
				$filter_types[] = $filter_type;
			}

			if ( 'component' !== $type && ! $filter_title ) {
				if ( 'post-meta' === $type ) {
					$filter_title = $filter_type_data['label'] . '[' . $meta_key . ']';
				} else {
					$filter_title = $filter_type_data['label'];
				}
			}

			if ( 'component' === $type && 'active-filters' === $component && ! $filter_title ) {
				$filter_title = __( 'Active Filters', 'wc-ajax-product-filter' );
			}

			$post_arr = array( 'post_title' => $filter_title );

			if ( $filter_id && 'wcapf-filter' === get_post_type( $filter_id ) ) {
				$post_arr['ID']          = $filter_id;
				$post_arr['post_status'] = $post_status;

				if ( $migrate ) {
					$post_arr['post_parent']  = $form_id;
					$post_arr['post_excerpt'] = $filter_type;
				}

				$new_filter_id = wp_update_post( $post_arr, true );
			} else {
				$post_arr['post_type']    = 'wcapf-filter';
				$post_arr['post_status']  = $post_status;
				$post_arr['post_parent']  = $form_id;
				$post_arr['post_excerpt'] = $filter_type;

				$new_filter_id = wp_insert_post( $post_arr, true );
			}

			if ( is_wp_error( $new_filter_id ) ) {
				continue;
			}

			if ( 'component' === $type ) {
				$post_name = '';
			}

			$filter['id']        = $new_filter_id;
			$filter['title']     = $filter_title;
			$filter['field_key'] = $post_name;

			$sanitized = $this->sanitize_filter_data( $filter, $migrate );

			// Remove 'isNew', 'uniqueIndex' when saving into the database.
			if ( isset( $sanitized['isNew'] ) ) {
				unset( $sanitized['isNew'] );
			}

			if ( isset( $sanitized['uniqueIndex'] ) ) {
				unset( $sanitized['uniqueIndex'] );
			}

			$post_arr = array(
				'ID'           => $new_filter_id,
				'post_content' => maybe_serialize( $sanitized ),
				'post_name'    => $post_name,
				'menu_order'   => $filter_order,
			);

			$unique_post_slug_callback = static function () use ( $post_name ) {
				return $post_name;
			};

			add_filter( 'pre_wp_unique_post_slug', $unique_post_slug_callback );
			$new_filter_id = wp_update_post( $post_arr, true );
			remove_filter( 'pre_wp_unique_post_slug', $unique_post_slug_callback );

			if ( ! is_wp_error( $new_filter_id ) ) {
				// Add 'isNew', 'uniqueIndex' when returning the filter data for React UI.
				if ( $is_new ) {
					$sanitized['isNew'] = $is_new;
				}

				if ( $unique_index ) {
					$sanitized['uniqueIndex'] = $unique_index;
				}

				$filters[] = $sanitized;
			}
		}

		return array( $filters, $errors );
	}

	/**
	 * Resolves and validates the filter key (post_name) for a filter
	 * configuration. Returns a tuple of [post_name, error_data, type_data].
	 *
	 * @param string $type           Filter type.
	 * @param array  $possible_types Available filter types.
	 * @param string $taxonomy       Selected taxonomy (taxonomy filter only).
	 * @param array  $filter_data    Raw filter configuration.
	 * @param string $post_name      Proposed filter key (slug).
	 * @param string $meta_key       Meta key (post-meta filter only).
	 * @param int    $filter_order   Position of the filter in the form.
	 *
	 * @return array{0: string, 1: array, 2: array}
	 */
	public function filter_key( $type, $possible_types, $taxonomy, $filter_data, $post_name, $meta_key, $filter_order ) {
		if ( 'component' === $type ) {
			return array( $post_name, array(), array() );
		}

		if ( 'taxonomy' === $type ) {
			$taxonomy_index    = array_search( 'taxonomy', array_column( $possible_types, 'value' ), true );
			$taxonomy_options  = $possible_types[ $taxonomy_index ];
			$taxonomy_types    = $taxonomy_options['options'];
			$filter_type_index = array_search( $taxonomy, array_column( $taxonomy_types, 'value' ), true );
			$filter_type_data  = $taxonomy_types[ $filter_type_index ];
		} else {
			$filter_type_index = array_search( $type, array_column( $possible_types, 'value' ), true );
			$filter_type_data  = $possible_types[ $filter_type_index ];
		}

		$global_filter_key = wcapf()->api->global_filter_key( $filter_data );

		// Try to grab the global filter key when possible.
		if ( ! $post_name && $global_filter_key ) {
			$post_name = $global_filter_key;
		}

		// Set default filter key.
		if ( ! $post_name ) {
			if ( 'post-meta' === $type ) {
				$post_name = '_' . $meta_key;
			} else {
				$post_name = $filter_type_data['key'];
			}
		}

		$error_data = array();

		if ( post_type_exists( $post_name ) ) {
			$error_data = array(
				'key'       => 'field_key_error_',
				'message'   => $this->generate_filter_key_error_message( 'post-type' ),
				'order'     => $filter_order,
				'field_key' => $post_name,
			);
		} elseif ( taxonomy_exists( $post_name ) ) {
			$error_data = array(
				'key'       => 'field_key_error_',
				'message'   => $this->generate_filter_key_error_message( 'taxonomy' ),
				'order'     => $filter_order,
				'field_key' => $post_name,
			);
		} elseif ( 's' === $post_name ) {
			$error_data = array(
				'key'       => 'field_key_error_',
				'message'   => __( 'This is a reserved key. Please use a different string.', 'wc-ajax-product-filter' ),
				'order'     => $filter_order,
				'field_key' => $post_name,
			);
		}

		return array( $post_name, $error_data, $filter_type_data );
	}

	/**
	 * Extracts the standard field values from a raw filter array.
	 *
	 * @param array $filter Raw filter data.
	 *
	 * @return array{0: string, 1: int, 2: string, 3: string, 4: string, 5: string, 6: string}
	 */
	private function get_filter_data( $filter ) {
		$filter_title = isset( $filter['title'] ) ? sanitize_text_field( $filter['title'] ) : '';
		$filter_id    = isset( $filter['id'] ) ? absint( $filter['id'] ) : 0;
		$post_name    = isset( $filter['field_key'] ) ? urldecode( sanitize_title( $filter['field_key'] ) ) : '';
		$type         = isset( $filter['type'] ) ? sanitize_text_field( $filter['type'] ) : '';
		$taxonomy     = isset( $filter['taxonomy'] ) ? sanitize_text_field( $filter['taxonomy'] ) : '';
		$meta_key     = isset( $filter['meta_key'] ) ? sanitize_text_field( $filter['meta_key'] ) : '';
		$component    = isset( $filter['component'] ) ? sanitize_text_field( $filter['component'] ) : '';

		return array( $filter_title, $filter_id, $post_name, $type, $taxonomy, $meta_key, $component );
	}

	/**
	 * Builds the user-facing error message for a filter-key conflict.
	 *
	 * @param string $type Conflict type. Expected: 'post-type' or 'taxonomy'.
	 *
	 * @return string
	 */
	private function generate_filter_key_error_message( $type ) {
		$messages = array(
			'post-type' => __(
				"Post type name can't be used as a filter key, it'll create conflict.",
				'wc-ajax-product-filter'
			),
			'taxonomy'  => __(
				"Taxonomy name can't be used as a filter key, it'll create conflict.",
				'wc-ajax-product-filter'
			),
		);

		$common_message = __( 'Please make it unique by adding an underscore.', 'wc-ajax-product-filter' );
		$type_message   = isset( $messages[ $type ] ) ? $messages[ $type ] : $messages['post-type'];

		return sprintf( '%s %s', $type_message, $common_message );
	}

	/**
	 * Sanitises a filter's field values before persisting.
	 *
	 * @param array $filter  Raw filter data.
	 * @param bool  $migrate Whether the filter is being migrated.
	 *
	 * @return array
	 */
	private function sanitize_filter_data( $filter, $migrate ) {
		$float_fields  = array( 'min_value', 'max_value', 'step' );
		$absint_fields = array( 'id', 'decimal_places', 'soft_limit', 'max_height', 'gap' );

		$limit_fields = array(
			'include_terms',
			'exclude_terms',
			'include_authors',
			'exclude_authors',
			'include_user_roles',
		);

		$single_array_fields = array( 'parent_term' );

		$value_may_have_spaces = array(
			'value_prefix',
			'value_postfix',
			'values_separator',
			'text_before_min_value',
			'text_before_max_value',
		);

		$markup_fields = array( 'help_text' );

		$sanitized_filter = array();

		foreach ( $filter as $key => $value ) {
			if ( in_array( $key, $float_fields, true ) ) {
				$value = (float) $value;

				if ( 'min_value' === $key && ! $value ) {
					$value = 0;
				}

				if ( 'max_value' === $key && ! $value ) {
					$value = 100;
				}

				if ( 'step' === $key && ! $value ) {
					$value = 1;
				}
			} elseif ( in_array( $key, $absint_fields, true ) ) {
				$value = absint( $value );
			} elseif ( in_array( $key, $limit_fields, true ) ) {
				if ( ! $migrate ) {
					// Pick the ids only.
					$value = is_array( $value ) ? wp_list_pluck( $value, 'value' ) : array();
					$value = array_map( 'sanitize_text_field', $value );
				}
			} elseif ( in_array( $key, $single_array_fields, true ) ) {
				if ( ! $migrate ) {
					$value = ( is_array( $value ) && isset( $value['value'] ) ) ? $value['value'] : '';
				}
			} elseif ( in_array( $key, $value_may_have_spaces, true ) ) {
				$value = str_replace( ' ', '&nbsp;', $value );

				$with_markup = array( 'values_separator', 'text_before_min_value', 'text_before_max_value' );

				if ( in_array( $key, $with_markup, true ) ) {
					$value = wp_kses_data( $value );
				} else {
					$value = sanitize_text_field( $value );
				}
			} elseif ( in_array( $key, $markup_fields, true ) ) {
				$value = wp_kses_post( $value );
			} elseif ( 'product_status_options' === $key ) {
				$value = $this->sanitize_product_status_options( $value );
			} elseif ( ! $migrate ) {
				$value = sanitize_text_field( $value );
			}

			$sanitized_filter[ $key ] = $value;
		}

		return apply_filters( 'wcapf_sanitize_filter_data', $sanitized_filter, $filter, $migrate );
	}

	/**
	 * Sanitises product-status options.
	 *
	 * @param array $options Raw option list.
	 *
	 * @return array
	 */
	private function sanitize_product_status_options( $options ) {
		if ( ! is_array( $options ) ) {
			return array();
		}

		$array    = array();
		$defaults = wp_list_pluck( wcapf()->api->product_status_options(), 'label', 'value' );

		foreach ( $options as $option ) {
			$option = wcapf()->api->sanitize_manual_option( $option );
			$value  = isset( $option['value'] ) ? $option['value'] : '';
			$label  = isset( $option['label'] ) ? $option['label'] : '';

			if ( ! strlen( $value ) ) {
				continue;
			}

			if ( ! strlen( $label ) ) {
				$label = isset( $defaults[ $value ] ) ? $defaults[ $value ] : $value;
			}

			$array[] = array_merge( $option, array( 'label' => $label ) );
		}

		return $array;
	}
}
