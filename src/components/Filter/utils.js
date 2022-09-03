import { __ } from '@wordpress/i18n';
import { find } from 'lodash';

export function filterDefaultData() {
	return {
		show_title: '1',
		field_key: '',
		taxonomy: '',
		display_type: 'checkbox',
		query_type: 'and',
		all_items_label: '',
		use_chosen: '',
		chosen_no_results_message: '',
		enable_multiple_filter: '',
		show_count: '',
		hide_empty: '',
		enable_tooltip: '',
		show_count_in_tooltip: '',
		tooltip_position: '',
		custom_appearance_options: {},
		use_term_slug_in_url: '',
		limit_options: '',
		parent_term: '',
		limit_values_by_id: '',
		exclude_values_id: '',
		show_clear_button: '',
		order_terms_by: 'name',
		order_terms_dir: 'asc',
		enable_accordion: '',
		accordion_default_state: 'expanded',
		enable_soft_limit: '',
		soft_limit: '',
		type: '',
		field_id: '',
		enable_visibility_rules: '',
		visibility_rules: [],
		get_options: 'automatically',
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
			defaultFilterKey: '_product_cat',
		},
		{
			title: __('Tag', 'wc-ajax-product-filter'),
			type: 'tag',
			defaultFilterKey: '_product_tag',
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
			defaultFilterKey: '_status',
		},
		{
			title: __('Post Property', 'wc-ajax-product-filter'),
			type: 'post-property',
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
			title: __('Sort by', 'wc-ajax-product-filter'),
			type: 'sort-by',
			defaultFilterKey: '_sort_by',
			isPro: true,
		},
		{
			title: __('Per page', 'wc-ajax-product-filter'),
			type: 'per-page',
			defaultFilterKey: '_per_page',
			isPro: true,
		},
		{
			title: __('Reset Button', 'wc-ajax-product-filter'),
			type: 'reset-button',
		},
	];
}

export function getTooltipPositionOptions() {
	return [
		{
			label: __('Top', 'wc-ajax-product-filter'),
			value: 'top',
		},
		{
			label: __('Right', 'wc-ajax-product-filter'),
			value: 'right',
		},
		{
			label: __('Bottom', 'wc-ajax-product-filter'),
			value: 'bottom',
		},
		{
			label: __('Left', 'wc-ajax-product-filter'),
			value: 'left',
		},
	];
}

export function getTaxonomyLimitByOptions() {
	return [
		{
			label: __('Off', 'wc-ajax-product-filter'),
			value: 'off',
		},
		{
			label: __('Include terms', 'wc-ajax-product-filter'),
			value: 'include',
		},
		{
			label: __('Exclude terms', 'wc-ajax-product-filter'),
			value: 'exclude',
		},
		{
			label: __('Child of', 'wc-ajax-product-filter'),
			value: 'child',
			isPro: true,
		},
	];
}

export function getOrderByOptions() {
	return [
		{
			label: __('ID', 'wc-ajax-product-filter'),
			value: 'id',
		},
		{
			label: __('Name', 'wc-ajax-product-filter'),
			value: 'name',
		},
		{
			label: __('Slug', 'wc-ajax-product-filter'),
			value: 'slug',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
	];
}

export function getOrderDirectionOptions() {
	return [
		{
			label: __('ASC', 'wc-ajax-product-filter'),
			value: 'asc',
		},
		{
			label: __('DESC', 'wc-ajax-product-filter'),
			value: 'desc',
		},
	];
}
