import { useFilter } from '../../../FilterContext';
import ValueTypeNumber from './ValueTypeNumber';
import TaxonomyOptions from './TaxonomyOptions';
import RatingOptions from './RatingOptions';
import ValueTypeText from './ValueTypeText';
import ValueTypeDate from './ValueTypeDate';
import ManualOptions from './ManualOptions';
import { isTaxonomyFilters } from '../../../utils';

const Options = () => {
	const {
		state: { filterType, activeFilterData },
	} = useFilter();

	const renderFields = () => {
		let fields;

		const { value_type } = activeFilterData;

		if (isTaxonomyFilters(filterType)) {
			fields = <TaxonomyOptions />;
		} else if ('price' === filterType) {
			fields = <ValueTypeNumber />;
		} else if ('rating' === filterType) {
			fields = <RatingOptions />;
		} else if ('product-status' === filterType) {
			fields = <ManualOptions />;
		} else if ('post-meta' === filterType) {
			if ('text' === value_type) {
				fields = <ValueTypeText />;
			} else if ('number' === value_type) {
				fields = <ValueTypeNumber />;
			} else if ('date' === value_type) {
				fields = <ValueTypeDate />;
			}
		} else if ('sort-by' === filterType) {
			fields = <ManualOptions />;
		} else if ('per-page' === filterType) {
			fields = <ManualOptions />;
		}

		return fields;
	};

	return <>{renderFields()}</>;
};

export default Options;
