import { __ } from '@wordpress/i18n';
import Checkbox from '../Field/Checkbox';
import Number from '../Field/Number';
import Radio from '../Field/Radio';
// import Select from '../Field/Select';
// import {
// 	filterModeOptions,
// 	formLayoutOptions,
// 	formVisibilityOptions,
// } from '../utilsForForm';
import AvailableOn from './AvailableOn';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';
import { accordionStates } from './utils';

const FormSettings = () => {
	const { state, dispatch } = useForm();
	const {
		handleTextFieldChange,
		handleCheckboxChange,
		handleRadioChange,
		// handleSelectChange
	} = useFormSettings(state, dispatch);

	const {
		formSettings: {
			priority,
			// form_layout,
			// columns_per_row,
			// show_form_on_top_of_products,
			// filter_mode,
			// form_visibility,
			show_clear_btn,
			form_accordion,
			form_accordion_state,
		},
	} = state;

	// const formLayouts = formLayoutOptions();
	// const formLayout = formLayouts.find(
	// 	(option) => form_layout === option.value
	// );

	// const filterModes = filterModeOptions();
	// const filterMode = filterModes.find(
	// 	(option) => filter_mode === option.value
	// );

	// const visibilityOptions = formVisibilityOptions();
	// const formVisibility = visibilityOptions.find(
	// 	(option) => form_visibility === option.value
	// );

	return (
		<>
			<AvailableOn />

			{WCAPF_PRO && (
				<Number
					id={'priority'}
					label={__('Priority', 'wc-ajax-product-filter')}
					description={__(
						'Forms with higher priority will be shown first when multiple forms are found on a page.',
						'wc-ajax-product-filter'
					)}
					value={priority ? priority : 0}
					onChange={handleTextFieldChange}
					min={0}
				/>
			)}

			{/* <Select
				id={'form_layout'}
				label={__('Form Layout', 'wc-ajax-product-filter')}
				description={__(
					'Determines how you want to arrange the form filters.',
					'wc-ajax-product-filter'
				)}
				options={formLayouts}
				value={formLayout}
				onChange={handleSelectChange}
				renderAsFormField
			/>

			{'horizontal' === form_layout && (
				<>
					<Number
						id={'columns_per_row'}
						label={__('Columns per row', 'wc-ajax-product-filter')}
						description={__(
							'How many columns do you want to show in a row?',
							'wc-ajax-product-filter'
						)}
						value={columns_per_row}
						onChange={handleTextFieldChange}
						min={1}
					/>

					<Checkbox
						id={'show_form_on_top_of_products'}
						label={__(
							'Show form on top of products',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Enable this to show the form on top of the products loop, only works on product archive pages.',
							'wc-ajax-product-filter'
						)}
						isChecked={show_form_on_top_of_products}
						onChange={handleCheckboxChange}
					/>
				</>
			)}

			<Select
				id={'filter_mode'}
				label={__('Filter Mode', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the filtering will work.',
					'wc-ajax-product-filter'
				)}
				options={filterModes}
				value={filterMode}
				onChange={handleSelectChange}
				renderAsFormField
			/>

			<Select
				id={'form_visibility'}
				label={__('Form Visibility', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the form will be displayed on different devices.',
					'wc-ajax-product-filter'
				)}
				options={visibilityOptions}
				value={formVisibility}
				onChange={handleSelectChange}
				renderAsFormField
			/> */}

			<Checkbox
				id={'show_clear_btn'}
				label={__('Enable clear filter', 'wc-ajax-product-filter')}
				isChecked={show_clear_btn}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show a button in each filter to clear the active options.',
					'wc-ajax-product-filter'
				)}
				isPro
			/>

			<Checkbox
				id={'form_accordion'}
				label={__('Enable accordion', 'wc-ajax-product-filter')}
				isChecked={form_accordion}
				onChange={handleCheckboxChange}
				description={__(
					'Collapse filter options by default for all filters. Individual filters can override this.',
					'wc-ajax-product-filter'
				)}
				isPro
			/>

			{WCAPF_PRO && '1' === form_accordion && (
				<Radio
					id={'form_accordion_state'}
					label={__('Accordion state', 'wc-ajax-product-filter')}
					description={__(
						'The default state for all filters using the form accordion setting.',
						'wc-ajax-product-filter'
					)}
					options={accordionStates()}
					value={form_accordion_state}
					onChange={handleRadioChange}
				/>
			)}
		</>
	);
};

export default FormSettings;
