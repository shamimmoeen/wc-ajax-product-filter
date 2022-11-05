import axios from 'axios';

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

export function getAvailableFilters() {
	const data = {
		action: 'wcapf_get_available_filters',
	};

	return axios.get(wcapf_admin_params.ajaxurl, {
		params: data,
	});
}

export function getFiltersPageLink() {
	return wcapf_admin_params.filters_page_link;
}

export function getEditFilterLink(filterId) {
	return getFiltersPageLink() + '&id=' + filterId;
}

export function getFormsPageLink() {
	return wcapf_admin_params.forms_page_link;
}

export function getEditFormLink(formId) {
	return getFormsPageLink() + '&id=' + formId;
}

export function getSettingsPageLink() {
	return wcapf_admin_params.settings_page_link;
}

export function slugify(value) {
	return '__' + value.replace(/ /g, '_');
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
