<?php
/**
 * Base class for filter elements.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Filter
 * @author     Mainul Hassan
 */

namespace WCAPF\Filter;

use WCAPF\Element\AbstractElement;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared behavior for the filter elements: the within-filter relation, the
 * shopper-scoped count query, manual-option preparation and the option-list
 * rendering. Concrete filters add the Filterable capability (clauses + items).
 */
abstract class AbstractFilter extends AbstractElement {

	/**
	 * The within-filter query relation ('or' or 'and').
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * The filter key (the URL parameter).
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * Whether empty options are removed ('remove') or kept.
	 *
	 * @var string
	 */
	protected $hide_empty;

	/**
	 * Constructor.
	 *
	 * @param array $entry The stored filter entry.
	 */
	public function __construct( array $entry ) {
		parent::__construct( $entry );

		$this->filter_key = $this->field->filter_key;
		$this->query_type = $this->field->query_type;
		$this->hide_empty = $this->field->hide_empty;
	}

	/**
	 * The admin grouping category.
	 *
	 * @return string
	 */
	public static function category(): string {
		return 'filter';
	}

	/**
	 * Outputs the filter's markup: the wrapper, the option list (built via the
	 * walker by default) and the closing tags.
	 *
	 * @return void
	 */
	public function render(): void {
		$this->before_filter();
		echo $this->build_menu(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Markup is escaped within the walker.
		$this->after_filter();
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
	 * Outputs the filter wrapper, title and accordion panel opening markup.
	 *
	 * @return void
	 */
	protected function before_filter() {
		$classes    = $this->get_filter_classes();
		$filter_id  = $this->field->filter_id;
		$filter_key = $this->filter_key;

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

		\WCAPF_Template_Loader::get_instance()->load(
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
	 * Closes the filter wrapper opened by before_filter().
	 *
	 * @return void
	 */
	protected function after_filter() {
		echo '</div>'; // Ends .wcapf-filter-inner
		echo '</div>'; // Ends .wcapf-filter
	}

	/**
	 * Builds the CSS classes applied to the filter wrapper. The
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
	 * Renders the slider/number-input UI for range filters from the supplied
	 * min/max range values.
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

		\WCAPF_Template_Loader::get_instance()->load( 'range', $args );
	}

	/**
	 * Gets the main query data (the page's tax/meta/search context) used to scope
	 * option counts to the viewed products.
	 *
	 * @param string $primary_table  The primary table name.
	 * @param string $primary_column The primary column name.
	 *
	 * @return array
	 */
	protected function get_main_query_data( $primary_table = '', $primary_column = '' ) {
		global $wpdb;

		if ( ! $primary_table ) {
			$primary_table = $wpdb->posts;
		}

		if ( ! $primary_column ) {
			$primary_column = 'ID';
		}

		$meta_query_sql = array(
			'join'  => '',
			'where' => '',
		);
		$tax_query_sql  = array(
			'join'  => '',
			'where' => '',
		);
		$search_query   = '';
		$where_sql      = '';

		$post__in       = array();
		$post__not_in   = array();
		$author__in     = array();
		$author__not_in = array();

		if ( is_shop() || is_product_taxonomy() ) {
			$tax_query    = \WC_Query::get_main_tax_query();
			$meta_query   = \WC_Query::get_main_meta_query();
			$search_query = \WC_Query::get_main_search_query_sql();

			if ( ! empty( $tax_query ) ) {
				$tax_query_obj = new \WP_Tax_Query( $tax_query );
				$tax_query_sql = $tax_query_obj->get_sql( $primary_table, $primary_column );
			}

			if ( ! empty( $meta_query ) ) {
				$meta_query_obj = new \WP_Meta_Query( $meta_query );
				$meta_query_sql = $meta_query_obj->get_sql( 'post', $primary_table, $primary_column );
			}

			$main_query     = \WC_Query::get_main_query();
			$post__in       = $main_query->get( 'post__in' );
			$post__not_in   = $main_query->get( 'post__not_in' );
			$author__in     = $main_query->get( 'author__in' );
			$author__not_in = $main_query->get( 'author__not_in' );
		}

		list(
			$meta_query_sql,
			$tax_query_sql,
			$search_query,
			$post__in,
			$post__not_in,
			$author__in,
			$author__not_in
			) = apply_filters(
				'wcapf_main_query_data',
				array(
					$meta_query_sql,
					$tax_query_sql,
					$search_query,
					$post__in,
					$post__not_in,
					$author__in,
					$author__not_in,
				),
				$primary_table,
				$primary_column
			);

		if ( $post__in ) {
			$ids_in = $this->query_builder->get_ids_sql( $post__in );

			$where_sql .= " AND $wpdb->posts.ID IN $ids_in";
		}

		if ( $post__not_in ) {
			$ids_in = $this->query_builder->get_ids_sql( $post__not_in );

			$where_sql .= " AND $wpdb->posts.ID NOT IN $ids_in";
		}

		if ( $author__in ) {
			$ids_in = $this->query_builder->get_ids_sql( $author__in );

			$where_sql .= " AND $wpdb->posts.post_author IN $ids_in";
		}

		if ( $author__not_in ) {
			$ids_in = $this->query_builder->get_ids_sql( $author__not_in );

			$where_sql .= " AND $wpdb->posts.post_author NOT IN $ids_in";
		}

		return array( $meta_query_sql, $tax_query_sql, $search_query, $where_sql );
	}

	/**
	 * Removes the zero-count items when the field is set to hide empty options.
	 *
	 * @param array $items The items.
	 *
	 * @return array
	 */
	protected function filter_by_hide_empty( $items ) {
		if ( 'remove' === $this->hide_empty ) {
			$items_with_count = array();

			foreach ( $items as $key => $item ) {
				if ( $item['count'] ) {
					$items_with_count[ $key ] = $item;
				}
			}

			$items = $items_with_count;
		}

		return $items;
	}

	/**
	 * Checks whether auto count updates are enabled for the current field.
	 *
	 * @return bool
	 */
	protected function auto_count_enabled() {
		return apply_filters(
			'wcapf_filter_update_count',
			$this->field->get_sub_field_value( 'update_count' ),
			$this->field
		);
	}

	/**
	 * Prepares the manual options into the item shape (product-status, sort-by,
	 * per-page). For sort-by the id is the generated option id, otherwise the value.
	 *
	 * @param array $manual_options The manual options from the filter field.
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
	 * Syncs item counts with the filtered count values keyed by item id.
	 *
	 * @param array $items          The items array.
	 * @param array $filtered_count The filtered counts keyed by item id.
	 *
	 * @return array
	 */
	protected function sync_items_count( $items, $filtered_count ) {
		if ( empty( $items ) ) {
			return array();
		}

		$updated_count = array();

		foreach ( $items as $key => $range ) {
			$id    = $range['id'];
			$count = isset( $filtered_count[ $id ] ) ? $filtered_count[ $id ] : 0;

			$range['count'] = $count;

			$updated_count[ $key ] = $range;
		}

		return $updated_count;
	}

	/**
	 * Builds the formatted "min — max" label for a range value, honouring the
	 * field's number-formatting settings.
	 *
	 * @param string $value The min/max range using the range separator.
	 *
	 * @return string
	 */
	protected function get_label_for_number_range( $value ) {
		$separator = wcapf()->data->range_values_separator();
		$range     = explode( $separator, $value );

		$range_min = isset( $range[0] ) ? $range[0] : '';
		$range_max = isset( $range[1] ) ? $range[1] : '';

		$value_prefix       = $this->field->get_sub_field_value( 'value_prefix' );
		$value_postfix      = $this->field->get_sub_field_value( 'value_postfix' );
		$values_separator   = $this->field->get_sub_field_value( 'values_separator' );
		$format_numbers     = $this->field->get_sub_field_value( 'format_numbers' );
		$decimal_places     = $this->field->get_sub_field_value( 'decimal_places' );
		$thousand_separator = $this->field->get_sub_field_value( 'thousand_separator' );
		$decimal_separator  = $this->field->get_sub_field_value( 'decimal_separator' );

		if ( $format_numbers ) {
			$range_min = number_format( $range_min, $decimal_places, $decimal_separator, $thousand_separator );
			$range_max = number_format( $range_max, $decimal_places, $decimal_separator, $thousand_separator );
		}

		return sprintf(
			'%1$s%2$s%3$s%4$s%1$s%5$s%3$s',
			$value_prefix,
			$range_min,
			$value_postfix,
			$values_separator,
			$range_max
		);
	}

	/**
	 * Combines per-value clauses into a single WHERE for the given relation.
	 *
	 * @param string $query_type       The within-filter relation ('or' or 'and').
	 * @param array  $or_filter_values The values combined with an IN list (OR relation).
	 * @param string $value_alias      The column the IN list compares against.
	 * @param array  $clauses          The individual prepared clauses.
	 *
	 * @return string
	 */
	protected function get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses ) {
		global $wpdb;

		if ( 'or' === $query_type ) {
			if ( $or_filter_values ) {
				$placeholders = implode( ',', array_fill( 0, count( $or_filter_values ), '%s' ) );

				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders
				$where = $wpdb->prepare( "$value_alias IN ($placeholders)", $or_filter_values );
			} elseif ( $clauses ) {
				if ( 1 < count( $clauses ) ) {
					$where = '( ' . implode( ' OR ', $clauses ) . ' )';
				} else {
					$where = implode( ' OR ', $clauses );
				}
			} else {
				$where = '1=0';
			}
		} elseif ( $clauses ) {
			if ( 1 < count( $clauses ) ) {
				$where = '( ' . implode( ' AND ', $clauses ) . ' )';
			} else {
				$where = implode( ' AND ', $clauses );
			}
		} else {
			$where = '1=0';
		}

		return $where;
	}
}
