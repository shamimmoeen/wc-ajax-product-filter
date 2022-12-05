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
			loading_animation,
			loading_image,
			loading_image_src,
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
