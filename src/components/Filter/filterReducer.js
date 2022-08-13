export const initialState = {
	isLoading: true,
	filterType: '',
	activeUIStep: '',
	filterKeys: {},
	additionalData: {},
	activeFilterData: {},
	filtersData: {},
	title: '',
	isDirty: false,
	isFilterOptionsLoading: true,
	doneFetchingFilterOptions: false,
	filterOptions: [],
	filterModalOptions: [],
};

const filterReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: true };

		case 'UNSET_DIRTY':
			return { ...state, isDirty: false };

		case 'SET_FILTER_TYPE':
			return { ...state, filterType: action.payload };

		case 'SET_ACTIVE_UI_STEP':
			return { ...state, activeUIStep: action.payload };

		case 'SET_ACTIVE_FILTER_DATA':
			return { ...state, activeFilterData: action.payload };

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.payload };

		case 'SET_ADDITIONAL_DATA':
			return { ...state, additionalData: action.payload };

		case 'SET_FILTERS_DATA':
			return { ...state, filtersData: action.payload };

		case 'SET_FILTERS_OPTIONS_LOADING':
			return { ...state, isFilterOptionsLoading: action.payload };

		case 'SET_FILTER_OPTIONS_FETCHED':
			return { ...state, doneFetchingFilterOptions: action.payload };

		case 'SET_FILTERS_MODAL_OPTIONS':
			return { ...state, filterModalOptions: action.payload };

		case 'SET_FILTERS_OPTIONS':
			return { ...state, filterOptions: action.payload };

		default:
			return state;
	}
};

export default filterReducer;
