<?php
/**
 * Main admin class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Admin class.
 *
 * @since 3.0.0
 */
class WCAPF_Admin {

	/**
	 * The constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'register_settings_page' ) );
		add_filter( 'admin_footer_text', array( $this, 'footer_text' ) );
		add_filter( 'in_admin_header', array( $this, 'render_header_navigation' ) );

		$plugin_file = plugin_basename( WCAPF_PLUGIN_FILE );
		add_filter( 'plugin_action_links_' . $plugin_file, array( $this, 'plugin_action_links' ) );

		add_action( 'admin_footer-widgets.php', array( $this, 'js_scripts_for_legacy_widget' ) );
	}

	/**
	 * Register the settings page.
	 *
	 * @return void
	 */
	public function register_settings_page() {
		add_submenu_page(
			'edit.php?post_type=wcapf-filter',
			__( 'WC Ajax Product Filter Settings', 'wc-ajax-product-filter' ),
			__( 'Settings', 'wc-ajax-product-filter' ),
			'manage_options',
			'wcapf-settings',
			array( $this, 'settings_page_html' )
		);
	}

	/**
	 * The settings page html markup.
	 *
	 * @return void
	 */
	public function settings_page_html() {
		WCAPF_Template_Loader::get_instance()->load( 'admin/settings-page' );
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
		global $typenow;

		if ( 'wcapf-filter' !== $typenow ) {
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
			__( 'Thank you for using %1$s! Would you mind taking a few seconds to give it a 5-star rating on WordPress?, %2$s.', 'wc-ajax-product-filter' ),
			'<b>' . __( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ) . '</b>',
			$give_rating
		);

		return '<i>' . $text . '</i>';
	}

	/**
	 * Renders the header navigation in admin area.
	 *
	 * @TODO: Remove this.
	 *
	 * @return void
	 */
	public function render_header_navigation() {
		global $typenow;

		if ( 'wcapf-filter' !== $typenow && 'wcapf-form' !== $typenow ) {
			return;
		}

		WCAPF_Template_Loader::get_instance()->load( 'admin/header-navigation' );
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

		$new_links = array();

		$new_links[] = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( $settings_page_url ),
			__( 'Settings', 'wc-ajax-product-filter' )
		);

		return array_merge( $new_links, $links );
	}

	/**
	 * Run the js scripts when the 'widget-added' event is triggered.
	 *
	 * @since 3.1.0
	 *
	 * @return void
	 */
	public function js_scripts_for_legacy_widget() {
		?>
		<!--suppress ES6ConvertVarToLetConst -->
		<script>
			( function( $ ) {
				$( document ).on( 'widget-added', function( e, $control ) {
					$control.find( '.wcapf-widget-dropdown-field' ).on( 'change', function() {
						var $dropdown        = $( this );
						var $selectedOption  = $( this ).find( 'option:selected' );
						var editLink         = $selectedOption.attr( 'data-edit-link' );
						var $editLink        = $dropdown.closest( '.widget-content' ).find( '.edit-link' );
						var $editLinkWrapper = $editLink.parent();

						$( $editLink.attr( 'href', editLink ) );

						if ( ! editLink.length ) {
							$editLinkWrapper.hide();
						} else {
							$editLinkWrapper.show();
						}
					} );
				} );
			} )( jQuery );
		</script>
		<?php
	}

}

if ( is_admin() ) {
	new WCAPF_Admin();
}
