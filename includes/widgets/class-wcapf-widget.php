<?php
/**
 * WCAPF_Widget class.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Widgets
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Widget class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Widget extends WP_Widget {

	/**
	 * Output widget form.
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		if ( ! $this->widget_fields() ) {
			esc_html_e( 'No settings are required', 'wc-ajax-product-filter' );
		} else {
			$this->render_form( $instance );
		}
	}

	protected function widget_fields() {
		return array();
	}

	protected function render_form( $instance ) {
		$_fields = apply_filters( 'wcapf_widget_fields', $this->widget_fields(), $instance, $this->id_base );
		$fields  = wp_list_sort( $_fields, 'position' );

		foreach ( $fields as $_data ) {
			$data          = $this->merge_data( $_data );
			$value         = isset( $instance[ $data['instance_id'] ] ) ? $instance[ $data['instance_id'] ] : null;
			$data['value'] = $value;
			$this->get_field( $data );
		}
	}

	private function merge_data( $data ) {
		$default_data = apply_filters( 'wcapf_widget_field_default_data', array(
			'type'    => '',
			'id'      => '',
			'label'   => '',
			'name'    => '',
			'value'   => '',
			'options' => array(),
		) );

		$data = wp_parse_args( $data, $default_data );

		$data['instance_id'] = $data['id'];
		$data['id']          = $this->get_field_id( $data['id'] );
		$data['name']        = $this->get_field_name( $data['name'] );

		return $data;
	}

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
		}
	}

	private function field_text( $data ) {
		$id    = $data['id'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<p>
			<?php $this->field_label( $data ); ?>
			<input
				class="widefat"
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				type="text"
				value="<?php echo esc_attr( $value ); ?>"
			>
		</p>
		<?php
	}

	private function field_label( $data ) {
		$id    = $data['id'];
		$label = $data['label'];
		?>
		<label for="<?php echo esc_attr( $id ); ?>">
			<?php echo esc_html( $label ); ?>:
		</label>
		<?php
	}

	private function field_select( $data ) {
		$id      = $data['id'];
		$name    = $data['name'];
		$value   = $data['value'];
		$options = $data['options'];
		?>
		<p>
			<?php $this->field_label( $data ); ?>
			<select
				class="widefat"
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
			>
				<?php foreach ( $options as $_key => $_value ) : ?>
					<?php
					$selected = $_key == $value ? 'selected="selected"' : '';
					?>
					<option
						value="<?php echo esc_attr( $_key ); ?>"
						<?php echo $selected; ?>
					><?php echo esc_html( $_value ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<?php
	}

	private function field_checkbox( $data ) {
		$id    = $data['id'];
		$label = $data['label'];
		$name  = $data['name'];
		$value = $data['value'];
		?>
		<p>
			<input
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				type="checkbox"
				value="1"
				<?php checked( $value, 1 ); ?>
			>
			<label for="<?php echo esc_attr( $id ); ?>">
				<?php echo esc_html( $label ); ?>
			</label>
		</p>
		<?php
	}

}
