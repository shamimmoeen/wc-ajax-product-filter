import { __ } from '@wordpress/i18n';
import Select from '../../../Field/Select';
import Number from '../../../Field/Number';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import ToggleGroup from '../../../Field/ToggleGroup';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import { tooltipCanBeEnabled } from '../../utils';

const useFields = (type, index) => {
	const { state, dispatch } = useForm();

	const {
		handleSelectChange,
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleToggleGroupChange,
	} = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		type: filterType,
		display_type,
		native_display_type_layout,
		custom_display_type_layout,
		grid_columns,
		enable_multiple_filter,
		enable_tooltip,
		tooltip_position,
		show_count_in_tooltip,
		number_display_type,
		number_range_enable_multiple_filter,
		date_display_type,
		time_period_enable_multiple_filter,
	} = filter;

	const layoutFields = (displayType) => {
		let _displayType;
		let id;
		let availableLayouts = [];

		if (
			[
				'checkbox',
				'radio',
				'range_checkbox',
				'range_radio',
				'time_period_checkbox',
				'time_period_radio',
			].includes(displayType)
		) {
			_displayType = native_display_type_layout;
			id = 'native_display_type_layout';

			availableLayouts = [
				{
					label: __('List', 'wc-ajax-product-filter'),
					value: 'list',
				},
				{
					label: __('Inline', 'wc-ajax-product-filter'),
					value: 'inline',
				},
				{
					label: __('Grid', 'wc-ajax-product-filter'),
					value: 'grid',
					isPro: true,
				},
			];
		} else if (
			['label', 'range_label', 'time_period_label'].includes(displayType)
		) {
			_displayType = custom_display_type_layout;
			id = 'custom_display_type_layout';

			availableLayouts = [
				{
					label: __('Inline', 'wc-ajax-product-filter'),
					value: 'inline',
				},
				{
					label: __('Grid', 'wc-ajax-product-filter'),
					value: 'grid',
					isPro: true,
				},
			];
		}

		if (!_displayType) {
			return;
		}

		const filterLayout = availableLayouts.find(
			(option) => _displayType === option.value
		);

		return (
			<>
				<Select
					id={id}
					index={index}
					label={__('Layout', 'wc-ajax-product-filter')}
					description={__(
						'Determines the layout of the filter options in the front end.',
						'wc-ajax-product-filter'
					)}
					options={availableLayouts}
					value={filterLayout}
					onChange={handleSelectChange}
					renderAsFormField={true}
				/>

				{'grid' === _displayType && (
					<Number
						id={'grid_columns'}
						index={index}
						label={__('Columns', 'wc-ajax-product-filter')}
						description={__(
							'Determines the number of columns for the grid layout.',
							'wc-ajax-product-filter'
						)}
						value={grid_columns}
						onChange={handleTextFieldChange}
						min={1}
						max={12} // TODO: Check with doc.
					/>
				)}
			</>
		);
	};

	const enableMultipleFilterField = (id) => {
		let showField = false;

		if ('text' === type) {
			showField =
				'label' === display_type ||
				'color' === display_type ||
				'image' === display_type;
		} else if ('number' === type) {
			showField = 'range_label' === number_display_type;
		} else if ('date' === type) {
			showField = 'time_period_label' === date_display_type;
		}

		if (showField) {
			return (
				<Checkbox
					id={id}
					index={index}
					label={__('Multiple Selection', 'wc-ajax-product-filter')}
					description={__(
						'Determines if the user can select multiple options when filtering products.',
						'wc-ajax-product-filter'
					)}
					isChecked={filter[id]}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const queryTypeField = (id) => {
		let showField = false;

		if ('text' === type) {
			if (
				'checkbox' === display_type ||
				'multi-select' === display_type
			) {
				showField = true;
			} else if (
				('label' === display_type ||
					'color' === display_type ||
					'image' === display_type) &&
				'1' === enable_multiple_filter
			) {
				showField = true;
			}
		} else if ('number' === type) {
			if (
				'range_checkbox' === number_display_type ||
				'range_multiselect' === number_display_type
			) {
				showField = true;
			} else if (
				'range_label' === number_display_type &&
				'1' === number_range_enable_multiple_filter
			) {
				showField = true;
			}
		} else if ('date' === type) {
			if (
				'time_period_checkbox' === date_display_type ||
				'time_period_multiselect' === date_display_type
			) {
				showField = true;
			} else if (
				'time_period_label' === date_display_type &&
				'1' === time_period_enable_multiple_filter
			) {
				showField = true;
			}
		}

		if (showField) {
			return (
				<Radio
					id={id}
					index={index}
					label={__('Query Type', 'wc-ajax-product-filter')}
					description={__(
						'OR: products that matched any option, AND: products that have both options.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('OR', 'wc-ajax-product-filter'),
							value: 'or',
						},
						{
							label: __('AND', 'wc-ajax-product-filter'),
							value: 'and',
						},
					]}
					onChange={handleRadioChange}
					value={filter[id]}
				/>
			);
		}
	};

	const allItemsLabelField = (id) => {
		let showField = false;

		if ('text' === type) {
			showField = ['radio', 'select', 'multi-select'].includes(
				display_type
			);
		} else if ('number' === type) {
			showField = [
				'range_radio',
				'range_select',
				'range_multiselect',
			].includes(number_display_type);
		} else if ('date' === type) {
			showField = [
				'time_period_radio',
				'time_period_select',
				'time_period_multiselect',
			].includes(date_display_type);
		}

		if (showField) {
			return (
				<Text
					id={id}
					index={index}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to use the default label.',
						'wc-ajax-product-filter'
					)}
					value={filter[id]}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const isCountEnabled = () => {
		let enabled = false;

		if ('text' === type) {
			const excludedFilterTypes = ['sort-by', 'per-page'];

			if (excludedFilterTypes.includes(filterType)) {
				enabled = false;
			} else {
				enabled = true;
			}
		} else if ('number' === type) {
			const validDisplayTypes = [
				'range_checkbox',
				'range_radio',
				'range_select',
				'range_multiselect',
				'range_label',
			];

			if (validDisplayTypes.includes(number_display_type)) {
				enabled = true;
			}
		} else if ('date' === type) {
			const validDisplayTypes = [
				'time_period_checkbox',
				'time_period_radio',
				'time_period_select',
				'time_period_multiselect',
				'time_period_label',
			];

			if (validDisplayTypes.includes(date_display_type)) {
				enabled = true;
			}
		}

		return enabled;
	};

	const showCountField = (id) => {
		if (isCountEnabled()) {
			return (
				<Checkbox
					id={id}
					index={index}
					label={__('Show count', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the product count in filter options.',
						'wc-ajax-product-filter'
					)}
					isChecked={filter[id]}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const tooltipEnabled = tooltipCanBeEnabled(filter);

	const enableTooltipField = () => {
		if (tooltipEnabled) {
			return (
				<Checkbox
					id={'enable_tooltip'}
					index={index}
					label={__('Enable tooltip', 'wc-ajax-product-filter')}
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
		if (tooltipEnabled && '1' === enable_tooltip) {
			return (
				<ToggleGroup
					id={'tooltip_position'}
					index={index}
					label={__('Tooltip position', 'wc-ajax-product-filter')}
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
		if (tooltipEnabled && '1' === enable_tooltip) {
			return (
				<Checkbox
					id={'show_count_in_tooltip'}
					index={index}
					label={__('Count in tooltip', 'wc-ajax-product-filter')}
					description={__(
						'Enable this to show the product count in the tooltip.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_count_in_tooltip}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	return {
		layoutFields,
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		showCountField,
		enableTooltipField,
		tooltipPositionField,
		showCountInTooltipField,
	};
};

export default useFields;
