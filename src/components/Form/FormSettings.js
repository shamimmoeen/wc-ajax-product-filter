import { __ } from '@wordpress/i18n';
import Checkbox from '../Field/Checkbox';
import Number from '../Field/Number';
import Radio from '../Field/Radio';
import Select from '../Field/Select';
import Text from '../Field/Text';
import { foundProVersion } from '../utils';
import {
	filterModeOptions,
	formLayoutOptions,
	formVisibilityOptions,
} from '../utilsForForm';
import AvailableOn from './AvailableOn';
import { useForm } from './FormContext';
import useFormSettings from './useFormSettings';

const WCAPF_PRO = foundProVersion();

const showUpcomingFeatures = false;

const FormSettings = () => {
	const { state, dispatch } = useForm();
	const {
		handleTextFieldChange,
		handleRadioChange,
		handleCheckboxChange,
		handleSelectChange,
	} = useFormSettings(state, dispatch);

	const {
		formSettings: {
			form_locations,
			products_loop_container,
			priority,
			form_layout,
			filter_mode,
			form_visibility,
			show_clear_btn,
			show_active_filters,
			show_reset_button,
		},
	} = state;

	let showProductsLoopContainer;

	if (form_locations) {
		for (const locationData of form_locations) {
			const { location } = locationData;

			if ('page' === location) {
				showProductsLoopContainer = true;

				break;
			}
		}
	}

	const filterModes = filterModeOptions();
	const filterMode = filterModes.find(
		(option) => option.value === filter_mode
	);

	const visibilityOptions = formVisibilityOptions();
	const formVisibility = visibilityOptions.find(
		(option) => option.value === form_visibility
	);

	return (
		<>
			<AvailableOn />

			{WCAPF_PRO && showProductsLoopContainer && (
				<Text
					id={'products_loop_container'}
					label={__(
						'Products loop container',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Give a valid id/class of the HTML element that contains the products loop.',
						'wc-ajax-product-filter'
					)}
					placeholder={'#id or .class'}
					value={products_loop_container}
					onChange={handleTextFieldChange}
				/>
			)}

			{WCAPF_PRO && (
				<Number
					id={'priority'}
					label={__('Priority', 'wc-ajax-product-filter')}
					description={__(
						'Form with higher priority will be shown first when multiple forms are found in a page.',
						'wc-ajax-product-filter'
					)}
					value={priority ? priority : 0}
					onChange={handleTextFieldChange}
					min={0}
				/>
			)}

			{showUpcomingFeatures && (
				<>
					<Radio
						id={'form_layout'}
						label={__('Layout', 'wc-ajax-product-filter')}
						description={__(
							'Determines how you want to arrange the form filters.',
							'wc-ajax-product-filter'
						)}
						options={formLayoutOptions()}
						value={form_layout}
						onChange={handleRadioChange}
					/>

					<Select
						id={'filter_mode'}
						label={__('Filter Mode', 'wc-ajax-product-filter')}
						description={__(
							'Determines how the filtering will work.',
							'wc-ajax-product-filter'
						)}
						options={filterModes}
						value={filterMode}
						onChange={handleSelectChange}
						renderAsFormField
					/>
				</>
			)}

			<Select
				id={'form_visibility'}
				label={__('Form Visibility', 'wc-ajax-product-filter')}
				description={__(
					'Determines how the form will be displayed on different devices.',
					'wc-ajax-product-filter'
				)}
				options={visibilityOptions}
				value={formVisibility}
				onChange={handleSelectChange}
				renderAsFormField
			/>

			<Checkbox
				id={'show_clear_btn'}
				label={__('Enable clear filter', 'wc-ajax-product-filter')}
				isChecked={show_clear_btn}
				onChange={handleCheckboxChange}
				description={__(
					'Whether to show a button in each filter to clear the active options.',
					'wc-ajax-product-filter'
				)}
				isPro
			/>

			<Checkbox
				id={'show_active_filters'}
				label={__('Show active filters', 'wc-ajax-product-filter')}
				isChecked={show_active_filters}
				onChange={handleCheckboxChange}
				description={__(
					'Enable this to show the active filters on top of the form.',
					'wc-ajax-product-filter'
				)}
			/>

			<Checkbox
				id={'show_reset_button'}
				label={__('Show reset button', 'wc-ajax-product-filter')}
				isChecked={show_reset_button}
				onChange={handleCheckboxChange}
				description={__(
					'Enable this to show a reset button at the bottom of the form.',
					'wc-ajax-product-filter'
				)}
			/>
		</>
	);
};

export default FormSettings;
