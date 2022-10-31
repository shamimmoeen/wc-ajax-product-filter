import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import Radio from '../../../../Field/Radio';
import Select from '../../../../Field/Select';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import { numberDisplayTypes } from '../../../utils';
import useFields from './useFields';

const ValueTypeNumber = () => {
	const { state, dispatch } = useFilter();
	const { handleRadioChange, handleCheckboxChange, handleSelectChange } =
		useFilterData(state, dispatch);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		removeEmptyField,
	} = useFields('number');

	const {
		filterType,
		activeFilterData: {
			number_display_type,
			number_range_slider_display_values_as,
			align_values_at_the_end,
		},
	} = state;

	const displayTypeField = () => {
		let options = [];

		if ('price' === filterType) {
			options = numberDisplayTypes(true);
		} else {
			options = numberDisplayTypes();
		}

		const value = options.find(
			(option) => number_display_type === option.value
		);

		return (
			<Select
				id={'number_display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filter will be shown on the frontend.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={value}
				onChange={handleSelectChange}
				renderAsFormField={true}
			/>
		);
	};

	const displayValuesField = () => {
		if ('range_slider' === number_display_type) {
			return (
				<Radio
					id={'number_range_slider_display_values_as'}
					label={__('Display values as', 'wc-ajax-product-filter')}
					description={__(
						'Determinses how the slider values will be shown on the frontend.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Plain Text', 'wc-ajax-product-filter'),
							value: 'plain_text',
						},
						{
							label: __('Input Field', 'wc-ajax-product-filter'),
							value: 'input_field',
						},
					]}
					onChange={handleRadioChange}
					value={number_range_slider_display_values_as}
				/>
			);
		}
	};

	// TODO: Move to the customize section.
	const alignValuesField = () => {
		if ('range_slider' === number_display_type) {
			return (
				<Checkbox
					id={'align_values_at_the_end'}
					label={__('Align values', 'wc-ajax-product-filter')}
					description={__(
						'Whether to align the slider values in the line; first item is on the start line, last item on the end line.',
						'wc-ajax-product-filter'
					)}
					isChecked={align_values_at_the_end}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{displayValuesField()}

			{alignValuesField()}

			{enableMultipleFilterField('number_range_enable_multiple_filter')}

			{queryTypeField('number_range_query_type')}

			{allItemsLabelField('number_range_select_all_items_label')}

			{useChosenField('number_range_use_chosen')}

			{allItemsLabelFieldForUseChosen(
				'number_range_select_all_items_label'
			)}

			{noResultsMessageField('number_range_chosen_no_results_message')}

			{showCountField('number_range_show_count')}

			{removeEmptyField('number_range_hide_empty')}
		</>
	);
};

export default ValueTypeNumber;
