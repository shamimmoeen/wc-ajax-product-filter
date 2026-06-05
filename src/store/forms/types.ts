export interface Form {
	id: number;
	title: string;
	locations?: string; // pro-only; the list table reads it
}

export interface State {
	forms: Form[];
}

export type Action =
	| { type: 'SET_FORMS'; forms: Form[] }
	| { type: 'ADD_FORM'; form: Form }
	| { type: 'REMOVE_FORM'; id: number };
