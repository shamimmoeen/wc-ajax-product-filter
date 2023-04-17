import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import useFields from './useFields';
import { authorLimitByOptions } from '../../utils';
import ToggleGroup from '../../../Field/ToggleGroup';
import SelectMulti from '../../../Field/SelectMulti';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';

const userRoles = wcapf_admin_params.user_roles;

const PostAuthorOptions = ({ index }) => {
	const { state, dispatch } = useForm();

	const { handleToggleGroupChange, handleSelectTermChange } =
		useFormFilterData(state, dispatch);

	const { getOptionsField, orderByField, orderDirectionField } =
		useFields(index);

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		get_options,
		limit_options,
		include_authors,
		exclude_authors,
		include_user_roles,
	} = filter;

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			const options = authorLimitByOptions();

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
	};

	const includeAuthorsField = () => {
		if ('automatically' === get_options && 'include' === limit_options) {
			return (
				<SelectMulti
					id={'include_authors'}
					index={index}
					label={__('Authors to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the authors that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={include_authors}
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
					id={'exclude_authors'}
					index={index}
					label={__('Authors to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the authors that will be excluded from the filter by options.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={exclude_authors}
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
					index={index}
					label={__('Author Roles', 'wc-ajax-product-filter')}
					description={__(
						'Select the roles; matched authors must have at least one of these roles.',
						'wc-ajax-product-filter'
					)}
					isMultiple={true}
					value={include_user_roles}
					onChange={handleSelectTermChange}
					type={'author'}
					isUserRoles={true}
					options={userRoles}
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

			{orderByField('post_author_order_by')}

			{orderDirectionField('post_author_order_dir')}

			{limitOptionsField()}

			{includeAuthorsField()}

			{excludeAuthorsField()}

			{userRolesField()}

			{manualOptions()}
		</>
	);
};

export default PostAuthorOptions;
