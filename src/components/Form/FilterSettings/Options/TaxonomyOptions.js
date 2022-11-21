import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import useFields from './useFields';
import { taxonomyLimitByOptions, termsOrderByOptions } from '../../utils';
import ToggleGroup from '../../../Field/ToggleGroup';
import SelectMulti from '../../../Field/SelectMulti';
import Select from '../../../Field/Select';

const TaxonomyOptions = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectChange,
		handleSelectTermChange,
	} = useFormFilterData(state, dispatch);

	const { getOptionsField, orderDirectionField } = useFields(index);

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		taxHierarchical,
		hierarchical,
		taxonomy,
		get_options,
		order_terms_by,
		limit_options,
		parent_term,
		limit_values_by_id,
		limit_values_include_children,
		exclude_values_id,
		exclude_values_include_children,
	} = filter;

	const _orderByField = () => {
		const isHierarchyEnabled = taxHierarchical && '1' === hierarchical;

		let orderByOptions = termsOrderByOptions();
		let options;

		if (isHierarchyEnabled || 'automatically' === get_options) {
			options = orderByOptions.filter(
				(option) => 'entry' !== option.value
			);
		} else {
			options = orderByOptions;
		}

		const value = options.find((option) => option.value === order_terms_by);

		return (
			<Select
				id={'order_terms_by'}
				index={index}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				value={value}
				renderAsFormField
				onChange={handleSelectChange}
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
			const limitByOptions = taxonomyLimitByOptions();

			if (taxHierarchical) {
				const value = limitByOptions.find(
					(option) => option.value === limit_options
				);

				return (
					<Select
						id={'limit_options'}
						index={index}
						label={__('Limit Options', 'wc-ajax-product-filter')}
						description={__(
							'Limit the filter options.',
							'wc-ajax-product-filter'
						)}
						options={limitByOptions}
						value={value}
						onChange={handleSelectChange}
						renderAsFormField
					/>
				);
			} else {
				const notAllowed = ['parent_only', 'child'];

				const options = limitByOptions.filter(
					(option) => !notAllowed.includes(option.value)
				);

				return (
					<ToggleGroup
						id={'limit_options'}
						index={index}
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
		}
	};

	const includeTermsField = () => {
		if ('automatically' === get_options && 'include' === limit_options) {
			return (
				<SelectMulti
					id={'limit_values_by_id'}
					index={index}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={limit_values_by_id}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxHierarchical}
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
					index={index}
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={exclude_values_id}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxHierarchical}
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
			taxHierarchical
		) {
			return (
				<SelectMulti
					id={'parent_term'}
					index={index}
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

	const manualOptions = () => {
		if ('manual_entry' === get_options) {
			return (
				<>
					<ManualOptions index={index} openModal={openModal} />

					<ManualOptionsModal
						index={index}
						open={open}
						closeModal={closeModal}
					/>
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

			{manualOptions()}
		</>
	);
};

export default TaxonomyOptions;
