export const initialState = {
	_availableFilters: [],
	availableFilters: [],
	availableFiltersLoading: true,
	formFilters: [],
	formPreviewLoading: true,
	title: '',
	isDirty: false,
};

const filterFormReducer = (state, action) => {
	switch (action.type) {
		case 'SET_BACKUP_AVAILABLE_FILTERS':
			return { ...state, _availableFilters: action.payload };

		case 'SET_AVAILABLE_FILTERS':
			return { ...state, availableFilters: action.payload };

		case 'SET_AVAILABLE_FILTERS_LOADING':
			return { ...state, availableFiltersLoading: action.payload };

		case 'ADD_FORM_FILTER':
			return {
				...state,
				formFilters: [action.payload, ...state.formFilters],
			};

		case 'UPDATE_FORM_FILTERS':
			return { ...state, formFilters: action.payload };

		case 'SET_FORM_DATA':
			return state;

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: true };

		case 'UNSET_DIRTY':
			return { ...state, isDirty: false };

		default:
			return state;
	}
};

export default filterFormReducer;
