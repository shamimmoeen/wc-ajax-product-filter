import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import ActiveFilters from './ActiveFilters';
import Others from './Others';
import PriceFilter from './PriceFilter';

const Appearance = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const { show_title } = activeFilterData;

	const { handleCheckboxChange } = useFilterData(activeFilterData, dispatch);

	const renderFields = () => {
		let fields;

		if ('active-filters' === filterType) {
			fields = <ActiveFilters />;
		} else if ('price' === filterType) {
			fields = <PriceFilter />;
		} else {
			fields = <Others />;
		}

		return fields;
	};

	return (
		<div>
			<Checkbox
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
				isChecked={show_title}
				onChange={(value) => handleCheckboxChange('show_title', value)}
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
