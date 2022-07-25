<?php
/**
 * The single line rule row template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/meta-box/tab-content/visibility-rules
 * @author     wptools.io
 */

/**
 * @var array $taxonomies The list of taxonomies.
 * @var array $rule       The rule array.
 */

$selected_rule        = isset( $rule[0] ) ? $rule[0] : '';
$selected_operator    = isset( $rule[1] ) ? $rule[1] : '';
$selected_rule_option = isset( $rule[2] ) ? $rule[2] : '';
?>

<!--suppress HtmlFormInputWithoutLabel -->

<tr>
	<td class="param">
		<select class="rule">
			<option
				value="page"
				<?php echo 'page' === $selected_rule ? 'selected="selected"' : ''; ?>
			><?php esc_html_e( 'Page', 'wc-ajax-product-filter' ); ?></option>
			<optgroup label="<?php esc_attr_e( 'Archive', 'wc-ajax-product-filter' ); ?>">
				<?php
				foreach ( $taxonomies as $taxonomy_name => $taxonomy_label ) {
					$selected = $taxonomy_name === $selected_rule ? ' selected="selected"' : '';
					echo '<option value="' . $taxonomy_name . '"' . $selected . '>' . $taxonomy_label . '</option>';
				}
				?>
			</optgroup>
		</select>
	</td>
	<td class="operator">
		<select class="operator">
			<option
				value="equal"
				<?php echo 'equal' === $selected_operator ? 'selected="selected"' : ''; ?>
			><?php esc_html_e( 'is equal to', 'wc-ajax-product-filter' ); ?></option>
			<option
				value="not-equal"
				<?php echo 'not-equal' === $selected_operator ? 'selected="selected"' : ''; ?>
			><?php esc_html_e( 'is not equal to', 'wc-ajax-product-filter' ); ?></option>
		</select>
	</td>
	<td class="value">
		<?php
		if ( ! $selected_rule || 'page' === $selected_rule ) {
			$page_select_classes = 'for-page active';
		} else {
			$page_select_classes = 'for-page';
		}
		?>
		<select class="<?php echo $page_select_classes; ?>">
			<option value="shop"><?php esc_html_e( 'Shop', 'wc-ajax-product-filter' ); ?></option>
		</select>
		<?php
		foreach ( $taxonomies as $taxonomy_name => $taxonomy_label ) {
			$dropdown_classes = 'for-' . $taxonomy_name;

			if ( $selected_rule === $taxonomy_name ) {
				$dropdown_classes .= ' active';
			}

			wp_dropdown_categories(
				array(
					'taxonomy'     => $taxonomy_name,
					'hierarchical' => true,
					'hide_empty'   => false,
					'name'         => $taxonomy_name,
					'class'        => $dropdown_classes,
					'selected'     => $selected_rule_option,
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
