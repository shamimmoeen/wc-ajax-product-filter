export const initialState = {
	isDirty: false,
	rules: [],
};

const seoRulesReducer = (state, action) => {
	switch (action.type) {
		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'UPDATE_RULES':
			return { ...state, rules: action.payload };

		default:
			return state;
	}
};

export default seoRulesReducer;
