import { useFilter } from '../../FilterContext';
import AvailableFilters from './AvailableFilters';
import GeneralFields from './GeneralFields';

const Basic = () => {
	const {
		state: {
			isFilterKeyChecking,
			filterType,
			activeFilterData,
			filterKeys,
			filtersData,
			additionalData,
			isDirty,
		},
		dispatch,
	} = useFilter();

	return (
		<>
			<AvailableFilters
				filterType={filterType}
				activeFilterData={activeFilterData}
				filtersData={filtersData}
				dispatch={dispatch}
				setDirty={true}
				isDirty={isDirty}
			/>

			<GeneralFields
				isFilterKeyChecking={isFilterKeyChecking}
				filterType={filterType}
				activeFilterData={activeFilterData}
				filterKeys={filterKeys}
				additionalData={additionalData}
				dispatch={dispatch}
			/>
		</>
	);
};

export default Basic;
