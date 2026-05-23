<?php
/**
 * Main plugin registry.
 *
 * Holds helper instances accessed via wcapf().
 *
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan
 */

namespace WCAPF;

use WCAPF\Helpers\ActiveFilters;
use WCAPF\Helpers\AdminUrl;
use WCAPF\Helpers\Compat;
use WCAPF\Helpers\Data;
use WCAPF\Helpers\Notices;
use WCAPF\Helpers\Rating;
use WCAPF\Helpers\Settings;
use WCAPF\Hooks\PostType;
use WCAPF\Migration\V4Migration;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin registry.
 */
class Plugin {

	/**
	 * Settings helper.
	 *
	 * @var Settings
	 */
	public Settings $settings;

	/**
	 * Admin URL helper.
	 *
	 * @var AdminUrl
	 */
	public AdminUrl $admin_url;

	/**
	 * Compatibility helper.
	 *
	 * @var Compat
	 */
	public Compat $compat;

	/**
	 * Rating helper.
	 *
	 * @var Rating
	 */
	public Rating $rating;

	/**
	 * Notices helper.
	 *
	 * @var Notices
	 */
	public Notices $notices;

	/**
	 * Data helper.
	 *
	 * @var Data
	 */
	public Data $data;

	/**
	 * Active filters helper.
	 *
	 * @var ActiveFilters
	 */
	public ActiveFilters $active_filters;

	/**
	 * Filter and form post-type registration hooks.
	 *
	 * @var PostType
	 */
	public PostType $post_type;

	/**
	 * V3 → v4 data migration and review-filters notice.
	 *
	 * @var V4Migration
	 */
	public V4Migration $v4_migration;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->settings       = new Settings();
		$this->admin_url      = new AdminUrl();
		$this->compat         = new Compat();
		$this->rating         = new Rating();
		$this->notices        = new Notices();
		$this->data           = new Data();
		$this->active_filters = new ActiveFilters();

		$this->post_type    = new PostType();
		$this->v4_migration = new V4Migration();
	}
}
