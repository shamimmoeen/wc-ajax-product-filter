import { __ } from '@wordpress/i18n';
import { mergeSelectOptions } from './utils';

export function defaultFormSettings() {
	return {
		filter_mode: 'immediate',
		form_visibility: 'always_display',
		show_form_title: '',
		show_active_filters: '',
		show_reset_button: '',
		place_for: '', // Mask it
	};
}

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

	const proOptions = [
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

	return mergeSelectOptions(freeOptions, proOptions, true);
}
