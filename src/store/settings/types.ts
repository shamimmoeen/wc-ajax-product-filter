// Loose for now, tighten to be real interface later.
export type Settings = Record< string, any >;

export interface FilterKey {
	secondary_type: string;
	label: string;
	field_key: string;
	_field_key: string;
	field_key_error?: string;
	field_key_error_?: string;
}

export interface State {
	settings: Settings;
	globalFilterKeys: FilterKey[];
	filterKeysChanged: boolean;
	isDirty: boolean;
	saveError: string;
}

export type Action =
	| { type: 'UPDATE_SETTINGS'; settings: Settings }
	| { type: 'MERGE_SETTINGS'; partial: Settings }
	| { type: 'SET_GLOBAL_FILTER_KEYS'; filterKeys: FilterKey[] }
	| { type: 'SET_FILTER_KEYS_CHANGED'; changed: boolean }
	| { type: 'SET_DIRTY'; isDirty: boolean }
	| { type: 'SET_ERROR'; error: string };
