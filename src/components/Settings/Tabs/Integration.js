import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';

const Integration = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange } = useSettingsData(state, dispatch);

	const {
		settings: {
			active_filters_on_top,
			enable_pagination_via_ajax,
			sorting_control,
			show_sorting_data_in_active_filters,
			use_term_slug,
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
					'Enable this if you want to show the active filters on top of the products, only works on product archive pages.',
					'wc-ajax-product-filter'
				)}
				isChecked={active_filters_on_top}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'enable_pagination_via_ajax'}
				label={__('Pagination via AJAX', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable ajax to paginate the products. Only applicable when filtering via ajax.',
					'wc-ajax-product-filter'
				)}
				isChecked={enable_pagination_via_ajax}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'sorting_control'}
				label={__('Product sorting via AJAX', 'wc-ajax-product-filter')}
				description={__(
					'Whether to enable ajax for the default product sorting dropdown. Only applicable when filtering via ajax.',
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
					'Enable this if you want to show the sort by data comes from the default product sorting dropdown in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_sorting_data_in_active_filters}
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
		</>
	);
};

export default Integration;
