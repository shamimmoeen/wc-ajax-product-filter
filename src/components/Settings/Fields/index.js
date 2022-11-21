import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Text from '../../Field/Text';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Select from '../../Field/Select';
import Number from '../../Field/Number';
import ImagePicker from '../../Field/ImagePicker';
import ScrollWindowTo from './ScrollWindowTo';
import SelectMulti from '../../Field/SelectMulti';

const filterRelationshipOptions = [
	{
		label: __('AND', 'wc-ajax-product-filter'),
		value: 'and',
	},
	{
		label: __('OR', 'wc-ajax-product-filter'),
		value: 'or',
	},
];

const userRoles = wcapf_admin_params.user_roles;

const Fields = () => {
	const { state, dispatch } = useSettings();
	const {
		handleCheckboxChange,
		handleTextFieldChange,
		handleSelectChange,
		handleImageChange,
		handleImageRemove,
		handleAuthorRolesChange,
	} = useSettingsData(state, dispatch);

	const {
		settings: {
			shop_loop_container,
			not_found_container,
			enable_pagination_via_ajax,
			pagination_container,
			sorting_control,
			show_sorting_data_in_active_filters,
			attach_chosen_on_sorting,
			loading_animation,
			loading_image,
			loading_image_src,
			scroll_to_top_offset,
			scroll_window,
			scroll_window_custom_element,
			author_roles,
			filter_relationships,
			update_count,
			remove_data,
		},
	} = state;

	const filterRelationship = filterRelationshipOptions.find(
		(option) => option.value === filter_relationships
	);

	const handleLoaderImageChange = (media) => {
		handleImageChange(media, 'loading_image');
	};

	const handleLoaderImageClear = () => {
		handleImageRemove('loading_image');
	};

	return (
		<>
			<Text
				id={'shop_loop_container'}
				label={__('Shop loop container', 'wc-ajax-product-filter')}
				description={__(
					"The element selector that is holding the shop loop. In most cases, you don't need to change this.",
					'wc-ajax-product-filter'
				)}
				value={shop_loop_container}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'not_found_container'}
				label={__('No products container', 'wc-ajax-product-filter')}
				description={__(
					"The element selector that is holding the no products found message. In most cases, you don't need to change this.",
					'wc-ajax-product-filter'
				)}
				value={not_found_container}
				onChange={handleTextFieldChange}
			/>

			<Checkbox
				id={'enable_pagination_via_ajax'}
				label={__('Pagination via AJAX', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable ajax to paginate the products.',
					'wc-ajax-product-filter'
				)}
				isChecked={enable_pagination_via_ajax}
				onChange={handleCheckboxChange}
			/>

			{'1' === enable_pagination_via_ajax && (
				<Text
					id={'pagination_container'}
					label={__('Pagination container', 'wc-ajax-product-filter')}
					description={__(
						"The element selector that is holding the pagination. In most cases, you don't need to change this.",
						'wc-ajax-product-filter'
					)}
					value={pagination_container}
					onChange={handleTextFieldChange}
				/>
			)}

			<Checkbox
				id={'sorting_control'}
				label={__('Product sorting via AJAX', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable ajax for the default product sorting dropdown.',
					'wc-ajax-product-filter'
				)}
				isChecked={sorting_control}
				onChange={handleCheckboxChange}
			/>

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

			<Checkbox
				id={'loading_animation'}
				label={__('Loading Animation', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show an animation while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				isChecked={loading_animation}
				onChange={handleCheckboxChange}
			/>

			{'1' === loading_animation && (
				<ImagePicker
					id={'loading_image'}
					label={__('Loading Image', 'wc-ajax-product-filter')}
					description={__(
						'Change the default loading image.',
						'wc-ajax-product-filter'
					)}
					imageId={loading_image}
					imageUrl={loading_image_src}
					onChange={handleLoaderImageChange}
					onClear={handleLoaderImageClear}
				/>
			)}

			<ScrollWindowTo />

			{'custom' === scroll_window && (
				<Text
					id={'scroll_window_custom_element'}
					label={__(
						'Custom element identifier',
						'wc-ajax-product-filter'
					)}
					description={__(
						'Give a valid id/class of the HTML element you want to scroll to.',
						'wc-ajax-product-filter'
					)}
					value={scroll_window_custom_element}
					onChange={handleTextFieldChange}
					placeholder={'#id or .class'}
				/>
			)}

			{'none' !== scroll_window && (
				<Number
					id={'scroll_to_top_offset'}
					label={__('Scroll to top offset', 'wc-ajax-product-filter')}
					description={__(
						'You can change this value to adjust the scroll to position, eg: 100.',
						'wc-ajax-product-filter'
					)}
					value={scroll_to_top_offset}
					onChange={handleTextFieldChange}
					type={'number'}
				/>
			)}

			<SelectMulti
				id={'author_roles'}
				label={__('Author Roles', 'wc-ajax-product-filter')}
				description={__(
					'Select the roles; matched authors must have at least one of these roles.',
					'wc-ajax-product-filter'
				)}
				isMultiple={true}
				value={author_roles}
				onChange={handleAuthorRolesChange}
				type={'author'}
				isUserRoles={true}
				options={userRoles}
			/>

			<Select
				id={'filter_relationships'}
				label={__('Filter Relationships', 'wc-ajax-product-filter')}
				description={__(
					'The relationship between filters. AND - products shown will match all filters, OR - products shown will match any of the filters.',
					'wc-ajax-product-filter'
				)}
				value={filterRelationship}
				onChange={handleSelectChange}
				options={filterRelationshipOptions}
				renderAsFormField
			/>

			<Checkbox
				id={'update_count'}
				label={__('Dynamic Product Count', 'wc-ajax-product-filter')}
				description={__(
					'Whether to update the product count number according to the applied filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={update_count}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'remove_data'}
				label={__('Remove Data', 'wc-ajax-product-filter')}
				description={__(
					'Enable this setting to remove all data when uninstalling WC Ajax Product Filter via the `plugins` page.',
					'wc-ajax-product-filter'
				)}
				isChecked={remove_data}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default Fields;
