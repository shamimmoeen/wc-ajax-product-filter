import { useEffect } from '@wordpress/element';
import { useFilter } from './FilterContext';
import { getFilterStatus } from './utilsForFilterData';

const useFilterStatus = () => {
	const { state, dispatch } = useFilter();

	const { isLoading, title, activeFilterData } = state;

	const setFilterStatus = (status) => {
		dispatch({ type: 'SET_FILTER_STATUS', payload: status });

		// TODO: For debugging purpose.
		console.log(status);
	};

	const removeFilterStatus = () => {
		dispatch({ type: 'SET_FILTER_STATUS', payload: '' });
	};

	const incrementFilterPreview = () => {
		dispatch({ type: 'SET_FILTER_PREVIEW' });
	};

	const dependents = [isLoading, title, activeFilterData];

	useEffect(() => {
		if (isLoading) {
			return;
		}

		const filterDataStatus = getFilterStatus(title, activeFilterData);

		if (filterDataStatus) {
			setFilterStatus(filterDataStatus);
		} else {
			removeFilterStatus();
			incrementFilterPreview();
		}
	}, dependents);
};

export default useFilterStatus;
