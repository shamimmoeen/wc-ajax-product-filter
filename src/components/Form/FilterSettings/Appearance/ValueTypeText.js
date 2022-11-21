import { __ } from '@wordpress/i18n';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import useFields from './useFields';
import { textDisplayTypes } from '../../utils';
import Select from '../../../Field/Select';
import Checkbox from '../../../Field/Checkbox';

const ValueTypeText = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleHierarchyChange, handleCheckboxChange, handleSelectChange } =
		useFormFilterData(state, dispatch);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
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

		if ('taxonomy' === type) {
			options = textDisplayTypes(true);
		} else if ('post-meta' === type && 'text' === value_type) {
			options = textDisplayTypes(true);
		} else {
			let allOptions;

			if ('rating' === type || 'product-status' === type) {
				allOptions = textDisplayTypes(true);
			} else {
				allOptions = textDisplayTypes(false);
			}

			const notAllowed = ['color', 'image'];

			options = allOptions.filter(
				(option) => !notAllowed.includes(option.value)
			);
		}

		const value = options.find((option) => display_type === option.value);

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
		if ('1' === taxHierarchical) {
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
					onChange={handleHierarchyChange}
					isPro={true}
				/>
			);
		}
	};

	const hierarchyAccordionField = () => {
		if ('1' === taxHierarchical && '1' === hierarchical) {
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

			{useChosenField('use_chosen')}

			{allItemsLabelFieldForUseChosen('all_items_label')}

			{noResultsMessageField('chosen_no_results_message')}

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
