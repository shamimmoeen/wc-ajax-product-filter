export const initialState = {
	title: '',
	isDirty: false,
};

const filterReducer = (state, action) => {
	switch (action.type) {
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

export default filterReducer;
