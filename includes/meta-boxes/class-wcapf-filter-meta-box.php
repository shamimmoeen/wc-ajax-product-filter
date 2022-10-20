<?php
/**
 * The filter meta box class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/meta-boxes
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

		$error_code = WCAPF_API_Utils::validate_filter( $field_type, $filter_key, $post_id );

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

		$_field_data = array();

		foreach ( $field_data as $field_key => $field_value ) {
			if ( in_array( $field_key, $available_fields ) ) {
				$_field_data[ $field_key ] = $field_value;
			}
		}

		$parsed_field = WCAPF_API_Utils::get_parsed_field(
			$_field_data,
			$field_type,
			$filter_key,
			$post_id,
			$field_data
		);

		update_post_meta( $post_id, '_field_data', $parsed_field );
		update_post_meta( $post_id, '_filter_key', $filter_key );
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
		$error_message = WCAPF_API_Utils::get_error_message_from_code( $error_code );

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
			'admin/meta-box/filter',
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
