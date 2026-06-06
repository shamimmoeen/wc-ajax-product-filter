import type { State } from './types';

export function getSettings( state: State ) {
	return state.settings;
}

export function getGlobalFilterKeys( state: State ) {
	return state.globalFilterKeys;
}

export function getFilterKeysChanged( state: State ) {
	return state.filterKeysChanged;
}

export function isDirty( state: State ) {
	return state.isDirty;
}

export function getError( state: State ) {
	return state.saveError;
}
