<?php
/**
 * The single line rule template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box/tab-content/visibility-rules
 * @author     wptools.io
 */

/**
 * @var array $taxonomies The list of taxonomies.
 * @var array $rules      The rules array.
 */
?>

<div class="single-line-rule">
	<table>
		<tbody>
			<?php
			if ( $rules ) {
				foreach ( $rules as $rule ) {
					WCAPF_Template_Loader::get_instance()->load(
						'admin/meta-box/tab-content/visibility-rules/single-line-rule-row',
						array( 'taxonomies' => $taxonomies, 'rule' => $rule )
					);
				}
			} else {
				WCAPF_Template_Loader::get_instance()->load(
					'admin/meta-box/tab-content/visibility-rules/single-line-rule-row',
					array( 'taxonomies' => $taxonomies, 'rule' => array() )
				);
			}
			?>
		</tbody>
	</table>
	<p><?php esc_html_e( 'or', 'wc-ajax-product-filter' ); ?></p>
</div>
