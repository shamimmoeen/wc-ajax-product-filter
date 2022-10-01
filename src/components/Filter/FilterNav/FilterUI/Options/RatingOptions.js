import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import { orderDirectionOptions } from '../../../utils';
import NumberOptionsTable from './NumberOptionsTable';

const RatingOptions = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange } = useFilterData(activeFilterData, dispatch);

	const { number_get_options, options_order_dir } = activeFilterData;

	const getOptionsField = () => {
		return (
			<Radio
				id={'number_get_options'}
				label={__('Get Options', 'wc-ajax-product-filter')}
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
				options={[
					{
						label: __('Automatically', 'wc-ajax-product-filter'),
						value: 'automatically',
					},
					{
						label: __('Manual Entry', 'wc-ajax-product-filter'),
						value: 'manual_entry',
					},
				]}
				value={number_get_options}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderDirectionField = () => {
		if ('automatically' === number_get_options) {
			return (
				<Radio
					id={'options_order_dir'}
					label={__('Order Direction', 'wc-ajax-product-filter')}
					description={__(
						'Whether to order options in ascending or descending order.',
						'wc-ajax-product-filter'
					)}
					options={orderDirectionOptions()}
					value={options_order_dir}
					onChange={handleRadioChange}
				/>
			);
		}
	};

	const manualOptions = () => {
		if ('manual_entry' === number_get_options) {
			return <NumberOptionsTable />;
		}
	};

	return (
		<>
			{getOptionsField()}

			{orderDirectionField()}

			{manualOptions()}
		</>
	);
};

export default RatingOptions;
