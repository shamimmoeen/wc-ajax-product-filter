import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	getTaxonomy,
	isTaxonomyFilters,
	isTaxonomyHierarchical,
	textDisplayTypes,
} from '../../../utils';
import useFields from './useFields';
import Select from '../../../../Field/Select';

const ValueTypeText = () => {
	const { state, dispatch } = useFilter();
	const { handleCheckboxChange, handleSelectChange } = useFilterData(
		state,
		dispatch
	);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		removeEmptyField,
		enableTooltipField,
		tooltipPositionField,
		showCountInTooltipField,
	} = useFields('text');

	const { filterType, activeFilterData, additionalData } = state;

	const {
		taxonomy: _taxonomy,
		display_type,
		use_category_images,
		hierarchical,
		enable_hierarchy_accordion,
		value_type,
	} = activeFilterData;

	const displayTypeField = () => {
		const haveAllDisplayTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
		];

		let options = [];

		if (haveAllDisplayTypes.includes(filterType)) {
			options = textDisplayTypes(true);
		} else if ('sort-by' === filterType || 'per-page' === filterType) {
			const allOptions = textDisplayTypes();
			const allowed = ['radio', 'select'];

			options = allOptions.filter((option) =>
				allowed.includes(option.value)
			);
		} else if ('post-meta' === filterType && 'text' === value_type) {
			options = textDisplayTypes(true);
		} else {
			let allOptions;

			if ('rating' === filterType || 'product-status' === filterType) {
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

	const useCategoryImagesField = () => {
		if ('category' === filterType && 'image' === display_type) {
			return (
				<Checkbox
					id={'use_category_images'}
					label={__('Use Category Images', 'wc-ajax-product-filter')}
					description={__(
						'Whether to use the category images in options.',
						'wc-ajax-product-filter'
					)}
					isChecked={use_category_images}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const isHierarchyEnabled = () => {
		if (!isTaxonomyFilters(filterType)) {
			return false;
		}

		const taxonomy = getTaxonomy(filterType, _taxonomy);
		const { taxonomy_hierarchical_data: hierarchicalData } = additionalData;

		if (!isTaxonomyHierarchical(taxonomy, hierarchicalData)) {
			return false;
		}

		const validDisplayTypes = [
			'checkbox',
			'radio',
			'select',
			'multi-select',
		];

		if (validDisplayTypes.includes(display_type)) {
			return true;
		}

		return false;
	};

	const hierarchyField = () => {
		if (isHierarchyEnabled()) {
			return (
				<Checkbox
					id={'hierarchical'}
					label={__('Show hierarchy', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the filter options as hierarchical.',
						'wc-ajax-product-filter'
					)}
					isChecked={hierarchical}
					onChange={handleCheckboxChange}
					isPro={true}
				/>
			);
		}
	};

	const hierarchyAccordionField = () => {
		if (isHierarchyEnabled() && '1' === hierarchical) {
			return (
				<Checkbox
					id={'enable_hierarchy_accordion'}
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

			{useCategoryImagesField()}

			{enableMultipleFilterField('enable_multiple_filter')}

			{queryTypeField('query_type')}

			{allItemsLabelField('all_items_label')}

			{useChosenField('use_chosen')}

			{allItemsLabelFieldForUseChosen('all_items_label')}

			{noResultsMessageField('chosen_no_results_message')}

			{hierarchyField()}

			{hierarchyAccordionField()}

			{showCountField('show_count')}

			{removeEmptyField('hide_empty')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeText;
