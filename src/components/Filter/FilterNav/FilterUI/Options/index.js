import { useFilter } from '../../../FilterContext';
import ValueTypeNumber from './ValueTypeNumber';
import TaxonomyOptions from './TaxonomyOptions';
import RatingOptions from './RatingOptions';
import StatusOptions from './StatusOptions';
import ValueTypeText from './ValueTypeText';
import ValueTypeDate from './ValueTypeDate';

const Options = () => {
	const {
		state: { filterType, activeFilterData },
	} = useFilter();

	const renderFields = () => {
		let fields;

		const taxonomyFilterTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
		];

		const { value_type } = activeFilterData;

		if (taxonomyFilterTypes.includes(filterType)) {
			fields = <TaxonomyOptions />;
		} else if ('price' === filterType) {
			fields = <ValueTypeNumber />;
		} else if ('rating' === filterType) {
			fields = <RatingOptions />;
		} else if ('product-status' === filterType) {
			fields = <StatusOptions />;
		} else if ('post-meta' === filterType) {
			if ('text' === value_type) {
				fields = <ValueTypeText />;
			} else if ('number' === value_type) {
				fields = <ValueTypeNumber />;
			} else if ('date' === value_type) {
				fields = <ValueTypeDate />;
			}
		}

		return fields;
	};

	return <>{renderFields()}</>;
};

export default Options;
