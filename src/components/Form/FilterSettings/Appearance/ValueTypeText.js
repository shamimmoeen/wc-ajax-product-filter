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
		</>
	);
};

export default ValueTypeText;
