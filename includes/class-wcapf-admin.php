<?php
/**
 * The admin settings page.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Admin class.
 */
class WCAPF_Admin {

	/**
	 * The constructor.
	 */
	private function __construct() {
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Admin();
			$instance->set_actions();
		}

		return $instance;
	}

	/**
	 * Sets the actions.
	 *
	 * @return void
	 */
	private function set_actions() {
		$hook = WCAPF_Helper::settings_page_hook();

		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_filter( 'set-screen-option', array( $this, 'list_table_set_option' ), 10, 3 );
		add_action( 'admin_footer-' . $hook, array( $this, 'render_pro_features_modal' ) );
		add_filter( 'plugin_action_links_' . WCAPF_PLUGIN_FILE, array( $this, 'plugin_action_links' ) );
		add_filter( 'admin_footer_text', array( $this, 'footer_text' ) );
		add_action( 'admin_footer-' . $hook, array( $this, 'render_tmpl_templates' ) );
		add_action( 'wp_ajax_wcapf_save_form', array( $this, 'save_form' ) );
	}

	/**
	 * Register the settings page.
	 *
	 * @return void
	 */
	public function register_settings_page() {
		add_options_page(
			__( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ),
			__( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ),
			'manage_options',
			'wc-ajax-product-filter',
			array( $this, 'renders_the_settings_page' )
		);
	}

	/**
	 * The settings page html markup.
	 *
	 * @return void
	 */
	public function renders_the_settings_page() {
		$this->get_template_loader()->load( 'admin/settings-page' );
	}

	/**
	 * Gets the instance of template loader class.
	 *
	 * @return WCAPF_Template_Loader|null
	 */
	private function get_template_loader() {
		return WCAPF_Template_Loader::get_instance();
	}

	/**
	 * Renders the pro features modal html markup.
	 *
	 * @return void
	 */
	public function render_pro_features_modal() {
		$this->get_template_loader()->load( 'pro-features-modal' );
	}

	/**
	 * Adds plugin's action links.
	 *
	 * @param array $links The default links.
	 *
	 * @return array The updated action links.
	 * @noinspection HtmlUnknownTarget
	 */
	public function plugin_action_links( $links ) {
		$settings_page_url = WCAPF_Helper::settings_page_url();

		$links[] = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $settings_page_url ),
			__( 'Settings', 'wc-ajax-product-filter' )
		);

		return $links;
	}

	/**
	 * Change the admin footer text.
	 *
	 * @param string $text The default footer text.
	 *
	 * @return string
	 * @noinspection HtmlUnknownTarget
	 */
	public function footer_text( $text ) {
		$screen = get_current_screen();
		$base   = isset( $screen->base ) ? $screen->base : '';

		if ( WCAPF_Helper::settings_page_hook() !== $base ) {
			return $text;
		}

		$rating_link = 'https://wordpress.org/plugins/wc-ajax-product-filter/#reviews';

		$give_rating = sprintf(
			'<a href="%1$s" target="_blank">%2$s</a>',
			esc_url( $rating_link ),
			__( 'give a rating', 'wc-ajax-product-filter' )
		);

		$text = sprintf(
			/* translators: plugin name, plugin review page link */
			__( 'Thank you for using %1$s! Your feedback and review both are import, %2$s.', 'wc-ajax-product-filter' ),
			'<b>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</b>',
			$give_rating
		);

		return '<i>' . $text . '</i>';
	}

	/**
	 * Renders the tmpl version of all available fields.
	 *
	 * @return void
	 */
	public function render_tmpl_templates() {
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

	/**
	 * Saves the form configurations via ajax.
	 *
	 * @return void
	 */
	public function save_form() {
		$nonce = isset( $_POST['save_form_nonce_field'] ) ? sanitize_text_field( $_POST['save_form_nonce_field'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'save_form_nonce' ) ) {
			wp_send_json_error( __( 'Nonce verification failed.', 'wc-ajax-product-filter' ) );
		}

		$fields = isset( $_POST['wcapf-fields'] ) ? $_POST['wcapf-fields'] : array();
		$parsed = array();

		foreach ( $fields as $type => $sub_fields ) {
			$class_name = WCAPF_Helper::get_field_class_name_by_type( $type );

			if ( ! $class_name ) {
				continue;
			}

			$field_class        = new $class_name();
			$field_sub_fields   = $field_class->get_sub_fields();
			$available_fields   = wp_list_pluck( $field_sub_fields, 'name' );
			$available_fields[] = 'position';

			foreach ( $sub_fields as $field ) {
				$parsed_field = array();

				foreach ( $field as $field_key => $field_value ) {
					if ( ! in_array( $field_key, $available_fields, true ) ) {
						continue;
					}

					$parsed_field[ $field_key ] = sanitize_text_field( $field_value );
				}

				$parsed_field['type'] = $type;

				// TODO: parse query_type here.
				$_enable_multiple = isset( $parsed_field['enable_multiple'] ) ? $parsed_field['enable_multiple'] : 0;

				if ( ! $_enable_multiple ) {
					$parsed_field['query_type'] = 'and';
				}

				$parsed_field = apply_filters( 'wcapf_parse_form_field_data', $parsed_field, $type, $field );

				$parsed[] = $parsed_field;
			}
		}

		$sorted = wp_list_sort( $parsed, 'position' );
		$sorted = apply_filters( 'wcapf_pre_save_form_conf', $sorted, $_POST );

		update_option( 'wcapf_form_conf', $sorted );

		wp_send_json_success( __( 'Successfully saved.', 'wc-ajax-product-filter' ) );
	}

}

if ( is_admin() ) {
	WCAPF_Admin::get_instance();
}
