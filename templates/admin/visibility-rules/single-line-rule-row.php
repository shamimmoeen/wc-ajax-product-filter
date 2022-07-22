<?php
/**
 * The single line rule row template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/visibility-rules
 * @author     wptools.io
 */

/**
 * @var array $taxonomies The list of taxonomies.
 */

?>

<!--suppress HtmlFormInputWithoutLabel -->

<tr>
	<td class="param">
		<select class="rule">
			<option value="page"><?php esc_html_e( 'Page', 'wc-ajax-product-filter' ); ?></option>
			<optgroup label="<?php esc_attr_e( 'Taxonomy', 'wc-ajax-product-filter' ); ?>">
				<?php
				foreach ( $taxonomies as $taxonomy_name => $taxonomy_label ) {
					echo '<option value="' . $taxonomy_name . '">' . $taxonomy_label . '</option>';
				}
				?>
			</optgroup>
		</select>
	</td>
	<td class="operator">
		<select class="operator">
			<option value="equal">
				<?php esc_html_e( 'is equal to', 'wc-ajax-product-filter' ); ?>
			</option>
			<option value="not-equal">
				<?php esc_html_e( 'is not equal to', 'wc-ajax-product-filter' ); ?>
			</option>
		</select>
	</td>
	<td class="value">
		<select class="for-page">
			<option value="post"><?php esc_html_e( 'Shop', 'wc-ajax-product-filter' ); ?></option>
		</select>
		<?php
		foreach ( $taxonomies as $taxonomy_name => $taxonomy_label ) {
			wp_dropdown_categories(
				array(
					'taxonomy'     => $taxonomy_name,
					'hierarchical' => true,
					'hide_empty'   => false
				)
			);
		}
		?>
	</td>
	<td class="add">
		<button class="button button-small button-secondary add-and-clause-btn" type="button">
			<?php esc_html_e( 'and', 'wc-ajax-product-filter' ); ?>
		</button>
	</td>
	<td class="remove">
		<span class="dashicons dashicons-remove remove-single-line-rule-btn"></span>
	</td>
</tr>
