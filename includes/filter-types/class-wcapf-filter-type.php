<?php
/**
 * WCAPF_Filter_Type class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/filter-types
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter_Type class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Filter_Type {

	/**
	 * Filter key
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * Query type
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * Hide empty
	 *
	 * @var bool
	 */
	protected $hide_empty;

	/**
	 * The field instance.
	 *
	 * @var WCAPF_Field_Instance
	 */
	protected $field;

	/**
	 * The constructor.
	 *
	 * @param WCAPF_Field_Instance $field The field instance.
	 */
	public function __construct( $field ) {
		$this->field = $field;

		$this->set_default_properties();
		$this->set_properties();
	}

	/**
	 * Sets the default properties.
	 *
	 * @return void
	 */
	private function set_default_properties() {
		$field = $this->field;

		$this->filter_key = $field->filter_key;
		$this->query_type = $field->query_type;
		$this->hide_empty = $field->hide_empty;
	}

	/**
	 * Sets the properties.
	 *
	 * @return void
	 */
	abstract protected function set_properties();

	/**
	 * Gets the items.
	 *
	 * @return array
	 */
	public function get_items() {
		return $this->prepare_items();
	}

	/**
	 * Prepare the items.
	 *
	 * @return array
	 */
	abstract protected function prepare_items();

	/**
	 * Exclude the empty items.
	 *
	 * @param array $items The items.
	 *
	 * @return array
	 */
	protected function filter_by_hide_empty( $items ) {
		if ( $this->hide_empty ) {
			$items_with_count = array();

			foreach ( $items as $item ) {
				$id = $item['id'];

				if ( $item['count'] ) {
					$items_with_count[ $id ] = $item;
				}
			}

			$items = $items_with_count;
		}

		return $items;
	}

	/**
	 * @return string
	 */
	protected function get_where_clause() {
		$main_query_type = WCAPF_Helper::get_field_relations();

		// TODO: Maybe include post__in, post__not_in and other vars from the main products query.
		$where = '';

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$where = $this->get_full_where_clause();
			} elseif ( 'or' === $this->query_type ) {
				$where = $this->get_where_clauses_by_other_filters();
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$where = $this->get_self_where_clause();
			} elseif ( 'or' === $this->query_type ) {
				$where = ' AND 1=1';
			}
		}

		return $where;
	}

	/**
	 * @return string
	 */
	protected function get_full_where_clause() {
		$filter = new WCAPF_Product_Filter();

		return $filter->get_full_where_clause();
	}

	protected function get_where_clauses_by_other_filters() {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		$wheres = array();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $filter_key => $filter ) {
				if ( $this->filter_key === $filter_key ) {
					continue;
				}

				$wheres[] = $filter['where'];
			}
		}

		$query_type = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

	protected function get_self_where_clause() {
		$chosen_filters = WCAPF_Helper::get_chosen_filters();

		$wheres = array();

		foreach ( $chosen_filters as $filter_type => $filter_type_filters ) {
			if ( 'filters_data' === $filter_type ) {
				continue;
			}

			foreach ( $filter_type_filters as $filter_key => $filter ) {
				if ( $this->filter_key === $filter_key ) {
					$wheres[] = $filter['where'];
					break;
				}
			}
		}

		$query_type = WCAPF_Helper::get_field_relations();

		return WCAPF_Product_Filter_Utils::combine_where_clauses( $wheres, $query_type );
	}

}
