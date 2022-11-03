import { getEditFormLink } from '../utils';

export function prepareFormData(raw) {
	const { id, title } = raw;

	const shortcode = `[wcapf_form id="${id}"]`;
	const editLink = getEditFormLink(id);

	return {
		id,
		title,
		shortcode,
		editLink,
	};
}
