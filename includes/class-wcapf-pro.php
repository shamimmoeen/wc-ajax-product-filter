<?php

class WCAPF_PRO {

	public function __construct() {
		add_filter( 'wcapf_filter_keys', array( $this, 'pro_filter_keys' ) );
	}

	public function pro_filter_keys( $keys ) {
		$taxonomies = get_object_taxonomies( 'product' );

		$excluded = array_merge( wc_get_attribute_taxonomy_names(), array(
			'product_cat',
			'product_tag',
		) );

		$allowed = array_diff( $taxonomies, $excluded );

		foreach ( $allowed as $taxonomy ) {
			$taxonomy_and_query_key = $taxonomy . 'a';
			$taxonomy_or_query_key  = $taxonomy . 'o';
			$taxonomy_and_query_key = str_replace( '_', '-', $taxonomy_and_query_key );
			$taxonomy_or_query_key  = str_replace( '_', '-', $taxonomy_or_query_key );

			$keys[ $taxonomy ] = array(
				'and' => $taxonomy_and_query_key,
				'or'  => $taxonomy_or_query_key,
			);
		}

		return $keys;
	}

}

new WCAPF_PRO();
