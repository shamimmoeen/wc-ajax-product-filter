import './list-filter-forms.scss';
import { render, StrictMode } from '@wordpress/element';

const App = () => {
	return <h1>List of Filter Forms</h1>;
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
