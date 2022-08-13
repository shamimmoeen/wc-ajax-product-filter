export function foundProVersion() {
	// return wcapf_admin_params.foundPro;
	return false;
}

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
