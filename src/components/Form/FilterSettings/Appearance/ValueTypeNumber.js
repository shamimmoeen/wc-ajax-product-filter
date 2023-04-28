import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import ToggleGroup from '../../../Field/ToggleGroup';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import Checkbox from '../../../Field/Checkbox';
import { foundProVersion } from '../../../utils';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import { numberDisplayTypes } from '../../utils';
import useFields from './useFields';

const ValueTypeNumber = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleRadioChange,
		handleToggleGroupChange,
		handleSelectChange,
		handleCheckboxChange,
	} = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		layoutFields,
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		showCountField,
		enableTooltipField,
		showCountInTooltipField,
		tooltipPositionField,
	} = useFields('number', index);

	const {
		number_display_type,
		number_range_slider_display_values_as,
		alignment,
		input_type_number,
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

	const alignmentField = () => {
		if (
			'range_slider' === number_display_type &&
			'plain_text' === number_range_slider_display_values_as
		) {
			return (
				<ToggleGroup
					id={'alignment'}
					index={index}
					label={__('Alignment', 'wc-ajax-product-filter')}
					description={__(
						'Whether to align the text in the center or justified by distributing space between them.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Default', 'wc-ajax-product-filter'),
							value: 'default',
						},
						{
							label: __('Centered', 'wc-ajax-product-filter'),
							value: 'centered',
						},
						{
							label: __('Justified', 'wc-ajax-product-filter'),
							value: 'justified',
						},
					]}
					value={alignment}
					onChange={handleToggleGroupChange}
				/>
			);
		}
	};

	const numberField = () => {
		if (
			('range_slider' === number_display_type &&
				'input_field' === number_range_slider_display_values_as) ||
			'range_number' === number_display_type
		) {
			return (
				<Checkbox
					id={'input_type_number'}
					index={index}
					label={__('Input type number', 'wc-ajax-product-filter')}
					description={__(
						'Enable this to hide units and display them as spinbox with up and down arrows.',
						'wc-ajax-product-filter'
					)}
					isChecked={input_type_number}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{displayValuesField()}

			{layoutFields(number_display_type)}

			{alignmentField()}

			{numberField()}

			{enableMultipleFilterField('number_range_enable_multiple_filter')}

			{queryTypeField('number_range_query_type')}

			{allItemsLabelField('number_range_select_all_items_label')}

			{showCountField('number_range_show_count')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeNumber;
