export const initialState = {
	isLoading: true,
	activeUIStep: '',
	title: '',
	filterType: '',
	filterId: '',
	activeFilterData: {},
	visibilityRules: {},
	additionalData: {},
	filterKeys: {},
	filtersData: {},
	filterStatus: '',
	isDirty: false,
	loadPreview: true,
	filterPreview: 0,
};

const filterReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_ACTIVE_UI_STEP':
			return { ...state, activeUIStep: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_FILTER_TYPE':
			return { ...state, filterType: action.payload };

		case 'SET_FILTER_ID':
			return { ...state, filterId: action.payload };

		case 'SET_ACTIVE_FILTER_DATA':
			return { ...state, activeFilterData: action.payload };

		case 'SET_ADDITIONAL_DATA':
			return { ...state, additionalData: action.payload };

		case 'SET_VISIBILITY_RULES':
			return { ...state, visibilityRules: action.payload };

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.payload };

		case 'SET_FILTERS_DATA':
			return { ...state, filtersData: action.payload };

		case 'SET_FILTER_STATUS':
			return { ...state, filterStatus: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'SET_LOAD_PREVIEW':
			return { ...state, loadPreview: action.payload };

		case 'SET_FILTER_PREVIEW':
			const count = state.filterPreview;

			return { ...state, filterPreview: count + 1 };

		default:
			return state;
	}
};

export default filterReducer;
