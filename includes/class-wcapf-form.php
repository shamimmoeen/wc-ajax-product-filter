<?php
/**
 * The filter form class.
 *
 * @since      4.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WCAPF_Form class.
 *
 * @since 4.0.0
 */
class WCAPF_Form {

	/**
	 * The form array.
	 *
	 * @var array
	 */
	protected $form;

	/**
	 * Initializes the form instance.
	 *
	 * Retrieves the current form data and stores it for later use during
	 * frontend rendering.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->form = $this->retrieve_form();
	}

	/**
	 * Retrieves the current form data.
	 *
	 * Reads the active form data from the global form variable prepared by the
	 * plugin before rendering.
	 *
	 * @return array Form data.
	 */
	protected function retrieve_form() {
		global $wcapf_form;

		return $wcapf_form;
	}

	/**
	 * Renders the filter form on the frontend.
	 *
	 * Outputs the full form markup, including all configured filters and
	 * components for the form instance.
	 *
	 * @return void
	 */
	public function render_form() {
		if ( ! $this->should_we_proceed() ) {
			return;
		}

		$form_id = isset( $this->form['form_id'] ) ? $this->form['form_id'] : '';

		$form_classes = 'wcapf-form wcapf-form-' . sanitize_html_class( $form_id );

		printf(
			'<div class="%1$s" data-id="%2$s">',
			esc_attr( $form_classes ),
			esc_attr( $form_id )
		);

		do_action( 'wcapf_before_form_filters', $form_id );

		$filters = isset( $this->form['filters'] ) ? $this->form['filters'] : array();
		$filters = apply_filters( 'wcapf_form_filters', $filters, $this->form );

		$number_input_types = WCAPF_Helper::number_input_display_types();

		foreach ( $filters as $filter ) {
			$field_data = isset( $filter['field'] ) ? $filter['field'] : array();

			if ( empty( $field_data ) || ! is_array( $field_data ) ) {
				continue;
			}

			$field_instance = new WCAPF_Field_Instance( $field_data );
			$field_type     = $field_instance->type;

			if ( ! $field_type ) {
				continue;
			}

			if ( 'component' === $field_type ) {
				$this->render_components( $field_instance );
			} elseif (
				'price' === $field_type &&
				in_array( $field_instance->display_type, $number_input_types, true )
			) {
				$this->render_price_filter( $field_instance );
			} elseif ( 'keyword' === $field_type ) {
				$this->render_keyword_filter( $field_instance );
			} else {
				$this->render_filter( $field_instance );
			}
		}

		if ( WCAPF_Helper::is_debug_mode_enabled() ) {
			$edit_url = WCAPF_Helper::form_edit_url( $form_id );

			if ( ! $filters ) {
				$message = sprintf(
					/* translators: %s: Form edit URL. */
					__(
						'The form is empty. Please add some filters by editing the form <a href="%s">here</a>.',
						'wc-ajax-product-filter'
					),
					esc_url( $edit_url )
				);

				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is escaped inside WCAPF_Helper::get_debug_message().
				echo WCAPF_Helper::get_debug_message( $message );
			} else {
				printf(
					'<p><a href="%1$s">%2$s</a></p>',
					esc_url( $edit_url ),
					esc_html__( 'Edit form', 'wc-ajax-product-filter' )
				);
			}
		}

		do_action( 'wcapf_after_form_filters', $form_id );

		echo '</div><!-- .wcapf-filter-form -->';

		$this->set_done();
	}

	/**
	 * Determines whether the form can be rendered.
	 *
	 * Prevents rendering when the form data is missing or the form has already
	 * been rendered.
	 *
	 * @return bool True if rendering should continue, otherwise false.
	 */
	private function should_we_proceed() {
		if ( ! $this->form ) {
			return false;
		}

		if ( isset( $this->form['rendered'] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Render the form components.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	protected function render_components( $field_instance ) {
		$component = $field_instance->get_sub_field_value( 'component' );

		if ( 'active-filters' === $component ) {
			$this->render_active_filters( $field_instance );
		} elseif ( 'reset-button' === $component ) {
			$this->render_reset_button( $field_instance );
		}
	}

	/**
	 * Renders the active filters.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function render_active_filters( $field_instance ) {
		$title            = $field_instance->get_sub_field_value( 'title' );
		$show_title       = $field_instance->get_sub_field_value( 'show_title' );
		$layout           = $field_instance->get_sub_field_value( 'active_filters_layout' );
		$empty_message    = $field_instance->get_sub_field_value( 'empty_filter_message' );
		$show_clear_btn   = $field_instance->get_sub_field_value( 'show_clear_btn' );
		$clear_btn_label  = WCAPF_Helper::clear_all_button_label();
		$clear_btn_layout = $field_instance->get_sub_field_value( 'clear_all_btn_layout' );

		$args = WCAPF_Helper::prepare_active_filters_args(
			array(
				'title'                => $title,
				'show_title'           => $show_title,
				'layout'               => $layout,
				'empty_message'        => $empty_message,
				'show_clear_btn'       => $show_clear_btn,
				'clear_all_btn_label'  => $clear_btn_label,
				'clear_all_btn_layout' => $clear_btn_layout,
			)
		);

		WCAPF_Template_Loader::get_instance()->load( 'active-filters', $args );
	}

	/**
	 * Renders the reset button.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function render_reset_button( $field_instance ) {
		$args = WCAPF_Helper::prepare_reset_button_args(
			array(
				'btn_label'   => WCAPF_Helper::reset_button_label(),
				'show_always' => $field_instance->get_sub_field_value( 'show_if_empty' ),
			)
		);

		WCAPF_Template_Loader::get_instance()->load( 'reset-button', $args );
	}

	/**
	 * Renders the price filter.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	protected function render_price_filter( $field_instance ) {
		$filter_type = new WCAPF_Filter_Type_Price( $field_instance );
		$range       = $filter_type->get_items();

		$this->before_filter( $field_instance );
		$this->render_number_inputs( $field_instance, $range );
		$this->after_filter();
	}

	/**
	 * Renders the opening markup for a filter.
	 *
	 * Outputs the wrapper and heading markup before the filter content is rendered.
	 *
	 * @param WCAPF_Field_Instance $field_instance Field instance.
	 *
	 * @return void
	 */
	protected function before_filter( $field_instance ) {
		$classes    = $this->get_filter_classes( $field_instance );
		$filter_id  = $field_instance->filter_id;
		$filter_key = $field_instance->filter_key;

		$show_title       = $field_instance->get_sub_field_value( 'show_title' );
		$filter_title     = $field_instance->get_sub_field_value( 'title' );
		$help_text        = $field_instance->get_sub_field_value( 'help_text' );
		$enable_accordion = $field_instance->get_sub_field_value( 'enable_accordion' );
		$accordion_state  = $field_instance->get_sub_field_value( 'accordion_default_state' );
		$show_clear_btn   = $field_instance->get_sub_field_value( 'show_clear_btn' );

		$filter_active = WCAPF_Helper::is_filter_active( $filter_key );

		if ( $filter_active && WCAPF_Helper::keep_accordion_opened_when_filter_active() ) {
			$accordion_state = 'expanded';
		}

		$is_expanded         = 'expanded' === $accordion_state ? 'true' : 'false';
		$accordion_header_id = 'wcapf-filter-accordion-header-' . $filter_id;
		$accordion_panel_id  = 'wcapf-filter-accordion-panel-' . $filter_id;

		$filter_classes = implode( ' ', $classes );

		if ( $field_instance->enable_soft_limit ) {
			printf(
				'<div class="%1$s" data-id="%2$s" data-visible-options="%3$s">',
				esc_attr( $filter_classes ),
				esc_attr( $filter_id ),
				esc_attr( $field_instance->soft_limit )
			);
		} else {
			printf(
				'<div class="%1$s" data-id="%2$s">',
				esc_attr( $filter_classes ),
				esc_attr( $filter_id )
			);
		}

		$title_classes = 'wcapf-filter-title';

		if ( $enable_accordion ) {
			$title_classes .= ' has-accordion';
		}

		WCAPF_Template_Loader::get_instance()->load(
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
				'title_classes'       => $title_classes,
				'title_for'           => '',
			)
		);

		if ( $enable_accordion ) {
			printf(
				'<div class="wcapf-filter-inner" id="%1$s" aria-labelledby="%2$s"%3$s>',
				esc_attr( $accordion_panel_id ),
				esc_attr( $accordion_header_id ),
				( 'false' === $is_expanded ) ? ' style="display: none;"' : ''
			);
		} else {
			echo '<div class="wcapf-filter-inner">';
		}
	}

	/**
	 * Retrieves CSS classes for a filter wrapper.
	 *
	 * Builds the filter wrapper classes based on the field type and its settings.
	 *
	 * @param WCAPF_Field_Instance $field_instance Field instance.
	 *
	 * @return array Filter wrapper classes.
	 */
	protected function get_filter_classes( $field_instance ) {
		$classes = array(
			'wcapf-filter',
			'wcapf-filter-' . sanitize_html_class( $field_instance->filter_id ),
		);

		$type = $field_instance->type;

		if ( 'taxonomy' === $type ) {
			$classes[] = 'wcapf-filter-taxonomy-' . sanitize_html_class( $field_instance->taxonomy );

			if ( $field_instance->enable_hierarchy_accordion ) {
				$classes[] = 'has-hierarchy-accordion';
			}
		} elseif ( 'post-meta' === $type ) {
			$classes[] = 'wcapf-filter-meta-' . sanitize_html_class( $field_instance->meta_key );
		} else {
			$classes[] = 'wcapf-filter-' . sanitize_html_class( $type );
		}

		if ( $field_instance->enable_soft_limit ) {
			$classes[] = 'has-soft-limit';
		}

		if ( 'keyword' === $type && WCAPF_Helper::get_applied_keyword() ) {
			$classes[] = 'search-active';
		}

		return $classes;
	}

	/**
	 * Renders number-based filter inputs.
	 *
	 * Outputs the range slider or number input UI for the filter using the
	 * provided min and max range values.
	 *
	 * @param WCAPF_Field_Instance $field_instance Field instance.
	 * @param array                $range_min_max  Range values containing min and max.
	 *
	 * @return void
	 */
	protected function render_number_inputs( $field_instance, $range_min_max ) {
		$display_type          = $field_instance->display_type;
		$display_values_as     = $field_instance->get_sub_field_value( 'number_range_slider_display_values_as' );
		$alignment             = $field_instance->get_sub_field_value( 'alignment' );
		$input_type_number     = $field_instance->get_sub_field_value( 'input_type_number' );
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
			$range_max_value = isset( $range_min_max['max'] ) ? $range_min_max['max'] : '';
		}

		$hide_inputs = apply_filters(
			'wcapf_hide_number_inputs_when_min_max_values_are_equal',
			'remove' === $field_instance->hide_empty
		);

		if ( $range_min_value === $range_max_value && $auto_detect && $hide_inputs ) {
			printf(
				'<div>%s</div>',
				esc_html( WCAPF_Helper::empty_filter_text() )
			);

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

		$min_value = (float) $min_value;
		$max_value = (float) $max_value;

		if ( $min_value > $max_value ) {
			$max_value = $min_value;
		}

		$step = apply_filters( 'wcapf_filter_range_step', $step, $min_value, $max_value, $field_instance );

		$slider_id    = $filter_key . '-slider-' . $filter_id;
		$slider_style = WCAPF_Helper::wcapf_option( 'number_range_slider_style' );

		$url_builder = new WCAPF_URL_Builder( $filter_key );

		$args = WCAPF_Helper::prepare_range_filter_args(
			array(
				'filter_id'             => $filter_id,
				'filter_key'            => $filter_key,
				'display_type'          => $display_type,
				'display_values_as'     => $display_values_as,
				'alignment'             => $alignment,
				'input_type_number'     => $input_type_number,
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
				'slider_style'          => $slider_style,
				'filter_url'            => $url_builder->get_range_url(),
				'clear_filter_url'      => $url_builder->get_clear_filter_url(),
			)
		);

		WCAPF_Template_Loader::get_instance()->load( 'range', $args );
	}

	/**
	 * Renders the filter's end markup.
	 *
	 * @return void
	 */
	protected function after_filter() {
		echo '</div>'; // Ends .wcapf-filter-inner
		echo '</div>'; // Ends .wcapf-filter
	}

	/**
	 * Renders the keyword filter.
	 *
	 * Outputs the keyword search filter for the current form.
	 *
	 * @since 4.1.0
	 *
	 * @param WCAPF_Field_Instance $field_instance Field instance.
	 *
	 * @return void
	 */
	protected function render_keyword_filter( $field_instance ) {
		$this->before_filter( $field_instance );

		$placeholder = WCAPF_Helper::wcapf_option(
			'keyword_filter_placeholder',
			__( 'Search products', 'wc-ajax-product-filter' )
		);
		$value       = WCAPF_Helper::get_applied_keyword();
		$with_cross  = true;

		$show_title     = $field_instance->get_sub_field_value( 'show_title' );
		$show_clear_btn = $field_instance->get_sub_field_value( 'show_clear_btn' );

		// Don't show the cross icon to clear the input field when clear button is enabled in filter heading.
		if ( $show_title && $show_clear_btn ) {
			$with_cross = false;
		}

		$filter_key  = $field_instance->filter_key;
		$url_builder = new WCAPF_URL_Builder( $filter_key );

		printf(
			'<div class="wcapf-keyword-filter-wrapper" data-filter-url="%1$s" data-clear-filter-url="%2$s">',
			esc_url( $url_builder->get_filter_url_with_placeholder() ),
			esc_url( $url_builder->get_clear_filter_url() )
		);

		$search_box_classes = 'wcapf-search-box with-icon icon-right';

		if ( $with_cross ) {
			$search_box_classes .= ' with-cross';
		}

		WCAPF_Template_Loader::get_instance()->load(
			'search-box',
			array(
				'placeholder'        => $placeholder,
				'value'              => $value,
				'icon_position'      => 'right',
				'with_cross'         => $with_cross,
				'search_box_classes' => $search_box_classes,
			)
		);

		echo '</div>';
		$this->after_filter();
	}

	/**
	 * Renders a standard filter.
	 *
	 * Supports taxonomy, rating, product status, post author, and post meta
	 * filters through the walker output.
	 *
	 * @param WCAPF_Field_Instance $field_instance Field instance.
	 *
	 * @return void
	 */
	protected function render_filter( $field_instance ) {
		$valid_types = array( 'taxonomy', 'rating', 'product-status', 'post-author', 'post-meta' );

		if ( ! in_array( $field_instance->filter_type, $valid_types, true ) ) {
			return;
		}

		$walker = new WCAPF_Walker( $field_instance );

		$this->before_filter( $field_instance );
		echo $walker->build_menu(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		$this->after_filter();
	}

	/**
	 * Marks the current form as rendered.
	 *
	 * Updates the global form state to prevent duplicate rendering.
	 *
	 * @return void
	 */
	protected function set_done() {
		global $wcapf_form;

		$wcapf_form['rendered'] = true;
	}
}
