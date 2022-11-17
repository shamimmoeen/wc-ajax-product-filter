import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useFilter } from '../../../FilterContext';
import {
	termsOrderByOptions,
	taxonomyLimitByOptions,
	getTaxonomy,
	isTaxonomyHierarchical,
} from '../../../utils';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectMulti from '../../../../Field/SelectMulti';
import Checkbox from '../../../../Field/Checkbox';
import useFields from './useFields';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';

const TaxonomyOptions = () => {
	const { state, dispatch } = useFilter();
	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectTermChange,
	} = useFilterData(state, dispatch);

	const { getOptionsField, orderDirectionField } = useFields();

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const {
		filterType,
		activeFilterData: {
			hierarchical,
			taxonomy: _taxonomy,
			get_options,
			order_terms_by,
			limit_options,
			parent_term,
			limit_values_by_id,
			limit_values_include_children,
			exclude_values_id,
			exclude_values_include_children,
			use_term_slug_in_url,
		},
		additionalData,
	} = state;

	const taxonomy = getTaxonomy(filterType, _taxonomy);
	const { taxonomy_hierarchical_data: hierarchicalData } = additionalData;
	const taxonomyHierarchical = isTaxonomyHierarchical(
		taxonomy,
		hierarchicalData
	);
	const isHierarchyEnabled = taxonomyHierarchical && '1' === hierarchical;

	useEffect(() => {
		if ('automatically' !== get_options) {
			return;
		}

		if ('entry' === order_terms_by) {
			handleToggleGroupChange('default', 'order_terms_by');
		}
	}, [get_options]);

	const _orderByField = () => {
		let _options = termsOrderByOptions();
		let options;

		if (isHierarchyEnabled || 'automatically' === get_options) {
			options = _options.filter((option) => 'entry' !== option.value);
		} else {
			options = _options;
		}

		return (
			<ToggleGroup
				id={'order_terms_by'}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={order_terms_by}
				onChange={handleToggleGroupChange}
				isPro={true}
			/>
		);
	};

	const _orderDirectionField = () => {
		if ('default' !== order_terms_by) {
			return orderDirectionField('order_terms_dir');
		}
	};

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			const _options = taxonomyLimitByOptions();
			let options;

			if (taxonomyHierarchical) {
				options = _options;
			} else {
				const notAllowed = ['parent_only', 'child'];

				options = _options.filter(
					(option) => !notAllowed.includes(option.value)
				);
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
				/>
			);
		}
	};

	const includeTermsField = () => {
		if ('automatically' === get_options && 'include' === limit_options) {
			return (
				<SelectMulti
					id={'limit_values_by_id'}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={limit_values_by_id}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxonomyHierarchical}
					checkboxId={'limit_values_include_children'}
					checkIsChecked={limit_values_include_children}
					onCheckChange={handleCheckboxChange}
				/>
			);
		}
	};

	const excludeTermsField = () => {
		if ('automatically' === get_options && 'exclude' === limit_options) {
			return (
				<SelectMulti
					id={'exclude_values_id'}
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={exclude_values_id}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxonomyHierarchical}
					checkboxId={'exclude_values_include_children'}
					checkIsChecked={exclude_values_include_children}
					onCheckChange={handleCheckboxChange}
				/>
			);
		}
	};

	const parentTermField = () => {
		if (
			'automatically' === get_options &&
			'child' === limit_options &&
			isTaxonomyHierarchical(taxonomy, hierarchicalData)
		) {
			return (
				<SelectMulti
					id={'parent_term'}
					label={__('Parent Term', 'wc-ajax-product-filter')}
					description={__(
						'Select the parent term for which child terms will be available as filter options.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
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
					'Whether to use term slug instead of id as the option value.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_term_slug_in_url}
				onChange={handleCheckboxChange}
				isPro={true}
			/>
		);
	};

	const manualOptions = () => {
		if ('manual_entry' === get_options) {
			return (
				<>
					<ManualOptions openModal={openModal} />

					<ManualOptionsModal open={open} closeModal={closeModal} />
				</>
			);
		}
	};

	return (
		<>
			{getOptionsField('get_options')}

			{_orderByField()}

			{_orderDirectionField()}

			{limitOptionsField()}

			{includeTermsField()}

			{excludeTermsField()}

			{parentTermField()}

			{termSlugField()}

			{manualOptions()}
		</>
	);
};

export default TaxonomyOptions;
