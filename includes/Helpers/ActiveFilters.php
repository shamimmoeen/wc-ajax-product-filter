<?php
/**
 * Active filters helper.
 *
 * Owns the active-filters UI end-to-end: reads chosen filter state from
 * the request, normalises it, prepares template args, and renders the
 * active-filters bar + reset button HTML.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Active filters helper.
 */
class ActiveFilters {

	/**
	 * Normalised active filters keyed by filter_key.
	 *
	 * @return array
	 */
	public function data(): array {
		$chosen_filters = $this->chosen();
		$active_filters = array();

		foreach ( $chosen_filters as $filter_type_filters ) {
			foreach ( $filter_type_filters as $filter_type => $filter ) {
				$_active_filters = $filter['active_filters'] ?? array();
				$filter_id       = $filter['filter_id'] ?? '';
				$filter_key      = ! empty( $filter['filter_key'] ) ? $filter['filter_key'] : $filter_type;

				$active_filters[ $filter_key ] = array(
					'filter_key'     => $filter_key,
					'filter_type'    => $filter_type,
					'filter_id'      => $filter_id,
					'active_filters' => $_active_filters,
				);
			}
		}

		return $active_filters;
	}

	/**
	 * The raw chosen-filters payload populated for the current request.
	 *
	 * @return array
	 */
	public function chosen(): array {
		global $wcapf_chosen_filters;

		return $wcapf_chosen_filters ? $wcapf_chosen_filters : array();
	}

	/**
	 * Active filter items sorted to match the query-string order, optionally grouped per filter key.
	 *
	 * @param string $layout Layout. Accepts 'simple' or 'extended'.
	 *
	 * @return array
	 */
	public function items( string $layout = 'simple' ): array {
		$active_filters = $this->data();
		$sorted         = array();

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reading query parameters only to determine ordering of active filters in the UI.
		foreach ( $_GET as $_key => $_value ) {
			$key = (string) wp_unslash( $_key );

			if ( array_key_exists( $key, $active_filters ) ) {
				$sorted[ $key ] = $active_filters[ $key ];
			}
		}

		if ( 'extended' === $layout ) {
			$grouped = array();

			foreach ( $sorted as $filter_data ) {
				$filter_key      = $filter_data['filter_key'] ?? '';
				$_active_filters = $filter_data['active_filters'] ?? array();

				if ( $_active_filters ) {
					if ( array_key_exists( $filter_key, $grouped ) ) {
						$old = $grouped[ $filter_key ]['active_filters'];
						$new = $old + $_active_filters;

						$grouped[ $filter_key ]['active_filters'] = $new;
					} else {
						$grouped[ $filter_key ] = $filter_data;
					}
				}
			}

			return $grouped;
		}

		$filters_data = array();

		foreach ( $sorted as $filter_data ) {
			$active_filters = $filter_data['active_filters'] ?? array();

			foreach ( $active_filters as $value => $label ) {
				$filter_data['active_filters'] = array( $value => $label );

				$filters_data[] = $filter_data;
			}
		}

		return $filters_data;
	}

	/**
	 * Whether the given filter key has any active selection.
	 *
	 * @param string $filter_key The filter key.
	 *
	 * @return bool
	 */
	public function is_filter_active( string $filter_key ): bool {
		return array_key_exists( $filter_key, $this->data() );
	}

	/**
	 * The currently applied keyword (empty string when none).
	 *
	 * @return string
	 */
	public function applied_keyword(): string {
		$chosen = $this->chosen();

		$filters_data = $chosen['filters_data'] ?? array();
		$keyword_data = $filters_data['keyword'] ?? array();

		return $keyword_data['values'][0] ?? '';
	}

	/**
	 * Prepares template args for the active-filters bar template.
	 *
	 * @param array $raw_args Raw template arguments.
	 *
	 * @return array
	 */
	public function prepare_args( array $raw_args ): array {
		$layout = ! empty( $raw_args['layout'] ) ? $raw_args['layout'] : 'simple';
		$title  = ! empty( $raw_args['title'] ) ? $raw_args['title'] : '';

		$all_filters = $this->items( $layout );

		$clear_all_btn_label  = ! empty( $raw_args['clear_all_btn_label'] ) ? $raw_args['clear_all_btn_label'] : '';
		$clear_all_btn_layout = ! empty( $raw_args['clear_all_btn_layout'] ) ? $raw_args['clear_all_btn_layout'] : 'block';
		$show_clear_btn       = ! empty( $raw_args['show_clear_btn'] );
		$empty_message        = ! empty( $raw_args['empty_message'] ) ? $raw_args['empty_message'] : '';

		if ( 'extended' === $layout ) {
			$clear_all_btn_layout = 'block';
		}

		$unique_id = ! empty( $raw_args['unique_id'] ) ? $raw_args['unique_id'] : wp_unique_id( 'af-' );
		$classes   = array( 'wcapf-active-filters', 'wcapf-active-filters-' . $unique_id );
		$classes[] = 'layout-' . $layout;
		$classes[] = 'clear-all-btn-layout-' . $clear_all_btn_layout;

		$show_title = (bool) $title;

		if ( ! $show_title ) {
			$show_clear_btn = false;
		}

		$inner_classes = array( 'wcapf-filter' );

		if ( $show_clear_btn && $all_filters ) {
			$inner_classes[] = 'filter-active';
		}

		$should_render = true;

		if ( ! $all_filters && ! $empty_message ) {
			$should_render = false;
		}

		return array(
			'filter_title'         => $title,
			'show_filter_title'    => $show_title,
			'filter_layout'        => $layout,
			'filter_empty_message' => $empty_message,
			'clear_all_btn_label'  => $clear_all_btn_label,
			'clear_all_btn_layout' => $clear_all_btn_layout,
			'show_clear_btn'       => $show_clear_btn,
			'all_filters'          => $all_filters,
			'total_filters'        => count( $all_filters ),
			'filter_unique_id'     => $unique_id,
			'filter_classes'       => implode( ' ', $classes ),
			'filter_inner_classes' => implode( ' ', $inner_classes ),
			'reset_btn_class'      => 'wcapf-reset-filters-btn',
			'filter_should_render' => $should_render,
		);
	}

	/**
	 * Prepares template args for the reset-button template.
	 *
	 * @param array $args Raw template arguments.
	 *
	 * @return array
	 */
	public function prepare_reset_button_args( array $args ): array {
		$btn_label   = ! empty( $args['btn_label'] ) ? $args['btn_label'] : '';
		$show_always = ! empty( $args['show_always'] );

		$active_filters = $this->data();

		$unique_id = ! empty( $args['unique_id'] ) ? $args['unique_id'] : wp_unique_id( 'rf-' );
		$classes   = array( 'wcapf-reset-filters', 'wcapf-reset-filters-' . $unique_id );

		$should_render = true;

		if ( ! $active_filters && ! $show_always ) {
			$should_render = false;
		}

		return array(
			'reset_btn_label'     => $btn_label,
			'reset_unique_id'     => $unique_id,
			'reset_classes'       => implode( ' ', $classes ),
			'reset_should_render' => $should_render,
		);
	}

	/**
	 * Renders the active-filters chip buttons.
	 *
	 * @param array  $filter_data Filter data (must contain active_filters, filter_key, filter_type).
	 *
	 * @param string $extra_class Additional CSS class for each chip.
	 *
	 * @return string
	 */
	public function markup( array $filter_data, string $extra_class = '' ): string {
		$active_filters = $filter_data['active_filters'] ?? array();
		$filter_key     = $filter_data['filter_key'] ?? '';
		$filter_type    = $filter_data['filter_type'] ?? '';

		$classes  = 'wcapf-filter-clear-btn wcapf-active-filter-item';
		$classes .= $extra_class ? ' ' . $extra_class : '';

		$html = '';

		foreach ( $active_filters as $value => $label ) {
			$url_builder = new \WCAPF_URL_Builder( $filter_key, true );

			if ( 'keyword' === $filter_type ) {
				// Multiple keywords can be applied — clear them all at once.
				$clear_filter_url = $url_builder->get_clear_filter_url();
			} else {
				$clear_filter_url = $url_builder->get_filter_url( $value, true );
			}

			$attrs  = 'class="' . esc_attr( $classes ) . '"';
			$attrs .= ' data-clear-filter-url="' . esc_url( $clear_filter_url ) . '"';

			$html .= '<button type="button" ' . $attrs . '>';
			$html .= '<span class="wcapf-nav-item-text">'; // Span avoids the flex-wrap issue.
			$html .= wp_kses_post( $label );
			$html .= '</span>';
			$html .= '<span class="wcapf-cross-sign">&#215;</span>';
			$html .= '</button>';
		}

		return $html;
	}

	/**
	 * Renders the reset (clear all) button.
	 *
	 * @param string $button_label   Button label.
	 * @param string $override_class Custom CSS class.
	 * @param string $style          Button style. Accepts 'primary' or 'secondary'.
	 *
	 * @return string
	 */
	public function reset_button_markup( string $button_label, string $override_class = '', string $style = 'secondary' ): string {
		$active_filters = $this->data();
		$filter_keys    = array_keys( $active_filters );

		if ( $override_class ) {
			$classes = 'wcapf-filter-clear-btn ' . $override_class;
		} elseif ( 'primary' === $style ) {
			$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-primary';
		} else {
			$classes = 'wcapf-filter-clear-btn wcapf-btn wcapf-btn-secondary';
		}

		$url_builder = new \WCAPF_URL_Builder();
		$reset_url   = $url_builder->get_reset_url();

		$attrs = 'data-clear-filter-url="' . esc_url( $reset_url ) . '"';

		if ( ! $filter_keys ) {
			$attrs .= ' disabled="disabled"';
		}

		$html  = '<button type="button" class="' . esc_attr( $classes ) . '" ' . $attrs . '>';
		$html .= esc_html( $button_label );
		$html .= '</button>';

		return $html;
	}
}
