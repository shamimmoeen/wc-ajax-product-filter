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
 * Shared behavior for filter elements: the within-filter relation, the
 * shopper-scoped count query, the hide-empty pass and the within-filter clause
 * combination. Wrapper rendering and manual-option preparation live on the
 * AbstractElement base so controls can use them too.
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
