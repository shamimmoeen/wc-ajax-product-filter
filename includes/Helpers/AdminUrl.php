<?php
/**
 * Admin URL helper.
 *
 * Builds URLs to plugin admin pages.
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
 * Admin URL helper.
 */
class AdminUrl {

	/**
	 * URL to edit a specific form.
	 *
	 * @param int $form_id The form id.
	 *
	 * @return string
	 */
	public function form_edit( int $form_id ): string {
		$forms_page_url = admin_url( 'admin.php?page=wcapf' );

		return add_query_arg( 'id', $form_id, $forms_page_url );
	}

	/**
	 * URL to the forms list page.
	 *
	 * @return string
	 */
	public function forms_page(): string {
		return menu_page_url( 'wcapf', false );
	}

	/**
	 * URL to the SEO rules page.
	 *
	 * @return string
	 */
	public function seo_rules_page(): string {
		return menu_page_url( 'wcapf-seo-rules', false );
	}

	/**
	 * URL to the settings page.
	 *
	 * @return string
	 */
	public function settings_page(): string {
		return menu_page_url( 'wcapf-settings', false );
	}

	/**
	 * URL to the upgrade page.
	 *
	 * @return string
	 */
	public function upgrade_page(): string {
		return menu_page_url( 'wcapf-upgrade', false );
	}
}
