import { __ } from '@wordpress/i18n';
import { availableFilters } from '../../Filter/utils';
import { foundProVersion } from '../../utils';

function getProFilterTypes() {
	const filterTypes = [];

	availableFilters().forEach((data) => {
		if (data.isPro) {
			filterTypes.push(data.type);
		}
	});

	return filterTypes;
}

export function tryingProFilterType(filterType) {
	return getProFilterTypes().includes(filterType);
}

export function proFilterTypeMessage(filterType) {
	let message;

	switch (filterType) {
		case 'post-property':
			message = __(
				'Filter by post property is a PRO feature.',
				'wc-ajax-product-filter'
			);

			break;

		case 'custom-taxonomy':
			message = __(
				'Filter by custom taxonomy is a PRO feature.',
				'wc-ajax-product-filter'
			);

			break;

		case 'post-meta':
			message = __(
				'Filter by post meta is a PRO feature.',
				'wc-ajax-product-filter'
			);

			break;

		case 'sort-by':
			message = __(
				'Sort by filter is a PRO feature.',
				'wc-ajax-product-filter'
			);

			break;

		case 'per-page':
			message = __(
				'Per page filter is a PRO feature.',
				'wc-ajax-product-filter'
			);

			break;
	}

	return message;
}

export function disableFilterSubmission(activeFilterData) {
	const { type } = activeFilterData;

	if (!foundProVersion() && getProFilterTypes().includes(type)) {
		return true;
	}

	if ('active-filters' === type || 'reset-button' === type) {
		return false;
	}

	const { field_key } = activeFilterData;

	if (!field_key) {
		return true;
	}

	const { taxonomy, post_property, meta_key } = activeFilterData;

	let disabled = false;

	if ('attribute' === type || 'custom-taxonomy' === type) {
		if (!taxonomy) {
			disabled = true;
		}
	} else if ('post-property' === type) {
		if (!post_property) {
			disabled = true;
		}
	} else if ('post-meta' === type) {
		if (!meta_key) {
			disabled = true;
		}
	}

	return disabled;
}
