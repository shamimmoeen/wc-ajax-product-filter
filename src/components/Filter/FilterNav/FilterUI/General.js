import { useFilter } from '../../FilterContext';
import AvaialableFilters from './AvailableFilters';
import GeneralFields from './GeneralFields';

const Basic = () => {
	const {
		state: { filterType, activeFilterData, filterKeys, additionalData },
		dispatch,
	} = useFilter();

	return (
		<>
			<AvaialableFilters />
			<GeneralFields
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
