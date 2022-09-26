import { useFilter } from '../../../FilterContext';
import Range from './Range';
import Others from './Others';

const Options = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const renderFields = () => {
		let fields;

		const taxonomyFilterTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
		];

		if (taxonomyFilterTypes.includes(filterType)) {
			fields = <Others />;
		} else if ('price' === filterType) {
			fields = <Range />;
		}

		return fields;
	};

	return <>{renderFields()}</>;
};

export default Options;
