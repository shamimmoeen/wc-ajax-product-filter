import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { foundProVersion } from '../../../utils';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import { numberDisplayTypes } from '../../utils';
import useFields from './useFields';

const ValueTypeNumber = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleRadioChange, handleCheckboxChange, handleSelectChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		enableTooltipField,
		showCountInTooltipField,
		tooltipPositionField,
	} = useFields('number', index);

	const {
		number_display_type,
		number_range_slider_display_values_as,
		align_values_at_the_end,
	} = filter;

	const displayTypeField = () => {
		const options = numberDisplayTypes(true);
		let value;

		value = options.find((option) => option.value === number_display_type);

		if (!foundProVersion()) {
			const freeDisplayTypes = ['range_slider', 'range_number'];

			if (!freeDisplayTypes.includes(number_display_type)) {
				const _proOptions = find(options, { proGroup: true });
				const proOptions = _proOptions.options;

				value = proOptions.find(
					(option) => option.value === number_display_type
				);
			}
		}

		return (
			<Select
				id={'number_display_type'}
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

	const displayValuesField = () => {
		if ('range_slider' === number_display_type) {
			return (
				<Radio
					id={'number_range_slider_display_values_as'}
					index={index}
					label={__(
						'Display slider values as',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Determines how the slider values will be shown on the frontend.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Input Field', 'wc-ajax-product-filter'),
							value: 'input_field',
						},
						{
							label: __('Plain Text', 'wc-ajax-product-filter'),
							value: 'plain_text',
						},
					]}
					onChange={handleRadioChange}
					value={number_range_slider_display_values_as}
				/>
			);
		}
	};

	const alignValuesField = () => {
		if (
			'range_slider' === number_display_type ||
			'range_number' === number_display_type
		) {
			let label;
			let description;

			if ('range_slider' === number_display_type) {
				label = __('Justify slider values', 'wc-ajax-product-filter');

				description = __(
					'Whether to justify the slider values by distributing space between or around them.',
					'wc-ajax-product-filter'
				);
			} else {
				label = __('Justify input fields', 'wc-ajax-product-filter');

				description = __(
					'Whether to justify the input fields by distributing space between or around them.',
					'wc-ajax-product-filter'
				);
			}

			return (
				<Checkbox
					id={'align_values_at_the_end'}
					index={index}
					label={label}
					description={description}
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

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeNumber;
