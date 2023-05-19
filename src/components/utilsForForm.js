import { __ } from '@wordpress/i18n';
import { mergeSelectOptions } from './utils';
import { merge } from 'lodash';

export function defaultLocation() {
	return {
		location: 'product_archive_pages',
		sub_location: '',
		results_method: '',
		product_query: wcapf_admin_params.default_product_query || {},
	};
}

export function defaultFormSettings() {
	const defaultSettings = wcapf_admin_params.form_default_data;

	return merge({}, defaultSettings, { form_locations: [defaultLocation()] });
}

export function formLayoutOptions() {
	return [
		{
			label: __('Vertical', 'wc-ajax-product-filter'),
			value: 'vertical',
		},
		{
			label: __('Horizontal', 'wc-ajax-product-filter'),
			value: 'horizontal',
			isPro: true,
		},
	];
}

export function filterModeOptions() {
	return [
		{
			label: __('Immediate', 'wc-ajax-product-filter'),
			value: 'immediate',
		},
		{
			label: __('Apply', 'wc-ajax-product-filter'),
			value: 'apply',
			isPro: true,
		},
		{
			label: __('Submit', 'wc-ajax-product-filter'),
			value: 'submit',
			isPro: true,
		},
	];
}

export const proVisibilityOptions = [
	{
		label: __('Slide-out panel on desktop', 'wc-ajax-product-filter'),
		value: 'slide_out_panel_on_desktop',
	},
	{
		label: __('Slide-out panel on mobile', 'wc-ajax-product-filter'),
		value: 'slide_out_panel_on_mobile',
	},
	{
		label: __('Slide-out panel on both', 'wc-ajax-product-filter'),
		value: 'slide_out_panel_on_both',
	},
];

export function formVisibilityOptions() {
	const freeOptions = [
		{
			label: __('Always display', 'wc-ajax-product-filter'),
			value: 'always_display',
		},
		{
			label: __('Click button on desktop', 'wc-ajax-product-filter'),
			value: 'click_button_on_desktop',
		},
		{
			label: __('Click button on mobile', 'wc-ajax-product-filter'),
			value: 'click_button_on_mobile',
		},
		{
			label: __('Click button on both', 'wc-ajax-product-filter'),
			value: 'click_button_on_both',
		},
	];

	return mergeSelectOptions(freeOptions, proVisibilityOptions, true);
}
