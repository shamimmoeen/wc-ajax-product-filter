import { __ } from '@wordpress/i18n';
import Checkbox from '../Field/Checkbox';
import Radio from '../Field/Radio';
import Select from '../Field/Select';
import Text from '../Field/Text';
import { foundProVersion } from '../utils';
import { formVisibilityOptions } from '../utilsForForm';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';

const WCAPF_PRO = foundProVersion();

const FormSettings = () => {
	const { state, dispatch } = useForm();
	const {
		handleCheckboxChange,
		handleRadioChange,
		handleSelectChange,
		handleTextFieldChange,
	} = useFormSettings(state, dispatch);

	const {
		formSettings: {
			disable_empty_options,
			remove_empty_filters,
			filter_mode,
			submit_button_label,
			form_visibility,
			opening_button_label,
			show_form_title,
			show_active_filters,
			show_reset_button,
			reset_button_label,
		},
	} = state;

	const filterOnOptions = [
		{
			label: __('Product archive pages', 'wc-ajax-product-filter'),
			value: 'product_archive_pages',
		},
	];

	const filterOn = filterOnOptions[0];

	const filterOnTooltip = __(
		'Upgrade to pro to select taxonomies and pages.',
		'wc-ajax-product-filter'
	);

	const availableOnId = WCAPF_PRO ? 'filter_on' : 'place_for';

	const visibilityOptions = formVisibilityOptions();
	const formVisibility = visibilityOptions.find(
		(option) => option.value === form_visibility
	);

	return (
		<>
			<Select
				id={availableOnId}
				label={__('Filter on', 'wc-ajax-product-filter')}
				description={__(
					'Determines where you want to show the form to filter the products.',
					'wc-ajax-product-filter'
				)}
				onChange={handleSelectChange}
				options={filterOnOptions}
				value={filterOn}
				tooltip={!WCAPF_PRO ? filterOnTooltip : ''}
				renderAsFormField
				isPro
				isDisabled={!WCAPF_PRO}
			/>

			{/* <Checkbox
				id={'disable_empty_options'}
				label={__('Disable empty options', 'wc-ajax-product-filter')}
				description={__(
					'By default we remove the options with no products. Enable this if you want to show them as disabled.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_empty_options}
				onChange={handleCheckboxChange}
				isPro
			/>

			<Checkbox
				id={'remove_empty_filters'}
				label={__('Remove empty filters', 'wc-ajax-product-filter')}
				isChecked={remove_empty_filters}
				onChange={handleCheckboxChange}
				description={__(
					"Whether to remove the filters that don't have any options.",
					'wc-ajax-product-filter'
				)}
				isPro
			/> */}

			<Radio
				id={'filter_mode'}
				label={__('Filter mode', 'wc-ajax-product-filter')}
				description={__(
					'Immediate: filtering starts when any change occurs, Submit button: filtering starts after clicking on a button.',
					'wc-ajax-product-filter'
				)}
				options={[
					{
						label: __('Immediate', 'wc-ajax-product-filter'),
						value: 'immediate',
					},
					{
						label: __('Submit button', 'wc-ajax-product-filter'),
						value: 'submit',
					},
				]}
				onChange={handleRadioChange}
				value={filter_mode}
			/>

			{'submit' === filter_mode && (
				<Text
					id={'submit_button_label'}
					label={__('Submit button label', 'wc-ajax-product-filter')}
					description={__(
						'Leave it empty to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={submit_button_label}
					onChange={handleTextFieldChange}
				/>
			)}

			<Select
				id={'form_visibility'}
				label={__('Form visibility', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the form will be displayed on different devices.',
					'wc-ajax-product-filter'
				)}
				options={visibilityOptions}
				value={formVisibility}
				onChange={handleSelectChange}
				renderAsFormField
			/>

			{'always' !== form_visibility && (
				<Text
					id={'opening_button_label'}
					label={__('Opening button label', 'wc-ajax-product-filter')}
					description={__(
						'Leave it empty to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={opening_button_label}
					onChange={handleTextFieldChange}
				/>
			)}

			<Checkbox
				id={'show_form_title'}
				label={__('Show form title', 'wc-ajax-product-filter')}
				isChecked={show_form_title}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show the form title before the filters.',
					'wc-ajax-product-filter'
				)}
			/>

			<Checkbox
				id={'show_active_filters'}
				label={__('Show active filters', 'wc-ajax-product-filter')}
				isChecked={show_active_filters}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show the active filters on top of the form.',
					'wc-ajax-product-filter'
				)}
			/>

			<Checkbox
				id={'show_reset_button'}
				label={__('Show reset button', 'wc-ajax-product-filter')}
				isChecked={show_reset_button}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show a reset button at the bottom of the form.',
					'wc-ajax-product-filter'
				)}
			/>

			{'1' === show_reset_button && (
				<Text
					id={'reset_button_label'}
					label={__('Reset button label', 'wc-ajax-product-filter')}
					description={__(
						'Leave it empty to show the default label.',
						'wc-ajax-product-filter'
					)}
					value={reset_button_label}
					onChange={handleTextFieldChange}
				/>
			)}
		</>
	);
};

export default FormSettings;
