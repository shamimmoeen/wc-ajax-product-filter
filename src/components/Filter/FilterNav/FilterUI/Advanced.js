import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import { useFilter } from '../../FilterContext';
import useFilterData from '../../useFilterData';

const Advanced = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, dispatch);

	const {
		show_title,
		use_term_slug_in_url,
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
					onChange={(value) =>
						handleCheckboxChange('enable_accordion', value)
					}
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
					value={accordion_default_state}
					onChange={(e) =>
						handleRadioChange(e, 'accordion_default_state')
					}
					options={[
						{
							label: __('Expanded', 'wc-ajax-product-filter'),
							value: 'expanded',
						},
						{
							label: __('Collapsed', 'wc-ajax-product-filter'),
							value: 'collapsed',
						},
					]}
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
					onChange={(value) =>
						handleCheckboxChange('show_clear_button', value)
					}
				/>
			);
		}
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
					onChange={(value) =>
						handleCheckboxChange('enable_soft_limit', value)
					}
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
					onChange={(e) => handleTextFieldChange(e, 'soft_limit')}
					type={'number'}
					min={1}
				/>
			);
		}
	};

	const termSlugField = () => {
		const taxonomyFilterTypes = [
			'category',
			'tag',
			'attribute',
			'custom-taxonomy',
		];

		if (taxonomyFilterTypes.includes(filterType)) {
			return (
				<Checkbox
					id={'use_term_slug_in_url'}
					label={__('Term slug in URL', 'wc-ajax-product-filter')}
					description={__(
						'Use term slug instead of id in the URL.',
						'wc-ajax-product-filter'
					)}
					isChecked={use_term_slug_in_url}
					onChange={(value) =>
						handleCheckboxChange('use_term_slug_in_url', value)
					}
					isPro={true}
				/>
			);
		}
	};

	return (
		<>
			{enableAccordionField()}

			{accordionDefaultSateField()}

			{enableClearButtonField()}

			{enableSoftLimitField()}

			{visibleOptionsField()}

			{termSlugField()}
		</>
	);
};

export default Advanced;
