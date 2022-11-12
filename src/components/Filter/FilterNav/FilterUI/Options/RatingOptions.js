import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import ManualOptions from './ManualOptions';
import useFields from './useFields';

const RatingOptions = () => {
	const {
		state: { activeFilterData },
	} = useFilter();

	const { getOptionsField } = useFields();

	const { number_get_options } = activeFilterData;

	const manualOptions = () => {
		if ('manual_entry' === number_get_options) {
			return <ManualOptions />;
		}
	};

	return (
		<>
			{getOptionsField('number_get_options')}

			{manualOptions()}
		</>
	);
};

export default RatingOptions;
