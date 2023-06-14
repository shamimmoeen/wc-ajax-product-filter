const title = wcapf_admin_params.form_data['post_title'];
const formId = wcapf_admin_params.form_data['post_id'];
const showReviewNotice =
	wcapf_admin_params.show_review_notice_for_milestone_achieved;

export const initialState = {
	isLoading: true,
	isDirty: false,
	title,
	formId,
	filterKeys: [],
	currentTab: 'filters',
	addFilterIndex: 1,
	filterStates: {},
	formFilters: [],
	formSettings: {},
	saveError: '',
	showReviewNotice,
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

		case 'INCREMENT_ADD_FILTER_INDEX':
			return { ...state, addFilterIndex: state.addFilterIndex + 1 };

		case 'SET_FILTER_STATES':
			return { ...state, filterStates: action.payload };

		case 'SET_FORM_FILTERS':
			return { ...state, formFilters: action.payload };

		case 'SET_FORM_SETTINGS':
			return { ...state, formSettings: action.payload };

		case 'SET_ERROR':
			return { ...state, saveError: action.payload };

		case 'SET_SHOW_REVIEW_NOTICE':
			return { ...state, showReviewNotice: action.payload };

		default:
			return state;
	}
};

export default formReducer;
