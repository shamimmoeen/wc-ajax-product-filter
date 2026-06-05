import type { State, Action } from './types';

const DEFAULT_STATE: State = { forms: [] };

export default function reducer(
	state: State = DEFAULT_STATE,
	action: Action,
): State {
	switch ( action.type ) {
		case 'SET_FORMS':
			return { ...state, forms: action.forms };
		case 'ADD_FORM':
			return { ...state, forms: [ action.form, ...state.forms ] };
		case 'REMOVE_FORM':
			return {
				...state,
				forms: state.forms.filter( ( form ) => form.id !== action.id ),
			};
		default:
			return state;
	}
}
