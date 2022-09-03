import { useFilter } from '../../FilterContext';
import AvaialableFilters from './AvailableFilters';
import GeneralFields from './GeneralFields';

const Basic = () => {
	const {
		state: {
			isFilterKeyChecking,
			filterType,
			activeFilterData,
			filterKeys,
			additionalData,
		},
		dispatch,
	} = useFilter();

	return (
		<>
			<AvaialableFilters />
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
