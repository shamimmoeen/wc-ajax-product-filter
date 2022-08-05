import { __ } from '@wordpress/i18n';

export function getAvailableFilters() {
	return [
		{
			title: __('Active Filters', 'wc-ajax-product-filter'),
			type: 'active-filters',
		},
		{
			title: __('Category', 'wc-ajax-product-filter'),
			type: 'category',
		},
		{
			title: __('Tag', 'wc-ajax-product-filter'),
			type: 'tag',
		},
		{
			title: __('Attribute', 'wc-ajax-product-filter'),
			type: 'attribute',
		},
		{
			title: __('Price', 'wc-ajax-product-filter'),
			type: 'price',
		},
		{
			title: __('Rating', 'wc-ajax-product-filter'),
			type: 'rating',
		},
		{
			title: __('Product Status', 'wc-ajax-product-filter'),
			type: 'product-status',
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
			isPro: true,
		},
		{
			title: __('Per page', 'wc-ajax-product-filter'),
			type: 'per-page',
			isPro: true,
		},
		{
			title: __('Reset Button', 'wc-ajax-product-filter'),
			type: 'reset-button',
		},
	];
}
