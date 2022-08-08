import { __ } from '@wordpress/i18n';
import { find } from 'lodash';

function filterDefaultData() {
	return {
		show_title: true,
		field_key: '',
		taxonomy: '',
		display_type: '',
		query_type: '',
		all_items_label: '',
		use_chosen: false,
		chosen_no_results_message: '',
		enable_multiple_filter: false,
		show_count: false,
		hide_empty: false,
		enable_tooltip: false,
		show_count_in_tooltip: false,
		tooltip_position: '',
		custom_appearance_options: {},
		use_term_slug_in_url: false,
		limit_options: 'off',
		parent_term: '',
		limit_values_by_id: '',
		exclude_values_id: '',
		show_clear_button: true,
		order_terms_by: 'name',
		order_terms_dir: 'asc',
		enable_accordion: false,
		accordion_default_state: 'expanded',
		enable_soft_limit: false,
		soft_limit: '',
		type: '',
		field_id: '',
		enable_visibility_rules: false,
		visibility_rules: [],
	};
}

export function getFilterDefaultData(type) {
	const defaultData = filterDefaultData();

	const filterData = find(getAvailableFilters(), { type });
	const defaultFilterKey = filterData.defaultFilterKey;

	if (defaultFilterKey) {
		return { ...defaultData, type, field_key: defaultFilterKey };
	}

	return { ...defaultData, type };
}

export function getAvailableFilters() {
	return [
		{
			title: __('Active Filters', 'wc-ajax-product-filter'),
			type: 'active-filters',
		},
		{
			title: __('Category', 'wc-ajax-product-filter'),
			type: 'category',
			defaultFilterKey: '_product-cat',
		},
		{
			title: __('Tag', 'wc-ajax-product-filter'),
			type: 'tag',
			defaultFilterKey: '_product-tag',
		},
		{
			title: __('Attribute', 'wc-ajax-product-filter'),
			type: 'attribute',
		},
		{
			title: __('Price', 'wc-ajax-product-filter'),
			type: 'price',
			defaultFilterKey: '_price',
		},
		{
			title: __('Rating', 'wc-ajax-product-filter'),
			type: 'rating',
			defaultFilterKey: '_rating',
		},
		{
			title: __('Product Status', 'wc-ajax-product-filter'),
			type: 'product-status',
			defaultFilterKey: '_product-status',
		},
		{
			title: __('Custom Taxonomy', 'wc-ajax-product-filter'),
			type: 'custom-taxonomy',
			isPro: true,
		},
		{
			title: __('Post Meta', 'wc-ajax-product-filter'),
			type: 'post-meta',
			isPro: true,
		},
		{
			title: __('Post Property', 'wc-ajax-product-filter'),
			type: 'post-property',
			isPro: true,
		},
		{
			title: __('Sort by', 'wc-ajax-product-filter'),
			type: 'sort-by',
			defaultFilterKey: '_sort-by',
			isPro: true,
		},
		{
			title: __('Per page', 'wc-ajax-product-filter'),
			type: 'per-page',
			defaultFilterKey: '_per-page',
			isPro: true,
		},
		{
			title: __('Reset Button', 'wc-ajax-product-filter'),
			type: 'reset-button',
		},
	];
}

export function foundProVersion() {
	return wcapf_admin_params.foundPro;
}
