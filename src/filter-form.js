import './filter-form.scss';
import { render } from '@wordpress/element';
import FilterForm from './components/FilterForm';
import { FilterFormProvider } from './components/FilterForm/FilterFormContext';

const App = () => {
	return (
		<FilterFormProvider>
			<FilterForm />
		</FilterFormProvider>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-filter-form-admin-ui'
	);

	if (renderElementInstance) {
		render(<App />, renderElementInstance);
	}
});
