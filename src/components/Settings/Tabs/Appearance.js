import { __, sprintf } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import ColorInput from '../../Field/ColorInput';
import Select from '../../Field/Select';
// import Text from '../../Field/Text';
// import ProFeaturesNotice from '../../ProFeaturesNotice';

const enablePrimaryTextColor = wcapf_admin_params.enable_primary_text_color;

const numberRangeSliderStyles = [];

for (let index = 1; index <= 11; index++) {
	numberRangeSliderStyles.push({
		label: sprintf(
			/* translators: %d: style number. */
			__( 'Style %d', 'wc-ajax-product-filter' ),
			index
		),
		value: 'style-' + index,
	});
}

// const slideOutPanelPositionOptions = [
// 	{
// 		label: __('Left', 'wc-ajax-product-filter'),
// 		value: 'left',
// 	},
// 	{
// 		label: __('Right', 'wc-ajax-product-filter'),
// 		value: 'right',
// 	},
// ];

const Appearance = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleTextFieldChange, handleSelectChange } =
		useSettingsData(state, dispatch);

	const {
		settings: {
			primary_color,
			primary_text_color,
			stylish_checkbox_radio,
			use_combobox,
			attach_combobox_on_sorting,
			improve_native_select,
			improve_scrollbar,
			improve_input_type_text_number,
			hierarchy_toggle_at_end,
			number_range_slider_style,
			star_icon_color,
			rating_star_use_fontawesome,
			remove_focus_style,
			disable_nouislider_js,
			disable_tippyjs,
			disable_date_filter_scripts,
			// primary_btn_class,
			// secondary_btn_class,
			// slide_out_panel_position,
		},
	} = state;

	const handleColorChange = (value, key) => {
		handleTextFieldChange(value, key);
	};

	const numberRangeSliderStyle = numberRangeSliderStyles.find(
		(option) => number_range_slider_style === option.value
	);

	return (
		<>
			{/* <ProFeaturesNotice
				message={__(
					'There are settings available only in the Pro version.',
					'wc-ajax-product-filter'
				)}
			/> */}

			<ColorInput
				label={__('Primary Color', 'wc-ajax-product-filter')}
				description={__(
					'Set a primary color according to your theme. Default is #1C5DA1.',
					'wc-ajax-product-filter'
				)}
				value={primary_color}
				onChange={(value) => handleColorChange(value, 'primary_color')}
				renderAsFormField
			/>

			{enablePrimaryTextColor && (
				<ColorInput
					label={__('Primary Text Color', 'wc-ajax-product-filter')}
					description={__(
						'This color will be used over the primary color for the font color.',
						'wc-ajax-product-filter'
					)}
					value={primary_text_color}
					onChange={(value) =>
						handleColorChange(value, 'primary_text_color')
					}
					renderAsFormField
				/>
			)}

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
				id={'use_combobox'}
				label={__('Enable ComboBox', 'wc-ajax-product-filter')}
				description={__(
					'Turns the native select element into a custom select box with improved design and behavior.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_combobox}
				onChange={handleCheckboxChange}
			/>

			{'1' === use_combobox && (
				<Checkbox
					id={'attach_combobox_on_sorting'}
					label={__(
						'ComboBox for sorting dropdown',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Attach ComboBox for the default sorting dropdown instead of the native select element.',
						'wc-ajax-product-filter'
					)}
					isChecked={attach_combobox_on_sorting}
					onChange={handleCheckboxChange}
				/>
			)}

			{'1' !== use_combobox && (
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
				id={'improve_scrollbar'}
				label={__('Improve scrollbar', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to improve the scrollbar that appears when max height is applied to a filter.',
					'wc-ajax-product-filter'
				)}
				isChecked={improve_scrollbar}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'improve_input_type_text_number'}
				label={__(
					'Improve input type text/number',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if you want to use styles from your theme for input type text/number.',
					'wc-ajax-product-filter'
				)}
				isChecked={improve_input_type_text_number}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'hierarchy_toggle_at_end'}
				label={__(
					'Hierarchy toggle at the end',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Uncheck this to show the hierarchy toggle just after the item label instead of at the end of the item.',
					'wc-ajax-product-filter'
				)}
				isChecked={hierarchy_toggle_at_end}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'disable_nouislider_js'}
				label={__(
					'Disable range slider scripts',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Disable loading the noUiSlider library. Enable this if your site does not use price range or number range filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_nouislider_js}
				onChange={handleCheckboxChange}
			/>

			{'1' !== disable_nouislider_js && (
				<Select
					id={'number_range_slider_style'}
					label={__(
						'Number range slider style',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Select the number range slider style from the available ones.',
						'wc-ajax-product-filter'
					)}
					value={numberRangeSliderStyle}
					onChange={handleSelectChange}
					options={numberRangeSliderStyles}
					maxMenuHeight={180}
					renderAsFormField
				/>
			)}

			<ColorInput
				label={__('Star Icon Color', 'wc-ajax-product-filter')}
				description={__(
					'Set the star icon color for the rating filter(not applicable for display type: select, multiselect). Default is #FDA256.',
					'wc-ajax-product-filter'
				)}
				value={star_icon_color}
				onChange={(value) =>
					handleColorChange(value, 'star_icon_color')
				}
				renderAsFormField
			/>

			<Checkbox
				id={'rating_star_use_fontawesome'}
				label={__(
					'FontAwesome for star icons',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if your site loads the FontAwesome icons.',
					'wc-ajax-product-filter'
				)}
				isChecked={rating_star_use_fontawesome}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'remove_focus_style'}
				label={__('Remove focus style', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to remove the focus style from input(text) and dropdown elements.',
					'wc-ajax-product-filter'
				)}
				isChecked={remove_focus_style}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'disable_tippyjs'}
				label={__('Disable tooltip scripts', 'wc-ajax-product-filter')}
				description={__(
					'Disable loading the Tippy.js tooltip library. Enable this if your site does not use tooltips in filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_tippyjs}
				onChange={handleCheckboxChange}
			/>

			{WCAPF_PRO && (
				<Checkbox
					id={'disable_date_filter_scripts'}
					label={__(
						'Disable date filter scripts',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Disable loading the jQuery UI datepicker library. Enable this if your site does not use date input filters.',
						'wc-ajax-product-filter'
					)}
					isChecked={disable_date_filter_scripts}
					onChange={handleCheckboxChange}
				/>
			)}

			{/* <Text
				id={'primary_btn_class'}
				label={__('Primary button class', 'wc-ajax-product-filter')}
				description={__(
					'Give the css class for the primary style buttons according to your theme.',
					'wc-ajax-product-filter'
				)}
				placeholder={'btn-primary'}
				value={primary_btn_class}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'secondary_btn_class'}
				label={__('Secondary button class', 'wc-ajax-product-filter')}
				description={__(
					'Give the css class for the secondary style buttons according to your theme.',
					'wc-ajax-product-filter'
				)}
				placeholder={'btn-secondary'}
				value={secondary_btn_class}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Radio
					id={'slide_out_panel_position'}
					label={__(
						'Slide-out panel position',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Choose the slide-out panel position.',
						'wc-ajax-product-filter'
					)}
					options={slideOutPanelPositionOptions}
					value={slide_out_panel_position}
					onChange={handleRadioChange}
				/>
			)} */}
		</>
	);
};

export default Appearance;
