<?php

class WCAPF_Utils {

	/**
	 * Gets the filter keys.
	 *
	 * @return array
	 */
	public function get_taxonomy_filter_keys() {
		$keys = array(
			'product_cat' => array(
				'and' => 'product-cata',
				'or'  => 'product-cato',
			),
			'product_tag' => array(
				'and' => 'product-taga',
				'or'  => 'product-tago',
			),
		);

		$attribute_taxonomies = wc_get_attribute_taxonomies();

		foreach ( $attribute_taxonomies as $attribute_taxonomy ) {
			$name     = $attribute_taxonomy->attribute_name;
			$taxonomy = wc_attribute_taxonomy_name( $name );

			$keys[ $taxonomy ] = array(
				'and' => 'attra-' . $name,
				'or'  => 'attro-' . $name,
			);
		}

		return apply_filters( 'wcapf_filter_keys', $keys );
	}

	/**
	 * Gets the child term ids for the given parent term.
	 *
	 * @param int    $term_id  The term id.
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return array
	 */
	public function get_term_childs( $term_id, $taxonomy ) {
		$transient_name = 'wcapf_term_childs_' . md5( $term_id . $taxonomy );
		$term_childs    = get_transient( $transient_name );

		if ( false === $term_childs ) {
			$term_childs = get_term_children( $term_id, $taxonomy );

			if ( is_wp_error( $term_childs ) ) {
				$term_childs = array();
			}

			set_transient( $transient_name, $term_childs, WCAPF_CACHE_TIME );
		}

		return $term_childs;
	}

	/**
	 * Gets the ancestor term ids for the given child term.
	 *
	 * @param int    $term_id  The term id.
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return array
	 */
	public function get_term_ancestors( $term_id, $taxonomy ) {
		$transient_name = 'wcapf_term_ancestors_' . md5( $term_id . $taxonomy );
		$term_ancestors = get_transient( $transient_name );

		if ( false === $term_ancestors ) {
			$term_ancestors = get_ancestors( $term_id, $taxonomy );
			set_transient( $transient_name, $term_ancestors );
		}

		// if found then add current term id to this array
		if ( sizeof( $term_ancestors ) > 0 ) {
			array_push( $term_ancestors, $term_id );
		}

		return $term_ancestors;
	}

	public function get_term_data( $term_id, $taxonomy ) {
		$transient_name = 'wcapf_term_data_' . md5( $term_id . $taxonomy );

		if ( false === ( $term_data = get_transient( $transient_name ) ) ) {
			$term_data = get_term( $term_id, $taxonomy );
			set_transient( $transient_name, $term_data, WCAPF_CACHE_TIME );
		}

		return $term_data;
	}

	public function get_term_objects( $term_id, $taxonomy ) {
		global $wcapf;
		$unfiltered_product_ids = $wcapf->unfilteredProductIds();

		$transient_name = 'wcapf_term_objects_' . md5( sanitize_key( $taxonomy ) . sanitize_key( $term_id ) );

		if ( false === ( $objects_in_term = get_transient( $transient_name ) ) ) {
			$objects_in_term = get_objects_in_term( $term_id, $taxonomy );
			$objects_in_term = array_intersect( $objects_in_term, $unfiltered_product_ids );
			set_transient( $transient_name, $objects_in_term, WCAPF_CACHE_TIME );
		}

		return (array) $objects_in_term;
	}

	public function get_term_products( $term_id, $taxonomy ) {
		$products_in_term = wcapf_get_term_objects( $term_id, $taxonomy );
		$term_childs      = wcapf_get_term_childs( $term_id, $taxonomy );

		if ( is_array( $term_childs ) && sizeof( $term_childs ) > 0 ) {
			foreach ( $term_childs as $term_child ) {
				$products_in_term = array_merge( $products_in_term, wcapf_get_term_objects( $term_child, $taxonomy ) );
			}
		}

		return array_unique( $products_in_term );
	}

	public function clear_transients() {
		global $wpdb;
		$sql = "DELETE FROM $wpdb->options WHERE `option_name` LIKE ('%\_transient_wcapf\_%') OR `option_name` LIKE ('%\_transient_timeout_wcapf\_%')";

		return $wpdb->query( $sql );
	}

}
