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

const ValueTypeText = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleCheckboxChange,
		handleSelectChange,
		handleShowHierarchyChange,
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
				'Determines the display type of filter options in the front end. <b>Note:</b> For color/image swatch, you need to manually enter the filter options and set the swatch data.',
				'wc-ajax-product-filter'
			);
		} else {
			description = __(
				'Determines the display type of filter options in the front end.',
				'wc-ajax-product-filter'
			);
		}

		return (
			<Select
				id={'display_type'}
				index={index}
				label={__('Display', 'wc-ajax-product-filter')}
				description={description}
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
		</>
	);
};

export default ValueTypeText;
