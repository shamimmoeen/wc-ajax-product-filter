import './list-forms.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import './store/forms';
import ListForms from './components/ListForms';

const App = () => <ListForms />;

document.addEventListener( 'DOMContentLoaded', () => {
	const el = document.getElementById( 'wcapf-forms-list-admin-ui' );

	if ( el ) {
		createRoot( el ).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	}
} );
