<?php
/**
 * The single line rule row template.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/templates/admin/visibility-rules
 * @author     wptools.io
 */

?>

<tr>
	<td class="param">
		<select class="rule">
			<optgroup label="Post">
				<option value="post_type" selected="selected">Post Type</option>
				<option value="sticky_post">Sticky Post</option>
				<option value="post_status">Post Status</option>
				<option value="post_in_category">Post In Category</option>
				<option value="post_has_tag">Post Has Tag</option>
				<option value="post_id">Post ID</option>
			</optgroup>
			<optgroup label="Page">
				<option value="page_template">Page Template</option>
				<option value="page_type">Page Type</option>
				<option value="singular_page">Is Singular Page</option>
			</optgroup>
			<optgroup label="Archive">
				<option value="post_type_archive">Post Type Archive</option>
				<option value="category_archive">Category Archive</option>
				<option value="post_tag_archive">Tag Archive</option>
				<option value="author_archive">Author Archive</option>
			</optgroup>
			<optgroup label="User">
				<option value="user_role">User Role</option>
				<option value="user_id">User ID</option>
			</optgroup>
		</select>
	</td>
	<td class="operator">
		<select class="operator">
			<option value="equal" selected="selected">
				is equal to
			</option>
			<option value="not-equal">
				is not equal to
			</option>
		</select>
	</td>
	<td class="value">
		<select class="value">
			<option value="post" selected="selected">Post</option>
			<option value="page">Page</option>
			<option value="attachment">Media</option>
			<option value="product">Product</option>
			<option value="mailpoet_page">MailPoet Page</option>
		</select></td>
	<td class="add">
		<button class="button button-small button-secondary add-and-clause-btn"
				type="button">
			and
		</button>
	</td>
	<td class="remove">
		<span class="dashicons dashicons-remove remove-single-line-rule-btn"></span>
	</td>
</tr>
