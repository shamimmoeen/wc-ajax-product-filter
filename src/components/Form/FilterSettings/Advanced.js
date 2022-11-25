import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import Radio from '../../Field/Radio';
import Textarea from '../../Field/Textarea';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import { accordionStates } from '../utils';

const Advanced = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		show_title,
		enable_accordion,
		accordion_default_state,
		help_text,
		options_with_no_products,
		enable_search_field,
		enable_reduce_height,
		soft_limit,
		max_height,
	} = filter;

	const showTitleField = () => {
		return (
			<Checkbox
				id={'show_title'}
				index={index}
				label={__('Show Title', 'wc-ajax-product-filter')}
				description={__(
					'Whether to hide the filter title.',
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

	const tooltipField = () => {
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

	const emptyOptionsField = () => {
		return (
			<Radio
				id={'options_with_no_products'}
				index={index}
				label={__('Options with no products', 'wc-ajax-product-filter')}
				description={__(
					"Determines what do we do for the filter options that don't have any products.",
					'wc-ajax-product-filter'
				)}
				options={[
					{
						label: __('Remove', 'wc-ajax-product-filter'),
						value: 'remove',
					},
					{
						label: __(
							'Show in disabled state',
							'wc-ajax-product-filter'
						),
						value: 'disable',
						isPro: true,
					},
				]}
				onChange={handleRadioChange}
				value={options_with_no_products}
			/>
		);
	};

	// TODO: Hide it when applicable.
	const enableSearchField = () => {
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
	};

	const reduceHeightField = () => {
		return (
			<Radio
				id={'enable_reduce_height'}
				index={index}
				label={__('Reduce Height', 'wc-ajax-product-filter')}
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
						label: __('Set Max Height', 'wc-ajax-product-filter'),
						value: 'max_height',
					},
					{
						label: __('Soft Limit', 'wc-ajax-product-filter'),
						value: 'soft_limit',
						isPro: true,
					},
				]}
				onChange={handleRadioChange}
				value={enable_reduce_height}
			/>
		);
	};

	const filterMaxHeightField = () => {
		if ('max_height' === enable_reduce_height) {
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
		if ('soft_limit' === enable_reduce_height) {
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

	return (
		<>
			{showTitleField()}

			{enableAccordionField()}

			{accordionDefaultSateField()}

			{tooltipField()}

			{emptyOptionsField()}

			{enableSearchField()}

			{reduceHeightField()}

			{filterMaxHeightField()}

			{visibleOptionsField()}
		</>
	);
};

export default Advanced;
