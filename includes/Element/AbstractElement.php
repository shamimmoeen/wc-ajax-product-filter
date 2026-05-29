<?php
/**
 * Base class for form elements.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Element
 * @author     Mainul Hassan
 */

namespace WCAPF\Element;

use WCAPF\FormFilter;
use WCAPF\QueryBuilder;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Holds an element's stored configuration and the shared helpers every element
 * needs: its request key, configured settings and the shopper's selection.
 */
abstract class AbstractElement implements Element {

	/**
	 * The element's stored configuration.
	 *
	 * @var FormFilter
	 */
	protected $field;

	/**
	 * The query builder used to assemble SQL fragments.
	 *
	 * @var QueryBuilder
	 */
	protected $query_builder;

	/**
	 * Constructor.
	 *
	 * @param array $entry The stored filter entry.
	 */
	public function __construct( array $entry ) {
		$this->field         = new FormFilter( $entry );
		$this->query_builder = new QueryBuilder();
	}

	/**
	 * The element's request key.
	 *
	 * @return string
	 */
	public function key(): string {
		return (string) $this->field->filter_key;
	}

	/**
	 * A configured value from the element's stored settings.
	 *
	 * @param string $name     The setting name.
	 * @param mixed  $fallback The value to use when the setting is unset.
	 *
	 * @return mixed
	 */
	protected function setting( $name, $fallback = '' ) {
		$value = $this->field->get_sub_field_value( $name );

		return '' === $value ? $fallback : $value;
	}

	/**
	 * The raw selected value for this element from the current request, or an
	 * empty string when the element has no selection.
	 *
	 * @return string
	 */
	protected function selected_value(): string {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$url = isset( $_SERVER['QUERY_STRING'] ) ? wp_unslash( $_SERVER['QUERY_STRING'] ) : '';
		parse_str( $url, $query );

		$key = $this->field->filter_key;

		if ( ! isset( $query[ $key ] ) ) {
			return '';
		}

		return sanitize_text_field( $query[ $key ] );
	}

	/**
	 * Builds the option list HTML via the walker.
	 *
	 * @return string
	 */
	protected function build_menu() {
		return $this->create_walker()->build_menu();
	}

	/**
	 * Creates the walker instance used to render the option list. Subclasses
	 * override this to swap in a different walker (e.g. the pro walker).
	 *
	 * @return \WCAPF\Walker
	 */
	protected function create_walker() {
		return new \WCAPF\Walker( $this->field );
	}

	/**
	 * Outputs the element wrapper, title and accordion panel opening markup.
	 *
	 * @return void
	 */
	protected function before_filter() {
		$classes    = $this->get_filter_classes();
		$filter_id  = $this->field->filter_id;
		$filter_key = $this->field->filter_key;

		$show_title       = $this->field->get_sub_field_value( 'show_title' );
		$filter_title     = $this->field->get_sub_field_value( 'title' );
		$help_text        = $this->field->get_sub_field_value( 'help_text' );
		$enable_accordion = $this->field->get_sub_field_value( 'enable_accordion' );
		$accordion_state  = $this->field->get_sub_field_value( 'accordion_default_state' );
		$show_clear_btn   = $this->field->get_sub_field_value( 'show_clear_btn' );

		$filter_active = wcapf()->active_filters->is_filter_active( $filter_key );

		if ( $filter_active && wcapf()->settings->keep_accordion_opened_when_filter_active() ) {
			$accordion_state = 'expanded';
		}

		$is_expanded         = 'expanded' === $accordion_state ? 'true' : 'false';
		$accordion_header_id = 'wcapf-filter-accordion-header-' . $filter_id;
		$accordion_panel_id  = 'wcapf-filter-accordion-panel-' . $filter_id;

		$filter_classes = implode( ' ', $classes );

		if ( $this->field->enable_soft_limit ) {
			printf(
				'<div class="%1$s" data-id="%2$s" data-visible-options="%3$s">',
				esc_attr( $filter_classes ),
				esc_attr( $filter_id ),
				esc_attr( $this->field->soft_limit )
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

		wcapf()->template->load(
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
	 * Closes the wrapper opened by before_filter().
	 *
	 * @return void
	 */
	protected function after_filter() {
		echo '</div>'; // Ends .wcapf-filter-inner
		echo '</div>'; // Ends .wcapf-filter
	}

	/**
	 * Builds the CSS classes applied to the element wrapper. The
	 * `wcapf_filter_classes` filter lets pro/themes extend the list (the pro
	 * visibility-rule gating registers here).
	 *
	 * @return array
	 */
	protected function get_filter_classes() {
		$classes = array(
			'wcapf-filter',
			'wcapf-filter-' . sanitize_html_class( $this->field->filter_id ),
		);

		$type = $this->field->type;

		if ( 'taxonomy' === $type ) {
			$classes[] = 'wcapf-filter-taxonomy-' . sanitize_html_class( $this->field->taxonomy );

			if ( $this->field->enable_hierarchy_accordion ) {
				$classes[] = 'has-hierarchy-accordion';
			}
		} elseif ( 'post-meta' === $type ) {
			$classes[] = 'wcapf-filter-meta-' . sanitize_html_class( $this->field->meta_key );
		} else {
			$classes[] = 'wcapf-filter-' . sanitize_html_class( $type );
		}

		if ( $this->field->enable_soft_limit ) {
			$classes[] = 'has-soft-limit';
		}

		if ( 'keyword' === $type && wcapf()->active_filters->applied_keyword() ) {
			$classes[] = 'search-active';
		}

		return apply_filters( 'wcapf_filter_classes', $classes, $this->field );
	}

	/**
	 * Prepares manual-option config rows into the item shape used by the walker.
	 * For sort-by the id is the configured option id; otherwise the value.
	 *
	 * @param array $manual_options The manual options from the field config.
	 *
	 * @return array
	 */
	protected function prepare_manual_options( $manual_options ) {
		$type    = $this->field->filter_type;
		$options = array();

		foreach ( $manual_options as $option ) {
			$value   = $option['value'];
			$label   = $option['label'];
			$tooltip = isset( $option['tooltip'] ) ? $option['tooltip'] : '';
			$count   = 0;

			if ( 'sort-by' === $type ) {
				$id = $option['id'];
			} else {
				$id = $value;
			}

			$item = array_merge(
				$option,
				array(
					'id'      => $id,
					'name'    => $label,
					'tooltip' => $tooltip,
					'count'   => $count,
				)
			);

			$options[ $id ] = $item;
		}

		return $options;
	}

	/**
	 * Renders the slider/number-input UI from the supplied min/max range values.
	 *
	 * @param array $range_min_max Range values keyed 'min' and 'max'.
	 *
	 * @return void
	 */
	protected function render_number_inputs( $range_min_max ) {
		$field_instance = $this->field;

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
				esc_html( wcapf()->settings->empty_filter_text() )
			);

			return;
		}

		$filter_key  = $field_instance->filter_key;
		$filter_type = $field_instance->filter_type;
		$filter_id   = $field_instance->filter_id;

		$chosen_filters = wcapf()->active_filters->chosen();
		$filters        = isset( $chosen_filters[ $filter_type ] ) ? $chosen_filters[ $filter_type ] : array();
		$filter         = isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();
		$values         = isset( $filter['values'] ) ? $filter['values'] : array();

		if ( \WCAPF_Helper::round_range_min_max_values( $field_instance ) ) {
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
		$slider_style = wcapf()->settings->get( 'number_range_slider_style' );

		$url_builder = new \WCAPF\UrlBuilder( $filter_key );

		$args = \WCAPF_Helper::prepare_range_filter_args(
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

		wcapf()->template->load( 'range', $args );
	}
}
