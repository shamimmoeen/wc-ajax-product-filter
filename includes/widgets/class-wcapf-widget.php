<?php
/**
 * WCAPF_Widget class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

/**
 * WCAPF_Widget class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Widget extends WP_Widget {

	/**
	 * Output widget form.
	 *
	 * @param array $instance Saved values from the database.
	 */
	public function form( $instance ) {
		if ( ! $this->widget_fields() ) {
			esc_html_e( 'No settings are required', 'wc-ajax-product-filter' );
		} else {
			$this->render_form( $instance );
		}
	}

	/**
	 * The child class must override this method and sets the widget form fields.
	 *
	 * @return array
	 */
	protected function widget_fields() {
		return array();
	}

	/**
	 * Outputs the widget form in the admin.
	 *
	 * @param array $instance Saved values from the database.
	 *
	 * @return void
	 */
	protected function render_form( $instance ) {
		$_fields = apply_filters( 'wcapf_widget_fields', $this->widget_fields(), $instance, $this->id_base );
		$fields  = wp_list_sort( $_fields, 'position' );

		echo '<div class="wcapf-widget-' . esc_attr( $this->id_base ) . '">';

		foreach ( $fields as $_data ) {
			$data          = $this->merge_data( $_data );
			$value         = isset( $instance[ $data['instance_id'] ] ) ? $instance[ $data['instance_id'] ] : null;
			$data['value'] = $value ? $value : $data['default'];
			$this->get_field( $data );
		}

		echo '</div>';
	}

	/**
	 * Merges the widget field data with the default data.
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
			)
		);

		$data = wp_parse_args( $data, $default_data );

		$data['instance_id'] = $data['id'];
		$data['id']          = $this->get_field_id( $data['id'] );
		$data['name']        = $this->get_field_name( $data['name'] );

		return $data;
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

			case 'script':
				$this->render_script( $data );
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
	 * Gets the widget field classes.
	 *
	 * @param array $data The widget field data.
	 *
	 * @return string
	 */
	private function field_classes( $data ) {
		$type        = $data['type'];
		$instance_id = $data['instance_id'];

		return 'wcapf-widget-field wcapf-widget-field-' . $type . ' wcapf-widget-field-' . $instance_id;
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
		<label for="<?php echo esc_attr( $id ); ?>">
			<?php echo esc_html( $label ); ?>:
		</label>
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
		$label = $data['label'];
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<div class="<?php echo esc_attr( $this->field_classes( $data ) ); ?>">
			<div class="wcapf-wrapper wcapf-checkbox-wrapper">
				<label>
					<input
						id="<?php echo esc_attr( $id ); ?>"
						name="<?php echo esc_attr( $name ); ?>"
						type="checkbox"
						value="1"
						<?php checked( $value, 1 ); ?>
					>
					<?php echo esc_html( $label ); ?>
				</label>
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
	 * Renders the javascript.
	 *
	 * @param array $data The widget field data.
	 *
	 * @return void
	 */
	private function render_script( array $data ) {
		$script = isset( $data['script'] ) ? $data['script'] : '';

		if ( ! $script ) {
			return;
		}

		echo $script; // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Renders the widget's start markup.
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
