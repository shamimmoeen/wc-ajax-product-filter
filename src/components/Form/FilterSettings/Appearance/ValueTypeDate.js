import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { foundProVersion } from '../../../utils';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import { dateDisplayTypes } from '../../utils';
import useFields from './useFields';

const dateDisplayFormats = wcapf_admin_params.date_formats;

const ValueTypeDate = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleRadioChange, handleCheckboxChange, handleSelectChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		showCountField,
		enableTooltipField,
		tooltipPositionField,
		showCountInTooltipField,
	} = useFields('date', index);

	const {
		date_display_type,
		date_format,
		show_date_inputs_inline,
		date_picker_month_dropdown,
		date_picker_year_dropdown,
	} = filter;

	const displayTypeField = () => {
		const options = dateDisplayTypes(true);
		let value;

		value = options.find((option) => option.value === date_display_type);

		if (!foundProVersion()) {
			const freeDisplayTypes = ['input_date', 'input_date_range'];

			if (!freeDisplayTypes.includes(date_display_type)) {
				const _proOptions = find(options, { proGroup: true });
				const proOptions = _proOptions.options;

				value = proOptions.find(
					(option) => option.value === date_display_type
				);
			}
		}

		return (
			<Select
				id={'date_display_type'}
				index={index}
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

	const dateFormatField = () => {
		if (
			'input_date' === date_display_type ||
			'input_date_range' === date_display_type
		) {
			return (
				<Radio
					id={'date_format'}
					index={index}
					label={__('Date Display Format', 'wc-ajax-product-filter')}
					description={__(
						'Determines how the date will be displayed in the frontend.',
						'wc-ajax-product-filter'
					)}
					options={dateDisplayFormats}
					onChange={handleRadioChange}
					value={date_format}
					isVertical={true}
				/>
			);
		}
	};

	const dateInputsInlineField = () => {
		if ('input_date_range' === date_display_type) {
			return (
				<Checkbox
					id={'show_date_inputs_inline'}
					index={index}
					label={__('Inline Date Inputs', 'wc-ajax-product-filter')}
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
					index={index}
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
					index={index}
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

			{showCountField('time_period_show_count')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeDate;
