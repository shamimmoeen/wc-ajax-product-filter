<?php
/**
 * The admin settings page.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Admin class.
 */
class WCAPF_Admin {

	/**
	 * The constructor.
	 */
	private function __construct() {
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Admin();
			$instance->set_actions();
		}

		return $instance;
	}

	/**
	 * Sets the actions.
	 *
	 * @return void
	 */
	private function set_actions() {
		$hook = WCAPF_Helper::settings_page_hook();

		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_filter( 'set-screen-option', array( $this, 'list_table_set_option' ), 10, 3 );
		add_action( 'admin_footer-' . $hook, array( $this, 'render_pro_features_modal' ) );
		add_filter( 'plugin_action_links_' . WCAPF_PLUGIN_FILE, array( $this, 'plugin_action_links' ) );
		add_filter( 'admin_footer_text', array( $this, 'footer_text' ) );
	}

	/**
	 * Register the settings page.
	 *
	 * @return void
	 */
	public function register_settings_page() {
		add_options_page(
			__( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ),
			__( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ),
			'manage_options',
			'wc-ajax-product-filter',
			array( $this, 'renders_the_settings_page' )
		);
	}

	/**
	 * The settings page html markup.
	 *
	 * @return void
	 */
	public function renders_the_settings_page() {
		$this->get_template_loader()->load( 'admin/settings-page' );
	}

	/**
	 * Gets the instance of template loader class.
	 *
	 * @return WCAPF_Template_Loader|null
	 */
	private function get_template_loader() {
		return WCAPF_Template_Loader::get_instance();
	}

	/**
	 * Renders the pro features modal html markup.
	 *
	 * @return void
	 */
	public function render_pro_features_modal() {
		$this->get_template_loader()->load( 'pro-features-modal' );
	}

	/**
	 * Adds plugin's action links.
	 *
	 * @param array $links The default links.
	 *
	 * @return array The updated action links.
	 * @noinspection HtmlUnknownTarget
	 */
	public function plugin_action_links( $links ) {
		$settings_page_url = WCAPF_Helper::settings_page_url();

		$links[] = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $settings_page_url ),
			__( 'Settings', 'wc-ajax-product-filter' )
		);

		return $links;
	}

	/**
	 * Change the admin footer text.
	 *
	 * @param string $text The default footer text.
	 *
	 * @return string
	 * @noinspection HtmlUnknownTarget
	 */
	public function footer_text( $text ) {
		$screen = get_current_screen();
		$base   = isset( $screen->base ) ? $screen->base : '';

		if ( WCAPF_Helper::settings_page_hook() !== $base ) {
			return $text;
		}

		$rating_link = 'https://wordpress.org/plugins/wc-ajax-product-filter/#reviews';

		$give_rating = sprintf(
			'<a href="%1$s" target="_blank">%2$s</a>',
			esc_url( $rating_link ),
			__( 'give a rating', 'wc-ajax-product-filter' )
		);

		$text = sprintf(
			/* translators: plugin name, plugin review page link */
			__( 'Thank you for using %1$s! Your feedback and review both are import, %2$s.', 'wc-ajax-product-filter' ),
			'<b>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</b>',
			$give_rating
		);

		return '<i>' . $text . '</i>';
	}

}

if ( is_admin() ) {
	WCAPF_Admin::get_instance();
}
