import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Text from '../../Field/Text';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Number from '../../Field/Number';
import ImagePicker from '../../Field/ImagePicker';
import ScrollWindowTo from './ScrollWindowTo';
import ProFeaturesNotice from '../../ProFeaturesNotice';

const LoaderOverlay = () => {
	const { state, dispatch } = useSettings();
	const {
		handleCheckboxChange,
		handleTextFieldChange,
		handleImageChange,
		handleImageRemove,
	} = useSettingsData(state, dispatch);

	const {
		settings: {
			loading_animation,
			loading_image,
			loading_image_src,
			scroll_to_top_offset,
			scroll_window,
			scroll_window_custom_element,
		},
	} = state;

	const handleLoaderImageChange = (media) => {
		handleImageChange(media, 'loading_image');
	};

	const handleLoaderImageClear = () => {
		handleImageRemove('loading_image');
	};

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'These settings are available only at the pro version.',
					'wc-ajax-product-filter'
				)}
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
					id={'loading_image'}
					label={__('Loading Image', 'wc-ajax-product-filter')}
					description={__(
						'Change the default loading image.',
						'wc-ajax-product-filter'
					)}
					imageId={loading_image}
					imageUrl={loading_image_src}
					onChange={handleLoaderImageChange}
					onClear={handleLoaderImageClear}
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
						'You can change this value to adjust the scroll to position, eg: 100.',
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

export default LoaderOverlay;
