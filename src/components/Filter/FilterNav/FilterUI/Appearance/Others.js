import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import Radio from '../../../../Field/Radio';
import Text from '../../../../Field/Text';
import DisplayTypeField from '../DisplayTypeField';
import { useFilter } from '../../../FilterContext';
import TooltipPosition from '../TooltipPosition';
import useFilterData from '../../../useFilterData';

const Others = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const {
		display_type,
		query_type,
		all_items_label,
		use_chosen,
		chosen_no_results_message,
		enable_multiple_filter,
		hierarchical,
		show_count,
		hide_empty,
		enable_tooltip,
		show_count_in_tooltip,
	} = activeFilterData;

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, dispatch);

	const displayTypeField = () => {
		const segments = [];

		const haveAllDisplayTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
			'product-status',
			'post-meta',
		];

		if (haveAllDisplayTypes.includes(filterType)) {
			segments.push([
				{
					label: __('Checkbox', 'wc-ajax-product-filter'),
					value: 'checkbox',
				},
				{
					label: __('Radio', 'wc-ajax-product-filter'),
					value: 'radio',
				},
				{
					label: __('Select', 'wc-ajax-product-filter'),
					value: 'select',
				},
				{
					label: __('Multi select', 'wc-ajax-product-filter'),
					value: 'multi-select',
				},
			]);

			segments.push([
				{
					label: __('Label', 'wc-ajax-product-filter'),
					value: 'label',
				},
				{
					label: __('Color', 'wc-ajax-product-filter'),
					value: 'color',
					isPro: true,
				},
				{
					label: __('Image', 'wc-ajax-product-filter'),
					value: 'image',
					isPro: true,
				},
			]);
		} else {
			segments.push([
				{
					label: __('Checkbox', 'wc-ajax-product-filter'),
					value: 'checkbox',
				},
				{
					label: __('Radio', 'wc-ajax-product-filter'),
					value: 'radio',
				},
				{
					label: __('Select', 'wc-ajax-product-filter'),
					value: 'select',
				},
				{
					label: __('Multi select', 'wc-ajax-product-filter'),
					value: 'multi-select',
				},
				{
					label: __('Label', 'wc-ajax-product-filter'),
					value: 'label',
				},
			]);
		}

		return (
			<DisplayTypeField
				id={'display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filter will be shown on the frontend.',
					'wc-ajax-product-filter'
				)}
				segments={segments}
				value={display_type}
				onChange={handleRadioChange}
			/>
		);
	};

	const enableMultipleFilterField = () => {
		let showField = false;

		if (
			'label' === display_type ||
			'color' === display_type ||
			'image' === display_type
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'enable_multiple_filter'}
					label={__('Multiple Selection', 'wc-ajax-product-filter')}
					description={__(
						'Determines if the user can select multiple options when filtering products.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_multiple_filter}
					onChange={(value) =>
						handleCheckboxChange('enable_multiple_filter', value)
					}
				/>
			);
		}
	};

	const queryTypeField = () => {
		let showField = false;

		if ('checkbox' === display_type || 'multi-select' === display_type) {
			showField = true;
		} else if (
			('label' === display_type ||
				'color' === display_type ||
				'image' === display_type) &&
			'1' === enable_multiple_filter
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Radio
					id={'query_type'}
					label={__('Query Type', 'wc-ajax-product-filter')}
					description={__(
						'AND: products that have both options, OR: products that matched any option.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('AND', 'wc-ajax-product-filter'),
							value: 'and',
						},
						{
							label: __('OR', 'wc-ajax-product-filter'),
							value: 'or',
						},
					]}
					onChange={(e) => handleRadioChange(e, 'query_type')}
					value={query_type}
				/>
			);
		}
	};

	const allItemsLabelField = () => {
		let showField = false;

		if ('radio' === display_type || 'select' === display_type) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'all_items_label'}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={all_items_label}
					onChange={(e) =>
						handleTextFieldChange(e, 'all_items_label')
					}
				/>
			);
		}
	};

	const useChosenField = () => {
		let showField = false;

		if ('select' === display_type || 'multi-select' === display_type) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'use_chosen'}
					label={__('Enable Combobox', 'wc-ajax-product-filter')}
					description={__(
						'Whether to use jQuery Chosen library instead of the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={use_chosen}
					onChange={(value) =>
						handleCheckboxChange('use_chosen', value)
					}
				/>
			);
		}
	};

	const allItemsLabelFieldForUseChosen = () => {
		let showField = false;

		if ('multi-select' === display_type && '1' === use_chosen) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'all_items_label'}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={all_items_label}
					onChange={(e) =>
						handleTextFieldChange(e, 'all_items_label')
					}
				/>
			);
		}
	};

	const noResultsMessageField = () => {
		let showField = false;

		if (
			('select' === display_type || 'multi-select' === display_type) &&
			use_chosen
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'chosen_no_results_message'}
					label={__('No Matches Message', 'wc-ajax-product-filter')}
					description={__(
						'This message is usually displayed when no options match the search term. Leave blank to show the default message.',
						'wc-ajax-product-filter'
					)}
					value={chosen_no_results_message}
					onChange={(e) =>
						handleTextFieldChange(e, 'chosen_no_results_message')
					}
				/>
			);
		}
	};

	const hierarchyField = () => {
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
					onChange={(value) =>
						handleCheckboxChange('hierarchical', value)
					}
				/>
			);
		}
	};

	const enableTooltipField = () => {
		let showField = false;

		if ('color' === display_type || 'image' === display_type) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'enable_tooltip'}
					label={__('Enable Tooltip', 'wc-ajax-product-filter')}
					description={__(
						'Display additional information in a tooltip when users hover over the option.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_tooltip}
					onChange={(value) =>
						handleCheckboxChange('enable_tooltip', value)
					}
				/>
			);
		}
	};

	const tooltipPositionField = () => {
		let showField = false;

		if (
			('color' === display_type || 'image' === display_type) &&
			enable_tooltip
		) {
			showField = true;
		}

		if (showField) {
			return <TooltipPosition />;
		}
	};

	const showCountInTooltipField = () => {
		let showField = false;

		if (
			('color' === display_type || 'image' === display_type) &&
			enable_tooltip
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'show_count_in_tooltip'}
					label={__('Count in tooltip', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the product count in tooltip.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_count_in_tooltip}
					onChange={(value) =>
						handleCheckboxChange('show_count_in_tooltip', value)
					}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{enableMultipleFilterField()}

			{queryTypeField()}

			{allItemsLabelField()}

			{useChosenField()}

			{allItemsLabelFieldForUseChosen()}

			{noResultsMessageField()}

			{hierarchyField()}

			<Checkbox
				id={'show_count'}
				label={__('Show Count', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show the product count in options.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_count}
				onChange={(value) => handleCheckboxChange('show_count', value)}
			/>

			<Checkbox
				id={'hide_empty'}
				label={__('Remove Empty', 'wc-ajax-product-filter')}
				description={__(
					'Whether to remove the options that show empty results.',
					'wc-ajax-product-filter'
				)}
				isChecked={hide_empty}
				onChange={(value) => handleCheckboxChange('hide_empty', value)}
			/>

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}
		</>
	);
};

export default Others;
