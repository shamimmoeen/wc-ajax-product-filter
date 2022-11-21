import { __ } from '@wordpress/i18n';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import ManualOptions from './ManualOptions';
import useFields from './useFields';

const RatingOptions = ({ index }) => {
	const { state, dispatch } = useForm();

	const {} = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { getOptionsField } = useFields(index);

	const { number_get_options } = filter;

	const manualOptions = () => {
		if ('manual_entry' === number_get_options) {
			return <ManualOptions index={index} />;
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
