import './list-filters.scss';
import { render, StrictMode } from '@wordpress/element';
import { ListFiltersProvider } from './components/ListFilters/ListFiltersContext';
import ListFilters from './components/ListFilters';

const App = () => {
	return (
		<ListFiltersProvider>
			<ListFilters />
		</ListFiltersProvider>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-filters-list-admin-ui'
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
