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
	 * The settings page url.
	 *
	 * @return string
	 */
	public static function settings_page_url() {
		return menu_page_url( 'wcapf-settings', false );
	}

	/**
	 * Gets the wcapf settings.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$option_name = 'wcapf_settings';
		$db_options  = get_option( $option_name );

		if ( has_filter( $option_name ) ) {
			$settings = wp_parse_args( apply_filters( $option_name, $db_options ), $db_options );
		} else {
			$settings = $db_options;
		}

		return $settings;
	}

	/**
	 * The available search form fields.
	 *
	 * @return array
	 */
	public static function available_search_fields() {
		$fields = array(
			array(
				'type'     => 'active-filters',
				'name'     => __( 'Active Filters', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'category',
				'name'     => __( 'Filter by Category', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'tag',
				'name'     => __( 'Filter by Tag', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'attribute',
				'name'     => __( 'Filter by Attribute', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'price',
				'name'     => __( 'Filter by Price', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'rating',
				'name'     => __( 'Filter by Rating', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'product-status',
				'name'     => __( 'Filter by Product Status', 'wc-ajax-product-filter' ),
				'position' => 5,
			),
			array(
				'type'     => 'reset-button',
				'name'     => __( 'Reset Button', 'wc-ajax-product-filter' ),
				'position' => 15,
			),
		);

		$fields = apply_filters( 'wcapf_available_search_fields', $fields );
		$fields = wp_list_sort( $fields, 'position' );

		return wp_list_pluck( $fields, 'name', 'type' );
	}

	/**
	 * Renders the filter form.
	 *
	 * TODO: Render the preview in admin area.
	 *
	 * @return void
	 */
	public static function render_filter_form() {
		$args = array(
			'post_type'   => 'wcapf-filter',
			'post_status' => 'publish',
			'nopaging'    => true,
			'fields'      => 'ids',
		);

		$filters = get_posts( $args );

		foreach ( $filters as $post_id ) {
			$field_data = get_post_meta( $post_id, '_field_data', true );

			$field_type  = isset( $field_data['type'] ) ? $field_data['type'] : '';
			$field_class = self::get_field_class_name_by_type( $field_type );

			if ( ! $field_class ) {
				continue;
			}

			$field = self::get_field_instance( $field_type, $field_data );
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

			$index ++;
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
