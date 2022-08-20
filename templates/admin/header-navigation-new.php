<?php
/**
 * The template for displaying admin navigation.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin
 * @author     wptools.io
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $current_screen;
$current_screen_id = $current_screen->id;

$tabs = array(
	array(
		'text'      => __( 'Filters', 'wc-ajax-product-filter' ),
		'url'       => menu_page_url( 'wcapf-new', false ),
		'is_active' => $current_screen_id === 'toplevel_page_wcapf-new',
	),
	array(
		'text'      => __( 'Filter Forms', 'wc-ajax-product-filter' ),
		'url'       => menu_page_url( 'new-filter-forms', false ),
		'is_active' => $current_screen_id === 'wcapf_page_new-filter-forms',
	),
	array(
		'text'      => __( 'Settings', 'wc-ajax-product-filter' ),
		'url'       => menu_page_url( 'wcapf-new-settings', false ),
		'is_active' => $current_screen_id === 'wcapf_page_wcapf-new-settings',
	),
);

$tabs = apply_filters( 'wcapf_admin_navigation_tabs', $tabs );

// Bail early if set to false.
if ( $tabs === false ) {
	return;
}

$helper = new WCAPF_Helper;

$show_pro_offer    = $helper::show_pro_version_offer();
$found_pro_version = $helper::found_pro_version();
?>

<div class="wcapf-admin-toolbar">
	<h2>
		<i class="wcapf-tab-icon dashicons dashicons-filter"></i>
		<?php esc_html_e( 'WC Ajax Product Filter', 'wc-ajax-product-filter' ); ?>
	</h2>

	<?php
	foreach ( $tabs as $tab ) {
		/** @noinspection HtmlUnknownTarget */
		printf(
			'<a class="wcapf-tab%s" href="%s">%s</a>',
			! empty( $tab['is_active'] ) ? ' is-active' : '',
			esc_url( $tab['url'] ),
			wp_kses_post( $tab['text'] )
		);
	}
	?>

	<?php if ( $show_pro_offer && ! $found_pro_version ) : ?>
		<a target="_blank" href="https://wptools.io/wc-ajax-product-filter/?utm_source=wcapf-free" class="btn-upgrade">
			<span>
				<img src="<?php echo WCAPF_PLUGIN_URL . '/admin/images/pro-icon.png'; ?>" alt="pro-icon">
				<?php _e( 'Upgrade to Pro', 'wc-ajax-product-filter' ); ?>
			</span>
		</a>
	<?php endif; ?>

</div>
