import './settings.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import { SettingsProvider } from './components/Settings/SettingsContext';
import Settings from './components/Settings';

const App = () => {
	return (
		<SettingsProvider>
			<Settings />
		</SettingsProvider>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-settings-admin-ui'
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
