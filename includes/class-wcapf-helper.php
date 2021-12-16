<?php
/**
 * The helper class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Helper class.
 */
class WCAPF_Helper {

	/**
	 * Determines if we show the pro features modal.
	 *
	 * @return mixed|void
	 */
	public static function show_pro_version_offer() {
		return apply_filters( 'wcapf_show_pro_offer', true );
	}

	/**
	 * The settings page hook.
	 *
	 * @return string
	 */
	public static function settings_page_hook() {
		return 'settings_page_wc-ajax-product-filter';
	}

	/**
	 * The settings page's settings tab url.
	 *
	 * @return string
	 */
	public static function settings_page_tab_url() {
		return add_query_arg( 'tab', 'settings', self::settings_page_url() );
	}

	/**
	 * The settings page url.
	 *
	 * @return string
	 */
	public static function settings_page_url() {
		return menu_page_url( 'wc-ajax-product-filter', false );
	}

	/**
	 * Gets the current tab of the settings page.
	 *
	 * @return string
	 */
	public static function get_current_tab() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return ( isset( $_GET['tab'] ) && 'settings' === $_GET['tab'] ) ? 'settings' : 'search-form';
	}

	/**
	 * Renders the form fields.
	 *
	 * @return void
	 */
	public static function render_form_fields() {
		$form_config = self::get_form_config();

		if ( ! $form_config ) {
			return;
		}

		$fields_data = self::available_search_fields();

		foreach ( $form_config as $field_instance ) {
			$field_type = isset( $field_instance['type'] ) ? $field_instance['type'] : '';
			$field_name = isset( $fields_data[ $field_type ] ) ? $fields_data[ $field_type ] : '';

			WCAPF_Template_Loader::get_instance()->load(
				'admin/form-field',
				array(
					'field_key'      => $field_type,
					'field_name'     => $field_name,
					'field_instance' => $field_instance,
				)
			);
		}
	}

	/**
	 * Gets the search form config.
	 *
	 * @return array
	 */
	public static function get_form_config() {
		return get_option( 'wcapf_form_conf' );
	}

	/**
	 * The available search form fields.
	 *
	 * @return array
	 */
	public static function available_search_fields() {
		$fields = array(
			'category'        => __( 'Filter by Category', 'wc-ajax-product-filter' ),
			'tag'             => __( 'Filter by Tag', 'wc-ajax-product-filter' ),
			'attribute'       => __( 'Filter by Attribute', 'wc-ajax-product-filter' ),
			'price'           => __( 'Filter by Price', 'wc-ajax-product-filter' ),
			'custom-taxonomy' => __( 'Filter by Custom Taxonomy', 'wc-ajax-product-filter' ), // TODO: Pro
			'post-meta'       => __( 'Filter by Post Meta', 'wc-ajax-product-filter' ), // TODO: Pro
			'submit-button'   => __( 'Submit Button', 'wc-ajax-product-filter' ),
			'reset-button'    => __( 'Reset Button', 'wc-ajax-product-filter' ),
		);

		return apply_filters( 'wcapf_available_search_fields', $fields );
	}

	/**
	 * Renders the filter form.
	 *
	 * @return void
	 */
	public static function render_filter_form() {
		$form_config = self::get_form_config();

		if ( ! $form_config ) {
			return;
		}

		foreach ( $form_config as $field_instance ) {
			$field_type  = isset( $field_instance['type'] ) ? $field_instance['type'] : '';
			$field_class = self::get_field_class_name_by_type( $field_type );

			if ( ! $field_class ) {
				continue;
			}

			$field = self::get_field_instance( $field_type, $field_instance );
			$field->filter_form();
		}
	}

	/**
	 * Gets the field's class name for the given type.
	 *
	 * @param string $type The field type.
	 *
	 * @return string
	 */
	public static function get_field_class_name_by_type( $type ) {
		$field_keys = explode( '-', $type );
		$class_name = 'WCAPF_Field_';
		$index      = 0;

		foreach ( $field_keys as $_field_key ) {
			if ( 0 < $index ) {
				$class_name .= '_';
			}

			$class_name .= ucfirst( $_field_key );

			$index++;
		}

		if ( ! class_exists( $class_name ) ) {
			return '';
		}

		return apply_filters( 'wcapf_field_class_name_by_type', $class_name, $type );
	}

	/**
	 * Gets the field's instance.
	 *
	 * @param string $type           The field type.
	 * @param array  $field_instance The field's instance.
	 *
	 * @return WCAPF_Field
	 */
	public static function get_field_instance( $type, $field_instance = array() ) {
		$class = self::get_field_class_name_by_type( $type );

		return new $class( $field_instance );
	}

	/**
	 * Renders the field's form for the given instance.
	 *
	 * @param array $field_instance The field's instance.
	 *
	 * @return void
	 */
	public static function render_field_form_by_instance( $field_instance ) {
		$type       = isset( $field_instance['type'] ) ? $field_instance['type'] : '';
		$class_name = self::get_field_class_name_by_type( $type );

		if ( ! $class_name ) {
			return;
		}

		$field = self::get_field_instance( $type, $field_instance );
		$field->form();
	}

}
