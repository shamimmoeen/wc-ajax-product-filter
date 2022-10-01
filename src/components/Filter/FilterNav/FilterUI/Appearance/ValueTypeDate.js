import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import DropdownSelect from '../../../../Field/DropdownSelect';
import Radio from '../../../../Field/Radio';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import { dateDisplayTypes } from '../../../utils';
import useFields from './useFields';

const ValueTypeDate = () => {
	const {
		state: { activeFilterData, additionalData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleCheckboxChange, handleDropdownChange } =
		useFilterData(activeFilterData, dispatch);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		removeEmptyField,
	} = useFields('date');

	const {
		date_display_type,
		date_format,
		show_date_inputs_inline,
		date_picker_month_dropdown,
		date_picker_year_dropdown,
	} = activeFilterData;

	const displayTypeField = () => {
		const options = dateDisplayTypes();
		const value = options.find(
			(option) => date_display_type === option.key
		);

		return (
			<DropdownSelect
				id={'date_display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filter will be shown on the frontend.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={value}
				onChange={handleDropdownChange}
				renderAsFormField={true}
			/>
		);
	};

	const dateFormatField = () => {
		if (
			'input_date' === date_display_type ||
			'input_date_range' === date_display_type
		) {
			const options = additionalData['default_date_display_formats'];

			return (
				<Radio
					id={'date_format'}
					label={__('Date Format', 'wc-ajax-product-filter')}
					description={__(
						'Determines how the date will be displayed in the frontend.',
						'wc-ajax-product-filter'
					)}
					options={options}
					onChange={handleRadioChange}
					value={date_format}
					isVertical={true}
				/>
			);
		}
	};

	// TODO: Move to the customize section.
	const dateInputsInlineField = () => {
		if ('input_date_range' === date_display_type) {
			return (
				<Checkbox
					id={'show_date_inputs_inline'}
					label={__('Inlide Date Inputs', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the date input fields in a single line.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_date_inputs_inline}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const useDropdownMonthField = () => {
		if (
			'input_date' === date_display_type ||
			'input_date_range' === date_display_type
		) {
			return (
				<Checkbox
					id={'date_picker_month_dropdown'}
					label={__(
						'Use dropdown for Month',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Whether to show the month dropdown in datepicker.',
						'wc-ajax-product-filter'
					)}
					isChecked={date_picker_month_dropdown}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const useDropdownYearField = () => {
		if (
			'input_date' === date_display_type ||
			'input_date_range' === date_display_type
		) {
			return (
				<Checkbox
					id={'date_picker_year_dropdown'}
					label={__(
						'Use dropdown for Year',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Whether to show the year dropdown in datepicker.',
						'wc-ajax-product-filter'
					)}
					isChecked={date_picker_year_dropdown}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{dateFormatField()}

			{dateInputsInlineField()}

			{useDropdownMonthField()}

			{useDropdownYearField()}

			{enableMultipleFilterField('time_period_enable_multiple_filter')}

			{queryTypeField('time_period_query_type')}

			{allItemsLabelField('time_period_select_all_items_label')}

			{useChosenField('time_period_use_chosen')}

			{allItemsLabelFieldForUseChosen(
				'time_period_select_all_items_label'
			)}

			{noResultsMessageField('time_period_chosen_no_results_message')}

			{showCountField('time_period_show_count')}

			{removeEmptyField('time_period_hide_empty')}
		</>
	);
};

export default ValueTypeDate;
