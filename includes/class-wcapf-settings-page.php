<?php
/**
 * The admin settings page.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
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

	public function get_option_name() {
		return $this->option_name;
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

	public function field_tr( $data, $settings ) {
		if ( 'read_only' === $data['type'] ) {
			return;
		}

		$id    = $data['id'];
		$label = $data['label'];
		$desc  = isset( $data['desc'] ) ? $data['desc'] : '';
		?>
		<tr class="settings-table-<?php echo esc_attr( $id ); ?>">
			<th scope="row">
				<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $label ); ?></label>
			</th>
			<td>
				<?php $this->field_input( $data, $settings ); ?>
				<?php if ( $desc ) : ?>
					<p class="description"><?php echo esc_html( $desc ); ?></p>
				<?php endif; ?>
			</td>
		</tr>
		<?php
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

			case 'media-upload':
				$this->field_media_uploader( $data, $settings );
				break;

			case 'scroll_window':
				$this->field_scroll_window_tr( $data, $settings );
				break;
		}
	}

	private function field_text_tr( $data, $settings ) {
		$id          = $data['id'];
		$placeholder = isset( $data['placeholder'] ) ? $data['placeholder'] : '';
		$value       = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		?>
		<input
			type="text"
			id="<?php echo esc_attr( $id ); ?>"
			name="<?php echo esc_attr( $id ); ?>"
			size="50"
			value="<?php echo esc_attr( $value ); ?>"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
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

	private function field_media_uploader( $data, $settings ) {
		$id          = $data['id'];
		$image_id    = isset( $settings[ $id ] ) ? $settings[ $id ] : '';
		$modal_title = isset( $data['modal_title'] ) ? $data['modal_title'] : '';
		$image_alt   = __( 'Loading image', 'wc-ajax-product-filter' );
		$image_src   = '';

		if ( $image_id ) {
			$image = wp_get_attachment_image_src( $image_id, 'full' );

			if ( $image ) {
				$image_src = $image[0];
			} else {
				$image_id = '';
			}
		}
		?>
		<div class="media-upload<?php echo ! $image_id ? ' no-image' : ''; ?>">
			<img
				class="image-src"
				src="<?php echo esc_url( $image_src ); ?>"
				alt="<?php echo esc_attr( $image_alt ); ?>"
				width="60"
			>
			<div>
				<input
					type="hidden"
					name="<?php echo esc_attr( $id ); ?>"
					id="<?php echo esc_attr( $id ); ?>"
					class="image-id"
					value="<?php echo esc_attr( $image_id ); ?>"
				>
				<button
					type="button"
					class="upload-image-button button"
					data-modal-title="<?php echo esc_attr( $modal_title ); ?>"
				>
					<?php esc_html_e( 'Upload', 'wc-ajax-product-filter' ); ?>
				</button>
				<button type="button" class="remove-image-button button">&times;</button>
			</div>
		</div>
		<?php
	}

	private function field_scroll_window_tr( $data, $settings ) {
		$id = $data['id'];

		if ( 'scroll_window' !== $id ) {
			return;
		}

		$this->field_select_tr( array(
			'id'      => 'scroll_window',
			'options' => array(
				'results' => __( 'Results container', 'wc-ajax-product-filter' ),
				'custom'  => __( 'Custom element', 'wc-ajax-product-filter' ),
				'none'    => __( 'None', 'wc-ajax-product-filter' ),
			),
		), $settings );

		echo '<span class="scroll-window-dependent-fields">';

		$this->field_select_tr( array(
			'id'      => 'scroll_window_for',
			'options' => array(
				'both'    => __( 'Both in desktop and mobile', 'wc-ajax-product-filter' ),
				'desktop' => __( 'Desktop only', 'wc-ajax-product-filter' ),
				'mobile'  => __( 'Mobile only', 'wc-ajax-product-filter' ),
			),
		), $settings );

		$this->field_select_tr( array(
			'id'      => 'scroll_window_when',
			'options' => array(
				'immediately' => __( 'Immediately', 'wc-ajax-product-filter' ),
				'after'       => __( 'After updating the results', 'wc-ajax-product-filter' ),
			),
		), $settings );

		echo '</span>';

		echo '<div class="scroll-window-custom-element-input">';

		$this->field_text_tr( array(
			'id'          => 'scroll_window_custom_element',
			'placeholder' => __( '#id or .class', 'wc-ajax-product-filter' ),
		), $settings );

		echo '</div>';
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
				'type'  => 'checkbox',
				'id'    => 'enable_pagination_via_ajax',
				'label' => __( 'Enable pagination via ajax', 'wc-ajax-product-filter' ),
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
				'label' => __( 'Product sorting via ajax', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'show_sorting_data_in_active_filters',
				'label' => __( 'Show sorting data in active filters', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'attach_chosen_on_sorting',
				'label' => __( 'Attach jquery chosen on sorting', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'loading_animation',
				'label' => __( 'Loading animation', 'wc-ajax-product-filter' ),
				'desc'  => __( 'Show an animation while the results are fetching.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'        => 'media-upload',
				'id'          => 'loading_image',
				'label'       => __( 'Loading image', 'wc-ajax-product-filter' ),
				'modal_title' => __( 'Loading animation image', 'wc-ajax-product-filter' ),
				'desc'        => __( 'Change the default loading image.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'scroll_window',
				'id'    => 'scroll_window',
				'label' => __( 'Scroll window to', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'text',
				'id'    => 'scroll_to_top_offset',
				'label' => __( 'Scroll to top offset', 'wc-ajax-product-filter' ),
				'desc'  => __( 'You can change this value to adjust the scroll to position, eg: 100', 'wc-ajax-product-filter' ),
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
			array(
				'type'  => 'checkbox',
				'id'    => 'update_count',
				'label' => __( 'Enable auto count', 'wc-ajax-product-filter' ),
				'desc'  => __( 'Update the count number according to the applied filters.', 'wc-ajax-product-filter' ),
			),
			array(
				'type'  => 'checkbox',
				'id'    => 'remove_data',
				'label' => __( 'Remove data', 'wc-ajax-product-filter' ),
				'desc'  => __( 'Enable this setting to remove all data when uninstalling WC Ajax Product Filter via the `plugins` page.', 'wc-ajax-product-filter' ),
			),
		);

		// Adds the scroll window fields.
		$fields = array_merge( $fields, array(
			array( 'type' => 'read_only', 'id' => 'scroll_window_for' ),
			array( 'type' => 'read_only', 'id' => 'scroll_window_when' ),
			array( 'type' => 'read_only', 'id' => 'scroll_window_custom_element' ),
		) );

		$fields = apply_filters( 'wcapf_settings_fields', $fields );

		$this->fields = $fields;
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

			if ( 'scroll_to_top_offset' === $name ) {
				$_value = intval( $_value );
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
			'shop_loop_container'                 => '.wcapf-before-products',
			'not_found_container'                 => '.wcapf-before-products',
			'enable_pagination_via_ajax'          => '1',
			'pagination_container'                => '.woocommerce-pagination',
			'sorting_control'                     => '1',
			'show_sorting_data_in_active_filters' => '1',
			'attach_chosen_on_sorting'            => '',
			'loading_animation'                   => '1',
			'scroll_window'                       => 'results',
			'scroll_window_for'                   => 'both',
			'scroll_window_when'                  => 'after',
			'scroll_window_custom_element'        => '',
			'scroll_to_top_offset'                => '100',
			'filter_relationships'                => 'and',
			'update_count'                        => '1',
			'remove_data'                         => '',
		);
	}

}

if ( is_admin() ) {
	WCAPF_Settings_Page::get_instance();
}
