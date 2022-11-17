import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import useFields from './useFields';
import { authorLimitByOptions, authorOrderByOptions } from '../../../utils';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectMulti from '../../../../Field/SelectMulti';
import Checkbox from '../../../../Field/Checkbox';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import { wcfmFound } from '../../../../utils';

const PostAuthorOptions = () => {
	const { state, dispatch } = useFilter();
	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectTermChange,
	} = useFilterData(state, dispatch);

	const { getOptionsField, orderByField, orderDirectionField } = useFields();

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const {
		activeFilterData: {
			get_options,
			post_author_order_by,
			limit_options,
			limit_values_by_id,
			exclude_values_id,
			include_user_roles,
			use_store_name,
		},
		additionalData: { user_roles },
	} = state;

	useEffect(() => {
		if ('automatically' !== get_options) {
			return;
		}

		if ('entry' === post_author_order_by) {
			handleToggleGroupChange('default', 'post_author_order_by');
		}
	}, [get_options]);

	const _orderByField = () => {
		let _options = authorOrderByOptions();
		let options;

		if ('automatically' === get_options) {
			options = _options.filter((option) => 'entry' !== option.value);
		} else {
			options = _options;
		}

		return orderByField('post_author_order_by', options, true);
	};

	const _orderDirectionField = () => {
		if ('default' !== post_author_order_by) {
			return orderDirectionField('post_author_order_dir');
		}
	};

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			const options = authorLimitByOptions();

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

	const includeAuthorsField = () => {
		if ('automatically' === get_options && 'include' === limit_options) {
			return (
				<SelectMulti
					id={'limit_values_by_id'}
					label={__('Authors to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the authors that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={limit_values_by_id}
					onChange={handleSelectTermChange}
					type={'author'}
				/>
			);
		}
	};

	const excludeAuthorsField = () => {
		if ('automatically' === get_options && 'exclude' === limit_options) {
			return (
				<SelectMulti
					id={'exclude_values_id'}
					label={__('Authors to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the authors that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={exclude_values_id}
					onChange={handleSelectTermChange}
					type={'author'}
				/>
			);
		}
	};

	const userRolesField = () => {
		if ('automatically' === get_options && 'user_roles' === limit_options) {
			return (
				<SelectMulti
					id={'include_user_roles'}
					label={__('User Roles', 'wc-ajax-product-filter')}
					description={__(
						'Select the roles; matched authors must have at least one of these roles.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={include_user_roles}
					onChange={handleSelectTermChange}
					type={'author'}
					isUserRoles={true}
					options={user_roles}
				/>
			);
		}
	};

	const useStoreNames = () => {
		if (wcfmFound()) {
			return (
				<Checkbox
					id={'use_store_name'}
					label={__('Use Store Name', 'wc-ajax-product-filter')}
					description={__(
						'Whether to show the store name as the option label.',
						'wc-ajax-product-filter'
					)}
					isChecked={use_store_name}
					onChange={handleCheckboxChange}
					isPro={true}
				/>
			);
		}
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

			{includeAuthorsField()}

			{excludeAuthorsField()}

			{userRolesField()}

			{useStoreNames()}

			{manualOptions()}
		</>
	);
};

export default PostAuthorOptions;
