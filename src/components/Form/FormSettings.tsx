import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import store from '../../store/form';
import Checkbox from '../Field/Checkbox';
import Number from '../Field/Number';
import Radio from '../Field/Radio';
import AvailableOn from './AvailableOn';
import useFormSettings from './useFormSettings';
import { accordionStates } from './utils';

const FormSettings = () => {
	const { handleTextFieldChange, handleCheckboxChange, handleRadioChange } =
		useFormSettings();

	const { priority, show_clear_btn, form_accordion, form_accordion_state } =
		useSelect( ( select ) => select( store ).getFormSettings(), [] );

	return (
		<>
			<AvailableOn />

			{ WCAPF_PRO && (
				<Number
					id={ 'priority' }
					label={ __( 'Priority', 'wc-ajax-product-filter' ) }
					description={ __(
						'Forms with higher priority will be shown first when multiple forms are found on a page.',
						'wc-ajax-product-filter',
					) }
					value={ priority ? priority : 0 }
					onChange={ handleTextFieldChange }
					min={ 0 }
				/>
			) }

			<Checkbox
				id={ 'show_clear_btn' }
				label={ __( 'Enable clear filter', 'wc-ajax-product-filter' ) }
				isChecked={ show_clear_btn }
				onChange={ handleCheckboxChange }
				description={ __(
					'Whether to show a button in each filter to clear the active options.',
					'wc-ajax-product-filter',
				) }
				isPro
			/>

			<Checkbox
				id={ 'form_accordion' }
				label={ __( 'Enable accordion', 'wc-ajax-product-filter' ) }
				isChecked={ form_accordion }
				onChange={ handleCheckboxChange }
				description={ __(
					'Collapse filter options by default for all filters. Individual filters can override this.',
					'wc-ajax-product-filter',
				) }
				isPro
			/>

			{ WCAPF_PRO && '1' === form_accordion && (
				<Radio
					id={ 'form_accordion_state' }
					label={ __( 'Accordion state', 'wc-ajax-product-filter' ) }
					description={ __(
						'The default state for all filters using the form accordion setting.',
						'wc-ajax-product-filter',
					) }
					options={ accordionStates() }
					value={ form_accordion_state }
					onChange={ handleRadioChange }
				/>
			) }
		</>
	);
};

export default FormSettings;
