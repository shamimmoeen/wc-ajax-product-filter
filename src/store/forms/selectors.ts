import type { State } from './types';

export function getForms( state: State ) {
	return state.forms;
}

export function getFormsCount( state: State ) {
	return state.forms.length;
}
