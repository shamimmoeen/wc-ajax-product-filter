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
	if (foundProVersion()) {
		return false;
	}

	return getProFilterTypes().includes(filterType);
}

export function disableFilterSubmission(activeFilterData) {
	const { type } = activeFilterData;

	const { field_key } = activeFilterData;

	if (!field_key) {
		return true;
	}

	const { taxonomy, meta_key } = activeFilterData;

	let disabled = false;

	if ('attribute' === type || 'custom-taxonomy' === type) {
		if (!taxonomy) {
			disabled = true;
		}
	} else if ('post-meta' === type) {
		if (!meta_key) {
			disabled = true;
		}
	}

	return disabled;
}
