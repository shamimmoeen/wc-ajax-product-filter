import { __ } from '@wordpress/i18n';
import { mergeSelectOptions } from './utils';

const defaultLocation = {
	location: 'product_archive_pages',
	sub_location: '',
};

export function defaultFormSettings() {
	return {
		form_locations: [defaultLocation],
		products_loop_container: '',
		priority: '0',
		form_layout: 'vertical',
		columns_per_row: '4',
		show_form_on_top_of_products: '1',
		filter_mode: 'immediate',
		form_visibility: 'always_display',
		show_clear_btn: '',
	};
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
