import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import SelectMulti from '../../Field/SelectMulti';
import useSettingsData from '../useSettingsData';

const userRoles = wcapf_admin_params.user_roles;

const Integration = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleAuthorRolesChange } = useSettingsData(
		state,
		dispatch
	);

	const {
		settings: {
			disable_ajax,
			enable_pagination_via_ajax,
			sorting_control,
			show_sorting_data_in_active_filters,
			attach_chosen_on_sorting,
			author_roles,
			active_filters_on_top,
		},
	} = state;

	return (
		<>
			{'1' !== disable_ajax && (
				<>
					<Checkbox
						id={'enable_pagination_via_ajax'}
						label={__(
							'Pagination via AJAX',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Whether to enable ajax to paginate the products.',
							'wc-ajax-product-filter'
						)}
						isChecked={enable_pagination_via_ajax}
						onChange={handleCheckboxChange}
					/>

					<Checkbox
						id={'sorting_control'}
						label={__(
							'Product sorting via AJAX',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Whether to enable ajax for the default product sorting dropdown.',
							'wc-ajax-product-filter'
						)}
						isChecked={sorting_control}
						onChange={handleCheckboxChange}
					/>
				</>
			)}

			<Checkbox
				id={'show_sorting_data_in_active_filters'}
				label={__(
					'Sorting data in Active Filters',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Whether to show the sort by data in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_sorting_data_in_active_filters}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'attach_chosen_on_sorting'}
				label={__(
					'ComboBox for sorting dropdown',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Use jQuery Chosen library for the sorting dropdown instead of the native select element.',
					'wc-ajax-product-filter'
				)}
				isChecked={attach_chosen_on_sorting}
				onChange={handleCheckboxChange}
			/>

			<SelectMulti
				id={'author_roles'}
				label={__('Author Roles', 'wc-ajax-product-filter')}
				description={__(
					'Users having any of these roles will be available(on Available Options modal) for post author filter.',
					'wc-ajax-product-filter'
				)}
				isMultiple={true}
				value={author_roles}
				onChange={handleAuthorRolesChange}
				type={'author'}
				isUserRoles={true}
				options={userRoles}
			/>

			<Checkbox
				id={'active_filters_on_top'}
				label={__(
					'Active Filters on top of products',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if you want to show the active filters on top of the products, only works on product archive pages.',
					'wc-ajax-product-filter'
				)}
				isChecked={active_filters_on_top}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default Integration;
