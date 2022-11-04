export const initialState = {
	isLoading: true,
	isDirty: false,
	title: '',
	formId: '',
	availableFilters: [],
	formFilters: [],
	formSettings: {},
};

const formReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_FORM_ID':
			return { ...state, formId: action.payload };

		case 'SET_AVAILABLE_FILTERS':
			return { ...state, availableFilters: action.payload };

		case 'SET_FORM_FILTERS':
			return { ...state, formFilters: action.payload };

		case 'SET_FORM_SETTINGS':
			return { ...state, formSettings: action.payload };

		default:
			return state;
	}
};

export default formReducer;
