<?php
/**
 * WCAPF_Field class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
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
		self::$count ++;
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

		$this->render_field();

		if ( ! $echo ) {
			return ob_get_clean();
		}
	}

	/**
	 * Outputs the form field in the admin area.
	 *
	 * @return void
	 */
	protected function render_field() {
		$groups = wp_list_sort( $this->get_group_fields(), 'position' );

		$instance    = $this->get_instance();
		$field_index = $this->get_field_index();
		$type        = $this->type();

		$field_name_prefix = 'wcapf-fields[' . $type . '][' . $field_index . ']';

		echo '<div class="wcapf-form-field wcapf-form-field-' . esc_attr( $type ) . '">';

		// TODO: Add hook.
		do_action( 'wcapf_before_render_field_subfields', $type, $instance );

		if ( $groups ) {

			foreach ( $groups as $group ) {
				$group_name  = isset( $group['name'] ) ? $group['name'] : '';
				$group_class = isset( $group['class'] ) ? $group['class'] : '';

				if ( 'group_start_wrapper' === $group_name ) {
					$classes = $group_name;
					$classes .= $group_class ? ' ' . $group_class : '';

					echo '<div class="' . esc_attr( $classes ) . '">';

					continue;
				}

				if ( 'group_end_wrapper' === $group_name ) {
					echo '</div>';

					continue;
				}

				$group_heading = isset( $group['heading'] ) ? $group['heading'] : '';
				$row_class     = isset( $group['row_class'] ) ? $group['row_class'] : '';
				$group_columns = isset( $group['columns'] ) ? $group['columns'] : array();
				$group_classes = 'column-start column-group-' . $group_name;

				$group_classes .= $group_class ? ' ' . $group_class : '';

				echo '<div class="' . esc_attr( $group_classes ) . '">';

				if ( $group_heading ) {
					echo '<h4 class="no-top-margin">' . esc_html( $group_heading ) . '</h4>';
				}

				if ( $group_columns ) {
					$row_classes = 'column-start row';

					$row_classes .= $row_class ? ' ' . $row_class : '';

					echo '<div class="' . $row_classes . '">';

					// TODO: Add hook.
					do_action( 'wcapf_before_render_field_row', $type, $instance );

					foreach ( $group_columns as $columns ) {
						$columns = wp_list_sort( $columns, 'position' );

						echo '<div class="column-start column">';
						$this->render_sub_fields( $columns, $field_index, $instance, $field_name_prefix );
						echo '</div>';
					}

					// TODO: Add hook.
					do_action( 'wcapf_after_render_field_row', $type, $instance );

					echo '</div>';
				}

				echo '</div>';
			}

		} else {
			echo '<p class="wcapf-form-field-no-settings">';
			esc_html_e( 'No settings are required.', 'wc-ajax-product-filter' );
			echo '</p>';
		}

		// TODO: Add hook.
		do_action( 'wcapf_after_render_field_subfields', $type, $instance );

		$this->get_field_position_input( $field_name_prefix );

		echo '</div>';
	}

	/**
	 * Gets the field group fields.
	 *
	 * @return array
	 */
	public function get_group_fields() {
		$group_fields = $this->field_groups();

		if ( ! is_array( $group_fields ) ) {
			$group_fields = array();
		}

		// Include the title group fields.
		$group_fields = array_merge( $this->fields_title_group(), $group_fields );

		return apply_filters( 'wcapf_field_group_fields', $group_fields, $this->type() );
	}

	// TODO: Make it abstract.
	protected function field_groups() {
		return array();
	}

	/**
	 * The title group fields.
	 *
	 * @return array[]
	 */
	private function fields_title_group() {
		return array(
			array(
				'name'     => 'title',
				'position' => 5,
				'columns'  => array( $this->title_group_columns() ),
			),
		);
	}

	/**
	 * The title group columns.
	 *
	 * @return array[]
	 */
	protected function title_group_columns() {
		return array(
			array(
				'type'     => 'text',
				'id'       => 'title',
				'label'    => __( 'Title', 'wc-ajax-product-filter' ),
				'name'     => 'title',
				'position' => 5,
			),
		);
	}

	/**
	 * The extended classes should set the field type.
	 *
	 * @return string
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
	protected function get_field_index() {
		if ( $this->placeholder ) {
			$index = '%%';
		} else {
			$index = self::$count - 1;
		}

		return $index;
	}

	/**
	 * @param array  $sub_fields
	 * @param mixed  $field_index
	 * @param array  $instance
	 * @param string $field_name_prefix
	 *
	 * @return void
	 */
	protected function render_sub_fields( $sub_fields, $field_index, $instance, $field_name_prefix ) {
		foreach ( $sub_fields as $_data ) {
			$data = $this->merge_data( $_data );

			$data['_name'] = $data['name'];
			$data['id']    = 'wcapf-input-' . $data['id'] . '-' . $field_index;
			$data['value'] = $this->get_field_value( $instance, $data );
			$data['name']  = $field_name_prefix . '[' . $data['name'] . ']';

			$this->get_field( $data );
		}
	}

	/**
	 * Merges the form field data with the default data.
	 *
	 * @param array $data The field data.
	 *
	 * @return array
	 */
	protected function merge_data( $data ) {
		$default_data = apply_filters(
			'wcapf_widget_field_default_data',
			array(
				'type'    => '',
				'id'      => '',
				'label'   => '',
				'_name'   => '',
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
	 * @param array $instance
	 * @param array $data
	 *
	 * @return mixed
	 */
	private function get_field_value( $instance, $data ) {
		$type = $this->type();
		$name = $data['name'];

		$value = isset( $instance[ $name ] ) ? $instance[ $name ] : $data['default'];

		// Sets the product status options.
		if ( 'product_status_options' === $name ) {
			$encode = json_encode( $value );
			$value  = rawurlencode( $encode );
		}

		return apply_filters( 'wcapf_form_field_value', $value, $name, $type, $instance, $data );
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
			case 'hidden':
				$this->field_hidden( $data );
				break;

			case 'text':
				$this->field_text( $data );
				break;

			case 'limit_values':
				$this->field_limit_values( $data );
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

			case 'html':
				$this->field_template( $data );
				break;

			case 'column-start':
				$this->column_start( $data );
				break;

			case 'column-end':
				$this->column_end();
				break;
		}
	}

	/**
	 * Renders the hidden input field.
	 *
	 * @return void
	 */
	private function field_hidden( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<input
				class="widefat"
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				type="hidden"
				value="<?php echo esc_attr( $value ); ?>"
			>
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
		$_name = $data['_name'];
		$class = $data['class'];

		$classes = 'wcapf-form-sub-field wcapf-form-sub-field-' . $type . ' wcapf-form-sub-field-' . $_name;

		if ( $class ) {
			$classes .= ' wcapf-form-sub-field-' . $class;
		}

		return $classes;
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
	 * Renders the field label.
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
	 * Renders the HTML markup for the limit values field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_limit_values( $data ) {
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
				<button type="button" class="button button-small limit-values-btn">
					<span class="dashicons dashicons-search"></span>
				</button>
			</div>
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
					<?php $increment ++; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Renders the html template inside field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 */
	private function field_template( $data ) {
		$template_name = isset( $data['template'] ) ? $data['template'] : '';

		if ( ! $template_name ) {
			return;
		}

		WCAPF_Template_Loader::get_instance()->load( $template_name, array( 'instance' => $this->get_instance() ) );
	}

	/**
	 * Renders the column start markup.
	 *
	 * @return void
	 */
	private function column_start( $data ) {
		$col_classes = isset( $data['classes'] ) ? 'column-start ' . $data['classes'] : 'column-start';

		echo '<!-- column start -->';
		echo '<div class="' . esc_attr( $col_classes ) . '">';
	}

	/**
	 * Renders the column start markup.
	 *
	 * @return void
	 */
	private function column_end() {
		echo '</div><!-- column end -->';
	}

	/**
	 * The hidden input element for field's position.
	 *
	 * @param string $field_name_prefix The field name prefix.
	 *
	 * @return void
	 */
	protected function get_field_position_input( $field_name_prefix ) {
		$instance            = $this->get_instance();
		$field_index         = $this->get_field_index();
		$position_field_id   = 'wcapf-input-position-' . $field_index;
		$position_field_name = $field_name_prefix . '[position]';
		$field_position      = isset( $instance['position'] ) ? $instance['position'] : $field_index;
		?>
		<input
			type="hidden"
			id="<?php echo esc_attr( $position_field_id ); ?>"
			name="<?php echo esc_attr( $position_field_name ); ?>"
			value="<?php echo esc_attr( $field_position ); ?>"
		>
		<?php
	}

	/**
	 * Output the filter form for the field in the frontend.
	 *
	 * @return void
	 */
	public function filter_form() {
		$this->render_filter_form();
	}

	/**
	 * Output the field's filter form.
	 *
	 * @return void
	 */
	abstract protected function render_filter_form();

	/**
	 * Gets the field's subfields.
	 *
	 * @return array
	 */
	public function get_sub_fields() {
		$sub_fields   = array();
		$group_fields = $this->get_group_fields();

		foreach ( $group_fields as $group_field ) {
			$columns = isset( $group_field['columns'] ) ? $group_field['columns'] : array();

			foreach ( $columns as $column ) {
				foreach ( $column as $column_field ) {
					$sub_fields[] = $column_field;
				}
			}
		}

		return apply_filters( 'wcapf_field_sub_fields', $sub_fields, $this->type() );
	}

	/**
	 * Renders the field's start markup.
	 *
	 * @param array $classes The field classes.
	 *
	 * @return void
	 */
	protected function before_filter_form( $classes ) {
		array_unshift( $classes, 'wcapf-field-filter-form' );

		$field_classes = implode( ' ', $classes );
		$field_id      = $this->get_filter_form_id();
		$field_title   = $this->get_sub_field_value( 'title' );

		echo '<div class="' . esc_attr( $field_classes ) . '" id="' . esc_attr( $field_id ) . '">';

		if ( $field_title ) {
			echo '<h4 class="wcapf-field-title">' . esc_html( $field_title ) . '</h4>';
		}
	}

	/**
	 * Get the field's filter form id.
	 *
	 * @return string
	 */
	private function get_filter_form_id() {
		return 'wcapf-filter-by-' . $this->type() . '-' . $this->get_field_index();
	}

	/**
	 * Get the field's subfield value.
	 *
	 * TODO: Add default parameter.
	 *
	 * @param string $name The subfield name.
	 *
	 * @return mixed
	 */
	protected function get_sub_field_value( $name ) {
		$instance = $this->get_instance();

		return isset( $instance[ $name ] ) ? $instance[ $name ] : '';
	}

	/**
	 * Renders the field's end markup.
	 *
	 * @return void
	 */
	protected function after_filter_form() {
		echo '</div>';
	}

}
