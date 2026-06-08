import './form.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import './store/form';
import Form from './components/Form';

const App = () => <Form />;

document.addEventListener( 'DOMContentLoaded', () => {
	const el = document.getElementById( 'wcapf-form-admin-ui' );

	if ( el ) {
		createRoot( el ).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	}
} );
