import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import { textDisplayTypes } from '../../../utils';
import DropdownSelect from '../../../../Field/DropdownSelect';
import useFields from './useFields';

const ValueTypeText = () => {
	const {
		state: { filterType, additionalData, activeFilterData },
		dispatch,
	} = useFilter();

	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleDropdownChange,
	} = useFilterData(activeFilterData, dispatch);

	const {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		removeEmptyField,
	} = useFields('text');

	const {
		display_type,
		hierarchical,
		enable_tooltip,
		tooltip_position,
		show_count_in_tooltip,
	} = activeFilterData;

	const displayTypeField = () => {
		const haveAllDisplayTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
			'product-status',
			'post-meta',
		];

		let options = [];

		if (haveAllDisplayTypes.includes(filterType)) {
			const freeFilterTypes = [
				'category',
				'tag',
				'attribute',
				'product-status',
			];

			if (freeFilterTypes.includes(filterType)) {
				options = textDisplayTypes(true);
			} else {
				options = textDisplayTypes();
			}
		} else if ('sort-by' === filterType || 'per-page' === filterType) {
			const allOptions = textDisplayTypes();
			const allowed = ['radio', 'select'];

			options = allOptions.filter((option) =>
				allowed.includes(option.key)
			);
		} else {
			const allOptions = textDisplayTypes();
			const notAllowed = ['color', 'image'];

			options = allOptions.filter(
				(option) => !notAllowed.includes(option.key)
			);
		}

		const value = options.find((option) => display_type === option.key);

		return (
			<DropdownSelect
				id={'display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filter will be shown on the frontend.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={value}
				onChange={handleDropdownChange}
				renderAsFormField={true}
			/>
		);
	};

	const hierarchyField = () => {
		let isHierarchical = false;

		if ('category' === filterType) {
			isHierarchical = true;
		} else if ('custom-taxonomy' === filterType) {
			const { taxonomy } = activeFilterData;
			const { taxonomy_hierarchical_data } = additionalData;

			if (taxonomy_hierarchical_data[taxonomy]) {
				isHierarchical = true;
			}
		}

		if (!isHierarchical) {
			return;
		}

		let showField = false;

		const validDisplayTypes = [
			'checkbox',
			'radio',
			'select',
			'multi-select',
		];

		if (validDisplayTypes.includes(display_type)) {
			showField = true;
		}

		if (showField) {
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
				/>
			);
		}
	};

	const enableTooltipField = () => {
		if ('color' === display_type || 'image' === display_type) {
			return (
				<Checkbox
					id={'enable_tooltip'}
					label={__('Enable Tooltip', 'wc-ajax-product-filter')}
					description={__(
						'Display additional information in a tooltip when users hover over the option.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_tooltip}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const tooltipPositionField = () => {
		if (
			('color' === display_type || 'image' === display_type) &&
			'1' === enable_tooltip
		) {
			return (
				<ToggleGroup
					id={'tooltip_position'}
					label={__('Tooltip Position', 'wc-ajax-product-filter')}
					description={__(
						'Determines on which side the tooltip will be placed.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Top', 'wc-ajax-product-filter'),
							value: 'top',
						},
						{
							label: __('Right', 'wc-ajax-product-filter'),
							value: 'right',
						},
						{
							label: __('Bottom', 'wc-ajax-product-filter'),
							value: 'bottom',
						},
						{
							label: __('Left', 'wc-ajax-product-filter'),
							value: 'left',
						},
					]}
					onChange={handleToggleGroupChange}
					value={tooltip_position}
				/>
			);
		}
	};

	const showCountInTooltipField = () => {
		if (
			('color' === display_type || 'image' === display_type) &&
			'1' === enable_tooltip
		) {
			return (
				<Checkbox
					id={'show_count_in_tooltip'}
					label={__('Count in tooltip', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the product count in tooltip.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_count_in_tooltip}
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

			{showCountField('show_count')}

			{removeEmptyField('hide_empty')}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default ValueTypeText;
