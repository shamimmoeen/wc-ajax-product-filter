import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import useSettingsData from '../useSettingsData';
import Text from '../../Field/Text';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import ImagePicker from '../../Field/ImagePicker';
import ScrollWindowTo from './ScrollWindowTo';
import ColorInput from '../../Field/ColorInput';
import Select from '../../Field/Select';
import { Notice } from '@wordpress/components';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion } from '../../utils';

const WCAPF_PRO = foundProVersion();

const animationOptions = [
	{
		label: __('Overlay only', 'wc-ajax-product-filter'),
		value: 'overlay',
	},
	{
		label: __('Overlay + Loading Icon', 'wc-ajax-product-filter'),
		value: 'overlay-with-icon',
	},
];

if (WCAPF_PRO) {
	animationOptions.push({
		label: __('Overlay + Loading Text', 'wc-ajax-product-filter'),
		value: 'overlay-with-text',
		isPro: true,
	});

	animationOptions.push({
		label: __('None', 'wc-ajax-product-filter'),
		value: 'none',
		isPro: true,
	});
}

let loadingIcons;

if (WCAPF_PRO) {
	loadingIcons = [
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
} else {
	loadingIcons = [
		{ label: 'Dual Ring', value: 'Dual-Ring' },
		{ label: 'Eclipse', value: 'Eclipse' },
		{ label: 'Gear', value: 'Gear' },
		{ label: 'Reload', value: 'Reload' },
		{ label: 'Ripple', value: 'Ripple' },
		{ label: 'Rolling', value: 'Rolling' },
		{ label: 'Spin', value: 'Spin' },
		{ label: 'Spinner', value: 'Spinner' },
	];
}

const scrollOnOptions = [
	{
		label: __('All', 'wc-ajax-product-filter'),
		value: 'all',
	},
	{
		label: __('Filter', 'wc-ajax-product-filter'),
		value: 'filter',
	},
	{
		label: __('Paginate', 'wc-ajax-product-filter'),
		value: 'paginate',
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
			loading_icon,
			loading_image,
			loading_image_src,
			loading_image_size,
			loading_text,
			loading_text_size,
			loading_text_color,
			loading_overlay_color,
			wait_cursor,
			scroll_to_top_offset,
			scroll_window,
			scroll_window_custom_element,
			scroll_on,
			disable_scroll_animation,
		},
	} = state;

	const handleLoaderImageChange = (media) => {
		handleImageChange(media, 'loading_image');
	};

	const handleLoaderImageClear = () => {
		handleImageRemove('loading_image');
	};

	const handleLoadingTextColorChange = (value) => {
		handleTextFieldChange(value, 'loading_text_color');
	};

	const handleOverlayColorChange = (value) => {
		handleTextFieldChange(value, 'loading_overlay_color');
	};

	const loadingAnimation = animationOptions.find(
		(option) => loading_animation === option.value
	);

	let loadingIcon;

	if (!WCAPF_PRO) {
		loadingIcon = loadingIcons.find(
			(option) => option.value === loading_icon
		);
	} else {
		if ('custom' === loading_icon) {
			loadingIcon = loadingIcons.find(
				(option) => option.value === loading_icon
			);
		} else {
			const icons = loadingIcons.find(
				(option) => option.value === 'icons'
			);

			loadingIcon = icons.options.find(
				(option) => option.value === loading_icon
			);
		}
	}

	const scrollOn = scrollOnOptions.find(
		(option) => scroll_on === option.value
	);

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'There are settings available only in the PRO version.',
					'wc-ajax-product-filter'
				)}
			/>

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
				onChange={handleSelectChange}
				renderAsFormField
			/>

			{'overlay-with-icon' === loading_animation && (
				<Select
					id={'loading_icon'}
					label={__('Loading Icon', 'wc-ajax-product-filter')}
					description={__(
						'Select the loading icon from available icons.',
						'wc-ajax-product-filter'
					)}
					value={loadingIcon}
					options={loadingIcons}
					onChange={handleSelectChange}
					renderAsFormField
				/>
			)}

			{WCAPF_PRO &&
				'overlay-with-icon' === loading_animation &&
				'custom' === loading_icon && (
					<ImagePicker
						label={__(
							'Custom loading icon',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Upload the loading icon. <b>Note:</b> If the SVG icon does not animate, try to upload by disabling sanitization.',
							'wc-ajax-product-filter'
						)}
						imageId={loading_image}
						imageUrl={loading_image_src}
						onChange={handleLoaderImageChange}
						onClear={handleLoaderImageClear}
					/>
				)}

			{'overlay-with-icon' === loading_animation && (
				<Number
					id={'loading_image_size'}
					label={__('Icon Size', 'wc-ajax-product-filter')}
					description={__(
						'Adjust the loading icon size in px. Default is 60.',
						'wc-ajax-product-filter'
					)}
					value={loading_image_size}
					onChange={handleTextFieldChange}
					type={'number'}
				/>
			)}

			{WCAPF_PRO && 'overlay-with-text' === loading_animation && (
				<>
					<Text
						id={'loading_text'}
						label={__('Loading Text', 'wc-ajax-product-filter')}
						description={__(
							'Displays a text element in the loading overlay. If empty default will be used.',
							'wc-ajax-product-filter'
						)}
						value={loading_text}
						onChange={handleTextFieldChange}
					/>

					<Number
						id={'loading_text_size'}
						label={__('Text Size', 'wc-ajax-product-filter')}
						description={__(
							'Adjust the loading text size in px. Default is 60.',
							'wc-ajax-product-filter'
						)}
						value={loading_text_size}
						onChange={handleTextFieldChange}
						type={'number'}
					/>

					<ColorInput
						label={__('Text Color', 'wc-ajax-product-filter')}
						description={__(
							'Adjust the loading text color. Default is #666666.',
							'wc-ajax-product-filter'
						)}
						value={loading_text_color}
						onChange={handleLoadingTextColorChange}
						renderAsFormField
					/>
				</>
			)}

			{WCAPF_PRO && 'none' !== loading_animation && (
				<ColorInput
					label={__('Overlay Color', 'wc-ajax-product-filter')}
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
			)}

			{'none' !== loading_animation && (
				<Checkbox
					id={'wait_cursor'}
					label={__('Wait Cursor', 'wc-ajax-product-filter')}
					description={__(
						'Enable this to show a wait cursor while the results are fetching.',
						'wc-ajax-product-filter'
					)}
					isChecked={wait_cursor}
					onChange={handleCheckboxChange}
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
				<>
					{WCAPF_PRO && (
						<Select
							id={'scroll_on'}
							label={__('Scroll on', 'wc-ajax-product-filter')}
							description={__(
								'Determines when to scroll on.',
								'wc-ajax-product-filter'
							)}
							value={scrollOn}
							options={scrollOnOptions}
							onChange={handleSelectChange}
							renderAsFormField
							isPro
						/>
					)}

					<Number
						id={'scroll_to_top_offset'}
						label={__(
							'Scroll to top offset',
							'wc-ajax-product-filter'
						)}
						description={__(
							'If you have a sticky header or some space that you want to include in the viewport then give the height of those in px.',
							'wc-ajax-product-filter'
						)}
						value={scroll_to_top_offset}
						onChange={handleTextFieldChange}
						type={'number'}
					/>

					{WCAPF_PRO && (
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
							isPro
						/>
					)}
				</>
			)}
		</>
	);
};

export default LoaderScrollTo;
