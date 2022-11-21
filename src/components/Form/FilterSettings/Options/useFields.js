import { __ } from '@wordpress/i18n';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import {
	methodsOfGettingOptions,
	orderDirectionOptions,
	orderTypeOptions,
} from '../../utils';

const useFields = (index) => {
	const { state, dispatch } = useForm();

	const { handleGetOptionsChange, handleRadioChange, handleSelectChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { type: filterType } = filter;

	const getOptionsField = (id) => {
		let description;

		if ('taxonomy' === filterType || 'post-meta' === filterType) {
			description = __(
				'Whether to get the options automatically or you want to add the options manually. <b>Note:</b> For color/image swatches, you need to manually enter the options.'
			);
		} else {
			description = __(
				'Whether to get the options automatically or you want to add the options manually.'
			);
		}

		return (
			<Radio
				id={id}
				index={index}
				label={__('Get Options', 'wc-ajax-product-filter')}
				description={description}
				options={methodsOfGettingOptions()}
				value={filter[id]}
				onChange={handleGetOptionsChange}
			/>
		);
	};

	const orderByField = (id, options, isPro = false) => {
		const value = options.find((option) => option.value === filter[id]);

		return (
			<Select
				id={id}
				index={index}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={value}
				onChange={handleSelectChange}
				renderAsFormField
				isPro={isPro}
			/>
		);
	};

	const orderDirectionField = (id) => {
		return (
			<Radio
				id={id}
				index={index}
				label={__('Order Direction', 'wc-ajax-product-filter')}
				description={__(
					'Whether to order options in ascending or descending order.',
					'wc-ajax-product-filter'
				)}
				options={orderDirectionOptions()}
				value={filter[id]}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderTypeField = (id) => {
		return (
			<Radio
				id={id}
				index={index}
				label={__('Order Type', 'wc-ajax-product-filter')}
				description={__(
					'Whether to arrange the options in alphabetical or numerical order.',
					'wc-ajax-product-filter'
				)}
				options={orderTypeOptions()}
				value={filter[id]}
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
