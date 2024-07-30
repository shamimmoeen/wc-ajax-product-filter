import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

export function addSuccessNotice(message, id, icon = '') {
	dispatch('core/notices').createSuccessNotice(message, {
		type: 'snackbar',
		id,
		icon,
	});
}

export function addErrorNotice(message, id, icon = '') {
	dispatch('core/notices').createErrorNotice(message, {
		type: 'snackbar',
		id,
		icon,
	});
}

export function removeNotice(id) {
	dispatch('core/notices').removeNotice(id);
}

// Copied to clipboard notice.
export function copiedToClipboardNotice() {
	addSuccessNotice(
		__('Copied to clipboard', 'wc-ajax-product-filter'),
		'copied-to-clipboard'
	);
}

export function removeCopiedToClipboardNotice() {
	removeNotice('copied-to-clipboard');
}

// Item Create Notices.
const itemCreateSuccessNoticeId = 'item-create-success';
const itemCreateErrorNoticeId = 'item-create-error';

export function itemCreateSuccessNotice() {
	addSuccessNotice(
		__('Sample form created successfully', 'wc-ajax-product-filter'),
		itemCreateSuccessNoticeId,
		'🙌'
	);
}

export function itemCreateErrorNotice(message) {
	addSuccessNotice(message, itemCreateErrorNoticeId, '😟');
}

export function removeItemCreateNotices() {
	removeNotice(itemCreateSuccessNoticeId);
	removeNotice(itemCreateErrorNoticeId);
}

// Item deleted notices.
const itemDeletedSuccessNoticeId = 'item-deleted-success';
const itemDeletedErrorNoticeId = 'item-deleted-error';

export function itemDeletedSuccessNotice(message) {
	addSuccessNotice(message, itemDeletedSuccessNoticeId, '😵');
}

export function itemDeletedErrorNotice(message) {
	addSuccessNotice(message, itemDeletedErrorNoticeId, '😟');
}

export function removeItemDeletedNotices() {
	removeNotice(itemDeletedSuccessNoticeId);
	removeNotice(itemDeletedErrorNoticeId);
}

// Item duplicated notices.
const itemDuplicatedSuccessNoticeId = 'item-duplicated-success';
const itemDuplicatedErrorNoticeId = 'item-duplicated-error';

export function itemDuplicatedSuccessNotice(message) {
	addSuccessNotice(message, itemDuplicatedSuccessNoticeId, '🙌');
}

export function itemDuplicatedErrorNotice(message) {
	addSuccessNotice(message, itemDuplicatedErrorNoticeId, '😟');
}

export function removeItemDuplicatedNotices() {
	removeNotice(itemDuplicatedSuccessNoticeId);
	removeNotice(itemDuplicatedErrorNoticeId);
}

// Item Save Notices.
const itemSaveSuccessNoticeId = 'item-save-success';
const itemSaveErrorNoticeId = 'item-save-error';

export function itemSavedSuccessNotice(message) {
	addSuccessNotice(message, itemSaveSuccessNoticeId, '👌');
}

export function itemSavedErrorNotice(message) {
	addSuccessNotice(message, itemSaveErrorNoticeId, '😟');
}

export function removeItemSavedNotices() {
	removeNotice(itemSaveSuccessNoticeId);
	removeNotice(itemSaveErrorNoticeId);
}

// Filter Delete Notices.
const filterDeleteNoticeId = 'filter-delete-error';

export function filterDeletedErrorNotice(message) {
	addSuccessNotice(message, filterDeleteNoticeId, '😟');
}

export function removeFilterDeletedNotices() {
	removeNotice(filterDeleteNoticeId);
}

// Settings notices.
const settingsSaveSuccessNoticeId = 'settings-save-success';
const settingsSaveErrorNoticeId = 'settings-save-error';

export function settingsSavedSuccessNotice(message) {
	addSuccessNotice(message, settingsSaveSuccessNoticeId, '👌');
}

export function settingsSavedErrorNotice(message) {
	addSuccessNotice(message, settingsSaveErrorNoticeId, '😟');
}

export function removeSettingsSavedNotices() {
	removeNotice(settingsSaveSuccessNoticeId);
	removeNotice(settingsSaveErrorNoticeId);
}

// Get form filters error notice.
const getFormFiltersErrorNoticeId = 'get-form-filters-error';

export function getFormFiltersErrorNotice(message) {
	addErrorNotice(message, getFormFiltersErrorNoticeId, '😟');
}
