import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import Text from '../../Field/Text';
import SelectMulti from '../../Field/SelectMulti';
import useSettingsData from '../useSettingsData';

const userRoles = wcapf_admin_params.user_roles;

const Integration = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleTextFieldChange, handleAuthorRolesChange } = useSettingsData(state, dispatch);

	const {
		settings: {
			active_filters_on_top,
			enable_pagination_via_ajax,
			sorting_control,
			sorting_data_in_active_filters,
			use_term_slug,
			child_terms_only,
			vendor_support,
			pagination_container,
			more_selectors,
			author_roles,
			multiple_form_locations,
		},
	} = state;

	return (
		<>
			<Checkbox
				id={'active_filters_on_top'}
				label={__(
					'Active Filters on top of products',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this to show the active filters on top of the products loop, only works in the standard shop loop.',
					'wc-ajax-product-filter'
				)}
				isChecked={active_filters_on_top}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'enable_pagination_via_ajax'}
				label={__('Pagination via Ajax', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable Ajax to paginate the products. Only applicable when filtering via Ajax.',
					'wc-ajax-product-filter'
				)}
				isChecked={enable_pagination_via_ajax}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'sorting_control'}
				label={__('Product sorting via Ajax', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable Ajax for the default product sorting dropdown. Only applicable when filtering via Ajax.',
					'wc-ajax-product-filter'
				)}
				isChecked={sorting_control}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'sorting_data_in_active_filters'}
				label={__(
					'Sorting data in Active Filters',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if you want to show the sort-by data that comes from the default product sorting dropdown in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={sorting_data_in_active_filters}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'use_term_slug'}
				label={__('Use term slug', 'wc-ajax-product-filter')}
				description={__(
					'Whether to use term slug instead of id as the option value.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_term_slug}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'child_terms_only'}
				label={__('Child terms only', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show only the child terms when viewing a term archive page.',
					'wc-ajax-product-filter'
				)}
				isChecked={child_terms_only}
				onChange={handleCheckboxChange}
				isPro
			/>

			<Checkbox
				id={'vendor_support'}
				label={__('Vendor support', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to show the store name as the option label in the post-author filter.',
					'wc-ajax-product-filter'
				)}
				isChecked={vendor_support}
				onChange={handleCheckboxChange}
				isPro
			/>

			<Text
				id={'pagination_container'}
				label={__('Pagination container', 'wc-ajax-product-filter')}
				description={__(
					"CSS selector of the pagination element. Supports multiple selectors separated by commas. In most cases you don't need to change this. Only applicable when filtering via Ajax.",
					'wc-ajax-product-filter'
				)}
				value={pagination_container}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'more_selectors'}
					label={__('Additional selectors', 'wc-ajax-product-filter')}
					description={__(
						'CSS selectors of additional elements to update after an Ajax filter. Separate multiple selectors with commas.',
						'wc-ajax-product-filter'
					)}
					value={more_selectors}
					onChange={handleTextFieldChange}
					isPro
				/>
			)}

			<SelectMulti
				id={'author_roles'}
				label={__('Post-Author Filter Roles', 'wc-ajax-product-filter')}
				description={__(
					'WordPress user roles whose members will appear in the <b>Available Options</b> picker when setting up a post-author filter.',
					'wc-ajax-product-filter'
				)}
				isMultiple={true}
				value={author_roles}
				onChange={handleAuthorRolesChange}
				type={'author'}
				isUserRoles={true}
				options={userRoles}
				maxMenuHeight={WCAPF_PRO ? 200 : 100}
			/>

			{WCAPF_PRO && (
				<Checkbox
					id={'multiple_form_locations'}
					label={__(
						'Form multiple locations',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Enable this if you want to reuse the same form in multiple locations on a page.',
						'wc-ajax-product-filter'
					)}
					isChecked={multiple_form_locations}
					onChange={handleCheckboxChange}
				/>
			)}
		</>
	);
};

export default Integration;
