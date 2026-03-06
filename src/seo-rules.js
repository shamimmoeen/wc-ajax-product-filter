import './seo-rules.scss';
import { createRoot } from 'react-dom/client';
import { StrictMode } from '@wordpress/element';
import { SEORulesProvider } from './components/SEORules/SEORulesContext';
import SEORules from './components/SEORules';

const App = () => {
	return (
		<SEORulesProvider>
			<SEORules />
		</SEORulesProvider>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-seo-rules-admin-ui'
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
