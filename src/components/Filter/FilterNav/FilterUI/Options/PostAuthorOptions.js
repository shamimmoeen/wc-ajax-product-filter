import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import useFields from './useFields';
import { authorLimitByOptions, authorOrderByOptions } from '../../../utils';
import ToggleGroup from '../../../../Field/ToggleGroup';
import SelectMulti from '../../../../Field/SelectMulti';
import Checkbox from '../../../../Field/Checkbox';

const PostAuthorOptions = () => {
	const { state, dispatch } = useFilter();
	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleSelectTermChange,
	} = useFilterData(state, dispatch);

	const { orderByField, orderDirectionField } = useFields();

	const {
		activeFilterData: {
			post_author_order_by,
			limit_options,
			limit_values_by_id,
			exclude_values_id,
			include_user_roles,
			use_store_name,
		},
		additionalData: { user_roles },
	} = state;

	const _orderByField = () => {
		const options = authorOrderByOptions();

		return orderByField('post_author_order_by', options);
	};

	const _orderDirectionField = () => {
		if ('default' !== post_author_order_by) {
			return orderDirectionField('post_author_order_dir');
		}
	};

	const limitOptionsField = () => {
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
	};

	const includeAuthorsField = () => {
		if ('include' === limit_options) {
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
		if ('exclude' === limit_options) {
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
		if ('user_roles' === limit_options) {
			return (
				<SelectMulti
					id={'include_user_roles'}
					label={__('User Roles', 'wc-ajax-product-filter')}
					description={__(
						'Select the roles, matched authors must have at least one of these roles.',
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
		if (wcapf_admin_params.wcfm_marketplace_found) {
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
				/>
			);
		}
	};

	return (
		<>
			{_orderByField()}

			{_orderDirectionField()}

			{limitOptionsField()}

			{includeAuthorsField()}

			{excludeAuthorsField()}

			{userRolesField()}

			{useStoreNames()}
		</>
	);
};

export default PostAuthorOptions;
