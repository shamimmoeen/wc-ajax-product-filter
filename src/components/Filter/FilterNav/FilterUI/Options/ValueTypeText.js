import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import ToggleGroup from '../../../../Field/ToggleGroup';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	orderTypeOptions,
	orderByOptions,
	orderDirectionOptions,
} from '../../../utils';

const ValueTypeText = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleToggleGroupChange } = useFilterData(
		activeFilterData,
		dispatch
	);

	const {
		get_options,
		options_order_by,
		options_order_dir,
		options_order_type,
	} = activeFilterData;

	useEffect(() => {
		if ('automatically' === get_options && 'label' === options_order_by) {
			handleToggleGroupChange('none', 'options_order_by');
		}
	}, [get_options]);

	const getOptionsField = () => {
		return (
			<Radio
				id={'get_options'}
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
				value={get_options}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderByField = () => {
		let options = orderByOptions();

		if ('automatically' === get_options) {
			options = orderByOptions().filter(
				(option) => 'label' !== option.value
			);
		}

		return (
			<ToggleGroup
				id={'options_order_by'}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				onChange={handleToggleGroupChange}
				value={options_order_by}
			/>
		);
	};

	const orderDirectionField = () => {
		if ('none' !== options_order_by) {
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

	const orderTypeField = () => {
		const allowed = ['label', 'value'];

		if (allowed.includes(options_order_by)) {
			return (
				<Radio
					id={'options_order_type'}
					label={__('Order Type', 'wc-ajax-product-filter')}
					description={__(
						'Whether to arrange the options in alphabetical or numerical order.',
						'wc-ajax-product-filter'
					)}
					options={orderTypeOptions()}
					value={options_order_type}
					onChange={handleRadioChange}
				/>
			);
		}
	};

	return (
		<>
			{getOptionsField()}

			{orderByField()}

			{orderDirectionField()}

			{orderTypeField()}
		</>
	);
};

export default ValueTypeText;
