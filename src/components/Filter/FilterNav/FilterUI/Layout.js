import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import DisplayTypeField from './DisplayTypeField';
import { useFilter } from '../../FilterContext';

const Layout = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const {
		show_title,
		display_type,
		query_type,
		all_items_label,
		use_chosen,
		chosen_no_results_message,
		enable_multiple_filter,
		show_count,
		hide_empty,
		enable_tooltip,
		show_count_in_tooltip,
		tooltip_position,
	} = activeFilterData;

	const handleCheckboxChange = (key, value) => {
		const _value = value ? '1' : '';

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: _value },
		});
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleTextFieldChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
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
					label={__(
						'Enable Multiple Filter',
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
					label={__(
						'Change All Items Label',
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
					label={__(
						'Use jQuery Chosen Library',
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
					label={__(
						'Change All Items Label',
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
					label={__('No results message', 'wc-ajax-product-filter')}
					value={chosen_no_results_message}
					onChange={(e) =>
						handleTextFieldChange(e, 'chosen_no_results_message')
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
					isChecked={enable_tooltip}
					onChange={(value) =>
						handleCheckboxChange('enable_tooltip', value)
					}
				/>
			);
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
					label={__(
						'Show count in tooltip',
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

	const tooltipPositionField = () => {
		let showField = false;

		if (
			('color' === display_type || 'image' === display_type) &&
			enable_tooltip
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Radio
					id={'tooltip_position'}
					label={__('Tooltip position', 'wc-ajax-product-filter')}
					value={tooltip_position}
					onChange={(e) => handleRadioChange(e, 'tooltip_position')}
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
				/>
			);
		}
	};

	return (
		<div>
			<Checkbox
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
				isChecked={show_title}
				onChange={(value) => handleCheckboxChange('show_title', value)}
				description={__(
					'Whether to show the filter title or not.',
					'wc-ajax-product-filter'
				)}
			/>

			<DisplayTypeField />

			{enableMultipleFilterField()}

			{queryTypeField()}

			{allItemsLabelField()}

			{useChosenField()}

			{allItemsLabelFieldForUseChosen()}

			{noResultsMessageField()}

			{enableTooltipField()}

			{tooltipPositionField()}

			{showCountInTooltipField()}

			<Checkbox
				id={'show_count'}
				label={__('Show count', 'wc-ajax-product-filter')}
				isChecked={show_count}
				onChange={(value) => handleCheckboxChange('show_count', value)}
			/>

			<Checkbox
				id={'hide_empty'}
				label={__('Hide empty', 'wc-ajax-product-filter')}
				isChecked={hide_empty}
				onChange={(value) => handleCheckboxChange('hide_empty', value)}
			/>
		</div>
	);
};

export default Layout;
