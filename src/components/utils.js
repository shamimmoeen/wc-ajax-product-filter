import { concat } from 'lodash';

export function foundProVersion() {
	// return wcapf_admin_params.foundPro;
	return false;
}

export function getInputId(id, index = '', subIndex = '') {
	let fieldId = id;

	if ('' !== index) {
		fieldId += '-' + index;
	}

	if ('' !== subIndex) {
		fieldId += '-' + subIndex;
	}

	return fieldId;
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

export function pluginVersion() {
	return wcapf_admin_params.version;
}

export function getFormsPageLink() {
	return wcapf_admin_params.forms_page_link;
}

export function getEditFormLink(formId) {
	return getFormsPageLink() + '&id=' + formId;
}

export function getSeoRulesPageLink() {
	return wcapf_admin_params.seo_rules_page_link;
}

export function getSettingsPageLink() {
	return wcapf_admin_params.settings_page_link;
}

export function upgradeToProLink() {
	return wcapf_admin_params.upgrade_page_link;
}

export function slugify(value) {
	return '__' + value.replace(/ /g, '_');
}

export function wcfmFound() {
	return wcapf_admin_params.wcfm_marketplace_found;
}

export function arrayMove(arr, fromIndex, toIndex) {
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

export function mergeSelectOptions(freeOptions, proOptions, withPro = false) {
	let options;

	if (withPro && !foundProVersion()) {
		const _proOptions = proOptions.map((option) => {
			option.isPro = true;

			return option;
		});

		options = concat(freeOptions, [
			{
				proGroup: true,
				options: _proOptions,
			},
		]);
	} else {
		options = concat(freeOptions, proOptions);
	}

	return options;
}
