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
	protected function get_post_in_clause() {
		global $wpdb;

		$main_query_type = WCAPF_Product_Filter::instance()->get_field_relations();
		$main_query      = WC_Query::get_main_query();
		$post__in        = isset( $main_query->query_vars['post__in'] ) ? $main_query->query_vars['post__in'] : array();
		$post_in_clause  = '';

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				if ( $post__in ) {
					$post_in = implode( ',', $post__in );

					$post_in_clause = " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				$filtered_product_ids = $this->get_product_ids_by_other_filters();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$post_in_clause = " AND $wpdb->posts.ID IN ( $post_in )";
				}
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$filtered_product_ids = $this->get_self_filtered_product_ids();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$post_in_clause = " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				$post_in_clause = " AND ( 1 = 1 )";
			}
		}

		return $post_in_clause;
	}

	/**
	 * Gets the product ids by other filters.
	 *
	 * @return array
	 */
	protected function get_product_ids_by_other_filters() {
		$filter = WCAPF_Product_Filter::instance();
		$chosen = $filter->get_chosen_filters();

		$excluded = array();

		foreach ( $chosen as $fields ) {
			foreach ( $fields as $filter_key => $field ) {
				if ( $this->filter_key === $filter_key ) {
					continue;
				}

				$excluded[] = $field['product_ids'];
			}
		}

		return WCAPF_Product_Filter_Utils::combine_values( 'or', $excluded );
	}

	/**
	 * Gets the self filtered product ids.
	 *
	 * @return array
	 */
	protected function get_self_filtered_product_ids() {
		$filter = WCAPF_Product_Filter::instance();
		$chosen = $filter->get_chosen_filters();

		$self = array();

		foreach ( $chosen as $fields ) {
			foreach ( $fields as $filter_key => $field ) {
				if ( $this->filter_key === $filter_key ) {
					$self = $field['product_ids'];
					break;
				}
			}
		}

		return $self;
	}

}
