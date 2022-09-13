<?php
/**
 * The filter meta box class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Meta_Box class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Meta_Box {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Filter_Meta_Box
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Filter_Meta_Box();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'save_post', array( $this, 'save_filter' ) );
		add_filter( 'redirect_post_location', array( $this, 'meta_validation_redirect_location' ), 10, 2 );
		add_action( 'admin_notices', array( $this, 'validation_error_admin_notice' ) );
		add_action( 'edit_form_advanced', array( $this, 'render_meta_box' ) );
		add_action( 'add_meta_boxes', array( $this, 'remove_slug_meta_box' ) );
		add_action( 'admin_footer', array( $this, 'render_tmpl_templates' ) );
		add_action( 'admin_footer', array( $this, 'render_product_status_option_placeholder_template' ) );
	}

	/**
	 * Saves the filter meta data.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function save_filter( $post_id ) {
		if ( ! isset( $_POST['wcapf_meta_box_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['wcapf_meta_box_nonce'], 'save_filter_meta_data' ) ) {
			return;
		}

		$field_data = isset( $_POST['field'] ) ? $_POST['field'] : array();
		$field_type = isset( $field_data['type'] ) ? sanitize_text_field( $field_data['type'] ) : '';
		$filter_key = isset( $field_data['field_key'] ) ? sanitize_title( $field_data['field_key'] ) : '';
		$class_name = WCAPF_Helper::get_field_class_name_by_type( $field_type );

		$error_code = '';

		$field_types_with_key_required = WCAPF_Helper::field_types_with_key_required();

		if ( ! $field_type ) { // Filter is required.
			$error_code = 20;
		} elseif ( ! $class_name ) { // Invalid filter type.
			$error_code = 21;
		} elseif ( in_array( $field_type, $field_types_with_key_required ) ) {
			if ( ! $filter_key ) { // Filter key required.
				$error_code = 22;
			} elseif ( $this->is_filter_key_already_in_use( $post_id, $filter_key ) ) { // Filter key is already in use.
				$error_code = 23;
			} elseif ( $this->taxonomy_exists_for_filter_key( $filter_key ) ) {
				$error_code = 24;
			}
		}

		if ( $error_code ) {
			$user_id = get_current_user_id();

			$transient_name = $this->meta_validation_transient_name( $post_id, $user_id );
			set_transient( $transient_name, $error_code, 45 );
		}

		if ( ! $class_name ) {
			return;
		}

		$field_class      = new $class_name();
		$field_sub_fields = $field_class->get_sub_fields();
		$available_fields = wp_list_pluck( $field_sub_fields, 'name' );

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

		foreach ( $available_fields as $field_key ) {
			$field_value = isset( $field_data[ $field_key ] ) ? $field_data[ $field_key ] : '';

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

		$parsed_field = apply_filters( 'wcapf_parse_form_field_data', $parsed_field, $field_data );

		update_post_meta( $post_id, '_field_data', $parsed_field );
		update_post_meta( $post_id, '_filter_key', $filter_key );
	}

	private function is_filter_key_already_in_use( $post_id, $filter_key ) {
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
	private function taxonomy_exists_for_filter_key( $filter_key ) {
		return taxonomy_exists( $filter_key );
	}

	private function meta_validation_transient_name( $post_id, $user_id ) {
		return 'wcapf_save_filter_error_code_' . $post_id . '_' . $user_id;
	}

	public function meta_validation_redirect_location( $location, $post_id ) {
		if ( 'wcapf-filter' !== get_post_type( $post_id ) ) {
			return $location;
		}

		$user_id        = get_current_user_id();
		$transient_name = $this->meta_validation_transient_name( $post_id, $user_id );

		if ( $error = get_transient( $transient_name ) ) {
			// change post status to draft
			if ( 'draft' !== get_post_status( $post_id ) ) {
				$post = array( 'ID' => $post_id, 'post_status' => 'draft' );
				wp_update_post( $post );
			}

			// redirect to new url with error code
			$location = add_query_arg( 'message', $error, $location );
		}

		return $location;
	}

	public function validation_error_admin_notice() {
		$error_code    = isset( $_GET['message'] ) ? sanitize_text_field( $_GET['message'] ) : '';
		$error_message = '';

		if ( '20' === $error_code ) {
			$error_message = __( 'Filter is required.', 'wc-ajax-product-filter' );
		} elseif ( '21' === $error_code ) {
			$error_message = __( 'Invalid filter type.', 'wc-ajax-product-filter' );
		} elseif ( '22' === $error_code ) {
			$error_message = __( 'Filter key is required.', 'wc-ajax-product-filter' );
		} elseif ( '23' === $error_code ) {
			$error_message = __( 'The filter key is already in use on another filter.', 'wc-ajax-product-filter' );
		} elseif ( '24' === $error_code ) {
			$error_message = __( 'There is a taxonomy exists with the filter key.', 'wc-ajax-product-filter' );
		}

		if ( ! $error_message ) {
			return;
		}

		$post_id = isset( $_GET['post'] ) ? sanitize_text_field( $_GET['post'] ) : '';
		$user_id = get_current_user_id();

		$transient_name = $this->meta_validation_transient_name( $post_id, $user_id );
		delete_transient( $transient_name );

		WCAPF_Template_Loader::get_instance()->load(
			'admin/admin-notice',
			array( 'msg_type' => 'error', 'message' => $error_message )
		);
	}

	/**
	 * Removes the slug meta box from the 'wcapf-filter' post type.
	 *
	 * @return void
	 */
	public function remove_slug_meta_box() {
		remove_meta_box( 'slugdiv', 'wcapf-filter', 'normal' );
	}

	/**
	 * Renders the meta box.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return void
	 */
	public function render_meta_box( $post ) {
		if ( 'wcapf-filter' !== get_post_type() ) {
			return;
		}

		$post_id = $post->ID;

		$field_data = get_post_meta( $post_id, '_field_data', true );
		$field_type = isset( $field_data['type'] ) ? $field_data['type'] : '';

		$field_class = WCAPF_Helper::get_field_class_name_by_type( $field_type );

		if ( ! $field_class ) {
			$field_type = '';
		}

		$available_fields  = WCAPF_Helper::available_search_fields();
		$active_field_name = '';

		if ( $field_type ) {
			$active_field_name = isset( $available_fields[ $field_type ] ) ? $available_fields[ $field_type ] : array();
		}

		WCAPF_Template_Loader::get_instance()->load(
			'admin/filter-meta-box',
			array(
				'available_fields'  => $available_fields,
				'field_type'        => $field_type,
				'active_field_name' => $active_field_name,
				'field_data'        => $field_data,
			)
		);
	}

	/**
	 * Renders the tmpl version of all available fields.
	 *
	 * @return void
	 */
	public function render_tmpl_templates() {
		if ( 'wcapf-filter' === get_post_type() ) {
			$search_form_fields = WCAPF_Helper::available_search_fields();

			foreach ( $search_form_fields as $type => $field_label ) {
				$class_name = WCAPF_Helper::get_field_class_name_by_type( $type );

				if ( ! $class_name ) {
					continue;
				}

				$field        = new $class_name();
				$field_markup = $field->form( false, true );

				echo '<script type="text/html" id="tmpl-wcapf-form-field-' . esc_attr( $type ) . '">';
				echo $field_markup; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
				echo '</script>';
			}
		}
	}

	/**
	 * Renders the product status option's placeholder template.
	 *
	 * @return void
	 */
	public function render_product_status_option_placeholder_template() {
		if ( 'wcapf-filter' === get_post_type() ) {
			echo '<script type="text/html" id="tmpl-wcapf-product-status-option">';
			WCAPF_Helper::product_status_option_markup();
			echo '</script>';
		}
	}

}

WCAPF_Filter_Meta_Box::instance();
