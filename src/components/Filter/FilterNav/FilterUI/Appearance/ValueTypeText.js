import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import { getCustomAppearanceModalData, textDisplayTypes } from '../../../utils';
import useFields from './useFields';
import Select from '../../../../Field/Select';
import CustomAppearanceModal from './CustomAppearanceModal';

const ValueTypeText = () => {
	const {
		state: { filterType, additionalData, activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectChange,
	} = useFilterData(activeFilterData, isDirty, dispatch);

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
		custom_appearance_options,
		use_category_images,
		hierarchical,
		enable_tooltip,
		tooltip_position,
		show_count_in_tooltip,
	} = activeFilterData;

	const customAppearance = () => {
		const { type, taxonomy } = getCustomAppearanceModalData(
			filterType,
			activeFilterData
		);

		if (type && taxonomy) {
			return (
				<CustomAppearanceModal
					type={type}
					taxonomy={taxonomy}
					appearanceData={custom_appearance_options}
				/>
			);
		}
	};

	const displayTypeField = () => {
		const haveAllDisplayTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
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
				allowed.includes(option.value)
			);
		} else {
			const allOptions = textDisplayTypes();
			const notAllowed = ['color', 'image'];

			options = allOptions.filter(
				(option) => !notAllowed.includes(option.value)
			);
		}

		const value = options.find((option) => display_type === option.value);

		return (
			<>
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
					childComponent={customAppearance()}
				/>
			</>
		);
	};

	const useCategoryThumbnailField = () => {
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

			{useCategoryThumbnailField()}

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
