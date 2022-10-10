import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import {
	termsOrderByOptions,
	taxonomyLimitByOptions,
	getTaxonomy,
} from '../../../utils';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectTerm from '../../../../Field/SelectTerm';
import useFields from './useFields';

const TaxonomyOptions = () => {
	const {
		state: { filterType, activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const { handleToggleGroupChange, handleSelectTermChange } = useFilterData(
		activeFilterData,
		isDirty,
		dispatch
	);

	const { orderByField, orderDirectionField } = useFields();

	const {
		taxonomy,
		order_terms_by,
		limit_options,
		parent_term,
		limit_values_by_id,
		exclude_values_id,
	} = activeFilterData;

	const taxonomyForSelectTerm = getTaxonomy(filterType, taxonomy);

	const _orderByField = () => {
		const options = termsOrderByOptions();
		const isPro = true;

		return orderByField('order_terms_by', options, isPro);
	};

	const _orderDirectionField = () => {
		if ('default' !== order_terms_by) {
			return orderDirectionField('order_terms_dir');
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
			{_orderByField()}

			{_orderDirectionField()}

			{limitOptionsField()}

			{includeTermsField()}

			{excludeTermsField()}

			{parentTermField()}
		</>
	);
};

export default TaxonomyOptions;
