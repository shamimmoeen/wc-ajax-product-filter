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
import Radio from '../../../Field/Radio';
import Number from '../../../Field/Number';
import { foundProVersion } from '../../../utils';

/**
 * TODO: Remove this file.
 */

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

	const {
		handleCheckboxChange,
		handleSelectChange,
		handleRadioChange,
		handleTextFieldChange,
	} = useFormFilterData(state, dispatch);

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
		hierarchical,
		enable_hierarchy_accordion,
		enable_swatch,
		swatch_type,
		swatch_size,
		swatch_preset,
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

		return (
			<Select
				id={'display_type'}
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

	const enableSwatchField = () => {
		return (
			<Checkbox
				id={'enable_swatch'}
				index={index}
				label={__('Enable swatch', 'wc-ajax-product-filter')}
				description={__(
					'Display color/image in filter options. <b>Note:</b> You need to manually enter the filter options and set the swatch data.',
					'wc-ajax-product-filter'
				)}
				isChecked={enable_swatch}
				onChange={handleCheckboxChange}
				isPro
			/>
		);
	};

	const swatchTypeField = () => {
		if ('1' === enable_swatch) {
			return (
				<>
					<div className='__global_swatch_section_heading'>
						<h4 className='__section_heading'>
							{__(
								'Swatch global settings',
								'wc-ajax-product-filter'
							)}
						</h4>
						<p className='__description'>
							{__(
								'Below are the global settings for this swatch.',
								'wc-ajax-product-filter'
							)}
						</p>
					</div>
					<Radio
						id={'swatch_type'}
						index={index}
						label={__('Swatch type', 'wc-ajax-product-filter')}
						description={__(
							'Determines the swatch type.',
							'wc-ajax-product-filter'
						)}
						options={[
							{
								label: __('Color', 'wc-ajax-product-filter'),
								value: 'color',
							},
							{
								label: __('Image', 'wc-ajax-product-filter'),
								value: 'image',
							},
						]}
						onChange={handleRadioChange}
						value={swatch_type}
					/>
				</>
			);
		}
	};

	const swatchSize = () => {
		if ('1' === enable_swatch) {
			return (
				<Number
					id={'swatch_size'}
					index={index}
					label={__('Swatch size', 'wc-ajax-product-filter')}
					description={__(
						'Give the swatch size in px. Leave empty to use the default size.',
						'wc-ajax-product-filter'
					)}
					value={swatch_size}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const swatchBorder = () => {
		if ('1' === enable_swatch) {
			return (
				<Number
					id={'swatch_size'}
					index={index}
					label={__('Border', 'wc-ajax-product-filter')}
					description={__(
						'Give the swatch size in px. Leave empty to use the default size.',
						'wc-ajax-product-filter'
					)}
					value={swatch_size}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const swatchRoundness = () => {
		if ('1' === enable_swatch) {
			return (
				<Number
					id={'swatch_size'}
					index={index}
					label={__('Roundness', 'wc-ajax-product-filter')}
					description={__(
						'Give the swatch size in px. Leave empty to use the default size.',
						'wc-ajax-product-filter'
					)}
					value={swatch_size}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const swatchPresetField = () => {
		if ('1' === enable_swatch && 'label' === display_type) {
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

	const swatchShowTextField = () => {
		if ('1' === enable_swatch && 'label' === display_type) {
			return (
				<Checkbox
					id={'show_swatch_text'}
					index={index}
					label={__('Show text', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the option text beside the swatch.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_swatch_text}
					onChange={handleCheckboxChange}
					isPro
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{enableMultipleFilterField('enable_multiple_filter')}

			{queryTypeField('query_type')}

			{allItemsLabelField('all_items_label')}

			{hierarchyField()}

			{hierarchyAccordionField()}

			{showCountField('show_count')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}

			{enableSwatchField()}

			{swatchTypeField()}

			{swatchSize()}

			{swatchBorder()}

			{swatchRoundness()}

			{swatchPresetField()}

			{swatchShowTextField()}
		</>
	);
};

export default ValueTypeText;
