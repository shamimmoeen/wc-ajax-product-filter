import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import Select from '../../Field/Select';
import useSettingsData from '../useSettingsData';
import { foundProVersion } from '../../utils';

const WCAPF_PRO = foundProVersion();

const sortByFormOptions = wcapf_admin_params.sort_by_form_options;

let sortByFormTooltip;

if (WCAPF_PRO) {
	sortByFormTooltip = __(
		"If the selected form doesn't contain the *Sort By* filter then the default sorting options won't be replaced.",
		'wc-ajax-product-filter'
	);
}

const Integration = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleSelectChange } = useSettingsData(
		state,
		dispatch
	);

	const {
		settings: {
			active_filters_on_top,
			enable_pagination_via_ajax,
			sorting_control,
			sorting_data_in_active_filters,
			replace_sorting_options,
			sort_by_form,
			use_term_slug,
			child_terms_only,
		},
	} = state;

	const sortByForm = sortByFormOptions.find(
		(option) => sort_by_form === option.value
	);

	return (
		<>
			<Checkbox
				id={'active_filters_on_top'}
				label={__(
					'Active Filters on top of products',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this to show the active filters on top of the products loop, only works on product archive pages.',
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
				id={'sorting_data_in_active_filters'}
				label={__(
					'Sorting data in Active Filters',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Enable this if you want to show the sort by data comes from the default product sorting dropdown in active filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={sorting_data_in_active_filters}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'replace_sorting_options'}
				label={__('Replace sorting options', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to replace the default product sorting options.',
					'wc-ajax-product-filter'
				)}
				isChecked={replace_sorting_options}
				onChange={handleCheckboxChange}
				isPro
			/>

			{'1' === replace_sorting_options && (
				<Select
					id={'sort_by_form'}
					label={__('Sort by form', 'wc-ajax-product-filter')}
					description={__(
						'Select the form that contains the <b>Sort By</b> filter with the sorting options you want.',
						'wc-ajax-product-filter'
					)}
					tooltip={sortByFormTooltip}
					value={sortByForm}
					onChange={handleSelectChange}
					options={sortByFormOptions}
					isDisabled={!WCAPF_PRO}
					maxMenuHeight={120}
					renderAsFormField
				/>
			)}

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
		</>
	);
};

export default Integration;
