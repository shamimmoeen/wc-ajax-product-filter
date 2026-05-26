<?php
/**
 * Base class for the self-contained filter types.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/FilterType
 * @author     Mainul Hassan
 */

namespace WCAPF\FilterType;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A filter type owns everything for its kind of filter: it builds its own query
 * clauses for an active selection and lists its own options to render.
 */
abstract class AbstractFilterType {

	/**
	 * The field instance (the filter's stored config).
	 *
	 * @var \WCAPF\FormFilter
	 */
	protected $field;

	/**
	 * The query builder used to assemble SQL fragments.
	 *
	 * @var \WCAPF\QueryBuilder
	 */
	protected $query_builder;

	/**
	 * The filter key (the URL parameter).
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * The within-filter query relation ('or' or 'and').
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * Whether empty options are removed ('remove') or kept.
	 *
	 * @var string
	 */
	protected $hide_empty;

	/**
	 * Constructor.
	 *
	 * @param \WCAPF\FormFilter   $field         The field instance.
	 * @param \WCAPF\QueryBuilder $query_builder The query builder.
	 */
	public function __construct( \WCAPF\FormFilter $field, \WCAPF\QueryBuilder $query_builder ) {
		$this->field         = $field;
		$this->query_builder = $query_builder;
		$this->filter_key    = $field->filter_key;
		$this->query_type    = $field->query_type;
		$this->hide_empty    = $field->hide_empty;
	}

	/**
	 * Builds the chosen-filter data (join, where, active filters, ...) for the
	 * given active selection.
	 *
	 * @param string $selected_value The raw selected value from the URL.
	 *
	 * @return array
	 */
	abstract public function build_clauses( $selected_value );

	/**
	 * Prepares the option items to render for this filter.
	 *
	 * @return array
	 */
	abstract protected function prepare_items();

	/**
	 * Gets the option items to render for this filter.
	 *
	 * @return array
	 */
	public function get_items() {
		return apply_filters( 'wcapf_filter_items', $this->prepare_items(), $this->field );
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
}
