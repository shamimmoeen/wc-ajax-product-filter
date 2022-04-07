<?php
/**
 * WCAPF_Filter_Type_Number class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Filter_Type_Number class.
 *
 * @since 3.0.0
 */
class WCAPF_Filter_Type_Number extends WCAPF_Filter_Type {

	protected $filter_key; // todo: required in parent class
	protected $filter_type; // todo: maybe remove
	protected $hide_empty; // todo: required in parent class
	protected $post_meta;
	protected $display_type;
	protected $value_type;
	protected $query_type;
	protected $get_options;
	protected $manual_options;

	/**
	 * @var WCAPF_Field_Instance
	 */
	private $field;

	/**
	 * The constructor.
	 *
	 * @param WCAPF_Field_Instance $field The field instance.
	 */
	public function __construct( $field ) {
		$this->field = $field;

		$this->set_properties();
	}

	private function set_properties() {
		$field = $this->field;

		$this->post_meta  = $field->get_sub_field_value( 'meta_key' );
		$this->value_type = $field->get_sub_field_value( 'value_type' );

		$this->display_type   = $field->display_type;
		$this->filter_key     = $field->filter_key;
		$this->filter_type    = $field->filter_type;
		$this->hide_empty     = $field->hide_empty;
		$this->query_type     = $field->query_type;
		$this->get_options    = $field->get_options;
		$this->manual_options = $field->manual_options;
	}

	/**
	 * Prepare the meta values for the post meta.
	 *
	 * @return array
	 */
	protected function prepare_items() {
		$items = array();

		if ( 'text' === $this->value_type ) {
			$items = $this->text_items();
		} elseif ( 'number' === $this->value_type ) {
			$items = $this->number_items();
		}

		return $items;
	}

	private function text_items() {
		$meta_values = array();

		if ( 'manual_entry' === $this->get_options ) {
			$manual_options = $this->manual_options;

			foreach ( $manual_options as $option ) {
				$meta_value = $option['value'];

				$data = array(
					'id'    => $meta_value,
					'name'  => $option['label'],
					'count' => 0,
				);

				$meta_values[ $meta_value ] = $data;
			}
		} else {
			$_meta_values = $this->get_meta_values();

			// Parse the array.
			foreach ( $_meta_values as $value ) {
				$meta_value    = $value['meta_value'];
				$product_count = $value['meta_count'];

				$data = array(
					'id'    => $meta_value,
					'name'  => $meta_value,
					'count' => $product_count,
				);

				$meta_values[ $meta_value ] = $data;
			}
		}

		$meta_values = $this->get_updated_meta_values_count( $meta_values );

		return $this->filter_by_hide_empty( $meta_values );
	}

	/**
	 * Gets the meta values for the meta key.
	 *
	 * @source https://stackoverflow.com/a/54017483
	 * @source https://stackoverflow.com/a/10633985
	 *
	 * @return array
	 * @noinspection SqlNoDataSourceInspection
	 */
	private function get_meta_values() {
		global $wpdb;

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		// Generate query.
		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS meta_count, metas.meta_value";
		$query['from']   = "FROM $wpdb->posts";

		$join = "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= " AND metas.meta_key = '$this->post_meta'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];

		// TODO: Include the search clause.

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Updates the terms count based on the current filter.
	 *
	 * @param array $meta_values List of all meta values.
	 *
	 * @return array
	 */
	private function get_updated_meta_values_count( $meta_values ) {
		if ( ! $meta_values ) {
			return array();
		}

		$meta_value_ids            = wp_list_pluck( $meta_values, 'id' );
		$active_meta_values        = $this->get_filtered_meta_product_counts( $meta_value_ids );
		$updated_meta_values_count = array();

		foreach ( $meta_values as $meta_value => $data ) {
			$data['count'] = isset( $active_meta_values[ $meta_value ] ) ? $active_meta_values[ $meta_value ] : 0;

			$updated_meta_values_count[ $meta_value ] = $data;
		}

		return $updated_meta_values_count;
	}

	/**
	 * Count products within certain terms, taking the main WP query into
	 * consideration.
	 *
	 * This query allows counts to be generated based on the viewed products,
	 * not all products.
	 *
	 * @param array $meta_values List of all meta values for the meta key.
	 *
	 * @return array The filtered term product counts.
	 */
	private function get_filtered_meta_product_counts( $meta_values ) {
		global $wpdb;

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		// Generate query.
		$query['select'] = "SELECT COUNT(DISTINCT $wpdb->posts.ID) AS meta_count, metas.meta_value";
		$query['from']   = "FROM $wpdb->posts";

		$join = "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		// $where .= 'AND metas.meta_value IN (' . implode( ',', $meta_values ) . ')';
		$where .= " AND metas.meta_key = '$this->post_meta'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];

		$main_query_type = WCAPF_Product_Filter::instance()->get_field_relations();
		$main_query      = WC_Query::get_main_query();
		$post__in        = isset( $main_query->query_vars['post__in'] ) ? $main_query->query_vars['post__in'] : array();

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				if ( $post__in ) {
					$post_in = implode( ',', $post__in );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				$filtered_product_ids = $this->get_product_ids_by_other_filters();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$filtered_product_ids = $this->get_self_filtered_product_ids();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				// No where clause required.
			}
		}

		// TODO: Include search clause.

		// $where .= $this->get_common_where_clauses();

		$query['where'] = $where;

		$query['group_by'] = 'GROUP BY metas.meta_value';
		$query['order_by'] = 'ORDER BY metas.meta_value * 1';

		$query = apply_filters( 'wcapf_filtered_meta_product_counts_query', $query, $this );
		$query = implode( ' ', $query );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$results = $wpdb->get_results( $query, ARRAY_A );

		return wp_list_pluck( $results, 'meta_count', 'meta_value' );
	}

	private function number_items() {
		$display_type = $this->display_type;

		if ( 'range_slider' === $display_type || 'range_number' === $display_type ) {
			return array( '' );
		}

		$range_min_value       = $this->field->get_sub_field_value( 'min_value' );
		$range_max_value       = $this->field->get_sub_field_value( 'max_value' );
		$range_min_auto_detect = $this->field->get_sub_field_value( 'min_value_auto_detect' );
		$range_max_auto_detect = $this->field->get_sub_field_value( 'max_value_auto_detect' );

		if ( $range_min_auto_detect ) {
			$range_min_value = $this->get_db_min();
		}

		if ( $range_max_auto_detect ) {
			$range_max_value = $this->get_db_max();
		}

		$min_value = $range_min_value;
		$max_value = $range_max_value;

		$min_value = floatval( $min_value );
		$max_value = floatval( $max_value );

		if ( $min_value > $max_value ) {
			$max_value = $min_value;
		}

		$ranges = $this->generate_ranges( $min_value, $max_value );

		return $this->filter_by_hide_empty( $ranges );
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @return string
	 */
	public function get_db_min() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MIN( CAST( meta_value as SIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			$this->post_meta
		);

		return $wpdb->get_var( $query );
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @return string
	 */
	public function get_db_max() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MAX( CAST( meta_value as SIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			$this->post_meta
		);

		return $wpdb->get_var( $query );
	}

	/**
	 * @param float $min_value
	 * @param float $max_value
	 *
	 * @return array
	 */
	private function generate_ranges( $min_value, $max_value ) {
		$ranges             = array();
		$step               = $this->field->get_sub_field_value( 'step' );
		$value_prefix       = $this->field->get_sub_field_value( 'value_prefix' );
		$value_postfix      = $this->field->get_sub_field_value( 'value_postfix' );
		$values_separator   = $this->field->get_sub_field_value( 'values_separator' );
		$decimal_places     = $this->field->get_sub_field_value( 'decimal_places' );
		$decimal_separator  = $this->field->get_sub_field_value( 'decimal_separator' );
		$thousand_separator = $this->field->get_sub_field_value( 'thousand_separator' );

		while ( $min_value < $max_value ) {
			$_max_value = $min_value + $step;

			$formatted_min = number_format( $min_value, $decimal_places, $decimal_separator, $thousand_separator );
			$formatted_max = number_format( $_max_value, $decimal_places, $decimal_separator, $thousand_separator );

			$value = $min_value . '+' . $_max_value;

			$name = $value_prefix;
			$name .= $formatted_min;
			$name .= $value_postfix;
			$name .= $values_separator;
			$name .= $value_prefix;
			$name .= $formatted_max;
			$name .= $value_postfix;

			$ranges[] = array(
				'min'   => $min_value,
				'max'   => $_max_value,
				'id'    => $value,
				'name'  => $name,
				'count' => '0',
			);

			$min_value = $_max_value;
		}

		// If no ranges, then bail out.
		if ( ! $ranges ) {
			return array();
		}

		global $wpdb;

		list( $meta_query_sql, $tax_query_sql ) = $this->get_query_data();

		$ranges_clauses = array();

		foreach ( $ranges as $range ) {
			$min_value1 = $range['min'];
			$max_value1 = $range['max'];
			$id         = $range['id'];

			$clauses = "COUNT";
			$clauses .= "(";
			$clauses .= "DISTINCT CASE WHEN metas.meta_value";
			$clauses .= " BETWEEN $min_value1 AND $max_value1";
			$clauses .= " THEN $wpdb->posts.ID END";
			$clauses .= ") AS `$id`";

			$ranges_clauses[] = $clauses;
		}

		$ranges_clauses = implode( ', ', $ranges_clauses );

		$query['select'] = "SELECT $ranges_clauses";

		$query['from'] = "FROM $wpdb->posts";

		$join = "INNER JOIN $wpdb->postmeta AS metas ON $wpdb->posts.ID = metas.post_id";

		$join .= $meta_query_sql['join'];
		$join .= $tax_query_sql['join'];

		$query['join'] = $join;

		$where = "WHERE $wpdb->posts.post_type IN ('product')";

		$where .= " AND $wpdb->posts.post_status = 'publish' ";
		$where .= " AND metas.meta_key = '$this->post_meta'";

		$where .= $tax_query_sql['where'] . $meta_query_sql['where'];

		$main_query_type = WCAPF_Product_Filter::instance()->get_field_relations();
		$main_query      = WC_Query::get_main_query();
		$post__in        = isset( $main_query->query_vars['post__in'] ) ? $main_query->query_vars['post__in'] : array();

		if ( 'and' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				if ( $post__in ) {
					$post_in = implode( ',', $post__in );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				$filtered_product_ids = $this->get_product_ids_by_other_filters();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			}
		} elseif ( 'or' === $main_query_type ) {
			if ( 'and' === $this->query_type ) {
				$filtered_product_ids = $this->get_self_filtered_product_ids();

				if ( $filtered_product_ids ) {
					$post_in = implode( ',', $filtered_product_ids );

					$where .= " AND $wpdb->posts.ID IN ( $post_in )";
				}
			} elseif ( 'or' === $this->query_type ) {
				// No where clause required.
			}
		}

		// TODO: Include search clause.

		// $where .= $this->get_common_where_clauses();

		$query['where'] = $where;

		$query = implode( ' ', $query );

		$ranges_count = $wpdb->get_row( $query, ARRAY_A );

		$ranges_with_count = array();

		foreach ( $ranges as $range ) {
			$id    = $range['id'];
			$count = isset( $ranges_count[ $id ] ) ? $ranges_count[ $id ] : 0;

			$range['count']      = $count;
			$ranges_with_count[] = $range;
		}

		return $ranges_with_count;
	}

	private function date_items() {

	}

}
