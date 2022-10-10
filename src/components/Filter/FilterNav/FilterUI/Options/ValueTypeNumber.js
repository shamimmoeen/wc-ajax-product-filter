import { __ } from '@wordpress/i18n';
import Number from '../../../../Field/Number';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import FieldNumber from './FieldNumber';
import ManualOptions from './ManualOptions';
import useFields from './useFields';

const ValueTypeNumber = () => {
	const {
		state: { activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const { handleCheckboxChange, handleTextFieldChange } = useFilterData(
		activeFilterData,
		isDirty,
		dispatch
	);

	const { getOptionsField } = useFields();

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
	} = activeFilterData;

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

		const automaticaDisplayTypes = ['range_slider', 'range_number'];

		if (automaticaDisplayTypes.includes(number_display_type)) {
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
						<Number
							id={'value_prefix'}
							label={__('Value Prefix', 'wc-ajax-product-filter')}
							description={__(
								'Text to appear before the values. Example: A currency symbol, $.',
								'wc-ajax-product-filter'
							)}
							value={value_prefix}
							onChange={handleTextFieldChange}
						/>
						<Number
							id={'value_postfix'}
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
						<Number
							id={'values_separator'}
							label={__(
								'Values Separator',
								'wc-ajax-product-filter'
							)}
							value={values_separator}
							onChange={handleTextFieldChange}
						/>
					</div>
					<div className='cols-wrapper'>
						<Number
							id={'decimal_places'}
							label={__(
								'Decimal Places',
								'wc-ajax-product-filter'
							)}
							value={decimal_places}
							onChange={handleTextFieldChange}
						/>
						<Number
							id={'thousand_separator'}
							label={__(
								'Thousand Separator',
								'wc-ajax-product-filter'
							)}
							value={thousand_separator}
							onChange={handleTextFieldChange}
						/>
						<Number
							id={'decimal_separator'}
							label={__(
								'Decimal Separator',
								'wc-ajax-product-filter'
							)}
							value={decimal_separator}
							onChange={handleTextFieldChange}
						/>
					</div>
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
			return <ManualOptions />;
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
