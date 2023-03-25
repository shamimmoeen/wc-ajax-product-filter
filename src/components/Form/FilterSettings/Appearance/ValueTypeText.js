import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import useFields from './useFields';
import {
	hierarchicalDisplayTypes,
	postMetaDisplayTypes,
	sortByDisplayTypes,
	taxonomyDisplayTypes,
	textDisplayTypes,
} from '../../utils';
import Select from '../../../Field/Select';
import Checkbox from '../../../Field/Checkbox';
import { foundProVersion } from '../../../utils';

const swatchDisplayTypes = ['color', 'image'];

const swatchPresets = [
	{
		label: __('Preset 1', 'wc-ajax-product-filter'),
		value: 'preset-1',
	},
	{
		label: __('Preset 2', 'wc-ajax-product-filter'),
		value: 'preset-2',
	},
	{
		label: __('Preset 3', 'wc-ajax-product-filter'),
		value: 'preset-3',
	},
];

const ValueTypeText = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleCheckboxChange, handleSelectChange } = useFormFilterData(
		state,
		dispatch
	);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		showCountField,
		enableTooltipField,
		tooltipPositionField,
		showCountInTooltipField,
	} = useFields('text', index);

	const { formFilters } = state;
	const filter = formFilters[index];

	const {
		type,
		taxHierarchical,
		display_type,
		swatch_preset,
		hierarchical,
		enable_hierarchy_accordion,
		value_type,
	} = filter;

	const displayTypeField = () => {
		let options = [];
		let value;

		if ('taxonomy' === type) {
			options = taxonomyDisplayTypes(true, taxHierarchical);
		} else if ('post-meta' === type && 'text' === value_type) {
			options = postMetaDisplayTypes(true);
		} else if ('sort-by' === type || 'per-page' === type) {
			options = sortByDisplayTypes();
		} else {
			options = textDisplayTypes();
		}

		value = options.find((option) => display_type === option.value);

		if (!foundProVersion()) {
			const freeDisplayTypes = [
				'checkbox',
				'radio',
				'select',
				'multi-select',
				'label',
			];

			if (!freeDisplayTypes.includes(display_type)) {
				const _proOptions = find(options, { proGroup: true });
				const proOptions = _proOptions.options;

				value = proOptions.find(
					(option) => option.value === display_type
				);
			}
		}

		let description;

		if (swatchDisplayTypes.includes(display_type)) {
			description = __(
				'Determines how the filter will be shown on the frontend. <b>Note:</b> You need to manually enter the filter options and set the swatch data.'
			);
		} else {
			description = __(
				'Determines how the filter will be shown on the frontend.'
			);
		}

		return (
			<Select
				id={'display_type'}
				index={index}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={description}
				options={options}
				value={value}
				onChange={handleSelectChange}
				renderAsFormField={true}
			/>
		);
	};

	const swatchPresetField = () => {
		if (swatchDisplayTypes.includes(display_type)) {
			const swatchPreset = swatchPresets.find(
				(option) => swatch_preset === option.value
			);

			return (
				<Select
					id={'swatch_preset'}
					index={index}
					label={__('Swatch Preset', 'wc-ajax-product-filter')}
					description={__(
						'Select the swatch style from the available presets.',
						'wc-ajax-product-filter'
					)}
					options={swatchPresets}
					value={swatchPreset}
					onChange={handleSelectChange}
					renderAsFormField={true}
				/>
			);
		}
	};

	const hierarchyField = () => {
		if (
			'1' === taxHierarchical &&
			hierarchicalDisplayTypes().includes(display_type)
		) {
			return (
				<Checkbox
					id={'hierarchical'}
					index={index}
					label={__('Show hierarchy', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the filter options as hierarchical.',
						'wc-ajax-product-filter'
					)}
					isChecked={hierarchical}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const hierarchyAccordionField = () => {
		if (
			'1' === taxHierarchical &&
			'1' === hierarchical &&
			hierarchicalDisplayTypes().includes(display_type) &&
			!['select', 'multi-select'].includes(display_type)
		) {
			return (
				<Checkbox
					id={'enable_hierarchy_accordion'}
					index={index}
					label={__(
						'Enable hierarchy accordion',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Whether to enable accordion for the hierarchy filter options.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_hierarchy_accordion}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{swatchPresetField()}

			{enableMultipleFilterField('enable_multiple_filter')}

			{queryTypeField('query_type')}

			{allItemsLabelField('all_items_label')}

			{hierarchyField()}

			{hierarchyAccordionField()}

			{showCountField('show_count')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeText;
