<?php
/**
 * The single line rule template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/visibility-rules
 * @author     wptools.io
 */

?>

<div class="single-line-rule">
	<table>
		<tbody>
			<?php
			WCAPF_Template_Loader::get_instance()->load(
				'admin/visibility-rules/single-line-rule-row'
			);
			?>
		</tbody>
	</table>
	<p>or</p>
</div>
