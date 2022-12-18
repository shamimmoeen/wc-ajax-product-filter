import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Text from '../../Field/Text';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Number from '../../Field/Number';
import ImagePicker from '../../Field/ImagePicker';
import ScrollWindowTo from './ScrollWindowTo';
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
			loading_animation,
			loading_image,
			loading_image_src,
			loading_overlay,
			loading_overlay_color,
			scroll_to_top_offset,
			scroll_window,
			scroll_window_custom_element,
		},
	} = state;

	const handlePrimaryColorChange = (value) => {
		handleTextFieldChange(value, 'primary_color');
	};

	const handleLoaderImageChange = (media) => {
		handleImageChange(media, 'loading_image');
	};

	const handleLoaderImageClear = () => {
		handleImageRemove('loading_image');
	};

	const handleOverlayColorChange = (value) => {
		handleTextFieldChange(value, 'loading_overlay_color');
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

			{/* {'1' === use_chosen && (
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
			)} */}

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

			<Checkbox
				id={'loading_animation'}
				label={__('Loading Animation', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show an animation while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				isChecked={loading_animation}
				onChange={handleCheckboxChange}
			/>

			{'1' === loading_animation && (
				<ImagePicker
					label={__('Custom loading image', 'wc-ajax-product-filter')}
					description={__(
						'Change the default loading image.',
						'wc-ajax-product-filter'
					)}
					imageId={loading_image}
					imageUrl={loading_image_src}
					onChange={handleLoaderImageChange}
					onClear={handleLoaderImageClear}
					isPro
				/>
			)}

			<Checkbox
				id={'loading_overlay'}
				label={__('Loading Overlay', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show an overlay while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				isChecked={loading_overlay}
				onChange={handleCheckboxChange}
			/>

			{'1' === loading_overlay && (
				<ColorInput
					label={__(
						'Loading Overlay Color',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Set a loading overlay color according to your theme.',
						'wc-ajax-product-filter'
					)}
					value={loading_overlay_color}
					onChange={handleOverlayColorChange}
					isPro
					disableAlpha={false}
					renderAsFormField
				/>
			)}

			<ScrollWindowTo />

			{'custom' === scroll_window && (
				<Text
					id={'scroll_window_custom_element'}
					label={__(
						'Custom element identifier',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Give a valid id/class of the HTML element you want to scroll to.',
						'wc-ajax-product-filter'
					)}
					value={scroll_window_custom_element}
					onChange={handleTextFieldChange}
					placeholder={'#id or .class'}
				/>
			)}

			{'none' !== scroll_window && (
				<Number
					id={'scroll_to_top_offset'}
					label={__('Scroll to top offset', 'wc-ajax-product-filter')}
					description={__(
						'If you have a sticky header or page title that you want to include in the viewport then give the height of those in px.',
						'wc-ajax-product-filter'
					)}
					value={scroll_to_top_offset}
					onChange={handleTextFieldChange}
					type={'number'}
				/>
			)}
		</>
	);
};

export default CSSJavaScript;
