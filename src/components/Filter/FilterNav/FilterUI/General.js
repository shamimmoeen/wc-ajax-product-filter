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

	const { initial_filter_keys: initialFilterKeysData } = additionalData;

	return (
		<>
			<AvailableFilters
				filterType={filterType}
				activeFilterData={activeFilterData}
				filtersData={filtersData}
				initialFilterKeysData={initialFilterKeysData}
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
				isDirty={isDirty}
				dispatch={dispatch}
			/>
		</>
	);
};

export default Basic;
