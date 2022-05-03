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
 * WCAPF_Settings_Page class.
 *
 * @since 3.0.0
 */
class WCAPF_Settings_Page {

	private $option_name;

	private $fields;

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
			$instance = new WCAPF_Settings_Page();
			$instance->set_option_name();
			$instance->set_fields();
			$instance->set_actions();
		}

		return $instance;
	}

	private function set_option_name() {
		$this->option_name = WCAPF_Helper::settings_option_key();
	}

	public function get_option_name() {
		return $this->option_name;
	}

	/**
	 * Sets the settings form fields.
	 *
	 * @return void
	 */
	private function set_fields() {
		$fields = array(
			array(
				'type'  => 'text',
				'id'    => 'shop_loop_container',
				'label' => __( 'Shop loop container', 'wc-ajax-product-filter' ),
				'desc'  => __( 'The element selector that is holding the shop loop. In most cases, you don\'t need to change this.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'text',
				'id'    => 'not_found_container',
				'label' => __( 'No products container', 'wc-ajax-product-filter' ),
				'desc'  => __( 'The element selector that is holding the no products found message. In most cases, you don\'t need to change this.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'text',
				'id'    => 'pagination_container',
				'label' => __( 'Pagination container', 'wc-ajax-product-filter' ),
				'desc'  => __( 'The element selector that is holding the pagination. In most cases, you don\'t need to change this.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'sorting_control',
				'label' => __( 'Product sorting', 'wc-ajax-product-filter' ),
				'desc'  => __( 'Enable the products\' default sorting via ajax.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'scroll_to_top',
				'label' => __( 'Scroll to top', 'wc-ajax-product-filter' ),
				'desc'  => __( 'Enable scroll to top after updating the products.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'text',
				'id'    => 'scroll_to_top_offset',
				'label' => __( 'Scroll to top offset', 'wc-ajax-product-filter' ),
				'desc'  => __( 'You may need to change this value to match with your theme, eg: 100', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'textarea',
				'id'    => 'custom_scripts',
				'label' => __( 'Custom JavaScript after update', 'wc-ajax-product-filter' ),
				'desc'  => __( 'If you want to add custom scripts that would be loaded after updating shop loop, eg: alert("hello");', 'wc-ajax-product-filter' ),
			),
			array(
				'type'    => 'select',
				'id'      => 'filter_relationships',
				'label'   => __( 'Filter relationships', 'wc-ajax-product-filter' ),
				'options' => array(
					'and' => __( 'AND', 'wc-ajax-product-filter' ),
					'or'  => __( 'OR', 'wc-ajax-product-filter' ),
				),
				'desc'    => __( 'The relationship between filters. AND - products shown will match all filters, OR - products shown will match any of the filters.', 'wc-ajax-product-filter' ),
			),
		);

		$fields = apply_filters( 'wcapf_settings_fields', $fields );

		$this->fields = $fields;
	}

	/**
	 * Renders the settings form fields.
	 *
	 * @return void
	 */
	public function render_settings_fields() {
		$options = WCAPF_Helper::get_settings();

		foreach ( $this->fields as $field ) {
			WCAPF_Settings_Page::get_instance()->field_tr( $field, $options );
		}
	}

	/**
	 * Renders the settings form submission messages.
	 *
	 * @param string $msg_code The message code.
	 *
	 * @return void
	 */
	public function render_settings_form_submission_messages( $msg_code ) {
		if ( ! $msg_code ) {
			return;
		}

		$msg_type = '';
		$message  = '';

		if ( 'invalid-nonce' === $msg_code ) {
			$msg_type = 'error';
			$message  = __( 'Nonce verification failed.', 'wc-ajax-product-filter' );
		} elseif ( 'settings-success' === $msg_code ) {
			$msg_type = 'success';
			$message  = __( 'Settings saved.', 'wc-ajax-product-filter' );
		}

		WCAPF_Template_Loader::get_instance()->load(
			'admin/admin-notice',
			array( 'msg_type' => $msg_type, 'message' => $message )
		);
	}

	/**
	 * Sets the actions.
	 *
	 * @return void
	 */
	private function set_actions() {
		add_action( 'admin_init', array( $this, 'save_settings' ) );
		add_action( 'admin_init', array( $this, 'save_default_settings' ) );
	}

	/**
	 * Saves the settings.
	 *
	 * @return void
	 */
	public function save_settings() {
		$fields = $this->fields;

		if ( ! isset( $_POST['wcapf_settings_nonce_field'] ) ) {
			return;
		}

		$msg_code = '';
		$referrer = $_POST['_wp_http_referer'];

		if ( ! wp_verify_nonce( $_POST['wcapf_settings_nonce_field'], 'wcapf_settings_save_nonce' ) ) {
			$msg_code = 'invalid-nonce';
		}

		if ( $msg_code ) {
			$redirect_to = add_query_arg( 'message', $msg_code, $referrer );

			wp_safe_redirect( $redirect_to );
			exit;
		}

		if ( has_filter( $this->option_name ) ) {
			$input = wp_parse_args( apply_filters( $this->option_name, $_POST ), $_POST );
		} else {
			$input = $_POST;
		}

		$parsed = array();

		foreach ( $fields as $field ) {
			$name   = $field['id'];
			$_value = isset( $input[ $name ] ) ? $input[ $name ] : '';

			// @source https://wordpress.org/support/topic/how-to-sanitize-an-admin-text-field-but-still-allow-quotes/
			if ( 'custom_scripts' === $name ) {
				$_value = stripslashes( $_value );
			}

			$value = sanitize_text_field( $_value );

			$parsed[ $name ] = $value;
		}

		$parsed = apply_filters( 'wcapf_parsed_settings', $parsed, $input, $_POST );

		update_option( $this->option_name, $parsed );

		$msg_code    = 'settings-success';
		$redirect_to = add_query_arg( 'message', $msg_code, $referrer );

		wp_safe_redirect( $redirect_to );
		exit;
	}

	/**
	 * Saves the default settings.
	 *
	 * @return void
	 */
	public function save_default_settings() {
		$option_name = $this->option_name;

		if ( ! get_option( $option_name ) ) {
			// check if filter is applied
			$settings = apply_filters( $option_name, $this->default_settings() );
			update_option( $option_name, $settings );
		}
	}

	/**
	 * Default settings for this plugin.
	 *
	 * @return array
	 */
	public function default_settings() {
		return array(
			'shop_loop_container'  => '.wcapf-before-products',
			'not_found_container'  => '.wcapf-before-products',
			'pagination_container' => '.woocommerce-pagination',
			'sorting_control'      => '1',
			'scroll_to_top'        => '1',
			'scroll_to_top_offset' => '0',
			'custom_scripts'       => '',
			'filter_relationships' => 'and',
		);
	}

	private function field_input( $data, $settings ) {
		$type = $data['type'];

		switch ( $type ) {
			case 'text':
				$this->field_text_tr( $data, $settings );
				break;

			case 'checkbox':
				$this->field_checkbox_tr( $data, $settings );
				break;

			case 'textarea':
				$this->field_textarea_tr( $data, $settings );
				break;

			case 'select':
				$this->field_select_tr( $data, $settings );
				break;
		}
	}

	public function field_tr( $data, $settings ) {
		$id    = $data['id'];
		$label = $data['label'];
		$desc  = $data['desc'];
		?>
		<tr>
			<th scope="row">
				<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $label ); ?></label>
			</th>
			<td>
				<?php $this->field_input( $data, $settings ); ?>
				<p class="description"><?php echo esc_html( $desc ); ?></p>
			</td>
		</tr>
		<?php
	}

	private function field_text_tr( $data, $settings ) {
		$id    = $data['id'];
		$value = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		?>
		<input
			type="text"
			id="<?php echo esc_attr( $id ); ?>"
			name="<?php echo esc_attr( $id ); ?>"
			size="50"
			value="<?php echo esc_attr( $value ); ?>"
		>
		<?php
	}

	private function field_checkbox_tr( $data, $settings ) {
		$id    = $data['id'];
		$value = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		?>
		<input
			type="checkbox"
			id="<?php echo esc_attr( $id ); ?>"
			name="<?php echo esc_attr( $id ); ?>"
			value="1"
			<?php checked( 1, $value ); ?>
		>
		<?php
	}

	private function field_textarea_tr( $data, $settings ) {
		$id    = $data['id'];
		$value = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		?>
		<textarea
			id="<?php echo esc_attr( $id ); ?>"
			name="<?php echo esc_attr( $id ); ?>"
			rows="5"
			cols="70"
		><?php echo esc_textarea( $value ); ?></textarea>
		<?php
	}

	private function field_select_tr( $data, $settings ) {
		$id      = $data['id'];
		$options = isset( $data['options'] ) ? $data['options'] : array();
		$value   = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		?>
		<select name="<?php echo esc_attr( $id ); ?>" id="<?php echo esc_attr( $id ); ?>">
			<?php foreach ( $options as $option_name => $option_label ) : ?>
				<option value="<?php echo esc_attr( $option_name ); ?>" <?php selected( $value, $option_name ); ?>>
					<?php echo esc_html( $option_label ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<?php
	}

}

if ( is_admin() ) {
	WCAPF_Settings_Page::get_instance();
}
