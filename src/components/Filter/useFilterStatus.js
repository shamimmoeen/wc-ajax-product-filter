import { useEffect } from '@wordpress/element';
import { foundProVersion } from '../utils';
import { useFilter } from './FilterContext';
import { getFilterStatus, proFeature } from './utilsForFilterData';

const useFilterStatus = () => {
	const { state, dispatch } = useFilter();

	const { isLoading, title, activeFilterData, visibilityRules } = state;
	const { enable_rules } = visibilityRules;

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

	const tryingProFeature = () => {
		if (foundProVersion()) {
			return false;
		}

		let tryingPro = '';

		if (enable_rules) {
			tryingPro = proFeature('visibility-rules');
		}

		return tryingPro;
	};

	const dependents = [isLoading, title, activeFilterData, enable_rules];

	useEffect(() => {
		if (isLoading) {
			return;
		}

		const filterDataStatus = getFilterStatus(title, activeFilterData);
		const tryingPro = tryingProFeature();
		let newFilterStatus = '';

		if (filterDataStatus) {
			newFilterStatus = filterDataStatus;
		} else if (tryingPro) {
			newFilterStatus = tryingPro;
		}

		if (newFilterStatus) {
			setFilterStatus(newFilterStatus);
		} else {
			removeFilterStatus();
			incrementFilterPreview();
		}
	}, dependents);
};

export default useFilterStatus;
