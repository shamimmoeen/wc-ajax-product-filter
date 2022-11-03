import './form.scss';
import { render, StrictMode } from '@wordpress/element';
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
		'wcapf-form-admin-ui'
	);

	if (renderElementInstance) {
		render(
			<StrictMode>
				<App />
			</StrictMode>,
			renderElementInstance
		);
	}
});
