const initialForms = wcapf_admin_params.forms;

export const initialState = {
	forms: initialForms,
};

const listFormsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_FORMS':
			return { ...state, forms: action.payload };

		default:
			return state;
	}
};

export default listFormsReducer;
