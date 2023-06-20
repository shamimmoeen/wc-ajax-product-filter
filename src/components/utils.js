import { __ } from '@wordpress/i18n';
import { concat } from 'lodash';

export const GENERIC_ERROR_MESSAGE = __(
	'Please fix the errors below.',
	'wc-ajax-product-filter'
);

export const FILTER_KEY_IN_USE_MESSAGE = __(
	'Filter key is in use by another entity.',
	'wc-ajax-product-filter'
);

export function proUpgradeRequired() {
	return wcapf_admin_params.pro_upgrade_notice || null;
}

export function wpVersion() {
	return parseFloat(wcapf_admin_params.wp_version);
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
	if (WCAPF_PRO) {
		return false;
	}

	return isProFeature;
}

export function proTag(isProFeature) {
	if (WCAPF_PRO) {
		return null;
	}

	if (!isProFeature) {
		return null;
	}

	return <span className='__pro_tag' />;
}

export function pluginVersion() {
	if (WCAPF_PRO && wcapf_admin_params.pro_version && 2.1 <= parseFloat(wcapf_admin_params.pro_version)) {
		return wcapf_admin_params.pro_version;
	}

	return wcapf_admin_params.free_version;
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
	return 'https://wptools.io/wc-ajax-product-filter/?utm_source=WCAPF+Free&utm_medium=inside+plugin&utm_campaign=WCAPF+Pro+Upgrade';
}

export function slugify(value) {
	return '__' + value.replace(/ /g, '_');
}

export function mergeSelectOptions(freeOptions, proOptions, withPro = false) {
	let options;

	if (withPro && !WCAPF_PRO) {
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
