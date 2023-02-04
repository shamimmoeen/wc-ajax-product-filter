<?php
/**
 * The filter form class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Form class.
 *
 * @since 4.0.0
 */
class WCAPF_Form {

	/**
	 * @var $form array
	 */
	private $form;

	public function __construct( $form = array() ) {
		if ( $form ) {
			$this->form = $form;
		} else {
			$this->form = $this->retrieve_form();
		}
	}

	private function retrieve_form() {
		global $wcapf_form;

		return $wcapf_form;
	}

	public function render_form() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$form_classes = 'wcapf-form wcapf-form-' . $this->form_id();

		echo '<div class="' . esc_attr( $form_classes ) . '" data-id="' . esc_attr( $this->form_id() ) . '">';

		do_action( 'wcapf_before_form_filters', $this->form_id() );

		if ( $this->get_property( 'show_active_filters' ) ) {
			$show_clear_btn       = $this->get_property( 'show_clear_btn' );
			$active_filters_label = __( 'Active Filters', 'wc-ajax-product-filters' );
			$clear_btn_label      = __( 'Clear All', 'wc-ajax-product-filters' );

			WCAPF_Template_Loader::get_instance()->load(
				'active-filters',
				array(
					'location'            => 'inside-form',
					'title'               => $active_filters_label,
					'show_clear_btn'      => $show_clear_btn,
					'clear_all_btn_label' => $clear_btn_label,
				)
			);
		}

		if ( $this->get_fields() ) {
			foreach ( $this->get_fields() as $field ) {
				$field_instance = new WCAPF_Field_Instance( $field['settings'] );
				$field_type     = $field_instance->type;

				if ( ! $field_type ) {
					continue;
				}

				if ( 'price' === $field_type ) {
					$this->render_price_filter( $field_instance );
				} else {
					$walker = new WCAPF_Walker( $field_instance );

					$this->before_filter( $field_instance );
					echo $walker->build_menu(); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
					$this->after_filter();
				}
			}
		}

		if ( $this->get_property( 'show_reset_button' ) ) {
			$reset_btn_label = __( 'Reset', 'wc-ajax-product-filters' );

			WCAPF_Template_Loader::get_instance()->load(
				'reset-button',
				array( 'btn_label' => $reset_btn_label )
			);
		}

		do_action( 'wcapf_after_form_filters', $this->form_id() );

		echo '</div><!-- .wcapf-filter-form -->';

		$this->set_done();
	}

	private function should_we_proceed() {
		if ( isset( $this->form['found'] ) ) {
			return false;
		}

		return true;
	}

	private function form_id() {
		return isset( $this->form['form_id'] ) ? $this->form['form_id'] : '';
	}

	private function get_property( $property ) {
		return isset( $this->form['settings'][ $property ] ) ? $this->form['settings'][ $property ] : '';
	}

	private function get_fields() {
		return isset( $this->form['filters'] ) ? $this->form['filters'] : array();
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_price_filter( $field_instance ) {
		$display_type = $field_instance->display_type;

		$walker = new WCAPF_Walker( $field_instance );

		$range_input_display_types = WCAPF_Helper::range_input_display_types();

		$items = apply_filters( 'wcapf_price_filter_items', array(), $field_instance );

		$this->before_filter( $field_instance );

		if ( in_array( $display_type, $range_input_display_types ) ) {
			$this->render_range_input_filter( $field_instance, $items );
		} else {
			echo $walker->build_menu(); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		}

		$this->after_filter();
	}

	/**
	 * Renders the filter's start markup.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function before_filter( $field_instance ) {
		$classes    = $this->get_filter_classes( $field_instance );
		$filter_id  = $field_instance->filter_id;
		$filter_key = $field_instance->filter_key;

		// TODO: Remove from free version.
		$filter_active = WCAPF_Product_Filter_Utils::is_filter_active( $filter_key );

		if ( $filter_active ) {
			$classes[] = 'filter-active';
		}

		$show_title       = $field_instance->get_sub_field_value( 'show_title' );
		$filter_title     = $field_instance->get_sub_field_value( 'title' );
		$help_text        = $field_instance->get_sub_field_value( 'help_text' );
		$enable_accordion = $field_instance->get_sub_field_value( 'enable_accordion' );
		$accordion_state  = $field_instance->get_sub_field_value( 'accordion_default_state' );
		$show_clear_btn   = $field_instance->get_sub_field_value( 'show_clear_btn' );

		if ( $filter_active && WCAPF_Helper::keep_accordion_opened_when_filter_active() ) {
			$accordion_state = 'expanded';
		}

		$is_expanded         = 'expanded' === $accordion_state ? 'true' : 'false';
		$accordion_header_id = 'wcapf-filter-accordion-header-' . $filter_id;
		$accordion_panel_id  = 'wcapf-filter-accordion-panel-' . $filter_id;

		$filter_classes = implode( ' ', $classes );

		$filter_start_wrapper = '<div';
		$filter_start_wrapper .= ' class="' . esc_attr( $filter_classes ) . '"';
		$filter_start_wrapper .= ' data-id="' . esc_attr( $filter_id ) . '"';

		if ( $field_instance->enable_soft_limit ) {
			$filter_start_wrapper .= ' data-visible-options="' . $field_instance->soft_limit . '"';
		}

		$filter_start_wrapper .= '>';

		echo $filter_start_wrapper;

		echo WCAPF_Template_Loader::get_instance()->load(
			'filter-title',
			array(
				'filter_key'          => $filter_key,
				'show_title'          => $show_title,
				'filter_title'        => $filter_title,
				'help_text'           => $help_text,
				'enable_accordion'    => $enable_accordion,
				'is_expanded'         => $is_expanded,
				'accordion_header_id' => $accordion_header_id,
				'accordion_panel_id'  => $accordion_panel_id,
				'show_clear_btn'      => $show_clear_btn,
			),
			false
		);

		$filter_inner_wrapper = '<div class="wcapf-filter-inner"';

		if ( $enable_accordion ) {
			$filter_inner_wrapper .= ' id="' . esc_attr( $accordion_panel_id ) . '"';
			$filter_inner_wrapper .= ' aria-labelledby="' . esc_attr( $accordion_header_id ) . '"';
			$filter_inner_wrapper .= 'false' === $is_expanded ? ' style="display: none;"' : '';
		}

		$filter_inner_wrapper .= '>';

		echo $filter_inner_wrapper;
	}

	/**
	 * Gets the filter wrapper classes.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return array
	 */
	private function get_filter_classes( $field_instance ) {
		$classes = array( 'wcapf-filter', 'wcapf-filter-' . $field_instance->filter_id );

		$type = $field_instance->type;

		if ( 'taxonomy' === $type ) {
			$classes[] = 'wcapf-filter-taxonomy-' . $field_instance->taxonomy;

			if ( $field_instance->enable_hierarchy_accordion ) {
				$classes[] = 'has-hierarchy-accordion';
			}
		} elseif ( 'post-meta' === $type ) {
			$classes[] = 'wcapf-filter-meta-' . $field_instance->meta_key;
		} else {
			$classes[] = 'wcapf-filter-' . $type;
		}

		if ( $field_instance->enable_soft_limit ) {
			$classes[] = 'has-soft-limit';
		}

		return $classes;
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $range_min_max  The filter range min, max value.
	 *
	 * @return void
	 */
	protected function render_range_input_filter( $field_instance, $range_min_max ) {
		$display_type          = $field_instance->display_type;
		$display_values_as     = $field_instance->get_sub_field_value( 'number_range_slider_display_values_as' );
		$alignment             = $field_instance->get_sub_field_value( 'alignment' );
		$auto_detect           = $field_instance->get_sub_field_value( 'auto_detect_min_max' );
		$range_min_value       = $field_instance->get_sub_field_value( 'min_value' );
		$range_max_value       = $field_instance->get_sub_field_value( 'max_value' );
		$step                  = $field_instance->get_sub_field_value( 'step' );
		$value_prefix          = $field_instance->get_sub_field_value( 'value_prefix' );
		$value_postfix         = $field_instance->get_sub_field_value( 'value_postfix' );
		$values_separator      = $field_instance->get_sub_field_value( 'values_separator' );
		$text_before_min_value = $field_instance->get_sub_field_value( 'text_before_min_value' );
		$text_before_max_value = $field_instance->get_sub_field_value( 'text_before_max_value' );
		$format_numbers        = $field_instance->get_sub_field_value( 'format_numbers' );
		$decimal_places        = $field_instance->get_sub_field_value( 'decimal_places' );
		$thousand_separator    = $field_instance->get_sub_field_value( 'thousand_separator' );
		$decimal_separator     = $field_instance->get_sub_field_value( 'decimal_separator' );

		if ( $auto_detect ) {
			$range_min_value = isset( $range_min_max['min'] ) ? $range_min_max['min'] : '';
		}

		if ( $auto_detect ) {
			$range_max_value = isset( $range_min_max['max'] ) ? $range_min_max['max'] : '';
		}

		$hide_range_input = apply_filters(
			'wcapf_hide_range_input_when_min_max_values_are_equal',
			'remove' === $field_instance->hide_empty
		);

		if ( $range_min_value === $range_max_value && $auto_detect && $hide_range_input ) {
			echo '<div>' . esc_html__( 'N/A', 'wc-ajax-product-filter' ) . '</div>';

			return;
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

		$url_builder = new WCAPF_URL_Builder( $filter_key );

		$data = array(
			'filter_id'             => $filter_id,
			'filter_key'            => $filter_key,
			'display_type'          => $display_type,
			'display_values_as'     => $display_values_as,
			'alignment'             => $alignment,
			'min_value'             => $min_value,
			'max_value'             => $max_value,
			'range_min_value'       => $range_min_value,
			'range_max_value'       => $range_max_value,
			'step'                  => $step,
			'value_prefix'          => $value_prefix,
			'value_postfix'         => $value_postfix,
			'values_separator'      => $values_separator,
			'text_before_min_value' => $text_before_min_value,
			'text_before_max_value' => $text_before_max_value,
			'format_numbers'        => $format_numbers,
			'decimal_places'        => $decimal_places,
			'thousand_separator'    => $thousand_separator,
			'decimal_separator'     => $decimal_separator,
			'slider_id'             => $slider_id,
			'filter_url'            => $url_builder->get_range_url(),
			'clear_filter_url'      => $url_builder->get_clear_filter_url(),
		);

		WCAPF_Template_Loader::get_instance()->load( 'range', $data );
	}

	/**
	 * Renders the filter's end markup.
	 *
	 * @return void
	 */
	private function after_filter() {
		echo '</div>'; // Ends .wcapf-filter-inner
		echo '</div>'; // Ends .wcapf-filter
	}

	private function set_done() {
		global $wcapf_form;

		$wcapf_form['found'] = true;
	}

}
