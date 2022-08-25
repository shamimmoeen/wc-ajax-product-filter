import { useFilter } from '../../FilterContext';
import AvailableFilters from '../../../AvailableFilters';
import { getFilterDefaultData } from '../../utils';

const AvaialableFilters = () => {
	const {
		state: { filterType, filtersData, activeFilterData },
		dispatch,
	} = useFilter();

	const handleSetFilterType = (filter) => {
		const _filterType = filter.type;

		if (_filterType === filterType) {
			return;
		}

		dispatch({ type: 'SET_FILTER_TYPE', payload: _filterType });
		dispatch({ type: 'SET_DIRTY' });

		let filterData = filtersData[_filterType];

		if (!filterData) {
			filterData = getFilterDefaultData(_filterType);
		}

		dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: filterData });

		const _filtersData = { ...filtersData, [filterType]: activeFilterData };

		dispatch({ type: 'SET_FILTERS_DATA', payload: _filtersData });
	};

	return (
		<AvailableFilters
			filterType={filterType}
			handleSetFilterType={handleSetFilterType}
		/>
	);
};

export default AvaialableFilters;
