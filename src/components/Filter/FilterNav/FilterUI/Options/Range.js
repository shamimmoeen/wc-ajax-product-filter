import { __ } from '@wordpress/i18n';
import Number from '../../../../Field/Number';
import Radio from '../../../../Field/Radio';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import FieldNumber from './FieldNumber';
import NumberOptionsTable from './NumberOptionsTable';

const Range = () => {
	const {
		state: { filterType, additionalData, activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleCheckboxChange, handleTextFieldChange } =
		useFilterData(activeFilterData, dispatch);

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

	const getOptionsField = () => {
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
			return (
				<Radio
					id={'number_get_options'}
					label={__('Get Options', 'wc-ajax-product-filter')}
					value={number_get_options}
					onChange={(e) => handleRadioChange(e, 'number_get_options')}
					options={[
						{
							label: __(
								'Automatically',
								'wc-ajax-product-filter'
							),
							value: 'automatically',
						},
						{
							label: __('Manual Entry', 'wc-ajax-product-filter'),
							value: 'manual_entry',
						},
					]}
					description={__(
						'Whether to get the options automatically or you want to add the options manually.'
					)}
				/>
			);
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
			const minValueDisabled = min_value_auto_detect ? true : false;
			const maxValueDisabled = max_value_auto_detect ? true : false;

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
							disabled={minValueDisabled}
							value={min_value}
							onChange={(e) =>
								handleTextFieldChange(e, 'min_value')
							}
							checkIsChecked={min_value_auto_detect}
							onCheckChange={(value) =>
								handleCheckboxChange(
									'min_value_auto_detect',
									value
								)
							}
						/>
						<FieldNumber
							id={'max_value'}
							label={__('Max Value', 'wc-ajax-product-filter')}
							description={__(
								'The maximum value that a user can select.',
								'wc-ajax-product-filter'
							)}
							disabled={maxValueDisabled}
							value={max_value}
							onChange={(e) =>
								handleTextFieldChange(e, 'max_value')
							}
							checkIsChecked={max_value_auto_detect}
							onCheckChange={(value) =>
								handleCheckboxChange(
									'max_value_auto_detect',
									value
								)
							}
						/>
						<Number
							id={'step'}
							label={__('Step', 'wc-ajax-product-filter')}
							description={__(
								'The step specifies the size of the increment.',
								'wc-ajax-product-filter'
							)}
							value={step}
							onChange={(e) => handleTextFieldChange(e, 'step')}
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
							onChange={(e) =>
								handleTextFieldChange(e, 'value_prefix')
							}
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
							onChange={(e) =>
								handleTextFieldChange(e, 'value_postfix')
							}
						/>
						<Number
							id={'values_separator'}
							label={__(
								'Values Separator',
								'wc-ajax-product-filter'
							)}
							value={values_separator}
							onChange={(e) =>
								handleTextFieldChange(e, 'values_separator')
							}
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
							onChange={(e) =>
								handleTextFieldChange(e, 'decimal_places')
							}
						/>
						<Number
							id={'thousand_separator'}
							label={__(
								'Thousand Separator',
								'wc-ajax-product-filter'
							)}
							value={thousand_separator}
							onChange={(e) =>
								handleTextFieldChange(e, 'thousand_separator')
							}
						/>
						<Number
							id={'decimal_separator'}
							label={__(
								'Decimal Separator',
								'wc-ajax-product-filter'
							)}
							value={decimal_separator}
							onChange={(e) =>
								handleTextFieldChange(e, 'decimal_separator')
							}
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
			return <NumberOptionsTable />;
		}
	};

	return (
		<>
			{getOptionsField()}

			{automaticRangeFields()}

			{manualOptions()}
		</>
	);
};

export default Range;
