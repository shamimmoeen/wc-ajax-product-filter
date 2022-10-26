import { __ } from '@wordpress/i18n';
import { foundProVersion } from '../utils';
import { getTableData } from './utils';
import { isEmpty } from 'lodash';

const softLimitDisabledDisplayTypes = ['select', 'multi-select'];

const rangeDisplayTypes = [
	'range_checkbox',
	'range_radio',
	'range_select',
	'range_multiselect',
	'range_label',
];

const dateDisplayTypes = [
	'time_period_checkbox',
	'time_period_radio',
	'time_period_select',
	'time_period_multiselect',
	'time_period_label',
];

function activeFiltersTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	const {
		active_filters_layout,
		enable_soft_limit,
		enable_soft_limit_for_extended_layout,
	} = activeFilterData;

	let proFeaturesTrying = false;

	if ('simple' === active_filters_layout && '1' === enable_soft_limit) {
		proFeaturesTrying = true;
	} else if (
		'extended' === active_filters_layout &&
		'1' === enable_soft_limit_for_extended_layout
	) {
		proFeaturesTrying = true;
	}

	return proFeaturesTrying;
}

function filterKeyMissing(activeFilterData) {
	const { field_key } = activeFilterData;

	if (!field_key) {
		return true;
	}

	return false;
}

function taxonomyTypeFilterTryingProFeatures(
	activeFilterData,
	checkForHierarchy = false
) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	const {
		display_type,
		hierarchical,
		order_terms_by,
		limit_options,
		use_term_slug_in_url,
		enable_soft_limit,
	} = activeFilterData;

	const proDisplayTypes = ['color', 'image'];

	const allowedHierarchicalDisplayTypes = [
		'checkbox',
		'radio',
		'select',
		'multi-select',
	];

	let proFeaturesTrying = false;

	if (proDisplayTypes.includes(display_type)) {
		proFeaturesTrying = true;
	} else if (
		checkForHierarchy &&
		allowedHierarchicalDisplayTypes.includes(display_type) &&
		'1' === hierarchical
	) {
		console.log('hierarchical here');
		proFeaturesTrying = true;
	} else if ('default' !== order_terms_by) {
		proFeaturesTrying = true;
	} else if ('off' !== limit_options) {
		proFeaturesTrying = true;
	} else if ('1' === use_term_slug_in_url) {
		proFeaturesTrying = true;
	} else if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		console.log('soft limit here');
		proFeaturesTrying = true;
	}

	return proFeaturesTrying;
}

function priceFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let proFeaturesTrying = false;

	const { number_display_type } = activeFilterData;

	if (rangeDisplayTypes.includes(number_display_type)) {
		proFeaturesTrying = true;
	}

	return proFeaturesTrying;
}

function ratingFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let proFeaturesTrying = false;

	const { display_type, number_get_options, enable_soft_limit } =
		activeFilterData;

	if ('manual_entry' === number_get_options) {
		proFeaturesTrying = true;
	} else if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		proFeaturesTrying = true;
	}

	return proFeaturesTrying;
}

function productStatusFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let proFeaturesTrying = false;

	const { display_type, enable_soft_limit } = activeFilterData;

	if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		proFeaturesTrying = true;
	}

	return proFeaturesTrying;
}

export function getFilterStatus(title, activeFilterData) {
	if (!title) {
		return __('Title is required', 'wc-ajax-product-filter');
	}

	const foundPro = foundProVersion();

	let message = '';

	const {
		type,
		number_display_type,
		date_display_type,
		taxonomy,
		post_property,
		meta_key,
		get_options,
		value_type,
		number_get_options,
	} = activeFilterData;

	const { optionsKey } = getTableData(type, activeFilterData);

	const rows = activeFilterData[optionsKey];

	switch (type) {
		case 'active-filters':
			if (activeFiltersTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			}

			break;

		case 'category':
			if (taxonomyTypeFilterTryingProFeatures(activeFilterData, true)) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			}

			break;

		case 'tag':
			if (taxonomyTypeFilterTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			}

			break;

		case 'attribute':
			if (taxonomyTypeFilterTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			} else if (!taxonomy) {
				message = __('Select an attribute', 'wc-ajax-product-filter');
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			}

			break;

		case 'price':
			if (priceFilterTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if (
				rangeDisplayTypes.includes(number_display_type) &&
				'manual_entry' === number_get_options &&
				isEmpty(rows)
			) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;

		case 'rating':
			if (ratingFilterTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if ('manual_entry' === number_get_options && isEmpty(rows)) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;

		case 'product-status':
			if (productStatusFilterTryingProFeatures(activeFilterData)) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if (isEmpty(rows)) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;

		case 'post-property':
			if (!foundPro) {
				message = 'pro-feature';
			} else if (!post_property) {
				message = __(
					'Select a post property',
					'wc-ajax-product-filter'
				);
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if (
				('post_date' === post_property ||
					'post_modified' === post_property) &&
				dateDisplayTypes.includes(date_display_type) &&
				isEmpty(rows)
			) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;

		case 'custom-taxonomy':
			if (!foundPro) {
				message = 'pro-feature';
			} else if (!taxonomy) {
				message = __('Select a taxonomy', 'wc-ajax-product-filter');
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			}

			break;

		case 'post-meta':
			if (!foundPro) {
				message = 'pro-feature';
			} else if (!meta_key) {
				message = __('Select a meta key', 'wc-ajax-product-filter');
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else {
				if ('text' === value_type) {
					if ('manual_entry' === get_options && isEmpty(rows)) {
						message = __(
							'Add few options',
							'wc-ajax-product-filter'
						);
					}
				} else if ('number' === value_type) {
					if (
						rangeDisplayTypes.includes(number_display_type) &&
						'manual_entry' === number_get_options &&
						isEmpty(rows)
					) {
						message = __(
							'Add few options',
							'wc-ajax-product-filter'
						);
					}
				} else if ('date' === value_type) {
					if (
						dateDisplayTypes.includes(date_display_type) &&
						isEmpty(rows)
					) {
						message = __(
							'Add few options',
							'wc-ajax-product-filter'
						);
					}
				}
			}

			break;

		case 'sort-by':
			if (!foundPro) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if (isEmpty(rows)) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;

		case 'per-page':
			if (!foundPro) {
				message = 'pro-feature';
			} else if (filterKeyMissing(activeFilterData)) {
				message = __(
					'Filter key is required',
					'wc-ajax-product-filter'
				);
			} else if (isEmpty(rows)) {
				message = __('Add few options', 'wc-ajax-product-filter');
			}

			break;
	}

	return message;
}
