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
			$this->form = $this->get_form();
		}
	}

	public function get_form() {
		global $wcapf_form;

		return $wcapf_form;
	}

	public function render_form() {
		echo '<div class="wcapf-filter-form" id="' . $this->get_property( 'form_id' ) . '">';

		if ( $this->get_property( 'show_form_title' ) ) {
			echo '<h3>' . esc_html( $this->get_property( 'form_title' ) ) . '</h3>';
		}

		echo '<div class="wcapf-form-fields">';

		if ( $this->get_fields() ) {
			foreach ( $this->get_fields() as $field ) {
				$field_instance = new WCAPF_Field_Instance( $field['settings'] );
				$field_type     = $field_instance->type;

				// echo $field_type;

				if ( 'taxonomy' === $field_type ) {
					$this->render_taxonomy_field( $field_instance );
				} elseif ( 'price' === $field_type ) {
					$this->render_price_field( $field_instance );
				} elseif ( 'rating' === $field_type ) {
					$this->render_rating_field( $field_instance );
				} elseif ( 'product-status' === $field_type ) {
					$this->render_product_status_field( $field_instance );
				} elseif ( 'post-author' === $field_type ) {
					$this->render_post_author_field( $field_instance );
				} elseif ( 'post-meta' === $field_type ) {
					$this->render_post_meta_field( $field_instance );
				}
			}
		}

		if ( $this->get_property( 'show_reset_button' ) ) {
			echo '<div class="wcapf-reset-filters">';
			echo WCAPF_Helper::get_reset_filters_button_markup( $this->get_property( 'reset_button_label' ) );
			echo '</div>';
		}

		echo '</div><!-- end form fields -->';
		echo '</div><!-- end form -->';
	}

	private function get_property( $property ) {
		if ( 'form_id' === $property ) {
			return isset( $this->form[ $property ] ) ? $this->form[ $property ] : '';
		} elseif ( 'form_title' === $property ) {
			return isset( $this->form[ $property ] ) ? $this->form[ $property ] : '';
		} else {
			return isset( $this->form['settings'][ $property ] ) ? $this->form['settings'][ $property ] : '';
		}
	}

	private function get_fields() {
		return isset( $this->form['filters'] ) ? $this->form['filters'] : array();
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function render_taxonomy_field( $field_instance ) {
		$walker = new WCAPF_Walker( $field_instance );

		$field = new WCAPF_Filter_Type_Taxonomy( $field_instance );
		$items = $field->get_items();

		$classes = array( 'wcapf-nav-filter' );

		if ( $field_instance->hierarchical && $field_instance->enable_hierarchy_accordion ) {
			$classes[] = 'hierarchy-accordion';
		}

		$this->before_field( $classes, $field_instance );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_field( $field_instance );
	}

	/**
	 * Renders the field's start markup.
	 *
	 * @param array                $classes        The field classes.
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function before_field( $classes, $field_instance ) {
		array_unshift( $classes, 'wcapf-single-filter' );

		$classes[] = 'wcapf-' . $field_instance->type . '-filter';

		$classes = apply_filters( 'wcapf_field_classes', $classes, $field_instance );

		$field_classes = implode( ' ', $classes );
		$show_title    = $field_instance->get_sub_field_value( 'show_title' );
		$filter_id     = $field_instance->get_sub_field_value( 'id' );
		$filter_title  = $field_instance->get_sub_field_value( 'title' );

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
	 * Renders the field's end markup.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 *
	 * @return void
	 */
	private function after_field( $field_instance ) {
		echo '</div>'; // Ends .wcapf-field-inner

		do_action( 'wcapf_content_field_inner_end', $field_instance );

		echo '</div>';
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_price_field( $field_instance ) {
		$display_type = $field_instance->display_type;

		$walker = new WCAPF_Walker( $field_instance );

		$range_number_filters = WCAPF_Helper::range_number_filter_types();

		$classes = array();

		if ( in_array( $display_type, $range_number_filters ) ) {
			$classes[] = 'wcapf-number-range-filter';
		} else {
			$classes[] = 'wcapf-nav-filter';
		}

		$items = apply_filters( 'wcapf_price_filter_items', array(), $field_instance );

		$this->before_field( $classes, $field_instance );

		if ( in_array( $display_type, $range_number_filters ) ) {
			$this->render_range_number_filter( $field_instance, $items );
		} else {
			echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		}

		$this->after_field( $field_instance );
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
		$display_values_as     = $field_instance->get_sub_field_value( 'number_range_slider_display_values_as' );
		$align_at_the_end      = $field_instance->get_sub_field_value( 'align_values_at_the_end' );

		if ( $auto_detect ) {
			$range_min_value = isset( $range_min_max['min'] ) ? $range_min_max['min'] : '';
		}

		if ( $auto_detect ) {
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

		$url_builder = new WCAPF_URL_Builder( $filter_key );

		$data = array(
			'filter_key'            => $filter_key,
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
			'display_values_as'     => $display_values_as,
			'align_at_the_end'      => $align_at_the_end,
			'filter_url'            => $url_builder->get_range_url(),
			'clear_filter_url'      => $url_builder->get_clear_filter_url(),
		);

		WCAPF_Template_Loader::get_instance()->load( $template, $data );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_rating_field( $field_instance ) {
		$walker = new WCAPF_Walker( $field_instance );

		if ( WCAPF_Helper::found_pro_version() ) {
			$_items = array();
		} else {
			$filter = new WCAPF_Filter_Type_Taxonomy( $field_instance );
			$_items = $filter->get_items();
		}

		$items = apply_filters( 'wcapf_rating_filter_items', $_items, $field_instance );

		$classes = array( 'wcapf-nav-filter' );

		$this->before_field( $classes, $field_instance );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_field( $field_instance );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_product_status_field( $field_instance ) {
		$walker = new WCAPF_Walker( $field_instance );

		$filter = new WCAPF_Filter_Type_Product_Status( $field_instance );
		$items  = $filter->get_items();

		$classes = array( 'wcapf-nav-filter' );

		$this->before_field( $classes, $field_instance );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_field( $field_instance );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_post_author_field( $field_instance ) {
		$walker = new WCAPF_Walker( $field_instance );

		$filter = new WCAPF_Filter_Type_Post_Author( $field_instance );
		$items  = $filter->get_items();

		$classes = array( 'wcapf-nav-filter' );

		$this->before_field( $classes, $field_instance );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_field( $field_instance );
	}

	/**
	 * @param WCAPF_Field_Instance $field_instance
	 *
	 * @return void
	 */
	private function render_post_meta_field( $field_instance ) {
		$walker = new WCAPF_Walker( $field_instance );

		$filter = new WCAPF_Filter_Type_Post_Meta( $field_instance );
		$items  = $filter->get_items();

		$classes = array( 'wcapf-nav-filter' );

		$this->before_field( $classes, $field_instance );
		echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
		$this->after_field( $field_instance );
	}

}
