import { __ } from '@wordpress/i18n';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import ManualOptions from './ManualOptions';

const ValueTypeDate = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { handleTextFieldChange } = useFilterData(activeFilterData, dispatch);

	const {
		date_display_type,
		date_from_prefix,
		date_from_postfix,
		date_from_placeholder,
		date_to_prefix,
		date_to_postfix,
		date_to_placeholder,
	} = activeFilterData;

	const inputFields = () => {
		if (
			'input_date' === date_display_type ||
			'input_date_range' === date_display_type
		) {
			return (
				<>
					<Text
						id={'date_from_prefix'}
						label={__('From Prefix', 'wc-ajax-product-filter')}
						description={__(
							'Text to appear before the From field.',
							'wc-ajax-product-filter'
						)}
						value={date_from_prefix}
						onChange={handleTextFieldChange}
					/>
					<Text
						id={'date_from_postfix'}
						label={__('From Postfix', 'wc-ajax-product-filter')}
						description={__(
							'Text to appear after the From field.',
							'wc-ajax-product-filter'
						)}
						value={date_from_postfix}
						onChange={handleTextFieldChange}
					/>
					<Text
						id={'date_from_placeholder'}
						label={__('From Placeholder', 'wc-ajax-product-filter')}
						description={__(
							'The placeholder text to appear for the From field.',
							'wc-ajax-product-filter'
						)}
						value={date_from_placeholder}
						onChange={handleTextFieldChange}
					/>

					{'input_date_range' === date_display_type && (
						<>
							<Text
								id={'date_to_prefix'}
								label={__(
									'To Prefix',
									'wc-ajax-product-filter'
								)}
								description={__(
									'Text to appear before the To field.',
									'wc-ajax-product-filter'
								)}
								value={date_to_prefix}
								onChange={handleTextFieldChange}
							/>
							<Text
								id={'date_to_postfix'}
								label={__(
									'To Postfix',
									'wc-ajax-product-filter'
								)}
								description={__(
									'Text to appear after the To field.',
									'wc-ajax-product-filter'
								)}
								value={date_to_postfix}
								onChange={handleTextFieldChange}
							/>
							<Text
								id={'date_to_placeholder'}
								label={__(
									'To Placeholder',
									'wc-ajax-product-filter'
								)}
								description={__(
									'The placeholder text to appear for the To field.',
									'wc-ajax-product-filter'
								)}
								value={date_to_placeholder}
								onChange={handleTextFieldChange}
							/>
						</>
					)}
				</>
			);
		}
	};

	const optionsTable = () => {
		const validDisplayTypes = [
			'time_period_checkbox',
			'time_period_radio',
			'time_period_select',
			'time_period_multiselect',
			'time_period_label',
		];

		if (validDisplayTypes.includes(date_display_type)) {
			return <ManualOptions />;
		}
	};

	return (
		<>
			{inputFields()}

			{optionsTable()}
		</>
	);
};

export default ValueTypeDate;
