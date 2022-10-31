import { useFilter } from '../../FilterContext';
import useFilterData from '../../useFilterData';
import AvailableFilters from './AvailableFilters';
import GeneralFields from './GeneralFields';

const Basic = () => {
	const { state, dispatch } = useFilter();
	const { setDirty } = useFilterData(state, dispatch);

	const handleSetDirty = () => {
		setDirty();
	};

	return (
		<>
			<AvailableFilters
				state={state}
				dispatch={dispatch}
				callback={handleSetDirty}
			/>

			<GeneralFields state={state} dispatch={dispatch} />
		</>
	);
};

export default Basic;
