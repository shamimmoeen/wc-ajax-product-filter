import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import useFields from './useFields';
import {
	hierarchicalDisplayTypes,
	sortByDisplayTypes,
	taxonomyDisplayTypes,
	textDisplayTypes,
} from '../../utils';
import Select from '../../../Field/Select';
import Checkbox from '../../../Field/Checkbox';
import { foundProVersion } from '../../../utils';
import Radio from '../../../Field/Radio';

const ValueTypeText = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleCheckboxChange,
		handleSelectChange,
		handleShowHierarchyChange,
		handleRadioChange,
	} = useFormFilterData(state, dispatch);

	const {
		layoutFields,
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
		native_display_type_layout,
		hierarchical,
		enable_hierarchy_accordion,
		value_type,
		enable_swatch,
		swatch_type,
		auto_swatch_data,
		swatch_with_input,
		swatch_with_label,
	} = filter;

	const displayTypeField = () => {
		let options = [];
		let value;

		if ('taxonomy' === type) {
			options = taxonomyDisplayTypes(true, taxHierarchical);
		} else if ('post-meta' === type && 'text' === value_type) {
			options = textDisplayTypes();
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
				label={__('Display', 'wc-ajax-product-filter')}
				description={__(
					'Determines the display type of filter options in the front end.',
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
			hierarchicalDisplayTypes().includes(display_type) &&
			'list-item' === native_display_type_layout
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
					onChange={handleShowHierarchyChange}
				/>
			);
		}
	};

	const hierarchyAccordionField = () => {
		if (
			'1' === taxHierarchical &&
			'1' === hierarchical &&
			hierarchicalDisplayTypes().includes(display_type) &&
			'list-item' === native_display_type_layout &&
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

	const swatchFields = () => {
		if (!['checkbox', 'radio'].includes(display_type)) {
			return;
		}

		return (
			<>
				<Checkbox
					id={'enable_swatch'}
					index={index}
					label={__('Enable swatches', 'wc-ajax-product-filter')}
					description={__(
						'Whether to display the filter options in color/image swatches.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_swatch}
					onChange={handleCheckboxChange}
					isPro
				/>

				{'1' === enable_swatch && (
					<>
						<Radio
							id={'swatch_type'}
							index={index}
							label={__('Swatch type', 'wc-ajax-product-filter')}
							description={__(
								'Select the swatch type, color, or image.',
								'wc-ajax-product-filter'
							)}
							tooltip={__(
								'For color swatch, if color is not found in an option and the image is found then the image will be shown, and vice versa.',
								'wc-ajax-product-filter'
							)}
							options={[
								{
									label: __(
										'Color',
										'wc-ajax-product-filter'
									),
									value: 'color',
								},
								{
									label: __(
										'Image',
										'wc-ajax-product-filter'
									),
									value: 'image',
								},
							]}
							onChange={handleRadioChange}
							value={swatch_type}
						/>

						<Checkbox
							id={'auto_swatch_data'}
							index={index}
							label={__(
								'Swatch data from meta',
								'wc-ajax-product-filter'
							)}
							description={__(
								'With <a href="https://wptools.io/docs/wc-ajax-product-filter/common/color-image-swatches/?utm_source=Filter+Swatches&utm_medium=inside+plugin&utm_campaign=WCAPF+Swatches+Documentation" target="_blank">supported plugins</a>, swatch data can be obtained from term meta, <b>otherwise, manually input filter options and set swatch data.</b>',
								'wc-ajax-product-filter'
							)}
							tooltip={__(
								"If you are using any of the supported plugins for the variation swatches, the swatch data can be obtained from term meta. However, if you're not using any of these supported plugins, you'll have to manually input the filter options and configure the swatch data.",
								'wc-ajax-product-filter'
							)}
							isChecked={auto_swatch_data}
							onChange={handleCheckboxChange}
						/>

						<Checkbox
							id={'swatch_with_input'}
							index={index}
							label={__(
								'Show with input',
								'wc-ajax-product-filter'
							)}
							description={__(
								'Enable this to show swatches with checkbox and radio buttons. For radio buttons, you will see the <b>All Items</b> option.',
								'wc-ajax-product-filter'
							)}
							isChecked={swatch_with_input}
							onChange={handleCheckboxChange}
						/>

						<Checkbox
							id={'swatch_with_label'}
							index={index}
							label={__(
								'Show with label',
								'wc-ajax-product-filter'
							)}
							description={__(
								'Enable this to show the option label beside the Swatch.',
								'wc-ajax-product-filter'
							)}
							isChecked={swatch_with_label}
							onChange={handleCheckboxChange}
						/>
					</>
				)}
			</>
		);
	};

	return (
		<>
			{displayTypeField()}

			{layoutFields(display_type)}

			{enableMultipleFilterField('enable_multiple_filter')}

			{queryTypeField('query_type')}

			{allItemsLabelField('all_items_label')}

			{hierarchyField()}

			{hierarchyAccordionField()}

			{showCountField('show_count')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}

			{swatchFields()}
		</>
	);
};

export default ValueTypeText;
