import './filter.scss';
import { render } from '@wordpress/element';
import Filter from './components/Filter';
import { FilterProvider } from './components/Filter/FilterContext';

const App = () => {
	return (
		<FilterProvider>
			<Filter />
		</FilterProvider>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const renderElementInstance = document.getElementById(
		'wcapf-filter-admin-ui'
	);

	if (renderElementInstance) {
		render(<App />, renderElementInstance);
	}
});
