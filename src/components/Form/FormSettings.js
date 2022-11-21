import { __ } from '@wordpress/i18n';
import Checkbox from '../Field/Checkbox';
import Radio from '../Field/Radio';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';

const FormSettings = () => {
	const { state, dispatch } = useForm();
	const { handleCheckboxChange, handleRadioChange } = useFormSettings(
		state,
		dispatch
	);

	const {
		formSettings: { show_title, form_submission, disable_ajax },
	} = state;

	return (
		<>
			<Checkbox
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
				isChecked={show_title}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show the form title before the filters.',
					'wc-ajax-product-filter'
				)}
			/>

			<Radio
				id={'form_submission'}
				label={__('Form Submission', 'wc-ajax-product-filter')}
				description={__(
					'Immediate: filtering starts when any change occurs, Submit Button: filtering starts by clicking on the button.',
					'wc-ajax-product-filter'
				)}
				options={[
					{
						label: __('Immediate', 'wc-ajax-product-filter'),
						value: 'immediate',
					},
					{
						label: __('Submit Button', 'wc-ajax-product-filter'),
						value: 'submit',
					},
				]}
				onChange={handleRadioChange}
				value={form_submission}
			/>

			<Checkbox
				id={'disable_ajax'}
				label={__('Disable AJAX', 'wc-ajax-product-filter')}
				isChecked={disable_ajax}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show the form title before the filters.',
					'wc-ajax-product-filter'
				)}
			/>
		</>
	);
};

export default FormSettings;
