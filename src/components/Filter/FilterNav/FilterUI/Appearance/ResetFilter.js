import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';

const ResetFilter = () => {
	const {
		state: { activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const { reset_button_label, show_if_empty } = activeFilterData;

	const { handleCheckboxChange, handleTextFieldChange } = useFilterData(
		activeFilterData,
		isDirty,
		dispatch
	);

	return (
		<>
			<Text
				id={'reset_button_label'}
				label={__('Button Label', 'wc-ajax-product-filter')}
				description={__(
					'Change the default button label.',
					'wc-ajax-product-filter'
				)}
				value={reset_button_label}
				onChange={handleTextFieldChange}
			/>

			<Checkbox
				id={'show_if_empty'}
				label={__('Show if empty', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show the reset filter button when no filter is applied.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_if_empty}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default ResetFilter;
