import { find } from 'lodash';
import { availableFilters } from '../Filter/utils';
import { getEditFilterLink } from '../utils';

export function prepareFilterData(raw) {
	const { id, field_key, type, taxonomy, meta_key, title } = raw;

	const shortcode = `[wcapf_filter id="${id}"]`;

	const _filterData = find(availableFilters(), { type: type });

	const component = _filterData['title'];
	let componentExtra = '';

	if ('custom-taxonomy' === type || 'attribute' === type) {
		componentExtra = taxonomy;
	} else if ('post-meta' === type) {
		componentExtra = meta_key;
	}

	const editLink = getEditFilterLink(id);

	return {
		id,
		title,
		filter_key: field_key,
		shortcode,
		component,
		componentExtra,
		editLink,
	};
}
