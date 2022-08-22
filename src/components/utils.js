import { getAvailableFilters } from './Filter/utils';
import { find } from 'lodash';

export function foundProVersion() {
	// return wcapf_admin_params.foundPro;
	return false;
}

// To disable the input element.
export function isProFeature(isProFeature) {
	if (foundProVersion()) {
		return false;
	}

	if (!isProFeature) {
		return false;
	}

	return true;
}

export function proTag(isProFeature) {
	if (foundProVersion()) {
		return '';
	}

	if (!isProFeature) {
		return '';
	}

	return <span className='__pro_tag' />;
}

export function prepareFilterData(raw) {
	const { id, field_key, type, taxonomy, meta_key, post_property, title } =
		raw;

	const shortcode = `[wcapf_filter id="${id}"]`;

	const availableFilters = getAvailableFilters();

	const _filterData = find(availableFilters, { type: type });

	const component = _filterData['title'];
	let componentExtra = '';

	if ('custom-taxonomy' === type || 'attribute' === type) {
		componentExtra = taxonomy;
	} else if ('post-meta' === type) {
		componentExtra = meta_key;
	} else if ('post-property' === type) {
		componentExtra = post_property;
	}

	let permalink = window.location.href;

	permalink += '&id=' + id;

	return {
		id,
		title,
		filter_key: field_key,
		shortcode,
		component,
		componentExtra,
		permalink,
	};
}

export function removeParam(key, sourceURL) {
	var rtn = sourceURL.split('?')[0],
		param,
		params_arr = [],
		queryString =
			sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';

	if (queryString !== '') {
		params_arr = queryString.split('&');

		for (var i = params_arr.length - 1; i >= 0; i -= 1) {
			param = params_arr[i].split('=')[0];

			if (param === key) {
				params_arr.splice(i, 1);
			}
		}

		if (params_arr.length) rtn = rtn + '?' + params_arr.join('&');
	}

	return rtn;
}
