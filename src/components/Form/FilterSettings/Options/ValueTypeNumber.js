import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Number from '../../../Field/Number';
import Text from '../../../Field/Text';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
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
		auto_detect_min_max,
		min_value,
		max_value,
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
					<Checkbox
						id={'auto_detect_min_max'}
						index={index}
						label={__(
							'Auto detect Min and Max',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Whether to detect the min and max value from the database.',
							'wc-ajax-product-filter'
						)}
						isChecked={auto_detect_min_max}
						onChange={handleCheckboxChange}
					/>

					{'1' !== auto_detect_min_max && (
						<>
							<Number
								id={'min_value'}
								index={index}
								label={__(
									'Min Value',
									'wc-ajax-product-filter'
								)}
								description={__(
									'The minimum value that a user can select.',
									'wc-ajax-product-filter'
								)}
								value={min_value}
								onChange={handleTextFieldChange}
							/>

							<Number
								id={'max_value'}
								index={index}
								label={__(
									'Max Value',
									'wc-ajax-product-filter'
								)}
								description={__(
									'The maximum value that a user can select.',
									'wc-ajax-product-filter'
								)}
								value={max_value}
								onChange={handleTextFieldChange}
							/>
						</>
					)}

					<Number
						id={'step'}
						index={index}
						label={__('Step', 'wc-ajax-product-filter')}
						description={__(
							'The step specifies the size of the increment amount.',
							'wc-ajax-product-filter'
						)}
						value={step}
						onChange={handleTextFieldChange}
					/>

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
						label={__('Value Postfix', 'wc-ajax-product-filter')}
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
						label={__('Values Separator', 'wc-ajax-product-filter')}
						value={values_separator}
						onChange={handleTextFieldChange}
					/>

					{'range_number' !== number_display_type && (
						<>
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
						</>
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
