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

global $submenu, $parent_file, $submenu_file, $plugin_page, $pagenow;

// Vars.
$parent_slug = 'edit.php?post_type=wcapf-filter';

// Generate array of navigation items.
$tabs = array();
if ( isset( $submenu[ $parent_slug ] ) ) {
	foreach ( $submenu[ $parent_slug ] as $i => $sub_item ) {

		// Ignore "Add New".
		if ( 'post-new.php?post_type=wcapf-filter' === $sub_item[2] ) {
			continue;
		}

		// Ignore "Account" coming from freemius.
		if ( 'wc-ajax-product-filter-account' === $sub_item[2] ) {
			continue;
		}

		// Define tab.
		$tab = array(
			'text' => $sub_item[0],
			'url'  => $sub_item[2],
		);

		// Convert submenu slug "test" to "$parent_slug&page=test".
		if ( ! strpos( $sub_item[2], '.php' ) ) {
			$tab['url'] = add_query_arg( array( 'page' => $sub_item[2] ), $parent_slug );
		}

		// Detect active state.
		if ( $submenu_file === $sub_item[2] || $plugin_page === $sub_item[2] ) {
			$tab['is_active'] = true;
		}

		$tabs[] = $tab;
	}
}

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
		<a target="_blank" href="https://wptools.io/wc-ajax-product-filter/?utm_source=WCAPF+Free&utm_medium=inside+plugin&utm_campaign=WCAPF+Pro+Upgrade" class="btn-upgrade">
			<span>
				<img src="<?php echo WCAPF_PLUGIN_URL . '/admin/images/pro-icon.png'; ?>" alt="pro-icon">
				<?php _e( 'Upgrade to Pro', 'wc-ajax-product-filter' ); ?>
			</span>
		</a>
	<?php endif; ?>

</div>
