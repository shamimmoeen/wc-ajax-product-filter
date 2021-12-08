<?php
/**
 * The settings page template.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates
 * @author     Mainul Hassan Main
 */

$wcapf_tab             = WCAPF_Helper::get_current_tab();
$wcapf_template_loader = WCAPF_Template_Loader::get_instance();
?>

<div class="wrap">
	<h1 class="wp-heading-inline">
		<?php echo esc_html( get_admin_page_title() ); ?>
	</h1>

	<hr class="wp-header-end">

	<h2 class="nav-tab-wrapper">
		<a
			href="<?php echo esc_url( WCAPF_Helper::settings_page_url() ); ?>"
			class="nav-tab <?php echo 'search-form' === $wcapf_tab ? esc_attr( 'nav-tab-active' ) : ''; ?>"
		>
			<?php esc_html_e( 'Search Form', 'wc-ajax-product-filter' ); ?>
		</a>
		<a
			href="<?php echo esc_url( WCAPF_Helper::settings_page_tab_url() ); ?>"
			class="nav-tab <?php echo 'settings' === $wcapf_tab ? esc_attr( 'nav-tab-active' ) : ''; ?>"
		>
			<?php esc_html_e( 'Settings', 'wc-ajax-product-filter' ); ?>
		</a>
	</h2>

	<div id="poststuff">
		<div id="post-body" class="columns-2">
			<div id="post-body-content">
				<?php
				if ( 'search-form' === $wcapf_tab ) {
					$wcapf_template_loader->load( 'admin/search-form' );
				} else {
					$wcapf_template_loader->load( 'admin/settings' );
				}
				?>
			</div>
			<div id="postbox-container-1" class="postbox-container">
				<?php $wcapf_template_loader->load( 'admin/sidebar' ); ?>
			</div>
		</div>
	</div>
</div>
