import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import ToggleGroup from '../../../../Field/ToggleGroup';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	methodsOfGettingOptions,
	orderDirectionOptions,
	orderTypeOptions,
} from '../../../utils';

const useFields = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleToggleGroupChange } = useFilterData(
		activeFilterData,
		dispatch
	);

	const getOptionsField = (id) => {
		return (
			<Radio
				id={id}
				label={__('Get Options', 'wc-ajax-product-filter')}
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
				options={methodsOfGettingOptions()}
				value={activeFilterData[id]}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderByField = (id, options, isPro = false) => {
		return (
			<ToggleGroup
				id={id}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={activeFilterData[id]}
				onChange={handleToggleGroupChange}
				isPro={isPro}
			/>
		);
	};

	const orderDirectionField = (id) => {
		return (
			<Radio
				id={id}
				label={__('Order Direction', 'wc-ajax-product-filter')}
				description={__(
					'Whether to order options in ascending or descending order.',
					'wc-ajax-product-filter'
				)}
				options={orderDirectionOptions()}
				value={activeFilterData[id]}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderTypeField = (id) => {
		return (
			<Radio
				id={id}
				label={__('Order Type', 'wc-ajax-product-filter')}
				description={__(
					'Whether to arrange the options in alphabetical or numerical order.',
					'wc-ajax-product-filter'
				)}
				options={orderTypeOptions()}
				value={activeFilterData[id]}
				onChange={handleRadioChange}
			/>
		);
	};

	return {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	};
};

export default useFields;
