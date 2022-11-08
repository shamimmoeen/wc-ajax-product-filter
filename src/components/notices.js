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
const itemCreateErrorNoticeId = 'item-create-error';

export function itemCreateErrorNotice(message) {
	addSuccessNotice(message, itemCreateErrorNoticeId, '😟');
}

export function removeItemCreateNotice() {
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
