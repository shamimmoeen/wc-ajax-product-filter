import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import useFields from './useFields';
import { taxonomyLimitByOptions } from '../../utils';
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

	const { getOptionsField, orderByField, orderDirectionField } =
		useFields(index);

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		taxHierarchical,
		taxonomy,
		get_options,
		limit_options,
		include_terms,
		include_child,
		exclude_terms,
		exclude_child,
		parent_term,
		direct_child_only,
	} = filter;

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			if (taxHierarchical) {
				const options = taxonomyLimitByOptions(taxHierarchical, true);
				const value = options.find(
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
						options={options}
						value={value}
						onChange={handleSelectChange}
						renderAsFormField
					/>
				);
			} else {
				const options = taxonomyLimitByOptions();

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
					id={'include_terms'}
					index={index}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={include_terms}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxHierarchical}
					checkboxId={'include_child'}
					checkIsChecked={include_child}
					onCheckChange={handleCheckboxChange}
				/>
			);
		}
	};

	const excludeTermsField = () => {
		if ('automatically' === get_options && 'exclude' === limit_options) {
			return (
				<SelectMulti
					id={'exclude_terms'}
					index={index}
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					taxonomy={taxonomy}
					isMultiple={true}
					value={exclude_terms}
					onChange={handleSelectTermChange}
					showIncludeChildren={taxHierarchical}
					checkboxId={'exclude_child'}
					checkIsChecked={exclude_child}
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
					showIncludeChildren={taxHierarchical}
					checkboxId={'direct_child_only'}
					checkIsChecked={direct_child_only}
					onCheckChange={handleCheckboxChange}
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

			{orderByField('order_terms_by')}

			{orderDirectionField('order_terms_dir')}

			{limitOptionsField()}

			{includeTermsField()}

			{excludeTermsField()}

			{parentTermField()}

			{manualOptions()}
		</>
	);
};

export default TaxonomyOptions;
