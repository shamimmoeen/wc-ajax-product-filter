import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import { useFilter } from '../../../FilterContext';
import {
	termsOrderByOptions,
	orderDirectionOptions,
	taxonomyLimitByOptions,
	getTaxonomy,
} from '../../../utils';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectTerm from '../../../../Field/SelectTerm';

const TaxonomyOptions = () => {
	const {
		state: { filterType, activeFilterData },
		dispatch,
	} = useFilter();

	const {
		handleRadioChange,
		handleToggleGroupChange,
		handleSelectTermChange,
	} = useFilterData(activeFilterData, dispatch);

	const {
		taxonomy,
		order_terms_by,
		order_terms_dir,
		limit_options,
		parent_term,
		limit_values_by_id,
		exclude_values_id,
	} = activeFilterData;

	const taxonomyForSelectTerm = getTaxonomy(filterType, taxonomy);

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
		if ('include' === limit_options) {
			return (
				<SelectTerm
					id={'limit_values_by_id'}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomyForSelectTerm}
					isMultiple={true}
					value={limit_values_by_id}
					onChange={handleSelectTermChange}
				/>
			);
		}
	};

	const excludeTermsField = () => {
		if ('exclude' === limit_options) {
			return (
				<SelectTerm
					id={'exclude_values_id'}
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomyForSelectTerm}
					isMultiple={true}
					value={exclude_values_id}
					onChange={handleSelectTermChange}
				/>
			);
		}
	};

	const parentTermField = () => {
		if ('child' === limit_options) {
			return (
				<SelectTerm
					id={'parent_term'}
					label={__('Parent Term', 'wc-ajax-product-filter')}
					description={__(
						'Select the parent term for which child terms will be available to filter the products.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomyForSelectTerm}
					onlyParent={true}
					value={parent_term}
					onChange={handleSelectTermChange}
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
