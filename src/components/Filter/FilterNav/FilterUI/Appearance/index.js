import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import ActiveFilters from './ActiveFilters';
import ValueTypeText from './ValueTypeText';
import ValueTypeNumber from './ValueTypeNumber';
import ResetFilter from './ResetFilter';
import ValueTypeDate from './ValueTypeDate';

const Appearance = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const { show_title, value_type } = activeFilterData;

	const { handleCheckboxChange } = useFilterData(activeFilterData, dispatch);

	const renderFields = () => {
		let fields;

		if ('active-filters' === filterType) {
			fields = <ActiveFilters />;
		} else if ('price' === filterType) {
			fields = <ValueTypeNumber />;
		} else if ('post-meta' === filterType) {
			if ('text' === value_type) {
				fields = <ValueTypeText />;
			} else if ('number' === value_type) {
				fields = <ValueTypeNumber />;
			} else if ('date' === value_type) {
				fields = <ValueTypeDate />;
			}
		} else if ('reset-button' === filterType) {
			fields = <ResetFilter />;
		} else {
			fields = <ValueTypeText />;
		}

		return fields;
	};

	return (
		<div>
			<Checkbox
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
				isChecked={show_title}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show the filter title before the options.',
					'wc-ajax-product-filter'
				)}
			/>

			{renderFields()}
		</div>
	);
};

export default Appearance;
