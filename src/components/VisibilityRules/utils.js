import { __ } from '@wordpress/i18n';

export const placeholderRule = {
	rule: 'archive',
	operator: 'equal',
	page: '',
	user: '',
	archive: '',
	term: '',
	filter: '',
	filter_operator: 'active',
	filter_contains: '',
};

export function getVRRules() {
	return [
		{
			label: __('Archive', 'wc-ajax-product-filter'),
			value: 'archive',
		},
		{
			label: __('Page', 'wc-ajax-product-filter'),
			value: 'page',
		},
		{
			label: __('User', 'wc-ajax-product-filter'),
			value: 'user',
		},
		// {
		// 	label: __('Filter', 'wc-ajax-product-filter'),
		// 	value: 'filter',
		// },
	];
}

export function getVROperators() {
	return [
		{
			label: __('Equal', 'wc-ajax-product-filter'),
			value: 'equal',
		},
		{
			label: __('Not equal', 'wc-ajax-product-filter'),
			value: 'not-equal',
		},
	];
}

export function getVRFilterOperators() {
	return [
		{
			label: __('Active', 'wc-ajax-product-filter'),
			value: 'active',
		},
		{
			label: __('Not active', 'wc-ajax-product-filter'),
			value: 'not-active',
		},
	];
}

export function getVRTaxonomies() {
	return wcapf_admin_params.taxonomies_with_archive;
}

export function getVRUserOptions() {
	return [
		{
			label: __('Logged in', 'wc-ajax-product-filter'),
			value: 'logged-in',
		},
		{
			label: __('Logged out', 'wc-ajax-product-filter'),
			value: 'logged-out',
		},
		...wcapf_admin_params.user_roles,
	];
}

export function getVRGlobalFilterKeys(type, taxonomy, metaKey) {
	const globalFilters = wcapf_admin_params.global_filter_keys;

	const sanitized = globalFilters.filter((option) => {
		let secondaryType;

		if ('taxonomy' === type) {
			secondaryType = `${type}>${taxonomy}`;
		} else if ('post-meta' === type) {
			secondaryType = `${type}>${metaKey}`;
		}

		if (secondaryType !== option.secondary_type) {
			return option;
		}
	});

	return sanitized.map((option) => {
		const filterLabel = option.label;
		const filterKey = option._field_key;

		return {
			// label: `${filterLabel} (${filterKey})`,
			label: filterLabel,
			value: filterKey,
		};
	});
}
