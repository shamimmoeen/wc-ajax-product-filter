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

		$chosen      = array();
		$taxonomies  = array();
		$price       = array();
		$statuses    = array();
		$post_author = array();
		$post_metas  = array();
		$keyword     = array();

		$filters_data = $this->filters_data( $query );

		foreach ( $filters_data as $filter_key => $field ) {
			$field_instance = new \WCAPF\FormFilter( $field );
			$filter_type    = $field_instance->filter_type;
			$filter_values  = sanitize_text_field( $query[ $filter_key ] ); // Sanitize the value that comes from the URL.

			if ( 'taxonomy' === $filter_type ) {
				$element = Element\Registry::resolve( $field );

				if ( $element instanceof Element\Filterable ) {
					$taxonomies[ $filter_key ] = $element->clauses();
				}
			} elseif ( 'price' === $filter_type ) {
				$element = Element\Registry::resolve( $field );

				if ( $element instanceof Element\Filterable ) {
					$price[ $filter_key ] = $element->clauses();
				}
			} elseif ( 'product-status' === $filter_type ) {
				$element = Element\Registry::resolve( $field );

				if ( $element instanceof Element\Filterable ) {
					$statuses[ $filter_key ] = $element->clauses();
				}
			} elseif ( 'post-author' === $filter_type ) {
				$element = Element\Registry::resolve( $field );

				if ( $element instanceof Element\Filterable ) {
					$post_author[ $filter_key ] = $element->clauses();
				}
			} elseif ( 'post-meta' === $filter_type ) {
				$post_metas[ $filter_key ] = $this->set_filter_by_post_meta_data( $filter_values, $field_instance );
			} elseif ( 'keyword' === $filter_type ) {
				$element = Element\Registry::resolve( $field );

				if ( $element instanceof Element\Filterable ) {
					$keyword = $element->clauses();
				}
			}
		}

		$chosen['taxonomy'] = $taxonomies;
		$chosen['price']    = $price;

		$chosen['product-status'] = $statuses;
		$chosen['post-author']    = $post_author;
		$chosen['post-meta']      = $post_metas;

		if ( $keyword ) {
			$chosen['filters_data']['keyword'] = $keyword;
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
	 * Sets price filter data.
	 *
	 * @param string            $filter_value   The filter value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_price_filter_data( $filter_value, $field_instance ) {
		$query_type = $field_instance->query_type;
		$filter_id  = $field_instance->filter_id;

		$active_filters = array();

		list( 'join' => $join, 'alias' => $alias ) = \WCAPF_Product_Filter_Utils::get_lookup_table_data();

		$_filter_values = \WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );
		$_filter_values = $_filter_values ? $_filter_values[0] : array(); // Pick the first range only.

		$separator = wcapf()->data->range_values_separator();

		$filter_values = explode( $separator, $_filter_values );

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		list( 'min' => $min, 'max' => $max ) = \WCAPF_Product_Filter_Utils::get_min_max_price_according_to_tax(
			$filter_values[0],
			$filter_values[1]
		);

		$where = "NOT ($max < $alias.min_price OR $min > $alias.max_price)";

		if ( $field_instance->get_sub_field_value( 'show_in_active_filters' ) ) {
			$range_id = implode( $separator, $filter_values );

			$active_filters[ $range_id ] = $this->get_label_for_number_range( $field_instance, $range_id );
		}

		return array(
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Gets the label for a number range.
	 *
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 * @param string            $value          The min, max range using separator.
	 *
	 * @return string
	 */
	protected function get_label_for_number_range( $field_instance, $value ) {
		$separator = wcapf()->data->range_values_separator();
		$range     = explode( $separator, $value );

		$range_min = isset( $range[0] ) ? $range[0] : '';
		$range_max = isset( $range[1] ) ? $range[1] : '';

		$value_prefix       = $field_instance->get_sub_field_value( 'value_prefix' );
		$value_postfix      = $field_instance->get_sub_field_value( 'value_postfix' );
		$values_separator   = $field_instance->get_sub_field_value( 'values_separator' );
		$format_numbers     = $field_instance->get_sub_field_value( 'format_numbers' );
		$decimal_places     = $field_instance->get_sub_field_value( 'decimal_places' );
		$thousand_separator = $field_instance->get_sub_field_value( 'thousand_separator' );
		$decimal_separator  = $field_instance->get_sub_field_value( 'decimal_separator' );

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
	 * Sets product status filter data.
	 *
	 * @param string            $filter_value   The filter value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_filter_by_product_status_data( $filter_value, $field_instance ) {
		$query_type = $field_instance->query_type;
		$filter_id  = $field_instance->filter_id;

		$active_filters = array();

		$filter_values = \WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );

		global $wpdb;

		$join   = '';
		$wheres = array();

		foreach ( $filter_values as $value ) {
			$condition = '';

			if ( 'featured' === $value ) {
				$featured_products = \WCAPF_Product_Filter_Utils::get_featured_product_ids_sql();

				$condition = "$wpdb->posts.ID IN $featured_products";
			} elseif ( 'on_sale' === $value ) {
				$on_sale_products = \WCAPF_Product_Filter_Utils::get_product_ids_on_sale_sql();

				$condition = "$wpdb->posts.ID IN $on_sale_products";
			}

			if ( $condition ) {
				$wheres[] = $condition;
			}
		}

		if ( $wheres ) {
			if ( 'or' === $query_type ) {
				$separator = ' OR ';
			} else {
				$separator = ' AND ';
			}

			$sql = implode( $separator, $wheres );

			if ( 1 < count( $wheres ) ) {
				$where = '( ' . $sql . ' )';
			} else {
				$where = $sql;
			}
		} else {
			$where = '1=0';
		}

		if ( $field_instance->get_sub_field_value( 'show_in_active_filters' ) ) {
			$active_filters = $this->active_product_status_filter_data( $filter_values, $field_instance );
		}

		return array(
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Gets active product status filter data.
	 *
	 * @param array             $filter_values  The filter values.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return array
	 */
	private function active_product_status_filter_data( $filter_values, $field_instance ) {
		$options = wp_list_pluck( $field_instance->manual_options, 'label', 'value' );

		$filter_data = array();

		foreach ( $filter_values as $filter_value ) {
			$filter_data[ $filter_value ] = ! empty( $options[ $filter_value ] ) ? $options[ $filter_value ] : $filter_value;
		}

		return $filter_data;
	}

	/**
	 * Sets post author filter data.
	 *
	 * @param string            $filter_value   The filter value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return array
	 */
	private function set_filter_by_post_author_data( $filter_value, $field_instance ) {
		$query_type = $field_instance->query_type;
		$property   = $field_instance->post_property;
		$filter_id  = $field_instance->filter_id;

		$allowed_properties = array( 'post_author' );

		$property = in_array( $property, $allowed_properties, true ) ? $property : 'post_author';

		$active_filters = array();

		global $wpdb;

		$join             = '';
		$clauses          = array();
		$or_filter_values = array();

		$alias = \WCAPF_Product_Filter_Utils::get_table_join_alias( $property );

		$value_alias = "$wpdb->posts.$alias";

		$property_values = \WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );

		foreach ( $property_values as $value ) {
			// Active filters data.
			if ( $field_instance->get_sub_field_value( 'show_in_active_filters' ) ) {
				$active_filters[ $value ] = $this->get_label_for_post_author( $value, $field_instance );
			}

			if ( 'or' === $query_type ) {
				$or_filter_values[] = $value;
			} else {
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$clauses[] = $wpdb->prepare( "$value_alias = %s", $value );
			}
		}

		$where = $this->get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses );

		return array(
			'query_type'     => $query_type,
			'values'         => $property_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Gets the label for a post author filter value.
	 *
	 * @param string            $value          The selected author value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return string
	 */
	protected function get_label_for_post_author( $value, $field_instance ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		$args = array(
			'fields'  => array( 'ID', 'display_name' ),
			'include' => array( $value ),
			'number'  => 1,
		);

		$users = get_users( $args );

		if ( empty( $users ) ) {
			return $value; // Fall back to raw value.
		}

		/**
		 * The user object.
		 *
		 * @var WP_User $user
		 */
		$user = $users[0];

		return $user->display_name;
	}

	/**
	 * Gets the WHERE clause for filter values.
	 *
	 * @param string $query_type       The query type.
	 * @param array  $or_filter_values The OR filter values.
	 * @param string $value_alias      The value alias.
	 * @param array  $clauses          The individual clauses.
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

	/**
	 * Sets post meta filter data.
	 *
	 * @param string            $filter_value   The filter value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return array
	 */
	protected function set_filter_by_post_meta_data( $filter_value, $field_instance ) {
		global $wpdb;

		$filter_key = $field_instance->filter_key;
		$query_type = $field_instance->query_type;
		$filter_id  = $field_instance->filter_id;

		$active_filters = array();

		$filter_values = \WCAPF_Product_Filter_Utils::get_chosen_filter_values( $filter_value );

		$clauses          = array();
		$or_filter_values = array();

		$join = $this->get_post_meta_join_clause( $filter_values, $field_instance );

		$value_alias = \WCAPF_Product_Filter_Utils::get_table_join_alias( $filter_key ) . '.meta_value';

		foreach ( $filter_values as $index => $meta_value ) {
			// Active filters data.
			if ( $field_instance->get_sub_field_value( 'show_in_active_filters' ) ) {
				$active_filters[ $meta_value ] = $meta_value;
			}

			if ( 'or' === $query_type ) {
				$or_filter_values[] = $meta_value;
			} else {
				$join_alias = \WCAPF_Product_Filter_Utils::get_table_join_alias_for_query_type_and( $index, $filter_key );

				$value_alias = "$join_alias.meta_value";

				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$clauses[] = $wpdb->prepare( "$value_alias = %s", $meta_value );
			}
		}

		$where = $this->get_where_clauses( $query_type, $or_filter_values, $value_alias, $clauses );

		return array(
			'query_type'     => $query_type,
			'values'         => $filter_values,
			'join'           => $join,
			'where'          => $where,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
	}

	/**
	 * Gets the JOIN clause for post meta filters.
	 *
	 * @param array             $filter_values  The filter values.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @return string
	 */
	public function get_post_meta_join_clause( $filter_values, $field_instance ) {
		global $wpdb;

		$query_type = $field_instance->query_type;
		$filter_key = $field_instance->filter_key;
		$meta_key   = $field_instance->meta_key;

		$join = '';

		if ( 'and' === $query_type ) {
			foreach ( $filter_values as $index => $meta_value ) {
				$join_alias = \WCAPF_Product_Filter_Utils::get_table_join_alias_for_query_type_and(
					$index,
					$filter_key
				);

				$join .= " LEFT JOIN $wpdb->postmeta AS $join_alias ON ($wpdb->posts.ID = $join_alias.post_id";
				// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$join .= $wpdb->prepare( " AND $join_alias.meta_key = %s)", $meta_key );
			}
		} else {
			$join_alias = \WCAPF_Product_Filter_Utils::get_table_join_alias( $filter_key );

			$join .= " LEFT JOIN $wpdb->postmeta AS $join_alias ON ($wpdb->posts.ID = $join_alias.post_id";
			// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
			$join .= $wpdb->prepare( " AND $join_alias.meta_key = %s)", $meta_key );
		}

		return $join;
	}

	/**
	 * Sets the keyword filter data.
	 *
	 * @param string            $filter_value   The filter value.
	 * @param \WCAPF\FormFilter $field_instance The field instance.
	 *
	 * @since 4.1.0
	 *
	 * @return array
	 */
	public function set_keyword_filter_data( $filter_value, $field_instance ) {
		$filter_key     = $field_instance->filter_key;
		$filter_id      = $field_instance->filter_id;
		$active_filters = array();

		// Here, it is possible to apply multiple keywords separated by comma or space.
		$filter_values = array( $filter_value );

		$prefix = wcapf()->settings->keyword_filter_prefix();

		$active_filters[ $filter_value ] = $prefix . ' ' . $filter_value;

		return array(
			'values'         => $filter_values,
			'filter_key'     => $filter_key,
			'filter_id'      => $filter_id,
			'active_filters' => $active_filters,
		);
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
