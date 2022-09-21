import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import Radio from '../../../../Field/Radio';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import DisplayTypeField from '../DisplayTypeField';

const PriceFilter = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const {
		number_display_type,
		number_range_slider_display_values_as,
		number_range_enable_multiple_filter,
		number_range_query_type,
		number_range_select_all_items_label,
		number_range_use_chosen,
		number_range_chosen_no_results_message,
		number_range_show_count,
		number_range_hide_empty,
	} = activeFilterData;

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, dispatch);

	const displayTypeField = () => {
		const segments = [];

		segments.push([
			{
				label: __('Slider', 'wc-ajax-product-filter'),
				value: 'range_slider',
			},
			{
				label: __('Number', 'wc-ajax-product-filter'),
				value: 'range_number',
			},
			{
				label: __('Checkbox', 'wc-ajax-product-filter'),
				value: 'range_checkbox',
				isPro: true,
			},
			{
				label: __('Radio', 'wc-ajax-product-filter'),
				value: 'range_radio',
				isPro: true,
			},
		]);

		segments.push([
			{
				label: __('Select', 'wc-ajax-product-filter'),
				value: 'range_select',
				isPro: true,
			},
			{
				label: __('Multiselect', 'wc-ajax-product-filter'),
				value: 'range_multiselect',
				isPro: true,
			},
			{
				label: __('Label', 'wc-ajax-product-filter'),
				value: 'range_label',
				isPro: true,
			},
		]);

		return (
			<DisplayTypeField
				id={'number_display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filter will be shown on the frontend.',
					'wc-ajax-product-filter'
				)}
				segments={segments}
				value={number_display_type}
				onChange={handleRadioChange}
			/>
		);
	};

	const displayValuesField = () => {
		let showField = false;

		if (
			'range_slider' === number_display_type ||
			'range_number' === number_display_type
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Radio
					id={'number_range_slider_display_values_as'}
					label={__('Display values as', 'wc-ajax-product-filter')}
					description={__(
						'Determinses how the range values will be shown on the frontend.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Plain Text', 'wc-ajax-product-filter'),
							value: 'plain_text',
						},
						{
							label: __('Input Field', 'wc-ajax-product-filter'),
							value: 'input_field',
						},
					]}
					onChange={(e) =>
						handleRadioChange(
							e,
							'number_range_slider_display_values_as'
						)
					}
					value={number_range_slider_display_values_as}
				/>
			);
		}
	};

	const enableMultipleFilterField = () => {
		let showField = false;

		if ('range_label' === number_display_type) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'number_range_enable_multiple_filter'}
					label={__('Multiple Selection', 'wc-ajax-product-filter')}
					description={__(
						'Determines if the user can select multiple options when filtering products.',
						'wc-ajax-product-filter'
					)}
					isChecked={number_range_enable_multiple_filter}
					onChange={(value) =>
						handleCheckboxChange(
							'number_range_enable_multiple_filter',
							value
						)
					}
				/>
			);
		}
	};

	const queryTypeField = () => {
		let showField = false;

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

		if (showField) {
			return (
				<Radio
					id={'number_range_query_type'}
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
					onChange={(e) =>
						handleRadioChange(e, 'number_range_query_type')
					}
					value={number_range_query_type}
				/>
			);
		}
	};

	const allItemsLabelField = () => {
		let showField = false;

		if (
			'range_radio' === number_display_type ||
			'range_select' === number_display_type
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'number_range_select_all_items_label'}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={number_range_select_all_items_label}
					onChange={(e) =>
						handleTextFieldChange(
							e,
							'number_range_select_all_items_label'
						)
					}
				/>
			);
		}
	};

	const useChosenField = () => {
		let showField = false;

		if (
			'range_select' === number_display_type ||
			'range_multiselect' === number_display_type
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'number_range_use_chosen'}
					label={__('Enable Combobox', 'wc-ajax-product-filter')}
					description={__(
						'Whether to use jQuery Chosen library instead of the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={number_range_use_chosen}
					onChange={(value) =>
						handleCheckboxChange('number_range_use_chosen', value)
					}
				/>
			);
		}
	};

	const allItemsLabelFieldForUseChosen = () => {
		let showField = false;

		if (
			'range_multiselect' === number_display_type &&
			'1' === number_range_use_chosen
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'number_range_select_all_items_label'}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={number_range_select_all_items_label}
					onChange={(e) =>
						handleTextFieldChange(
							e,
							'number_range_select_all_items_label'
						)
					}
				/>
			);
		}
	};

	const noResultsMessageField = () => {
		let showField = false;

		if (
			('range_select' === number_display_type ||
				'range_multiselect' === number_display_type) &&
			number_range_use_chosen
		) {
			showField = true;
		}

		if (showField) {
			return (
				<Text
					id={'number_range_chosen_no_results_message'}
					label={__('No Matches Message', 'wc-ajax-product-filter')}
					description={__(
						'This message is usually displayed when no options match the search term. Leave blank to show the default message.',
						'wc-ajax-product-filter'
					)}
					value={number_range_chosen_no_results_message}
					onChange={(e) =>
						handleTextFieldChange(
							e,
							'number_range_chosen_no_results_message'
						)
					}
				/>
			);
		}
	};

	const showCountField = () => {
		let showField = false;

		const validDisplayTypes = [
			'range_checkbox',
			'range_radio',
			'range_select',
			'range_multiselect',
			'range_label',
		];

		if (validDisplayTypes.includes(number_display_type)) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'number_range_show_count'}
					label={__('Show Count', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the product count in options.',
						'wc-ajax-product-filter'
					)}
					isChecked={number_range_show_count}
					onChange={(value) =>
						handleCheckboxChange('number_range_show_count', value)
					}
				/>
			);
		}
	};

	const hideEmptyField = () => {
		let showField = false;

		const validDisplayTypes = [
			'range_checkbox',
			'range_radio',
			'range_select',
			'range_multiselect',
			'range_label',
		];

		if (validDisplayTypes.includes(number_display_type)) {
			showField = true;
		}

		if (showField) {
			return (
				<Checkbox
					id={'number_range_hide_empty'}
					label={__('Remove Empty', 'wc-ajax-product-filter')}
					description={__(
						'Whether to remove the options that show empty results.',
						'wc-ajax-product-filter'
					)}
					isChecked={number_range_hide_empty}
					onChange={(value) =>
						handleCheckboxChange('number_range_hide_empty', value)
					}
				/>
			);
		}
	};

	return (
		<>
			{displayTypeField()}

			{displayValuesField()}

			{enableMultipleFilterField()}

			{queryTypeField()}

			{allItemsLabelField()}

			{useChosenField()}

			{allItemsLabelFieldForUseChosen()}

			{noResultsMessageField()}

			{showCountField()}

			{hideEmptyField()}
		</>
	);
};

export default PriceFilter;
