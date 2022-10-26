import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import { useFilter } from '../../FilterContext';
import useFilterData from '../../useFilterData';
import {
	accordionStates,
	getTaxonomy,
	isTaxonomyFilters,
	isTaxonomyHierarchical,
} from '../../utils';

const Advanced = () => {
	const {
		state: { filterType, activeFilterData, additionalData, isDirty },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, isDirty, dispatch);

	const {
		show_title,
		active_filters_layout,
		display_type,
		taxonomy: _taxonomy,
		hierarchical,
		number_display_type,
		date_display_type,
		value_type,
		enable_clear_all_button,
		move_clear_all_button_in_title,
		enable_accordion,
		accordion_default_state,
		show_clear_button,
		enable_soft_limit,
		enable_soft_limit_for_extended_layout,
		soft_limit,
		soft_limit_for_extended_layout,
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
						'Move clear all button in title',
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

	const showSoftLimit = () => {
		if ('active-filters' === filterType) {
			return true;
		}

		if ('reset-button' === filterType) {
			return false;
		}

		const taxonomyTypeFilter = isTaxonomyFilters(filterType);
		const taxonomy = getTaxonomy(filterType, _taxonomy);
		const { taxonomy_hierarchical_data: hierarchicalData } = additionalData;

		const hierarchicalDisplayTypes = [
			'checkbox',
			'radio',
			'select',
			'multi-select',
		];

		if (
			taxonomyTypeFilter &&
			isTaxonomyHierarchical(taxonomy, hierarchicalData) &&
			hierarchicalDisplayTypes.includes(display_type) &&
			'1' === hierarchical
		) {
			return false;
		}

		let show;
		let _display_type;

		if (taxonomyTypeFilter) {
			_display_type = display_type;
		} else if ('price' === filterType) {
			_display_type = number_display_type;
		} else if (
			'post-meta' === filterType ||
			'post-property' === filterType
		) {
			if ('text' === value_type) {
				_display_type = display_type;
			} else if ('number' === value_type) {
				_display_type = number_display_type;
			} else if ('date' === value_type) {
				_display_type = date_display_type;
			}
		} else {
			_display_type = display_type;
		}

		const notAllowedDisplayTypes = [
			'select',
			'multi-select',
			'range_slider',
			'range_number',
			'range_select',
			'range_multiselect',
			'input_date',
			'input_date_range',
			'time_period_select',
			'time_period_multiselect',
		];

		if (notAllowedDisplayTypes.includes(_display_type)) {
			show = false;
		} else {
			show = true;
		}

		return show;
	};

	const enableSoftLimitField = () => {
		if (showSoftLimit()) {
			let id = 'enable_soft_limit';
			let value = enable_soft_limit;

			if (
				'active-filters' === filterType &&
				'extended' === active_filters_layout
			) {
				id = 'enable_soft_limit_for_extended_layout';
				value = enable_soft_limit_for_extended_layout;
			}

			const description = __(
				'Whether to hide the long list of options with a `<b>Show More/Show Less</b>` toggle.',
				'wc-ajax-product-filter'
			);

			let isProFeature = false;

			const filterTypes = [
				'price',
				'post-property',
				'custom-taxonomy',
				'post-meta',
				'sort-by',
				'per-page',
			];

			if (!filterTypes.includes(filterType)) {
				isProFeature = true;
			}

			return (
				<Checkbox
					id={id}
					label={__('Soft Limit', 'wc-ajax-product-filter')}
					description={description}
					isChecked={value}
					onChange={handleCheckboxChange}
					isPro={isProFeature}
				/>
			);
		}
	};

	const visibleOptionsField = () => {
		if (showSoftLimit()) {
			let id = 'soft_limit';
			let value = soft_limit;
			let enabled = enable_soft_limit;

			if (
				'active-filters' === filterType &&
				'extended' === active_filters_layout
			) {
				id = 'soft_limit_for_extended_layout';
				value = soft_limit_for_extended_layout;
				enabled = enable_soft_limit_for_extended_layout;
			}

			if (enabled) {
				return (
					<Text
						id={id}
						label={__(
							'Number of visible options',
							'wc-ajax-product-filter	'
						)}
						description={__(
							'Show the toggle after this many options.',
							'wc-ajax-product-filter	'
						)}
						value={value}
						onChange={handleTextFieldChange}
						type={'number'}
						min={1}
					/>
				);
			}
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
