import { __ } from '@wordpress/i18n';
import { foundProVersion, wcfmFound } from '../utils';

const foundPro = foundProVersion();

export function proFeature(feature) {
	return { type: 'pro-feature', feature };
}

export function dataMissing(message) {
	return { type: 'data-missing', message };
}

export function dataRequired(message) {
	return { type: 'data-required', message };
}

function filterKeyMissing() {
	return dataRequired(
		__('Filter key is required.', 'wc-ajax-product-filter')
	);
}

function activeFiltersTryingProFeatures(activeFilterData) {
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

function tryingSoftLimit(activeFilterData) {
	let tryingPro = false;

	const { display_type, enable_soft_limit } = activeFilterData;

	const notAllowed = ['select', 'multi-select'];

	if ('1' === enable_soft_limit && !notAllowed.includes(display_type)) {
		tryingPro = true;
	}

	return tryingPro;
}

function tryingClearFilterButton(activeFilterData) {
	const { show_clear_button } = activeFilterData;

	if ('1' === show_clear_button) {
		return true;
	} else {
		return false;
	}
}

function taxonomyFilterTryingProFeatures(
	activeFilterData,
	hierarchical = false
) {
	if (foundPro) {
		return false;
	}

	const {
		display_type,
		hierarchical: hierarchyEnabled,
		get_options,
		order_terms_by,
		use_term_slug_in_url,
	} = activeFilterData;

	const proDisplayTypes = ['color', 'image'];

	const hierarchyAllowed = ['checkbox', 'radio', 'select', 'multi-select'];

	let tryingPro = false;

	if (proDisplayTypes.includes(display_type)) {
		tryingPro = proFeature(`display-type-${display_type}`);
	} else if (
		hierarchical &&
		hierarchyAllowed.includes(display_type) &&
		'1' === hierarchyEnabled
	) {
		tryingPro = proFeature('hierarchical-view');
	} else if ('manual_entry' === get_options) {
		tryingPro = proFeature('manual-entry');
	} else if ('default' !== order_terms_by) {
		tryingPro = proFeature('terms-orderby-count');
	} else if ('1' === use_term_slug_in_url) {
		tryingPro = proFeature('term-slug-in-url');
	} else if (tryingClearFilterButton(activeFilterData)) {
		tryingPro = proFeature('clear-filter-button');
	} else if (tryingSoftLimit(activeFilterData)) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

function priceFilterTryingProFeatures(activeFilterData) {
	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { number_display_type } = activeFilterData;

	const notAllowed = [
		'range_checkbox',
		'range_radio',
		'range_select',
		'range_multiselect',
		'range_label',
	];

	if (notAllowed.includes(number_display_type)) {
		tryingPro = proFeature(`display-type-${number_display_type}`);
	} else if (tryingClearFilterButton(activeFilterData)) {
		tryingPro = proFeature('clear-filter-button');
	}

	return tryingPro;
}

function ratingFilterTryingProFeatures(activeFilterData) {
	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { number_get_options } = activeFilterData;

	if ('manual_entry' === number_get_options) {
		tryingPro = proFeature('manual-entry');
	} else if (tryingClearFilterButton(activeFilterData)) {
		tryingPro = proFeature('clear-filter-button');
	} else if (tryingSoftLimit(activeFilterData)) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

function productStatusFilterTryingProFeatures(activeFilterData) {
	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	if (tryingClearFilterButton(activeFilterData)) {
		tryingPro = proFeature('clear-filter-button');
	} else if (tryingSoftLimit(activeFilterData)) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

function postAuthorFilterTryingProFeatures(activeFilterData) {
	if (foundPro) {
		return false;
	}

	let tryingPro = false;

	const { get_options, post_author_order_by, use_store_name } =
		activeFilterData;

	if ('manual_entry' === get_options) {
		tryingPro = proFeature('manual-entry');
	} else if ('default' !== post_author_order_by) {
		tryingPro = proFeature('ordering-of-filter-options');
	} else if (wcfmFound() && '1' === use_store_name) {
		tryingPro = proFeature('store-name-as-option-label');
	} else if (tryingClearFilterButton(activeFilterData)) {
		tryingPro = proFeature('clear-filter-button');
	} else if (tryingSoftLimit(activeFilterData)) {
		tryingPro = proFeature('soft-limit');
	}

	return tryingPro;
}

export function getFilterStatus(title, activeFilterData) {
	if (!title) {
		return dataRequired(__('Title is required.', 'wc-ajax-product-filter'));
	}

	let tryingPro = '';
	let message = '';

	const { field_key, type, taxonomy, meta_key } = activeFilterData;

	switch (type) {
		case 'active-filters':
			tryingPro = activeFiltersTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			}

			break;

		case 'category':
			tryingPro = taxonomyFilterTryingProFeatures(activeFilterData, true);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'tag':
			tryingPro = taxonomyFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'attribute':
			tryingPro = taxonomyFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!taxonomy) {
				message = dataMissing(
					__('Please select a attribute.', 'wc-ajax-product-filter')
				);
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'price':
			tryingPro = priceFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'rating':
			tryingPro = ratingFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'product-status':
			tryingPro = productStatusFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'post-author':
			tryingPro = postAuthorFilterTryingProFeatures(activeFilterData);

			if (tryingPro) {
				message = tryingPro;
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'custom-taxonomy':
			if (!foundPro) {
				message = proFeature('custom-taxonomy-filter');
			} else if (!taxonomy) {
				message = dataMissing(
					__('Please select a taxonomy.', 'wc-ajax-product-filter')
				);
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'post-meta':
			if (!foundPro) {
				message = proFeature('post-meta-filter');
			} else if (!meta_key) {
				message = dataMissing(
					__('Please select a meta key.', 'wc-ajax-product-filter')
				);
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'search':
			if (!foundPro) {
				message = proFeature('filter-by-keyword');
			}

			break;

		case 'sort-by':
			if (!foundPro) {
				message = proFeature('sort-by-filter');
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;

		case 'per-page':
			if (!foundPro) {
				message = proFeature('per-page-filter');
			} else if (!field_key) {
				message = filterKeyMissing();
			}

			break;
	}

	return message;
}
