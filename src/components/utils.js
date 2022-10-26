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

export function upgradeToProLink() {
	return '#';
}

export function pluginVersion() {
	return wcapf_admin_params.version;
}

export function getAdditionalData() {
	const data = {
		action: 'get_filter_additional_data',
	};

	return axios.get(wcapf_admin_params.ajaxurl, {
		params: data,
	});
}

const filtersPageLink = wcapf_admin_params.filters_page_link;

export function getEditFilterLink(filterId) {
	return filtersPageLink + '&id=' + filterId;
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

	const permalink = getEditFilterLink(id);

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

export function prepareMetaKeys(options) {
	const _options = [];

	for (const [value, label] of Object.entries(options)) {
		_options.push({ label, value });
	}

	return _options;
}

// TODO: Check for pro features.
export function disableFilterSubmission(activeFilterData) {
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
