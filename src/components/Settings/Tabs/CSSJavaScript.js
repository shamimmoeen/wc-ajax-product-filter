import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import ColorInput from '../../Field/ColorInput';

const CSSJavaScript = () => {
	const { state, dispatch } = useSettings();
	const {
		handleCheckboxChange,
		handleTextFieldChange,
		handleImageChange,
		handleImageRemove,
	} = useSettingsData(state, dispatch);

	const {
		settings: {
			primary_color,
			stylish_checkbox_radio,
			use_chosen,
			attach_chosen_on_sorting,
			improve_native_select,
		},
	} = state;

	const handlePrimaryColorChange = (value) => {
		handleTextFieldChange(value, 'primary_color');
	};

	return (
		<>
			<ColorInput
				label={__('Primary Color', 'wc-ajax-product-filter')}
				description={__(
					'Set a primary color according to your theme.',
					'wc-ajax-product-filter'
				)}
				value={primary_color}
				onChange={handlePrimaryColorChange}
				renderAsFormField
			/>

			<Checkbox
				id={'stylish_checkbox_radio'}
				label={__(
					'Stylish checkbox & radio buttons',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if you want stylish checkbox and radio buttons instead of native design.',
					'wc-ajax-product-filter'
				)}
				isChecked={stylish_checkbox_radio}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'use_chosen'}
				label={__('Enable ComboBox', 'wc-ajax-product-filter')}
				description={__(
					'Turns the native select element into a custom select box with improved design and behavior.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_chosen}
				onChange={handleCheckboxChange}
			/>

			{'1' === use_chosen && (
				<Checkbox
					id={'attach_chosen_on_sorting'}
					label={__(
						'ComboBox for sorting dropdown',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Attach combobox for the default sorting dropdown instead of the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={attach_chosen_on_sorting}
					onChange={handleCheckboxChange}
				/>
			)}

			{'1' !== use_chosen && (
				<Checkbox
					id={'improve_native_select'}
					label={__(
						'Improve native select element',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Uncheck this if your theme already implements the design for the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={improve_native_select}
					onChange={handleCheckboxChange}
				/>
			)}
		</>
	);
};

export default CSSJavaScript;
