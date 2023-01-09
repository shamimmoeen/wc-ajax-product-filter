import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Text from '../../Field/Text';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Number from '../../Field/Number';
import ImagePicker from '../../Field/ImagePicker';
import ScrollWindowTo from './ScrollWindowTo';
import ColorInput from '../../Field/ColorInput';
import Select from '../../Field/Select';
import { Notice } from '@wordpress/components';

const animationOptions = [
	{ label: __('None', 'wc-ajax-product-filter'), value: 'none' },
	{
		label: __('Custom', 'wc-ajax-product-filter'),
		value: 'custom',
		isPro: true,
	},
	{
		label: 'Icons',
		value: 'icons',
		options: [
			{ label: 'Dual Ring', value: 'Dual-Ring' },
			{ label: 'Eclipse', value: 'Eclipse' },
			{ label: 'Gear', value: 'Gear' },
			{ label: 'Reload', value: 'Reload' },
			{ label: 'Ripple', value: 'Ripple' },
			{ label: 'Rolling', value: 'Rolling' },
			{ label: 'Spin', value: 'Spin' },
			{ label: 'Spinner', value: 'Spinner' },
		],
	},
];

const LoaderScrollTo = () => {
	const { state, dispatch } = useSettings();
	const {
		handleSelectChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleImageChange,
		handleImageRemove,
	} = useSettingsData(state, dispatch);

	const {
		settings: {
			disable_ajax,
			loading_animation,
			loading_image,
			loading_image_src,
			loading_image_size,
			loading_overlay_color,
			wait_cursor,
			scroll_to_top_offset,
			scroll_window,
			scroll_window_custom_element,
			disable_scroll_animation,
		},
	} = state;

	const handleLoaderImageChange = (media) => {
		handleImageChange(media, 'loading_image');
	};

	const handleLoaderImageClear = () => {
		handleImageRemove('loading_image');
	};

	const handleOverlayColorChange = (value) => {
		handleTextFieldChange(value, 'loading_overlay_color');
	};

	let loadingAnimation;

	if ('none' === loading_animation || 'custom' === loading_animation) {
		loadingAnimation = animationOptions.find(
			(option) => option.value === loading_animation
		);
	} else {
		const icons = animationOptions.find(
			(option) => option.value === 'icons'
		);

		loadingAnimation = icons.options.find(
			(option) => option.value === loading_animation
		);
	}

	return (
		<>
			{'1' === disable_ajax && (
				<Notice
					status='info'
					className='ajax-disabled-info'
					isDismissible={false}
				>
					{__(
						'These settings are applicable when filtering via ajax.',
						'wc-ajax-product-filter'
					)}
				</Notice>
			)}

			<Select
				id={'loading_animation'}
				label={__('Loading Animation', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show an animation while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				value={loadingAnimation}
				options={animationOptions}
				onChange={(selected) =>
					handleSelectChange(selected, 'loading_animation')
				}
				renderAsFormField
			/>

			{'custom' === loading_animation && (
				<ImagePicker
					label={__('Custom loading image', 'wc-ajax-product-filter')}
					description={__(
						'Upload the loading image. <b>Note:</b> If the SVG image does not animate, try to upload by disabling sanitization.',
						'wc-ajax-product-filter'
					)}
					imageId={loading_image}
					imageUrl={loading_image_src}
					onChange={handleLoaderImageChange}
					onClear={handleLoaderImageClear}
				/>
			)}

			{'none' !== loading_animation && (
				<Number
					id={'loading_image_size'}
					label={__('Loading image size', 'wc-ajax-product-filter')}
					description={__(
						'Adjust the loading image size in px. Default is 120.',
						'wc-ajax-product-filter'
					)}
					value={loading_image_size}
					onChange={handleTextFieldChange}
					type={'number'}
				/>
			)}

			<ColorInput
				label={__('Loading Overlay Color', 'wc-ajax-product-filter')}
				description={__(
					'Adjust the loading overlay color. <b>Note:</b> There is an alpha channel to control the transparency or opacity of the color.',
					'wc-ajax-product-filter'
				)}
				value={loading_overlay_color}
				onChange={handleOverlayColorChange}
				isPro
				disableAlpha={false}
				renderAsFormField
			/>

			<Checkbox
				id={'wait_cursor'}
				label={__('Wait Cursor', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show a wait cursor while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				isChecked={wait_cursor}
				onChange={handleCheckboxChange}
			/>

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
				<>
					<Number
						id={'scroll_to_top_offset'}
						label={__(
							'Scroll to top offset',
							'wc-ajax-product-filter'
						)}
						description={__(
							'If you have a sticky header or page title that you want to include in the viewport then give the height of those in px.',
							'wc-ajax-product-filter'
						)}
						value={scroll_to_top_offset}
						onChange={handleTextFieldChange}
						type={'number'}
					/>

					<Checkbox
						id={'disable_scroll_animation'}
						label={__(
							'Disable scroll window animation',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Check this to disable the scroll window animation.',
							'wc-ajax-product-filter'
						)}
						isChecked={disable_scroll_animation}
						onChange={handleCheckboxChange}
					/>
				</>
			)}
		</>
	);
};

export default LoaderScrollTo;
