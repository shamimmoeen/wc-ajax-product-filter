const initialSettings = wcapf_admin_params.settings;

export const initialState = {
	isDirty: false,
	settings: initialSettings,
};

const settingsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'UPDATE_SETTINGS':
			return { ...state, settings: action.payload };

		default:
			return state;
	}
};

export default settingsReducer;
