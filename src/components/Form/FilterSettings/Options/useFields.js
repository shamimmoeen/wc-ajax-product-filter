import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { foundProVersion } from '../../../utils';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import {
	authorOrderByOptions,
	authorProOrderByOptions,
	metaValuesOrderByOptions,
	metaValuesProOrderByOptions,
	methodsOfGettingOptions,
	orderDirectionOptions,
	orderTypeOptions,
	termsOrderByOptions,
	termsProOrderByOptions,
} from '../../utils';

const useFields = (index) => {
	const { state, dispatch } = useForm();

	const { handleGetOptionsChange, handleRadioChange, handleSelectChange } =
		useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { get_options } = filter;

	const getOptionsField = (id) => {
		return (
			<Radio
				id={id}
				index={index}
				label={__('Get Options', 'wc-ajax-product-filter')}
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
				options={methodsOfGettingOptions()}
				value={filter[id]}
				onChange={handleGetOptionsChange}
			/>
		);
	};

	const orderByField = (id) => {
		const isManualEntry = 'manual_entry' === get_options;
		let options;
		let proOptions;
		let value;

		if ('order_terms_by' === id) {
			options = termsOrderByOptions(isManualEntry);
			proOptions = termsProOrderByOptions();
		} else if ('options_order_by' === id) {
			options = metaValuesOrderByOptions(isManualEntry);
			proOptions = metaValuesProOrderByOptions();
		} else if ('post_author_order_by' === id) {
			options = authorOrderByOptions(isManualEntry);
			proOptions = authorProOrderByOptions();
		}

		value = options.find((option) => option.value === filter[id]);

		if (!foundProVersion()) {
			if (proOptions.includes(filter[id])) {
				const _proOptions = find(options, { proGroup: true });
				const proOptions = _proOptions.options;

				value = proOptions.find(
					(option) => option.value === filter[id]
				);
			}
		}

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
