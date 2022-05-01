<?php
/**
 * The product filter class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

// phpcs:disable WordPress.Security.NonceVerification.Recommended

/**
 * WCAPF_Product_Filter class.
 *
 * @since 3.0.0
 */
class WCAPF_Product_Filter {

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Product_Filter
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Product_Filter();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	public function init_hooks() {
		add_action( 'woocommerce_product_query', array( $this, 'set_filter' ) );
	}

	/**
	 * Query the products, applying sorting/ordering etc. This applies to the
	 * main WordPress loop.
	 *
	 * @param WP_Query $query Query instance.
	 *
	 * @return WP_Query Return modified query instance.
	 */
	public function set_filter( $query ) {
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return $query;
		}

		$query->set( 'post__in', $this->get_filtered_product_ids() );

		return $query;
	}

	/**
	 * Gets the filtered product ids.
	 *
	 * @return array
	 */
	private function get_filtered_product_ids() {
		$main_query_type = $this->get_field_relations();

		$chosen_filters     = $this->get_chosen_filters();
		$products_in_fields = array();

		foreach ( $chosen_filters as $fields ) {
			foreach ( $fields as $field ) {
				$products_in_fields[] = $field['product_ids'];
			}
		}

		$filtered_product_ids = WCAPF_Product_Filter_Utils::combine_values( $main_query_type, $products_in_fields );

		return array_unique( $filtered_product_ids );
	}

	/**
	 * Gets the field relations.
	 *
	 * @return string
	 */
	public function get_field_relations() {
		$settings = WCAPF_Helper::get_settings();

		return isset( $settings['filter_relationships'] ) ? $settings['filter_relationships'] : 'and';
	}

	/**
	 * Gets the chosen filters from url.
	 *
	 * @return array
	 */
	public function get_chosen_filters() {
		// parse url
		$url = $_SERVER['QUERY_STRING'];
		$url = str_replace( '+', '%2B', $url ); // Preserve '+' to filter by ranges.
		parse_str( $url, $query );

		$chosen     = array();
		$taxonomies = array();
		$post_metas = array();

		// keyword
		if ( isset( $_GET['keyword'] ) ) {
			$keyword = ( ! empty( $_GET['keyword'] ) ) ? $_GET['keyword'] : '';

			$chosen['keyword'] = $keyword;
		}

		// orderby
		if ( isset( $_GET['orderby'] ) ) {
			$orderby = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : '';

			$chosen['orderby'] = $orderby;
		}

		$filters_data = array();

		if ( $query ) {
			$filter_keys = array_keys( $query );

			$args = array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
				'meta_query'  => array(
					array(
						'key'   => '_filter_key',
						'value' => $filter_keys,
					),
				),
			);

			$args = apply_filters( 'wcapf_filters_query_args', $args );

			$filters = get_posts( $args );

			if ( $filters ) {
				foreach ( $filters as $filter_id ) {
					$field_data = get_post_meta( $filter_id, '_field_data', true );
					$field_key  = isset( $field_data['field_key'] ) ? $field_data['field_key'] : '';

					if ( ! $field_key ) {
						continue;
					}

					$filters_data[ $field_key ] = $field_data;
				}
			}
		}

		$filters_data = apply_filters( 'wcapf_filters_data', $filters_data );

		$helper = new WCAPF_Helper;

		$taxonomy_field_types = $helper::taxonomy_field_types();

		foreach ( $filters_data as $_filter_data ) {
			$field_instance = new WCAPF_Field_Instance( $_filter_data );
			$filter_key     = $field_instance->filter_key;
			$field_type     = $field_instance->type;

			if ( in_array( $field_type, $taxonomy_field_types ) ) {
				$result = $this->get_chosen_term( $field_instance, $query );

				if ( $result ) {
					$taxonomies[ $filter_key ] = $result;
				}
			} elseif ( 'price' === $field_type && ! $helper::found_pro_version() ) {
				$result = $this->get_chosen_price( $field_instance, $query );

				if ( $result ) {
					$post_metas[ $filter_key ] = $result;
				}
			}
		}

		// TODO: Rating.
		// TODO: Product Status.

		$chosen['taxonomy']  = $taxonomies;
		$chosen['post-meta'] = $post_metas;

		return apply_filters( 'wcapf_chosen_filters', $chosen, $filters_data, $query );
	}

	/**
	 * Filter data by taxonomy.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $query          The url query.
	 *
	 * @return array
	 */
	private function get_chosen_term( $field_instance, $query ) {
		$active_filters    = array();
		$active_ancestors  = array();
		$products_in_terms = array();

		$filter_key = $field_instance->filter_key;
		$terms      = WCAPF_Product_Filter_Utils::get_chosen_filter_values_refactored( $filter_key, $query );

		if ( ! $terms ) {
			return array();
		}

		$query_type = $field_instance->query_type;
		$taxonomy   = $field_instance->taxonomy;

		$include_hierarchical_data = false;

		if ( is_taxonomy_hierarchical( $taxonomy ) ) {
			$include_hierarchical_data = true;
		}

		foreach ( $terms as $term_id ) {
			$args = array(
				'post_type'   => 'product',
				'post_status' => WCAPF_Helper::filterable_post_statuses(),
				'nopaging'    => true,
				'fields'      => 'ids',
				'tax_query'   => array(
					array(
						'taxonomy'         => $taxonomy,
						'field'            => 'id',
						'terms'            => $term_id,
						'include_children' => true,
					),
				),
			);

			$args = apply_filters( 'wcapf_term_filter_query_args', $args, $field_instance );

			// TODO: Maybe use cache.
			$term_products = get_posts( $args );

			$term_products[] = 0;

			$products_in_terms[ $term_id ] = $term_products;

			// For hierarchical accordion.
			if ( $include_hierarchical_data ) {
				$ancestors        = get_ancestors( $term_id, $taxonomy );
				$active_ancestors = array_merge( $ancestors, $active_ancestors );
			}

			// TODO: Set the data for active filters.
		}

		$product_ids = WCAPF_Product_Filter_Utils::combine_values( $query_type, $products_in_terms );

		return array(
			'taxonomy'          => $taxonomy,
			'filter_key'        => $filter_key,
			'query_type'        => $query_type,
			'values'            => $terms,
			'product_ids'       => $product_ids,
			'products_in_terms' => $products_in_terms,
			'active_filters'    => $active_filters,
			'active_ancestors'  => $active_ancestors,
		);
	}

	/**
	 * Filter data by price.
	 *
	 * @param WCAPF_Field_Instance $field_instance The field instance.
	 * @param array                $query          The url query.
	 *
	 * @return array
	 */
	private function get_chosen_price( $field_instance, $query ) {
		$active_filters = array();

		$filter_key = $field_instance->filter_key;
		$query_type = $field_instance->query_type;
		$meta_key   = $field_instance->meta_key;
		$data_type  = $field_instance->number_data_type;

		$_filter_values = WCAPF_Product_Filter_Utils::get_chosen_filter_values_refactored( $filter_key, $query );
		$_filter_values = $_filter_values ? $_filter_values[0] : array(); // Pick the first range only.

		$filter_values = $_filter_values ? explode( '+', $_filter_values ) : array();

		if ( ! $filter_values ) {
			return array();
		}

		if ( 2 > count( $filter_values ) ) {
			return array();
		}

		$min = floatval( $filter_values[0] );
		$max = floatval( $filter_values[1] );

		$args = array(
			'post_type'   => 'product',
			'post_status' => WCAPF_Helper::filterable_post_statuses(),
			'nopaging'    => true,
			'fields'      => 'ids',
			'meta_query'  => array(
				array(
					'key'     => $meta_key,
					'value'   => array( $min, $max ),
					'compare' => 'BETWEEN',
					'type'    => $data_type,
				),
			),
		);

		$args = apply_filters( 'wcapf_price_filter_query_args', $args, $field_instance );

		// TODO: Maybe use cache.
		$ranged_products = get_posts( $args );

		$ranged_products[] = 0;
		$products_in_metas = $ranged_products;
		$product_ids       = $ranged_products;

		// TODO: Set the data for active filters.

		return array(
			'meta'              => $meta_key,
			'filter_key'        => $filter_key,
			'query_type'        => $query_type,
			'values'            => $filter_values,
			'product_ids'       => $product_ids,
			'products_in_metas' => $products_in_metas,
			'active_filters'    => $active_filters,
		);
	}

}

add_action( 'plugins_loaded', array( 'WCAPF_Product_Filter', 'instance' ) );
