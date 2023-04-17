import './form.scss';
import { render, StrictMode } from '@wordpress/element';
import Form from './components/Form';
import { FormProvider } from './components/Form/FormContext';

const App = () => {
	return (
		<FormProvider>
			<Form />
		</FormProvider>
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
