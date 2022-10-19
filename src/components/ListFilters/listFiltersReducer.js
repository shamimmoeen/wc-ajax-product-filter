const initialFilters = wcapf_admin_params.filters;

export const initialState = {
	title: '',
	filterType: '',
	filterKeys: {},
	additionalData: {},
	activeFilterData: {},
	filtersData: {},
	filters: initialFilters,
};

const listFiltersReducer = (state, action) => {
	switch (action.type) {
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
