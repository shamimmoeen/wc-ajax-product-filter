import { getEditFormLink } from '../utils';
import { merge } from 'lodash';

export function prepareFormData(raw) {
	const { id } = raw;

	const shortcode = `[wcapf_form id="${id}"]`;
	const editLink = getEditFormLink(id);

	return merge({}, raw, { shortcode, editLink });
}
