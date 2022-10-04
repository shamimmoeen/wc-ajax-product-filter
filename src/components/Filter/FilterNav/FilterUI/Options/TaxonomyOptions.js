import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import Select from '../../../../Field/Select';
import { useFilter } from '../../../FilterContext';
import {
	termsOrderByOptions,
	orderDirectionOptions,
	taxonomyLimitByOptions,
} from '../../../utils';
import { isEmpty } from 'lodash';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectNew from '../../../../Field/SelectNew';
import SelectNew2 from '../../../../Field/SelectNew2';

const TaxonomyOptions = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { handleRadioChange, handleToggleGroupChange } = useFilterData(
		activeFilterData,
		dispatch
	);

	const { limit_options, order_terms_by, order_terms_dir } = activeFilterData;

	const handleSelectChange = (values, key) => {
		if (isEmpty(values)) {
			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: { ...activeFilterData, [key]: '' },
			});
		} else {
			const { value } = values[0];

			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: { ...activeFilterData, [key]: value },
			});
		}
	};

	const orderByField = () => {
		const options = termsOrderByOptions();

		return (
			<ToggleGroup
				id={'order_terms_by'}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				onChange={handleToggleGroupChange}
				value={order_terms_by}
				isPro={true}
			/>
		);
	};

	const orderDirectionField = () => {
		if ('default' !== order_terms_by) {
			return (
				<Radio
					id={'order_terms_dir'}
					label={__('Order Direction', 'wc-ajax-product-filter')}
					description={__(
						'Whether to order options in ascending or descending order.',
						'wc-ajax-product-filter'
					)}
					options={orderDirectionOptions()}
					value={order_terms_dir}
					onChange={handleRadioChange}
				/>
			);
		}
	};

	const limitOptionsField = () => {
		const options = taxonomyLimitByOptions();

		return (
			<ToggleGroup
				id={'limit_options'}
				label={__('Limit Options', 'wc-ajax-product-filter')}
				description={__(
					'Limit the filter options.',
					'wc-ajax-product-filter'
				)}
				options={options}
				onChange={handleToggleGroupChange}
				value={limit_options}
				isPro={true}
			/>
		);
	};

	const includeTermsField = () => {
		const options = [];
		const value = [];

		if ('include' === limit_options) {
			return (
				<Select
					id={'limit_values_by_id'}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'limit_values_by_id')
					}
				/>
			);
		}
	};

	const excludeTermsField = () => {
		const options = [
			{
				key: 'hello',
				name: 'Hello',
			},
		];

		const value = [{}];

		if ('exclude' === limit_options) {
			return (
				<SelectNew2 />
				// <SelectNew
				// 	id={'exclude_values_id'}
				// 	label={__('Terms to exclude', 'wc-ajax-product-filter')}
				// 	description={__(
				// 		'Select the terms that will be excluded from the filter by options.',
				// 		'wc-ajax-product-filter'
				// 	)}
				// />
				// <Select
				// 	id={'exclude_values_id'}
				// 	label={__('Terms to exclude', 'wc-ajax-product-filter')}
				// 	description={__(
				// 		'Select the terms that will be excluded from the filter by options.',
				// 		'wc-ajax-product-filter'
				// 	)}
				// 	options={options}
				// 	values={value}
				// 	onChange={(values) => console.log(values)}
				// 	// onChange={(values) =>
				// 	// 	handleSelectChange(values, 'exclude_values_id')
				// 	// }
				// />
			);
		}
	};

	const parentTermField = () => {
		if ('child' === limit_options) {
			const options = [
				{
					key: 'hello',
					name: 'Hello',
				},
			];
			const value = [];

			return (
				<Select
					id={'parent_term'}
					label={__('Parent Term', 'wc-ajax-product-filter')}
					description={__(
						'Select the parent term for which child terms will be available to filter the products.',
						'wc-ajax-product-filter'
					)}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'parent_term')
					}
				/>
			);
		}
	};

	return (
		<>
			{orderByField()}

			{orderDirectionField()}

			{limitOptionsField()}

			{includeTermsField()}

			{excludeTermsField()}

			{parentTermField()}
		</>
	);
};

export default TaxonomyOptions;
