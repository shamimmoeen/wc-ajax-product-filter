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
use WCAPF\Helpers\Api;
use WCAPF\Helpers\Compat;
use WCAPF\Helpers\Data;
use WCAPF\Helpers\Notices;
use WCAPF\Helpers\Rating;
use WCAPF\Helpers\Settings;
use WCAPF\Helpers\Template;
use WCAPF\Hooks\LegacyTemplatePath;
use WCAPF\Hooks\PostAuthorFilter;
use WCAPF\Hooks\PostType;
use WCAPF\Hooks\RatingFilter;
use WCAPF\Hooks\Shop;
use WCAPF\Hooks\TaxonomyFilter;
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
	 * Template helper.
	 *
	 * @var Template
	 */
	public Template $template;

	/**
	 * Admin-API data helper.
	 *
	 * @var Api
	 */
	public Api $api;

	/**
	 * Filter and form post-type registration hooks.
	 *
	 * @var PostType
	 */
	public PostType $post_type;

	/**
	 * Post-author filter behavior hooks.
	 *
	 * @var PostAuthorFilter
	 */
	public PostAuthorFilter $post_author_filter;

	/**
	 * Rating filter behavior hooks.
	 *
	 * @var RatingFilter
	 */
	public RatingFilter $rating_filter;

	/**
	 * Taxonomy filter behavior hooks.
	 *
	 * @var TaxonomyFilter
	 */
	public TaxonomyFilter $taxonomy_filter;

	/**
	 * WooCommerce shop-loop integration hooks.
	 *
	 * @var Shop
	 */
	public Shop $shop;

	/**
	 * Pre-v3 theme template override fallback.
	 *
	 * @var LegacyTemplatePath
	 */
	public LegacyTemplatePath $legacy_template_path;

	/**
	 * V3 → v4 data migration and review-filters notice.
	 *
	 * @var V4Migration
	 */
	public V4Migration $v4_migration;

	/**
	 * Default-settings seeding on activation and update.
	 *
	 * @var Setup
	 */
	public Setup $setup;

	/**
	 * Frontend script and style enqueuing.
	 *
	 * @var FrontendScripts
	 */
	public FrontendScripts $frontend_scripts;

	/**
	 * Admin-ajax endpoints backing the React admin UI.
	 *
	 * @var Ajax
	 */
	public Ajax $ajax;

	/**
	 * Admin pages, assets, and review notices. Null on non-admin requests.
	 *
	 * @var Admin|null
	 */
	public ?Admin $admin = null;

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
		$this->template       = new Template();
		$this->api            = new Api();

		$this->post_type            = new PostType();
		$this->post_author_filter   = new PostAuthorFilter();
		$this->rating_filter        = new RatingFilter();
		$this->taxonomy_filter      = new TaxonomyFilter();
		$this->shop                 = new Shop();
		$this->legacy_template_path = new LegacyTemplatePath();
		$this->v4_migration         = new V4Migration();
		$this->setup                = new Setup();

		$this->frontend_scripts = new FrontendScripts();
		$this->ajax             = new Ajax();

		if ( is_admin() ) {
			$this->admin = new Admin();
		}

		add_action(
			'widgets_init',
			static function () {
				register_widget( Widgets\Form::class );
				register_widget( Widgets\LegacyFilter::class );
			}
		);

		add_shortcode( 'wcapf_form', array( new Shortcodes\Form(), 'render' ) );
		add_shortcode( 'wcapf_filter', array( new Shortcodes\LegacyFilter(), 'render' ) );
		add_shortcode( 'wcapf_active_filters', array( new Shortcodes\ActiveFilters(), 'render' ) );
		add_shortcode( 'wcapf_reset_button', array( new Shortcodes\ResetButton(), 'render' ) );
	}
}
