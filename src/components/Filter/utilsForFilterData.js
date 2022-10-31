import { __ } from '@wordpress/i18n';
import { foundProVersion } from '../utils';
import { getTableData } from './utils';
import { isEmpty } from 'lodash';

export function proFeature(feature) {
	return { type: 'pro-feature', feature };
}

export function dataRequired(message) {
	return { type: 'data-required', message };
}

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

	let tryingPro = false;

	if ('simple' === active_filters_layout && '1' === enable_soft_limit) {
		tryingPro = proFeature('soft-limit');
	} else if (
		'extended' === active_filters_layout &&
		'1' === enable_soft_limit_for_extended_layout
	) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
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

	let tryingPro = false;

	if (proDisplayTypes.includes(display_type)) {
		tryingPro = proFeature(`display-type-${display_type}`);
	} else if (
		checkForHierarchy &&
		allowedHierarchicalDisplayTypes.includes(display_type) &&
		'1' === hierarchical
	) {
		tryingPro = proFeature('hierarchical');
	} else if ('default' !== order_terms_by) {
		tryingPro = proFeature('ordering-of-terms');
	} else if ('off' !== limit_options) {
		tryingPro = proFeature('limit-terms');
	} else if ('1' === use_term_slug_in_url) {
		tryingPro = proFeature('term-slug-in-url');
	} else if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

function priceFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { number_display_type } = activeFilterData;

	if (rangeDisplayTypes.includes(number_display_type)) {
		tryingPro = proFeature(`display-type-${number_display_type}`);
	}

	return tryingPro;
}

function ratingFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { display_type, number_get_options, enable_soft_limit } =
		activeFilterData;

	if ('manual_entry' === number_get_options) {
		tryingPro = proFeature('rating-manual-entry');
	} else if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

function productStatusFilterTryingProFeatures(activeFilterData) {
	const foundPro = foundProVersion();

	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { display_type, enable_soft_limit } = activeFilterData;

	if (
		'1' === enable_soft_limit &&
		!softLimitDisabledDisplayTypes.includes(display_type)
	) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

export function getFilterStatus(title, activeFilterData) {
	if (!title) {
		return dataRequired(__('Title is required', 'wc-ajax-product-filter'));
	}

	const foundPro = foundProVersion();

	let tryingPro = '';
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
			tryingPro = activeFiltersTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			}

			break;

		case 'category':
			tryingPro = taxonomyTypeFilterTryingProFeatures(
				activeFilterData,
				true
			);

			if (tryingPro) {
				message = tryingPro;
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'tag':
			tryingPro = taxonomyTypeFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'attribute':
			tryingPro = taxonomyTypeFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!taxonomy) {
				message = dataRequired(
					__('Select an attribute', 'wc-ajax-product-filter')
				);
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'price':
			tryingPro = priceFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if (
				rangeDisplayTypes.includes(number_display_type) &&
				'manual_entry' === number_get_options &&
				isEmpty(rows)
			) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'rating':
			tryingPro = ratingFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if ('manual_entry' === number_get_options && isEmpty(rows)) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'product-status':
			tryingPro = productStatusFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if (isEmpty(rows)) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'post-property':
			if (!foundPro) {
				message = proFeature('pro-feature');
			} else if (!post_property) {
				message = dataRequired(
					__('Select a post property', 'wc-ajax-product-filter')
				);
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if (
				('post_date' === post_property ||
					'post_modified' === post_property) &&
				dateDisplayTypes.includes(date_display_type) &&
				isEmpty(rows)
			) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'custom-taxonomy':
			if (!foundPro) {
				message = proFeature('pro-feature');
			} else if (!taxonomy) {
				message = dataRequired(
					__('Select a taxonomy', 'wc-ajax-product-filter')
				);
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'post-meta':
			if (!foundPro) {
				message = proFeature('pro-feature');
			} else if (!meta_key) {
				message = dataRequired(
					__('Select a meta key', 'wc-ajax-product-filter')
				);
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else {
				if ('text' === value_type) {
					if ('manual_entry' === get_options && isEmpty(rows)) {
						message = dataRequired(
							__('Add few options', 'wc-ajax-product-filter')
						);
					}
				} else if ('number' === value_type) {
					if (
						rangeDisplayTypes.includes(number_display_type) &&
						'manual_entry' === number_get_options &&
						isEmpty(rows)
					) {
						message = dataRequired(
							__('Add few options', 'wc-ajax-product-filter')
						);
					}
				} else if ('date' === value_type) {
					if (
						dateDisplayTypes.includes(date_display_type) &&
						isEmpty(rows)
					) {
						message = dataRequired(
							__('Add few options', 'wc-ajax-product-filter')
						);
					}
				}
			}

			break;

		case 'sort-by':
			if (!foundPro) {
				message = proFeature('pro-feature');
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if (isEmpty(rows)) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;

		case 'per-page':
			if (!foundPro) {
				message = proFeature('pro-feature');
			} else if (filterKeyMissing(activeFilterData)) {
				message = dataRequired(
					__('Filter key is required', 'wc-ajax-product-filter')
				);
			} else if (isEmpty(rows)) {
				message = dataRequired(
					__('Add few options', 'wc-ajax-product-filter')
				);
			}

			break;
	}

	return message;
}
