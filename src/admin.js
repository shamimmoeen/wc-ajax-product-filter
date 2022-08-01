import './admin.scss';
import { render } from '@wordpress/element';
import FilterForm from './FilterForm';
import { FilterFormProvider } from './FilterForm/FilterFormContext';

const App = () => {
	return (
		<FilterFormProvider>
			<FilterForm />
		</FilterFormProvider>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-filter-admin-ui'
	);

	if (renderElementInstance) {
		render(<App />, renderElementInstance);
	}
});
