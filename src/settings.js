import './settings.scss';
import { render, StrictMode } from '@wordpress/element';

const App = () => {
	return <h1>The settings panel</h1>;
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-settings-admin-ui'
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
