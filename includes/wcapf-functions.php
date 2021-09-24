<?php
/**
 * Helper functions.
 *
 * @package    WC_Ajax_Product_Filter
 * @subpackage Functions
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Get current page URL with various filtering props supported by WC.
 *
 * @since 3.0.0
 *
 * @return string
 * @see   WC_Widget()->get_current_page_url()
 */
function wcapf_get_current_page_url() {
	$queried_object = get_queried_object();
	$link           = '';

	if ( defined( 'SHOP_IS_ON_FRONT' ) ) {
		$link = home_url();
	} elseif ( is_shop() ) {
		$link = get_permalink( wc_get_page_id( 'shop' ) );
	} elseif ( is_product_category() ) {
		$link = get_term_link( get_query_var( 'product_cat' ), 'product_cat' );
	} elseif ( is_product_tag() ) {
		$link = get_term_link( get_query_var( 'product_tag' ), 'product_tag' );
	} elseif ( $queried_object ) {
		$link = get_term_link( $queried_object->slug, $queried_object->taxonomy );
	}

	// Min/Max.
	if ( isset( $_GET['min_price'] ) ) {
		$link = add_query_arg( 'min_price', wc_clean( wp_unslash( $_GET['min_price'] ) ), $link );
	}

	if ( isset( $_GET['max_price'] ) ) {
		$link = add_query_arg( 'max_price', wc_clean( wp_unslash( $_GET['max_price'] ) ), $link );
	}

	// Order by.
	if ( isset( $_GET['orderby'] ) ) {
		$link = add_query_arg( 'orderby', wc_clean( wp_unslash( $_GET['orderby'] ) ), $link );
	}

	/*
	 * Search Arg.
	 * To support quote characters, first they are decoded from &quot; entities, then URL encoded.
	 */
	if ( get_search_query() ) {
		$link = add_query_arg( 's', rawurlencode( htmlspecialchars_decode( get_search_query() ) ), $link );
	}

	// Post Type Arg.
	if ( isset( $_GET['post_type'] ) ) {
		$link = add_query_arg( 'post_type', wc_clean( wp_unslash( $_GET['post_type'] ) ), $link );
	}

	// Min Rating Arg.
	if ( isset( $_GET['rating_filter'] ) ) {
		$link = add_query_arg( 'rating_filter', wc_clean( wp_unslash( $_GET['rating_filter'] ) ), $link );
	}

	// All current filters.
	if ( $_chosen_attributes = WC_Query::get_layered_nav_chosen_attributes() ) {
		// phpcs:ignore Squiz.PHP.DisallowMultipleAssignments.Found, WordPress.CodeAnalysis.AssignmentInCondition.Found
		foreach ( $_chosen_attributes as $name => $data ) {
			$filter_name = sanitize_title( str_replace( 'pa_', '', $name ) );

			if ( ! empty( $data['terms'] ) ) {
				$link = add_query_arg( 'filter_' . $filter_name, implode( ',', $data['terms'] ), $link );
			}

			if ( 'or' === $data['query_type'] ) {
				$link = add_query_arg( 'query_type_' . $filter_name, 'or', $link );
			}
		}
	}

	return $link;
}

/**
 * Builds the query string.
 *
 * @param int        $key             the key identifier
 * @param int|string $value           the value
 * @param bool       $multiple_filter is multiple filter enabled
 *
 * @return string the query string
 */
function wcapf_build_query_string( $key, $value, $multiple_filter = true ) {
	$base_url = wcapf_get_current_page_url();
	$query    = wcapf_build_query( $key, $value, $multiple_filter );
	// return $query;
	$link = rawurldecode( add_query_arg( $query, $base_url ) );

	// https://wordpress.stackexchange.com/questions/294213/add-query-arg-one-key-with-multiple-values/294219#294219
	// $link = preg_replace('/\[\d*\]/', '', $link);

	return $link;
}

function wcapf_build_query( $key, $value, $multiple_filter = true, $query = null ) {
	if ( null === $query ) {
		$uri = $_SERVER['QUERY_STRING'];
		parse_str( $uri, $query );
	}

	// single filter
	// if key exists in url and value is same then unset it
	// otherwise change the value

	if ( ! $multiple_filter ) {
		if ( array_key_exists( $key, $query ) && $query[ $key ] == $value ) {
			unset( $query[ $key ] );
		} else {
			$query[ $key ] = $value;
		}
	}

	/*
	 * Multiple filter
	 *
	 * if key doesn't exist in url then add the key, value
	 * if key and value both exist in the url then unset it
	 * otherwise append the value in the key array
	 */

	if ( $multiple_filter ) {
		if ( ! array_key_exists( $key, $query ) ) {
			$query[ $key ] = array( $value );
		} elseif ( in_array( $value, $query[ $key ] ) ) {
			$sub_key = array_search( $value, $query[ $key ] );

			if ( false !== $sub_key ) {
				unset( $query[ $key ][ $sub_key ] );
				$query[ $key ] = array_values( $query[ $key ] );
			}

			if ( ! $query[ $key ] ) {
				unset( $query[ $key ] );
			}
		} else {
			$query[ $key ][] = $value;
		}
	}

	return $query;
}
