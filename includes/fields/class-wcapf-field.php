<?php
/**
 * WCAPF_Field class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     wptools.io
 */

/**
 * WCAPF_Field class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Field {

	/**
	 * The field's instance.
	 *
	 * @var array
	 */
	protected $instance;

	/**
	 * The constructor.
	 *
	 * @param array $instance The field's instance.
	 */
	public function __construct( $instance = array() ) {
		$this->instance = $instance;
	}

	/**
	 * Output form field.
	 *
	 * @param bool $echo Determines if we echo the field or not.
	 *
	 * @return string|void
	 */
	public function form( $echo = true ) {
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

		$instance = $this->get_instance();
		$type     = $this->type();

		echo '<div class="wcapf-form-field wcapf-form-field-' . esc_attr( $type ) . '">';

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

					foreach ( $group_columns as $columns ) {
						$columns = wp_list_sort( $columns, 'position' );

						echo '<div class="column-start column">';
						$this->render_sub_fields( $columns );
						echo '</div>';
					}

					echo '</div>';
				}

				echo '</div>';
			}

		} else {
			echo '<p class="wcapf-form-field-no-settings">';
			esc_html_e( 'No settings are required.', 'wc-ajax-product-filter' );
			echo '</p>';
		}

		do_action( 'wcapf_after_render_field_subfields', $type, $instance );

		$this->get_field_type_input();

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

	/**
	 * Abstract method to set the field groups from the child classes.
	 *
	 * @return array
	 */
	abstract protected function field_groups();

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
		$type = $this->type();

		$fields = array(
			array(
				'type'     => 'checkbox',
				'id'       => 'show_title',
				'label'    => __( 'Show Title', 'wc-ajax-product-filter' ),
				'name'     => 'show_title',
				'default'  => '1',
				'position' => 5,
			),
		);

		$show_field_key_in_title_group = apply_filters( 'wcapf_show_field_key_in_title_group', true, $type );
		$field_types_with_key_required = WCAPF_Helper::field_types_with_key_required();

		if ( $show_field_key_in_title_group && in_array( $type, $field_types_with_key_required ) ) {
			$fields = array_merge( $fields, array( $this->get_field_key_data() ) );
		}

		return $fields;
	}

	/**
	 * The extended classes should set the field type.
	 *
	 * @return string
	 */
	abstract protected function type();

	/**
	 * @return array
	 */
	protected function get_field_key_data() {
		return array(
			'type'     => 'text',
			'id'       => 'field_key',
			'label'    => __( 'Filter Key', 'wc-ajax-product-filter' ),
			'name'     => 'field_key',
			'default'  => $this->get_default_field_key(),
			'position' => 15,
		);
	}

	/**
	 * The default field key. Prepend dash to avoid conflicting with the registered taxonomies.
	 *
	 * @return string
	 */
	private function get_default_field_key() {
		$type = $this->type();

		switch ( $type ) {
			case 'category':
				$key = '_product_cat';
				break;

			case 'tag':
				$key = '_product_tag';
				break;

			case 'product-status':
				$key = '_status';
				break;

			default:
				$key = '_' . $type;
				break;
		}

		return apply_filters( 'wcapf_field_default_key', $key, $type );
	}

	/**
	 * Gets the field's instance.
	 *
	 * @return array
	 */
	public function get_instance() {
		return $this->instance;
	}

	/**
	 * @param array $sub_fields
	 *
	 * @return void
	 */
	protected function render_sub_fields( $sub_fields ) {
		foreach ( $sub_fields as $_data ) {
			$data = $this->merge_data( $_data );

			$name          = $data['name'];
			$data['_name'] = $name;
			$data['id']    = 'wcapf-input-' . $data['id'];
			$data['value'] = $this->get_field_value( $data );
			$data['name']  = 'field[' . $name . ']';

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
	 * @param array $data
	 *
	 * @return mixed
	 */
	private function get_field_value( $data ) {
		$instance = $this->get_instance();
		$type     = $this->type();
		$name     = $data['name'];

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

			case 'hidden_manual_options':
				$this->hidden_manual_options( $data );
				break;

			case 'text':
				$this->field_text( $data );
				break;

			case 'limit_values':
				$this->field_limit_values( $data );
				break;

			case 'user_roles':
				$this->field_user_roles( $data );
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
	 * Renders the hidden manual options field.
	 *
	 * @return void
	 */
	private function hidden_manual_options( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		$table = isset( $data['table'] ) ? $data['table'] : '';
		$tmpl  = isset( $data['tmpl'] ) ? $data['tmpl'] : '';
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<input
				class="widefat manual_options"
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				type="hidden"
				value="<?php echo esc_attr( $value ); ?>"
				data-table="<?php echo esc_attr( $table ); ?>"
				data-tmpl="<?php echo esc_attr( $tmpl ); ?>"
			>
		</div>
		<?php
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
					<?php echo 'field_key' === $data['_name'] ? 'autocomplete="off"' : ''; ?>
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
	 * Renders the HTML markup for the user roles field.
	 *
	 * @param array $data The field data.
	 *
	 * @return void
	 *
	 * @since 3.3.0
	 */
	private function field_user_roles( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		$value = is_array( $value ) ? $value : array();

		$user_roles = WCAPF_Product_Filter_Utils::get_user_roles();
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<?php $this->field_label( $data ); ?>

			<div class="wcapf-wrapper">
				<?php foreach ( $user_roles as $role => $label ) : ?>
					<label>
						<input
							type="checkbox"
							id="<?php echo esc_attr( $id ); ?>"
							name="<?php echo esc_attr( $name ); ?>[]"
							value="<?php echo esc_attr( $role ); ?>"
							<?php echo in_array( $role, $value ) ? 'checked="checked"' : ''; ?>
						>
						<?php echo esc_html( $label ); ?>
					</label>
				<?php endforeach; ?>
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
		$value     = $data['value'] ?: $data['default'];
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
	 * The hidden input element for field type.
	 *
	 * @return void
	 */
	protected function get_field_type_input() {
		?>
		<input
			type="hidden"
			name="field[type]"
			value="<?php echo esc_attr( $this->type() ); ?>"
		>
		<?php
	}

	/**
	 * Output the filter form for the field in the frontend.
	 *
	 * @return void
	 */
	public function filter_form() {
		/**
		 * TODO: Maybe show the preview in the backend also.
		 */
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

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
	 * @noinspection PhpUnused
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
	 * @return void
	 */
	protected function render_taxonomy_filter() {
		$field_instance = new WCAPF_Field_Instance( $this->get_instance() );

		$walker = new WCAPF_Walker( $field_instance );

		$filter = new WCAPF_Filter_Type_Taxonomy( $field_instance );
		$items  = $filter->get_items();

		$classes = array( 'wcapf-nav-filter' );

		if ( $field_instance->hierarchical && $field_instance->enable_hierarchy_accordion ) {
			$classes[] = 'hierarchy-accordion';
		}

		if ( ! $items ) {
			$classes[] = 'wcapf-field-hidden';
		}

		$this->before_filter_form( $classes, $field_instance, $items );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_filter_form( $field_instance );
	}

	/**
	 * Renders the field's start markup.
	 *
	 * @param array                $classes        The field classes.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $items          The filter items.
	 *
	 * @return void
	 */
	protected function before_filter_form( $classes, $field_instance, $items = array() ) {
		array_unshift( $classes, 'wcapf-single-filter' );

		$classes[] = 'wcapf-' . $this->type() . '-filter';

		$classes = apply_filters( 'wcapf_field_classes', $classes, $field_instance, $items );

		$field_classes = implode( ' ', $classes );
		$show_title    = $this->get_sub_field_value( 'show_title' );
		$filter_id     = $this->get_sub_field_value( 'field_id' );
		$filter_title  = get_the_title( $filter_id );

		echo '<div class="' . esc_attr( $field_classes ) . '" data-id="' . esc_attr( $filter_id ) . '">';

		do_action( 'wcapf_content_field_inner_start', $field_instance );

		$heading = '';

		if ( $show_title ) {
			$heading = '<h4 class="wcapf-field-title">' . esc_html( $filter_title ) . '</h4>';
		}

		echo apply_filters( 'wcapf_field_heading', $heading, $field_instance );

		$field_inner_attributes = apply_filters( 'wcapf_field_inner_attributes', '', $field_instance );

		echo '<div class="wcapf-field-inner"' . $field_inner_attributes . '>';
	}

	/**
	 * Get the field's subfield value.
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
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	protected function after_filter_form( $field_instance ) {
		echo '</div>'; // Ends .wcapf-field-inner

		do_action( 'wcapf_content_field_inner_end', $field_instance );

		echo '</div>';
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $range_min_max  The filter range min, max value.
	 *
	 * @return void
	 */
	protected function render_range_number_filter( $field_instance, $range_min_max ) {
		$display_type = $field_instance->display_type;

		if ( 'range_slider' === $display_type ) {
			$template = 'public/filter-range-slider';
		} else {
			$template = 'public/filter-range-number';
		}

		$range_min_value       = $this->get_sub_field_value( 'min_value' );
		$range_max_value       = $this->get_sub_field_value( 'max_value' );
		$step                  = $this->get_sub_field_value( 'step' );
		$range_min_auto_detect = $this->get_sub_field_value( 'min_value_auto_detect' );
		$range_max_auto_detect = $this->get_sub_field_value( 'max_value_auto_detect' );
		$value_prefix          = $this->get_sub_field_value( 'value_prefix' );
		$value_postfix         = $this->get_sub_field_value( 'value_postfix' );
		$values_separator      = $this->get_sub_field_value( 'values_separator' );
		$decimal_places        = $this->get_sub_field_value( 'decimal_places' );
		$thousand_separator    = $this->get_sub_field_value( 'thousand_separator' );
		$decimal_separator     = $this->get_sub_field_value( 'decimal_separator' );
		$display_values_as     = $this->get_sub_field_value( 'number_range_slider_display_values_as' );
		$align_at_the_end      = $this->get_sub_field_value( 'align_values_at_the_end' );

		if ( $range_min_auto_detect ) {
			$range_min_value = isset( $range_min_max['min'] ) ? $range_min_max['min'] : '';
		}

		if ( $range_max_auto_detect ) {
			$range_max_value = isset( $range_min_max['max'] ) ? $range_min_max['max'] : '';
		}

		$filter_key  = $field_instance->filter_key;
		$filter_type = $field_instance->filter_type;
		$filter_id   = $field_instance->filter_id;

		$chosen_filters = WCAPF_Helper::get_chosen_filters();
		$filters        = isset( $chosen_filters[ $filter_type ] ) ? $chosen_filters[ $filter_type ] : array();
		$filter         = isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();
		$values         = isset( $filter['values'] ) ? $filter['values'] : array();

		if ( WCAPF_Helper::round_range_min_max_values( $field_instance ) ) {
			$range_min_value = floor( $range_min_value );
			$range_max_value = ceil( $range_max_value );
		}

		if ( $range_min_value > $range_max_value ) {
			$range_max_value = $range_min_value;
		}

		if ( 2 === count( $values ) ) {
			$min_value = $values[0];
			$max_value = $values[1];
		} else {
			$min_value = $range_min_value;
			$max_value = $range_max_value;
		}

		$min_value = floatval( $min_value );
		$max_value = floatval( $max_value );

		if ( $min_value > $max_value ) {
			$max_value = $min_value;
		}

		$step = apply_filters( 'wcapf_filter_range_step', $step, $min_value, $max_value, $field_instance );

		$slider_id = $filter_key . '-slider-' . $filter_id;

		$data = array(
			'filter_key'         => $filter_key,
			'min_value'          => $min_value,
			'max_value'          => $max_value,
			'range_min_value'    => $range_min_value,
			'range_max_value'    => $range_max_value,
			'step'               => $step,
			'value_prefix'       => $value_prefix,
			'value_postfix'      => $value_postfix,
			'values_separator'   => $values_separator,
			'decimal_places'     => $decimal_places,
			'thousand_separator' => $thousand_separator,
			'decimal_separator'  => $decimal_separator,
			'slider_id'          => $slider_id,
			'display_values_as'  => $display_values_as,
			'align_at_the_end'   => $align_at_the_end,
		);

		WCAPF_Template_Loader::get_instance()->load( $template, $data );
	}

}
