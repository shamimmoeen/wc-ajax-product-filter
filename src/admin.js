import './admin.scss';
import { render } from '@wordpress/element';
import FilterForm from './FilterForm';

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-filter-admin-ui'
	);

	if (renderElementInstance) {
		render(<FilterForm />, renderElementInstance);
	}
});
