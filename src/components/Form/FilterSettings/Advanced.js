import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import Radio from '../../Field/Radio';
import Textarea from '../../Field/Textarea';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import { accordionStates, hierarchicalDisplayTypes } from '../utils';

const Advanced = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		type,
		taxHierarchical,
		display_type,
		number_display_type,
		date_display_type,
		hierarchical,
		value_type,
		show_title,
		enable_accordion,
		accordion_default_state,
		help_text,
		enable_search_field,
		enable_reduce_height,
		soft_limit,
		max_height,
		show_in_active_filters,
	} = filter;

	const showTitleField = () => {
		return (
			<Checkbox
				id={'show_title'}
				index={index}
				label={__('Show title', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show the filter title before the filter options.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_title}
				onChange={handleCheckboxChange}
			/>
		);
	};

	const enableAccordionField = () => {
		if ('1' === show_title) {
			return (
				<Checkbox
					id={'enable_accordion'}
					index={index}
					label={__('Enable accordion', 'wc-ajax-product-filter')}
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
		if ('1' === show_title && '1' === enable_accordion) {
			return (
				<Radio
					id={'accordion_default_state'}
					index={index}
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

	const helpTextField = () => {
		if ('1' === show_title) {
			return (
				<Textarea
					id={'help_text'}
					index={index}
					label={__('Help Text', 'wc-ajax-product-filter')}
					description={__(
						'Show additional information in a tooltip. Supports basic markup.',
						'wc-ajax-product-filter	'
					)}
					value={help_text}
					onChange={handleTextFieldChange}
					rows={2}
				/>
			);
		}
	};

	const isApplicable = (field = 'reduce-height') => {
		if (
			'taxonomy' === type &&
			taxHierarchical &&
			hierarchicalDisplayTypes().includes(display_type) &&
			'1' === hierarchical
		) {
			return false;
		}

		if (
			'taxonomy' === type &&
			taxHierarchical &&
			'hierarchy-select' === display_type
		) {
			return false;
		}

		let show;
		let _display_type;

		if ('taxonomy' === type) {
			_display_type = display_type;
		} else if ('price' === type) {
			_display_type = number_display_type;
		} else if ('post-author' === type) {
			_display_type = display_type;
		} else if ('post-meta' === type) {
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

		let notAllowedDisplayTypes;

		if ('reduce-height' === field) {
			notAllowedDisplayTypes = [
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
		} else {
			notAllowedDisplayTypes = [
				'range_slider',
				'range_number',
				'input_date',
				'input_date_range',
			];
		}

		if (notAllowedDisplayTypes.includes(_display_type)) {
			show = false;
		} else {
			show = true;
		}

		return show;
	};

	const enableSearchField = () => {
		if (isApplicable('search')) {
			return (
				<Checkbox
					id={'enable_search_field'}
					index={index}
					label={__('Search Field', 'wc-ajax-product-filter')}
					description={__(
						'Adds a search field to narrow down the filter options.',
						'wc-ajax-product-filter'
					)}
					isChecked={enable_search_field}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const reduceHeightField = () => {
		if (isApplicable()) {
			return (
				<Radio
					id={'enable_reduce_height'}
					index={index}
					label={__('Reduce height', 'wc-ajax-product-filter')}
					description={__(
						'Enable this if you want to reduce the filter height.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('No', 'wc-ajax-product-filter'),
							value: 'no',
						},
						{
							label: __(
								'Set max height',
								'wc-ajax-product-filter'
							),
							value: 'max_height',
						},
						{
							label: __('Soft Limit', 'wc-ajax-product-filter'),
							value: 'soft_limit',
						},
					]}
					onChange={handleRadioChange}
					value={enable_reduce_height}
				/>
			);
		}
	};

	const filterMaxHeightField = () => {
		if ('max_height' === enable_reduce_height && isApplicable()) {
			return (
				<Number
					id={max_height}
					index={index}
					label={__('Filter max height', 'wc-ajax-product-filter	')}
					description={__(
						'Set the filter container max height in px.',
						'wc-ajax-product-filter	'
					)}
					value={max_height}
					onChange={handleTextFieldChange}
					min={1}
				/>
			);
		}
	};

	const visibleOptionsField = () => {
		if ('soft_limit' === enable_reduce_height && isApplicable()) {
			return (
				<Number
					id={soft_limit}
					index={index}
					label={__(
						'Number of visible options',
						'wc-ajax-product-filter	'
					)}
					description={__(
						'Show a <b>Show More/Show Less</b> toggle after this many options.',
						'wc-ajax-product-filter	'
					)}
					value={soft_limit}
					onChange={handleTextFieldChange}
					min={1}
				/>
			);
		}
	};

	const showInActiveFiltersField = () => {
		return (
			<Checkbox
				id={'show_in_active_filters'}
				index={index}
				label={__('Show in Active Filters', 'wc-ajax-product-filter')}
				description={__(
					'Determines if we show the selected options for this filter in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_in_active_filters}
				onChange={handleCheckboxChange}
			/>
		);
	};

	return (
		<>
			{showTitleField()}

			{enableAccordionField()}

			{accordionDefaultSateField()}

			{helpTextField()}

			{enableSearchField()}

			{reduceHeightField()}

			{filterMaxHeightField()}

			{visibleOptionsField()}

			{showInActiveFiltersField()}
		</>
	);
};

export default Advanced;
