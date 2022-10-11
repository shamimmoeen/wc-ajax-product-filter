import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import { useFilter } from '../../FilterContext';
import useFilterData from '../../useFilterData';
import { accordionStates } from '../../utils';

const Advanced = () => {
	const {
		state: { filterType, activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, isDirty, dispatch);

	const {
		show_title,
		enable_clear_all_button,
		move_clear_all_button_in_title,
		enable_accordion,
		accordion_default_state,
		show_clear_button,
		enable_soft_limit,
		soft_limit,
	} = activeFilterData;

	const enableAccordionField = () => {
		if (show_title) {
			return (
				<Checkbox
					id={'enable_accordion'}
					label={__('Enable Accordion', 'wc-ajax-product-filter')}
					description={__(
						'Place more filters by collapsing the filter options.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_accordion}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const accordionDefaultSateField = () => {
		if (show_title && enable_accordion) {
			return (
				<Radio
					id={'accordion_default_state'}
					label={__(
						'Accordion default state',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Determines how the accordion should appear initially.',
						'wc-ajax-product-filter'
					)}
					options={accordionStates()}
					value={accordion_default_state}
					onChange={handleRadioChange}
				/>
			);
		}
	};

	const enableClearButtonField = () => {
		const disallowedFilterTypes = ['active-filters', 'reset-button'];

		if (!disallowedFilterTypes.includes(filterType)) {
			return (
				<Checkbox
					id={'show_clear_button'}
					label={__('Enable clear filter', 'wc-ajax-product-filter')}
					description={__(
						'Show a button to clear the filter items.',
						'wc-ajax-product-filter'
					)}
					isChecked={show_clear_button}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const moveClearAllButtonInTitleField = () => {
		return (
			'active-filters' === filterType &&
			'1' === enable_clear_all_button &&
			'1' === show_title && (
				<Checkbox
					id={'move_clear_all_button_in_title'}
					label={__(
						'Clear All button in title',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Whether to show clear all filters button in the title.',
						'wc-ajax-product-filter'
					)}
					isChecked={move_clear_all_button_in_title}
					onChange={handleCheckboxChange}
				/>
			)
		);
	};

	const enableSoftLimitField = () => {
		let showField = true;

		if (showField) {
			return (
				<Checkbox
					id={'enable_soft_limit'}
					label={__('Soft Limit', 'wc-ajax-product-filter')}
					description={__(
						'Hide the long list of options with a `Show More/Show Less` toggle.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_soft_limit}
					onChange={handleCheckboxChange}
					isPro={true}
				/>
			);
		}
	};

	const visibleOptionsField = () => {
		let showField = true;

		if (showField && enable_soft_limit) {
			return (
				<Text
					id={'soft_limit'}
					label={__(
						'Number of visible options',
						'wc-ajax-product-filter	'
					)}
					description={__(
						'Show the toggle after this many options.',
						'wc-ajax-product-filter	'
					)}
					value={soft_limit}
					onChange={handleTextFieldChange}
					type={'number'}
					min={1}
				/>
			);
		}
	};

	return (
		<>
			{enableAccordionField()}

			{accordionDefaultSateField()}

			{enableClearButtonField()}

			{moveClearAllButtonInTitleField()}

			{enableSoftLimitField()}

			{visibleOptionsField()}
		</>
	);
};

export default Advanced;
