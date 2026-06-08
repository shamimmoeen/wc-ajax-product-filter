import type { State } from './types';

export function getFilters( state: State ) {
	return state.formFilters;
}

// Per-filter subscription — a Filter selecting getFilter(index) only re-renders
// when its own filter changes (UPDATE_FILTER keeps other elements' references).
export function getFilter( state: State, index: number ) {
	return state.formFilters[ index ];
}

export function getFormSettings( state: State ) {
	return state.formSettings;
}

export function getFilterKeys( state: State ) {
	return state.filterKeys;
}

export function getFilterStates( state: State ) {
	return state.filterStates;
}

export function getFilterState( state: State, id: string | number ) {
	return state.filterStates[ id ];
}

export function getTitle( state: State ) {
	return state.title;
}

export function getAddFilterIndex( state: State ) {
	return state.addFilterIndex;
}

export function getShowReviewNotice( state: State ) {
	return state.showReviewNotice;
}

export function getError( state: State ) {
	return state.saveError;
}

export function isDirty( state: State ) {
	return state.isDirty;
}

export function getCurrentTab( state: State ) {
	return state.currentTab;
}
