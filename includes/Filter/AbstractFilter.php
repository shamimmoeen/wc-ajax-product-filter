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
	 * Outputs the filter's option markup.
	 *
	 * @return void
	 */
	public function render(): void {
		$walker = new \WCAPF\Walker( $this->field );

		echo $walker->build_menu(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Markup is escaped within the walker.
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
}
