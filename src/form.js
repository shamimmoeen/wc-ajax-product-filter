import './form.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import Form from './components/Form';
import { FormProvider } from './components/Form/FormContext';

const App = () => {
	return (
		<FormProvider>
			<Form />
		</FormProvider>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-form-admin-ui'
	);

	if ( renderElementInstance ) {
		const root = createRoot( renderElementInstance );
		root.render(
			<StrictMode>
				<App />
			</StrictMode>
		);
	}
} );
