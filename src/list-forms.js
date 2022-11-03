import './list-forms.scss';
import { render, StrictMode } from '@wordpress/element';
import { ListFormsProvider } from './components/ListForms/ListFormsContext';
import ListForms from './components/ListForms';

const App = () => {
	return (
		<ListFormsProvider>
			<ListForms />
		</ListFormsProvider>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-forms-list-admin-ui'
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
