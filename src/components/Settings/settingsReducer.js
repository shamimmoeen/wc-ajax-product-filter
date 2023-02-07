import { merge } from 'lodash';
import { defaultSettings } from './utils';

const initialSettings = merge(defaultSettings(), wcapf_admin_params.settings);
const globalFilterKeys = wcapf_admin_params.global_filter_keys;

export const initialState = {
	isDirty: false,
	currentTab: 'general',
	settings: initialSettings,
	globalFilterKeys,
	filterKeysChanged: false,
	seoSettings: {}, // TODO: Maybe redundant.
	saveError: '',
};

const settingsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_DIRTY':
			return { ...state, isDirty: action.payload };

		case 'SET_CURRENT_TAB':
			return { ...state, currentTab: action.payload };

		case 'UPDATE_SETTINGS':
			return { ...state, settings: action.payload };

		case 'UPDATE_GLOBAL_FILTER_KEYS':
			return { ...state, globalFilterKeys: action.payload };

		case 'SET_FILTER_KEYS_CHANGED':
			return { ...state, filterKeysChanged: action.payload };

		case 'UPDATE_SEO_SETTINGS':
			return { ...state, seoSettings: action.payload };

		case 'SET_ERROR':
			return { ...state, saveError: action.payload };

		default:
			return state;
	}
};

export default settingsReducer;
