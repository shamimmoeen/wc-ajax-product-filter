import './settings.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import './store/settings';
import Settings from './components/Settings';

const App = () => <Settings />;

document.addEventListener( 'DOMContentLoaded', () => {
	const el = document.getElementById( 'wcapf-settings-admin-ui' );

	if ( el ) {
		createRoot( el ).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	}
} );
