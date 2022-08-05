export const initialState = {
	filterType: 'attribute',
	filterTypeLabel: 'Attribute',
	filterKey: {
		category: '_color',
	},
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

		case 'SET_FILTER_TYPE':
			return { ...state, filterType: action.payload };

		case 'SET_FILTER_TYPE_LABEL':
			return { ...state, filterTypeLabel: action.payload };

		default:
			return state;
	}
};

export default filterReducer;
