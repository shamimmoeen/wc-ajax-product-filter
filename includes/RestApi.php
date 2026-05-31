<?php
/**
 * wcapf/v1 REST API coordinator. Instantiates the per-resource controllers
 * (forms, settings, data sources, notices); each registers its own routes
 * on rest_api_init.
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

use WCAPF\RestApi\DataSourcesController;
use WCAPF\RestApi\FormsController;
use WCAPF\RestApi\NoticesController;
use WCAPF\RestApi\SettingsController;

/**
 * Holds the per-resource controllers as typed public properties so themes /
 * plugins can detach individual routes the WC()->cart way.
 */
class RestApi {

	/**
	 * Forms + filters CRUD controller.
	 *
	 * @var FormsController
	 */
	public FormsController $forms;

	/**
	 * Plugin settings controller.
	 *
	 * @var SettingsController
	 */
	public SettingsController $settings;

	/**
	 * Dropdown / modal data sources controller.
	 *
	 * @var DataSourcesController
	 */
	public DataSourcesController $data_sources;

	/**
	 * Notice-dismiss controller.
	 *
	 * @var NoticesController
	 */
	public NoticesController $notices;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->forms        = new FormsController();
		$this->settings     = new SettingsController();
		$this->data_sources = new DataSourcesController();
		$this->notices      = new NoticesController();
	}
}
