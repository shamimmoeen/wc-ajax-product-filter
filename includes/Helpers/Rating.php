<?php
/**
 * Rating helper.
 *
 * Builds rating star markup (text entities, icon HTML, and icon class set).
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/Helpers
 * @author     Mainul Hassan
 */

namespace WCAPF\Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Rating helper.
 */
class Rating {

	/**
	 * Rating markup using the Unicode star entity (one star per rating point).
	 *
	 * @param int $rating Rating value.
	 *
	 * @return string
	 */
	public function entities( int $rating ): string {
		$rating_entities = '';

		while ( $rating > 0 ) {
			// @source https://www.htmlsymbols.xyz/unicode/U+2B50
			$rating_entities .= '&#11088;';
			--$rating;
		}

		return $rating_entities;
	}

	/**
	 * Rating markup using icon tags (Font Awesome or built-in icon font).
	 *
	 * @param int $rating Rating value.
	 *
	 * @return string
	 */
	public function icons( int $rating ): string {
		$rating_html = '';
		$star_icons  = $this->star_icons();

		$remaining = 5 - $rating;

		while ( $rating > 0 ) {
			$rating_html .= $star_icons['star_full'];
			--$rating;
		}

		$show_empty_stars = apply_filters( 'wcapf_show_empty_star_in_rating', false );

		if ( $show_empty_stars ) {
			while ( $remaining > 0 ) {
				$rating_html .= $star_icons['star_empty'];
				--$remaining;
			}
		}

		return $rating_html;
	}

	/**
	 * Star icon markup keyed by state (full/empty/half).
	 *
	 * Uses Font Awesome tags when the setting is on, otherwise the bundled icon font.
	 *
	 * @return array<string, string> Keys: star_full, star_empty, star_half.
	 */
	public function star_icons(): array {
		if ( wcapf()->settings->get( 'rating_star_use_fontawesome' ) ) {
			$star_full  = '<i class="fa-solid fa-star wcapf-star-icon"></i>';
			$star_empty = '<i class="fa-regular fa-star wcapf-star-icon"></i>';
			$star_half  = '<i class="fa-solid fa-star-half-stroke wcapf-star-icon"></i>';
		} else {
			$star_full  = '<i class="wcapf-icon-star-full wcapf-star-icon"></i>';
			$star_empty = '<i class="wcapf-icon-star-empty wcapf-star-icon"></i>';
			$star_half  = '<i class="wcapf-icon-star-half wcapf-star-icon"></i>';
		}

		return compact( 'star_full', 'star_empty', 'star_half' );
	}
}
