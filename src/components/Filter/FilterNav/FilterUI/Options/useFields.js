import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import ToggleGroup from '../../../../Field/ToggleGroup';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	isTaxonomyFilters,
	methodsOfGettingOptions,
	orderDirectionOptions,
	orderTypeOptions,
} from '../../../utils';

const useFields = () => {
	const { state, dispatch } = useFilter();
	const { handleRadioChange, handleToggleGroupChange } = useFilterData(
		state,
		dispatch
	);

	const { filterType, activeFilterData } = state;

	const getOptionsField = (id) => {
		const { value_type } = activeFilterData;
		let description;
		let version = 'short';

		if ('post-meta' === filterType) {
			version = 'long';
		} else if (isTaxonomyFilters(filterType)) {
			version = 'long';
		} else if ('price' === filterType || 'rating' === filterType) {
			version = 'long-without-color-image';
		} else if ('post-property' === filterType && 'text' === value_type) {
			version = 'long-without-color-image';
		}

		if ('long' === version) {
			description = __(
				'Whether to get the options automatically or you want to add the options manually. <b>Note:</b> For color/image swatches, custom labels, and tooltips, you need to manually enter the options.'
			);
		} else if ('long-without-color-image' === version) {
			description = __(
				'Whether to get the options automatically or you want to add the options manually. <b>Note:</b> For custom labels, and tooltips, you need to manually enter the options.'
			);
		} else {
			description = __(
				'Whether to get the options automatically or you want to add the options manually.'
			);
		}

		return (
			<Radio
				id={id}
				label={__('Get Options', 'wc-ajax-product-filter')}
				description={description}
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
