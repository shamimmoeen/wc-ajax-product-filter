const _activeFilterData = {
	show_title: '1',
	field_key: '',
	taxonomy: '',
	display_type: 'checkbox',
	query_type: 'and',
	all_items_label: '',
	use_chosen: '',
	chosen_no_results_message: '',
	enable_multiple_filter: '',
	show_count: '',
	hide_empty: '',
	enable_tooltip: '',
	show_count_in_tooltip: '',
	tooltip_position: '',
	custom_appearance_options: {},
	use_term_slug_in_url: '',
	limit_options: '',
	parent_term: '',
	limit_values_by_id: '',
	exclude_values_id: '',
	show_clear_button: '',
	order_terms_by: 'name',
	order_terms_dir: 'asc',
	enable_accordion: '',
	accordion_default_state: 'expanded',
	enable_soft_limit: '',
	soft_limit: '',
	type: 'attribute',
	field_id: '',
	enable_visibility_rules: '',
	visibility_rules: [],
	get_options: 'automatically',
};

const _filterType = 'attribute';

const _filterTitle = 'Hello World';

export const initialState = {
	isLoading: true,
	title: _filterTitle,
	filterType: _filterType,
	filterKeys: {},
	additionalData: {},
	activeFilterData: _activeFilterData,
	filtersData: {},
	filters: [],
};

const listFiltersReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_FILTER_TYPE':
			return { ...state, filterType: action.payload };

		case 'SET_ACTIVE_FILTER_DATA':
			return { ...state, activeFilterData: action.payload };

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.payload };

		case 'SET_ADDITIONAL_DATA':
			return { ...state, additionalData: action.payload };

		case 'SET_FILTERS_DATA':
			return { ...state, filtersData: action.payload };

		case 'SET_FILTERS':
			return { ...state, filters: action.payload };

		default:
			return state;
	}
};

export default listFiltersReducer;
