const title = wcapf_admin_params.form_data['post_title'];
const formId = wcapf_admin_params.form_data['post_id'];

export const initialState = {
	isLoading: true,
	isDirty: false,
	title,
	formId,
	filterKeys: [],
	currentTab: 'filters',
	accordionStates: [],
	formFilters: [],
	formSettings: {},
	saveError: '',
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

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.payload };

		case 'SET_CURRENT_TAB':
			return { ...state, currentTab: action.payload };

		case 'SET_ACCORDION_STATES':
			return { ...state, accordionStates: action.payload };

		case 'SET_FORM_FILTERS':
			return { ...state, formFilters: action.payload };

		case 'SET_FORM_SETTINGS':
			return { ...state, formSettings: action.payload };

		case 'SET_ERROR':
			return { ...state, saveError: action.payload };

		default:
			return state;
	}
};

export default formReducer;
