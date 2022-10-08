import { find } from 'lodash';
import axios from 'axios';
import { availableFilters } from './Filter/utils';

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

export function getAdditionalData() {
	const data = {
		action: 'get_filter_additional_data',
	};

	return axios.get(wcapf_admin_params.ajaxurl, {
		params: data,
	});
}

export function prepareFilterData(raw) {
	const { id, field_key, type, taxonomy, meta_key, post_property, title } =
		raw;

	const shortcode = `[wcapf_filter id="${id}"]`;

	const _filterData = find(availableFilters(), { type: type });

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

export function prepareMetaKeys(options) {
	const _options = [];

	for (const [value, label] of Object.entries(options)) {
		_options.push({ label, value });
	}

	return _options;
}

export function disableFilterHandling(activeFilterData) {
	const { type } = activeFilterData;

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

export function getNoOfMaxTermsToRender() {
	const maxItems =
		parseInt(wcapf_admin_params.max_items_in_custom_appearance_modal) || 99;

	return maxItems < 1 ? 99 : maxItems;
}

export function getTimeoutForRemovingMediaFrames() {
	const timeout =
		parseInt(wcapf_admin_params.timeout_for_cleaning_wp_media_frames) ||
		100;

	return timeout < 99 ? 100 : timeout;
}

// Causing too many media frame instances at every render.
export function removeMediaFrames(timeout) {
	const $ = jQuery;

	$('body').children('button.browser').remove();
	$('body').children('div[id^="__wp-uploader-id"]').remove();

	setTimeout(() => {
		$('body').children('div.wp-uploader-browser').remove();
	}, timeout);
}
