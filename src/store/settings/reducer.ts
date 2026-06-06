import { State, Action } from './types';

const DEFAULT_STATE: State = {
	settings: {},
	globalFilterKeys: [],
	filterKeysChanged: false,
	isDirty: false,
	saveError: '',
};

export default function reducer(
	state: State = DEFAULT_STATE,
	action: Action,
): State {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS':
			return { ...state, settings: action.settings };
		case 'MERGE_SETTINGS':
			return {
				...state,
				settings: { ...state.settings, ...action.partial },
			};
		case 'SET_GLOBAL_FILTER_KEYS':
			return { ...state, globalFilterKeys: action.filterKeys };
		case 'SET_FILTER_KEYS_CHANGED':
			return { ...state, filterKeysChanged: action.changed };
		case 'SET_DIRTY':
			return { ...state, isDirty: action.isDirty };
		case 'SET_ERROR':
			return { ...state, saveError: action.error };
		default:
			return state;
	}
}
