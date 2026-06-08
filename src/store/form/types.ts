export type FormSettings = Record< string, any >;
export type FormFilter = Record< string, any >;
export type FilterKey = Record< string, any >;

export interface FilterState {
	accordionStatus: boolean;
	currentTab: string;
}

export interface State {
	formFilters: FormFilter[];
	formSettings: FormSettings;
	filterKeys: FilterKey[];
	filterStates: Record< string, FilterState >;
	title: string;
	addFilterIndex: number;
	showReviewNotice: boolean;
	saveError: string;
	isDirty: boolean;
	currentTab: string;
}

export type Action =
	| { type: 'SET_FILTERS'; filters: FormFilter[] }
	| { type: 'UPDATE_FILTER'; index: number; partial: FormFilter }
	| { type: 'REMOVE_FILTER'; index: number }
	| { type: 'SET_FORM_SETTINGS'; settings: FormSettings }
	| { type: 'MERGE_FORM_SETTINGS'; partial: FormSettings }
	| { type: 'SET_FILTER_KEYS'; filterKeys: FilterKey[] }
	| { type: 'SET_FILTER_STATES'; filterStates: Record< string, FilterState > }
	| {
			type: 'SET_FILTER_STATE';
			id: string | number;
			partial: Partial< FilterState >;
	  }
	| { type: 'SET_TITLE'; title: string }
	| { type: 'SET_SHOW_REVIEW_NOTICE'; show: boolean }
	| { type: 'INCREMENT_ADD_FILTER_INDEX' }
	| { type: 'SET_ERROR'; error: string }
	| { type: 'SET_DIRTY'; isDirty: boolean }
	| { type: 'SET_CURRENT_TAB'; currentTab: string };
