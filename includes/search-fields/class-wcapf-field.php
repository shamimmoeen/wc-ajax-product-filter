<?php
/**
 * WCAPF_Field class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage search-fields
 */

/**
 * WCAPF_Field class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Field {

	/**
	 * The number of times the class instantiated.
	 *
	 * @var int
	 */
	public static $count = 0;

	/**
	 * The field's instance.
	 *
	 * @var array
	 */
	protected $instance;

	/**
	 * Determines if the field will be used as placeholder or not.
	 *
	 * @var bool
	 */
	private $placeholder = false;

	/**
	 * The constructor.
	 *
	 * @param array $instance The field's instance.
	 */
	public function __construct( $instance = array() ) {
		$this->instance = $instance;
		self::$count++;
	}

	/**
	 * Output form field.
	 *
	 * @param bool $echo        Determines if we echo the field or not.
	 * @param bool $placeholder Determines if the field will be used as placeholder or not.
	 *
	 * @return string|void
	 */
	public function form( $echo = true, $placeholder = false ) {
		$this->placeholder = $placeholder;

		if ( ! $echo ) {
			ob_start();
		}

		if ( ! $this->sub_fields() ) {
			echo '<p class="wcapf-form-field-no-settings">';
			esc_html_e( 'No settings are required.', 'wc-ajax-product-filter' );
			echo '</p>';
		} else {
			$this->render_field();
		}

		if ( ! $echo ) {
			return ob_get_clean();
		}
	}

	/**
	 * The child class must override this method and sets the field's subfields.
	 *
	 * TODO: Should be abstract and protected.
	 *
	 * @return array
	 */
	public function sub_fields() {
		return array();
	}

	/**
	 * Outputs the form field in the admin.
	 *
	 * @return void
	 */
	protected function render_field() {
		$_sub_fields = apply_filters(
			'wcapf_field_sub_fields',
			$this->sub_fields(),
			$this->type(),
			$this->get_instance()
		);

		$sub_fields  = wp_list_sort( $_sub_fields, 'position' );
		$instance    = $this->get_instance();
		$field_index = $this->get_field_index();

		$field_name_prefix = 'wcapf-fields[' . $this->type() . '][' . $field_index . ']';

		echo '<div class="wcapf-form-field wcapf-form-field-' . esc_attr( $this->type() ) . '">';

		foreach ( $sub_fields as $_data ) {
			$data = $this->merge_data( $_data );

			$data['id']    = 'wcapf-input-' . $data['id'] . '-' . $field_index;
			$data['value'] = isset( $instance[ $data['name'] ] ) ? $instance[ $data['name'] ] : $data['default'];
			$data['name']  = $field_name_prefix . '[' . $data['name'] . ']';

			$this->get_field( $data );
		}

		$this->get_field_position_input( $field_name_prefix );

		echo '</div>';
	}

	/**
	 * The extended classes should set the field type.
	 */
	abstract protected function type();

	/**
	 * Gets the field's instance.
	 *
	 * @return array
	 */
	public function get_instance() {
		return $this->instance;
	}

	/**
	 * Gets the field index.
	 *
	 * @return int|string
	 */
	private function get_field_index() {
		if ( $this->placeholder ) {
			$index = '%%';
		} else {
			$index = self::$count - 1;
		}

		return $index;
	}

	/**
	 * Merges the form field data with the default data.
	 *
	 * @param array $data The field data.
	 *
	 * @return array
	 */
	private function merge_data( $data ) {
		$default_data = apply_filters(
			'wcapf_widget_field_default_data',
			array(
				'type'    => '',
				'id'      => '',
				'label'   => '',
				'name'    => '',
				'value'   => '',
				'options' => array(),
				'default' => '',
				'class'   => '',
			)
		);

		return wp_parse_args( $data, $default_data );
	}

	/**
	 * Renders the HTML markup for the widget field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	protected function get_field( $data ) {
		$type = $data['type'];

		switch ( $type ) {
			case 'text':
				$this->field_text( $data );
				break;

			case 'select':
				$this->field_select( $data );
				break;

			case 'checkbox':
				$this->field_checkbox( $data );
				break;

			case 'radio':
				$this->field_radio( $data );
				break;
		}
	}

	/**
	 * Renders the HTML markup for the text field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_text( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<?php $this->field_label( $data ); ?>

			<div class="wcapf-wrapper">
				<input
					class="widefat"
					id="<?php echo esc_attr( $id ); ?>"
					name="<?php echo esc_attr( $name ); ?>"
					type="text"
					value="<?php echo esc_attr( $value ); ?>"
				>
			</div>
		</div>
		<?php
	}

	/**
	 * Gets the field classes.
	 *
	 * @param array $data The field data.
	 *
	 * @return string
	 */
	private function field_classes( $data ) {
		$type  = $data['type'];
		$class = $data['class'];

		$classes = 'wcapf-form-sub-field wcapf-form-sub-field-' . $type;

		if ( $class ) {
			$classes .= ' wcapf-widget-sub-field-' . $class;
		}

		return $classes;
	}

	/**
	 * Renders the HTML markup for the field label.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_label( $data ) {
		$id    = $data['id'];
		$label = $data['label'];
		?>
		<div class="wcapf-form-sub-field-label">
			<label for="<?php echo esc_attr( $id ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>
		</div>
		<?php
	}

	/**
	 * Renders the HTML markup for the select field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_select( $data ) {
		$id      = $data['id'];
		$name    = $data['name'];
		$value   = strval( $data['value'] );
		$options = $data['options'];
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<?php $this->field_label( $data ); ?>

			<div class="wcapf-wrapper">
				<select
					class="widefat"
					id="<?php echo esc_attr( $id ); ?>"
					name="<?php echo esc_attr( $name ); ?>"
				>
					<?php foreach ( $options as $_key => $label ) : ?>
						<option
							value="<?php echo esc_attr( $_key ); ?>"
							class="<?php echo esc_attr( $_key ); ?>"
							<?php selected( $value, strval( $_key ) ); ?>>
							<?php echo esc_html( $label ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>
		</div>
		<?php
	}

	/**
	 * Renders the HTML markup for the checkbox field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_checkbox( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<?php $this->field_label( $data ); ?>

			<div class="wcapf-wrapper">
				<input
					id="<?php echo esc_attr( $id ); ?>"
					name="<?php echo esc_attr( $name ); ?>"
					type="checkbox"
					value="1"
					<?php checked( $value, 1 ); ?>
				>
			</div>
		</div>
		<?php
	}

	/**
	 * Renders the HTML markup for the radio field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_radio( $data ) {
		$id        = $data['id'];
		$name      = $data['name'];
		$value     = $data['value'];
		$options   = $data['options'];
		$increment = 0;
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<?php $this->field_label( $data ); ?>

			<div class="wcapf-wrapper">
				<?php foreach ( $options as $key => $label ) : ?>
					<?php $input_id = 0 === $increment ? $id : $id . '-' . $key; ?>
					<div>
						<label>
							<input
								id="<?php echo esc_attr( $input_id ); ?>"
								name="<?php echo esc_attr( $name ); ?>"
								type="radio"
								value="<?php echo esc_attr( $key ); ?>"
								<?php checked( $value, $key ); ?>
							>
							<?php echo esc_html( $label ); ?>
						</label>
					</div>
					<?php $increment++; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}

	/**
	 * The hidden input element for field's position.
	 *
	 * @param string $field_name_prefix The field name prefix.
	 *
	 * @return void
	 */
	private function get_field_position_input( $field_name_prefix ) {
		$instance            = $this->get_instance();
		$field_index         = $this->get_field_index();
		$position_field_id   = 'wcapf-input-position-' . $field_index;
		$position_field_name = $field_name_prefix . '[position]';
		$field_position      = isset( $instance['position'] ) ? $instance['position'] : $field_index;
		// todo: the field should be hidden.
		?>
		<input
			type="text"
			id="<?php echo esc_attr( $position_field_id ); ?>"
			name="<?php echo esc_attr( $position_field_name ); ?>"
			value="<?php echo esc_attr( $field_position ); ?>"
		>
		<?php
	}

	/**
	 * Renders the field's start markup.
	 *
	 * @param array  $args         Widget arguments.
	 * @param array  $instance     Saved values from the database.
	 * @param string $widget_class The widget class.
	 *
	 * @return void
	 */
	protected function before_widget( $args, $instance, $widget_class ) {
		$before_widget = $args['before_widget'];

		// No class found, so add it.
		if ( strpos( $before_widget, 'class' ) === false ) {
			$before_widget = str_replace( '>', 'class="' . $widget_class . '"', $before_widget );
		} else { // Class found but not the one that we need, so add it.
			$before_widget = str_replace( 'class="', 'class="' . $widget_class . ' ', $before_widget );
		}

		echo $before_widget; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped

		if ( ! empty( $instance['title'] ) ) {
			// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
			// phpcs:enable
		}
	}

	/**
	 * Renders the widget's end markup.
	 *
	 * @param array $args Widget arguments.
	 *
	 * @return void
	 */
	protected function after_widget( $args ) {
		echo $args['after_widget']; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
	}

}
