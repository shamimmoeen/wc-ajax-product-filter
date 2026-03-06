import './list-forms.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import { ListFormsProvider } from './components/ListForms/ListFormsContext';
import ListForms from './components/ListForms';

const App = () => {
	return (
		<ListFormsProvider>
			<ListForms />
		</ListFormsProvider>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-forms-list-admin-ui'
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
