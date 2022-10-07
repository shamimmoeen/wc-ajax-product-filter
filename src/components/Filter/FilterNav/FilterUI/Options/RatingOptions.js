import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import ManualOptions from './ManualOptions';
import useFields from './useFields';

const RatingOptions = () => {
	const {
		state: { activeFilterData },
	} = useFilter();

	const { getOptionsField, orderDirectionField } = useFields();

	const { number_get_options } = activeFilterData;

	const _orderDirectionField = () => {
		if ('automatically' === number_get_options) {
			return orderDirectionField('options_order_dir');
		}
	};

	const manualOptions = () => {
		if ('manual_entry' === number_get_options) {
			return <ManualOptions />;
		}
	};

	return (
		<>
			{getOptionsField('number_get_options')}

			{_orderDirectionField()}

			{manualOptions()}
		</>
	);
};

export default RatingOptions;
