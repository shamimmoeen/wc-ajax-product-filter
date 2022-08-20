export const initialState = {
	isLoading: true,
	isDirty: false,
	filters: [],
};

const listFiltersReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: true };

		case 'UNSET_DIRTY':
			return { ...state, isDirty: false };

		case 'SET_FILTERS':
			return { ...state, filters: action.payload };

		default:
			return state;
	}
};

export default listFiltersReducer;
