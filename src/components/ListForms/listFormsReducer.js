const initialForms = wcapf_admin_params.forms;

export const initialState = {
	isDirty: false,
	title: '',
	forms: initialForms,
	availableFilters: [],
	formFilters: [],
};

const listFormsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_FORMS':
			return { ...state, forms: action.payload };

		case 'SET_AVAILABLE_FILTERS':
			return { ...state, availableFilters: action.payload };

		case 'SET_FORM_FILTERS':
			return { ...state, formFilters: action.payload };

		default:
			return state;
	}
};

export default listFormsReducer;
