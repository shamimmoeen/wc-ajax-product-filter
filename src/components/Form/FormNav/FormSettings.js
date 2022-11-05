import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Radio from '../../Field/Radio';
import MediaScreenRules from '../../VisibilityRules/MediaScreenRules';
import { useForm } from '../FormContext';
import useFormData from '../useFormData';

const FormSettings = () => {
	const { state, dispatch } = useForm();
	const { handleCheckboxChange, handleRadioChange, updateFormSettings } =
		useFormData(state, dispatch);

	const {
		formSettings: {
			show_title,
			form_submission,
			disable_ajax,
			media_screens,
		},
	} = state;

	const handleMediaScreenChange = (value) => {
		let values = [...media_screens];

		if (values.includes(value)) {
			values = values.filter((_value) => _value !== value);
		} else {
			values.push(value);
		}

		updateFormSettings('media_screens', values);
	};

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
						isPro: true,
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
				isPro={true}
			/>

			<MediaScreenRules
				label={__('Hide form on', 'wc-ajax-product-filter')}
				description={__(
					'Select screen sizes where you want to hide the form.',
					'wc-ajax-product-filter'
				)}
				rules={media_screens}
				onChange={handleMediaScreenChange}
			/>
		</>
	);
};

export default FormSettings;
