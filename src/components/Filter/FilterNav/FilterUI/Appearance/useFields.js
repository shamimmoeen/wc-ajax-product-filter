import { __ } from '@wordpress/i18n';
import Checkbox from '../../../../Field/Checkbox';
import Radio from '../../../../Field/Radio';
import Text from '../../../../Field/Text';
import useFilterData from '../../../useFilterData';
import { useFilter } from '../../../FilterContext';

const useFields = (type) => {
	const { state, dispatch } = useFilter();
	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(state, dispatch);

	const { filterType, activeFilterData } = state;

	const {
		display_type,
		enable_multiple_filter,
		use_chosen,
		number_display_type,
		number_range_enable_multiple_filter,
		number_range_use_chosen,
		date_display_type,
		time_period_enable_multiple_filter,
		time_period_use_chosen,
	} = activeFilterData;

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
					label={__('Multiple Selection', 'wc-ajax-product-filter')}
					description={__(
						'Determines if the user can select multiple options when filtering products.',
						'wc-ajax-product-filter'
					)}
					isChecked={activeFilterData[id]}
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
					onChange={handleRadioChange}
					value={activeFilterData[id]}
				/>
			);
		}
	};

	const allItemsLabelField = (id) => {
		let showField = false;

		if ('text' === type) {
			showField = 'radio' === display_type || 'select' === display_type;
		} else if ('number' === type) {
			showField =
				'range_radio' === number_display_type ||
				'range_select' === number_display_type;
		} else if ('date' === type) {
			showField =
				'time_period_radio' === date_display_type ||
				'time_period_select' === date_display_type;
		}

		if (showField) {
			return (
				<Text
					id={id}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label.',
						'wc-ajax-product-filter'
					)}
					value={activeFilterData[id]}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const useChosenField = (id) => {
		let showField = false;

		if ('text' === type) {
			showField =
				'select' === display_type || 'multi-select' === display_type;
		} else if ('number' === type) {
			showField =
				'range_select' === number_display_type ||
				'range_multiselect' === number_display_type;
		} else if ('date' === type) {
			showField =
				'time_period_select' === date_display_type ||
				'time_period_multiselect' === date_display_type;
		}

		if (showField) {
			return (
				<Checkbox
					id={id}
					label={__('Enable Combobox', 'wc-ajax-product-filter')}
					description={__(
						'Whether to use jQuery Chosen library instead of the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={activeFilterData[id]}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const allItemsLabelFieldForUseChosen = (id) => {
		let showField = false;

		if ('text' === type) {
			showField = 'multi-select' === display_type && '1' === use_chosen;
		} else if ('number' === type) {
			showField =
				'range_multiselect' === number_display_type &&
				'1' === number_range_use_chosen;
		} else if ('date' === type) {
			showField =
				'time_period_multiselect' === date_display_type &&
				'1' === time_period_use_chosen;
		}

		if (showField) {
			return (
				<Text
					id={id}
					label={__('All Items Label', 'wc-ajax-product-filter')}
					description={__(
						'Change the default option label. Leave blank to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={activeFilterData[id]}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	const noResultsMessageField = (id) => {
		let showField = false;

		if ('text' === type) {
			showField =
				('select' === display_type ||
					'multi-select' === display_type) &&
				'1' === use_chosen;
		} else if ('number' === type) {
			showField =
				('range_select' === number_display_type ||
					'range_multiselect' === number_display_type) &&
				'1' === number_range_use_chosen;
		} else if ('date' === type) {
			showField =
				('time_period_select' === date_display_type ||
					'time_period_multiselect' === date_display_type) &&
				'1' === time_period_use_chosen;
		}

		if (showField) {
			return (
				<Text
					id={id}
					label={__('No Matches Message', 'wc-ajax-product-filter')}
					description={__(
						'This message is usually displayed when no options match the search term. Leave blank to show the default message.',
						'wc-ajax-product-filter'
					)}
					value={activeFilterData[id]}
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
					label={__('Show Count', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the product count in options.',
						'wc-ajax-product-filter'
					)}
					isChecked={activeFilterData[id]}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const removeEmptyField = (id) => {
		if (isCountEnabled()) {
			const filterTypes = [
				'category',
				'tag',
				'attribute',
				'rating',
				'product-status',
			];

			return (
				<Checkbox
					id={id}
					label={__('Remove Empty', 'wc-ajax-product-filter')}
					description={__(
						'Whether to remove the options that show empty results.',
						'wc-ajax-product-filter'
					)}
					isChecked={activeFilterData[id]}
					onChange={handleCheckboxChange}
					isPro={filterTypes.includes(filterType)}
				/>
			);
		}
	};

	return {
		enableMultipleFilterField,
		queryTypeField,
		allItemsLabelField,
		useChosenField,
		allItemsLabelFieldForUseChosen,
		noResultsMessageField,
		showCountField,
		removeEmptyField,
	};
};

export default useFields;
