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

// Filter Create Notices.
const filterCreateErrorNoticeId = 'filter-create-error';

export function filterCreateErrorNotice(message) {
	addSuccessNotice(message, filterCreateErrorNoticeId, '😟');
}

export function removeFilterCreateNotice() {
	removeNotice(filterCreateErrorNoticeId);
}

// Filter Save Notices.
const filterSaveSuccessNoticeId = 'filter-save-success';
const filterSaveErrorNoticeId = 'filter-save-error';

export function filterSavedSuccessNotice(message) {
	addSuccessNotice(message, filterSaveSuccessNoticeId, '🔥');
}

export function filterSavedErrorNotice(message) {
	addSuccessNotice(message, filterSaveErrorNoticeId, '😟');
}

export function removeFilterNotices() {
	removeNotice(filterSaveSuccessNoticeId);
	removeNotice(filterSaveErrorNoticeId);
}
