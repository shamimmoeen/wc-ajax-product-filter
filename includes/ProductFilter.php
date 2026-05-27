<?php
/**
 * The product filter class.
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

namespace WCAPF;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Builds the SQL JOIN/WHERE clauses for the chosen filters.
 */
class ProductFilter {

	/**
	 * The query builder used to assemble SQL fragments.
	 *
	 * @var QueryBuilder
	 */
	protected $query_builder;

	/**
	 * Constructor.
	 *
	 * @param QueryBuilder $query_builder The query builder.
	 */
	public function __construct( QueryBuilder $query_builder = null ) {
		$this->query_builder = $query_builder ? $query_builder : new QueryBuilder();
	}

	/**
	 * Gets the full SQL JOIN clause for the chosen filters.
	 *
	 * @return string
	 */
	public function get_full_join_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$joins        = $post_clauses['joins'];

		$full_join = implode( ' ', $joins );

		return $full_join ? ' ' . $full_join : '';
	}

	/**
	 * Gets the full join n where clauses for the main filter.
	 *
	 * @return array
	 */
	private function get_full_join_n_where_clauses() {
		$joins  = array();
		$wheres = array();

		$chosen_filters = wcapf()->active_filters->chosen();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $filters ) {
				$join  = $filters['join'];
				$where = $filters['where'];

				$joins[]  = $join;
				$wheres[] = $where;
			}
		}

		return compact( 'joins', 'wheres' );
	}

	/**
	 * Gets the chosen filters from url. Avoid calling this method using this class instance,
	 * rather use the helper class instance.
	 *
	 * @return array
	 *
	 * @see \WCAPF\Helpers\ActiveFilters::chosen()
	 */
	public function get_chosen_filters() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$url = isset( $_SERVER['QUERY_STRING'] ) ? wp_unslash( $_SERVER['QUERY_STRING'] ) : '';
		parse_str( $url, $query );

		$chosen = array(
			'taxonomy'       => array(),
			'price'          => array(),
			'product-status' => array(),
			'post-author'    => array(),
			'post-meta'      => array(),
		);

		$filters_data = $this->filters_data( $query );

		foreach ( $filters_data as $filter_key => $field ) {
			$element = Element\Registry::resolve( $field );

			if ( ! $element instanceof Element\Filterable ) {
				continue;
			}

			$clauses     = $element->clauses();
			$filter_type = ( new \WCAPF\FormFilter( $field ) )->filter_type;

			// The keyword filter contributes no JOIN/WHERE; it feeds the query's
			// search term, so it is grouped under filters_data (which the clause
			// combiner skips) rather than as a result-set clause.
			if ( 'keyword' === $filter_type ) {
				if ( $clauses ) {
					$chosen['filters_data']['keyword'] = $clauses;
				}
			} else {
				$chosen[ $filter_type ][ $filter_key ] = $clauses;
			}
		}

		$chosen = $this->set_default_sorting_data( $chosen );

		/**
		 * Register a hook to add the sort-by, per-page filters data.
		 */
		return apply_filters( 'wcapf_chosen_filters', $chosen, $filters_data, $query );
	}

	/**
	 * Gets the active filter's data.
	 *
	 * @param array $query The key, values array from the $_GET variable.
	 *
	 * @return array
	 */
	protected function filters_data( $query ) {
		$assigned = $this->get_relevant_form();

		if ( ! $assigned ) {
			return array();
		}

		$settings = wcapf()->settings->all();

		if ( ! empty( $settings['disable_wcapf'] ) ) {
			return array();
		}

		$global_keys = \WCAPF_API_Utils::get_filter_keys( true );
		$global_keys = wp_list_pluck( $global_keys, 'field_key' );

		$settings['filter_keys'] = $global_keys;

		if ( is_shop() ) {
			$settings['base_url'] = get_permalink( wc_get_page_id( 'shop' ) );
		} else {
			$settings['base_url'] = get_term_link( get_queried_object_id() );
		}

		global $wcapf, $wcapf_form;

		$wcapf      = $settings;
		$form       = \WCAPF_Product_Filter_Utils::get_form_filters( $assigned );
		$wcapf_form = $form;

		$filters_data = array();

		if ( $query ) {
			$filter_keys = array_keys( $query );
			$filter_keys = array_map(
				function ( $key ) {
					return urldecode( sanitize_title( $key ) );
				},
				$filter_keys
			);

			foreach ( $form['filters'] as $filter ) {
				$field_key = $filter['key'];

				if ( in_array( $field_key, $filter_keys, true ) ) {
					$filters_data[ $field_key ] = $filter['field'];
				}
			}
		}

		return $filters_data;
	}

	/**
	 * Gets the assigned form.
	 *
	 * @since 4.0.0
	 *
	 * @return array|int|WP_Post
	 */
	private function get_relevant_form() {
		$form_data = array();

		$forms = get_posts(
			array(
				'post_type'      => 'wcapf-form',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'orderby'        => 'ID',
				'order'          => 'ASC',
			)
		);

		if ( ! $forms ) {
			return $form_data;
		}

		return $forms[0];
	}

	/**
	 * Sets data for the default sorting.
	 *
	 * @param array $chosen The chosen filters array.
	 *
	 * @return array
	 */
	private function set_default_sorting_data( $chosen ) {
		if ( empty( wcapf()->settings->get( 'sorting_data_in_active_filters' ) ) ) {
			return $chosen;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reads front-end sorting state from the URL query args.
		$orderby = isset( $_GET['orderby'] ) ? sanitize_key( wp_unslash( $_GET['orderby'] ) ) : '';

		if ( ! $orderby ) {
			return $chosen;
		}

		$values = \WCAPF_Product_Filter_Utils::get_chosen_filter_values( $orderby );
		$prefix = wcapf()->settings->sort_by_prefix();

		$active_filters = array();

		foreach ( $values as $value ) {
			$active_filters[ $value ] = $prefix . ' ' . $value;
		}

		$data = array(
			'values'         => $values,
			'filter_key'     => 'orderby',
			'active_filters' => $active_filters,
		);

		$chosen['filters_data']['orderby'] = $data;

		return $chosen;
	}

	/**
	 * Gets the full SQL WHERE clause for the chosen filters.
	 *
	 * @return string
	 */
	public function get_full_where_clause() {
		$post_clauses = $this->get_full_join_n_where_clauses();
		$wheres       = $post_clauses['wheres'];
		$query_type   = wcapf()->settings->field_relations();

		return \WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}
}
