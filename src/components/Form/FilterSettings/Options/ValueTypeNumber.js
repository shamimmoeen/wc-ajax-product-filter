import { __ } from '@wordpress/i18n';
import Number from '../../../Field/Number';
import Text from '../../../Field/Text';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import FieldNumber from './FieldNumber';
import ManualOptions from './ManualOptions';
import useFields from './useFields';

const ValueTypeNumber = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleCheckboxChange, handleTextFieldChange } = useFormFilterData(
		state,
		dispatch
	);

	const { getOptionsField } = useFields(index);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		number_display_type,
		number_get_options,
		min_value,
		min_value_auto_detect,
		max_value,
		max_value_auto_detect,
		step,
		value_prefix,
		value_postfix,
		values_separator,
		decimal_places,
		thousand_separator,
		decimal_separator,
	} = filter;

	const _getOptionsField = () => {
		let showField = false;

		const validDisplayTypes = [
			'range_checkbox',
			'range_radio',
			'range_select',
			'range_multiselect',
			'range_label',
		];

		if (validDisplayTypes.includes(number_display_type)) {
			showField = true;
		}

		if (showField) {
			return getOptionsField('number_get_options');
		}
	};

	const automaticRangeFields = () => {
		let showField = false;

		const automaticDisplayTypes = ['range_slider', 'range_number'];

		if (automaticDisplayTypes.includes(number_display_type)) {
			showField = true;
		} else {
			if ('automatically' === number_get_options) {
				showField = true;
			}
		}

		if (showField) {
			return (
				<div className='number-ui-options'>
					<div className='cols-wrapper'>
						<FieldNumber
							id={'min_value'}
							index={index}
							label={__('Min Value', 'wc-ajax-product-filter')}
							description={__(
								'The minimum value that a user can select.',
								'wc-ajax-product-filter'
							)}
							disabled={'1' === min_value_auto_detect}
							value={min_value}
							onChange={handleTextFieldChange}
							checkboxId={'min_value_auto_detect'}
							checkIsChecked={min_value_auto_detect}
							onCheckChange={handleCheckboxChange}
						/>
						<FieldNumber
							id={'max_value'}
							index={index}
							label={__('Max Value', 'wc-ajax-product-filter')}
							description={__(
								'The maximum value that a user can select.',
								'wc-ajax-product-filter'
							)}
							disabled={'1' === max_value_auto_detect}
							value={max_value}
							onChange={handleTextFieldChange}
							checkboxId={'max_value_auto_detect'}
							checkIsChecked={max_value_auto_detect}
							onCheckChange={handleCheckboxChange}
						/>
						<Number
							id={'step'}
							index={index}
							label={__('Step', 'wc-ajax-product-filter')}
							description={__(
								'The step specifies the size of the increment.',
								'wc-ajax-product-filter'
							)}
							value={step}
							onChange={handleTextFieldChange}
						/>
					</div>
					<div className='cols-wrapper'>
						<Text
							id={'value_prefix'}
							index={index}
							label={__('Value Prefix', 'wc-ajax-product-filter')}
							description={__(
								'Text to appear before the values. Example: A currency symbol, $.',
								'wc-ajax-product-filter'
							)}
							value={value_prefix}
							onChange={handleTextFieldChange}
						/>
						<Text
							id={'value_postfix'}
							index={index}
							label={__(
								'Value Postfix',
								'wc-ajax-product-filter'
							)}
							description={__(
								'Text to appear after the values. Example: A currency symbol, €.',
								'wc-ajax-product-filter'
							)}
							value={value_postfix}
							onChange={handleTextFieldChange}
						/>
						<Text
							id={'values_separator'}
							index={index}
							label={__(
								'Values Separator',
								'wc-ajax-product-filter'
							)}
							value={values_separator}
							onChange={handleTextFieldChange}
						/>
					</div>
					{'range_number' !== number_display_type && (
						<div className='cols-wrapper'>
							<Number
								id={'decimal_places'}
								index={index}
								label={__(
									'Decimal Places',
									'wc-ajax-product-filter'
								)}
								value={decimal_places}
								onChange={handleTextFieldChange}
							/>
							<Text
								id={'thousand_separator'}
								index={index}
								label={__(
									'Thousand Separator',
									'wc-ajax-product-filter'
								)}
								value={thousand_separator}
								onChange={handleTextFieldChange}
							/>
							<Text
								id={'decimal_separator'}
								index={index}
								label={__(
									'Decimal Separator',
									'wc-ajax-product-filter'
								)}
								value={decimal_separator}
								onChange={handleTextFieldChange}
							/>
						</div>
					)}
				</div>
			);
		}
	};

	const manualOptions = () => {
		let showField = false;

		const validDisplayTypes = [
			'range_checkbox',
			'range_radio',
			'range_select',
			'range_multiselect',
			'range_label',
		];

		if (
			validDisplayTypes.includes(number_display_type) &&
			'manual_entry' === number_get_options
		) {
			showField = true;
		}

		if (showField) {
			return <ManualOptions index={index} />;
		}
	};

	return (
		<>
			{_getOptionsField()}

			{automaticRangeFields()}

			{manualOptions()}
		</>
	);
};

export default ValueTypeNumber;
