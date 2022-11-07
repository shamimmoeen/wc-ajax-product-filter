import { __ } from '@wordpress/i18n';
import { useSettings } from './SettingsContext';
import Text from '../Field/Text';
import Checkbox from '../Field/Checkbox';
import useSettingsData from './useSettingsData';

const Fields = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleRadioChange, handleTextFieldChange } =
		useSettingsData(state, dispatch);

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
			scroll_window,
			scroll_to_top_offset,
			filter_relationships,
			update_count,
			remove_data,
			scroll_window_for,
			scroll_window_when,
			scroll_window_custom_element,
		},
	} = state;

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
					'Whether to show the the default sort by data in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_sorting_data_in_active_filters}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'attach_chosen_on_sorting'}
				label={__(
					'Attach jquery chosen on sorting',
					'wc-ajax-product-filter'
				)}
				isChecked={attach_chosen_on_sorting}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'loading_animation'}
				label={__('Loading Animation', 'wc-ajax-product-filter')}
				isChecked={loading_animation}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default Fields;
