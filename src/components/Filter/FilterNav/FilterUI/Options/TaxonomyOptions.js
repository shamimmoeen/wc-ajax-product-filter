import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import {
	termsOrderByOptions,
	taxonomyLimitByOptions,
	getTaxonomy,
} from '../../../utils';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectMulti from '../../../../Field/SelectMulti';
import Checkbox from '../../../../Field/Checkbox';
import useFields from './useFields';

const TaxonomyOptions = () => {
	const {
		state: { filterType, activeFilterData, additionalData, isDirty },
		dispatch,
	} = useFilter();

	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectTermChange,
	} = useFilterData(activeFilterData, isDirty, dispatch);

	const { orderByField, orderDirectionField } = useFields();

	const {
		taxonomy,
		order_terms_by,
		limit_options,
		parent_term,
		limit_values_by_id,
		exclude_values_id,
		use_term_slug_in_url,
	} = activeFilterData;

	const { taxonomy_hierarchical_data } = additionalData;

	const taxonomyForSelectTerm = getTaxonomy(filterType, taxonomy);

	const isTaxonomyHierarchical = () => {
		let hierarchical;

		if ('product_cat' === taxonomyForSelectTerm) {
			hierarchical = true;
		} else if ('product_tag' === taxonomyForSelectTerm) {
			hierarchical = false;
		} else {
			hierarchical = taxonomy_hierarchical_data[taxonomyForSelectTerm];
		}

		return hierarchical;
	};

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
		const _options = taxonomyLimitByOptions();
		let options;

		if (isTaxonomyHierarchical()) {
			options = _options;
		} else {
			options = _options.filter((option) => 'child' !== option.value);
		}

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
				<SelectMulti
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
				<SelectMulti
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
		if ('child' === limit_options && isTaxonomyHierarchical()) {
			return (
				<SelectMulti
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

	const termSlugField = () => {
		return (
			<Checkbox
				id={'use_term_slug_in_url'}
				label={__('Use Term Slug', 'wc-ajax-product-filter')}
				description={__(
					'Whether to use the term slug instead of id as the option value.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_term_slug_in_url}
				onChange={handleCheckboxChange}
			/>
		);
	};

	return (
		<>
			{_orderByField()}

			{_orderDirectionField()}

			{limitOptionsField()}

			{includeTermsField()}

			{excludeTermsField()}

			{parentTermField()}

			{termSlugField()}
		</>
	);
};

export default TaxonomyOptions;
