import apiFetch from '@wordpress/api-fetch';
import { newFilterData } from '../../components/Form/utils';
import type { FormFilter, FormSettings, FilterKey, FilterState } from './types';

export function setFilters( filters: FormFilter[] ) {
	return { type: 'SET_FILTERS' as const, filters };
}

export function updateFilter( index: number, partial: FormFilter ) {
	return { type: 'UPDATE_FILTER' as const, index, partial };
}

export function removeFilter( index: number ) {
	return { type: 'REMOVE_FILTER' as const, index };
}

export function setFormSettings( settings: FormSettings ) {
	return { type: 'SET_FORM_SETTINGS' as const, settings };
}

export function mergeFormSettings( partial: FormSettings ) {
	return { type: 'MERGE_FORM_SETTINGS' as const, partial };
}

export function setFilterKeys( filterKeys: FilterKey[] ) {
	return { type: 'SET_FILTER_KEYS' as const, filterKeys };
}

export function setFilterStates( filterStates: Record< string, FilterState > ) {
	return { type: 'SET_FILTER_STATES' as const, filterStates };
}

export function setFilterState(
	id: string | number,
	partial: Partial< FilterState >,
) {
	return { type: 'SET_FILTER_STATE' as const, id, partial };
}

export function setTitle( title: string ) {
	return { type: 'SET_TITLE' as const, title };
}

export function setShowReviewNotice( show: boolean ) {
	return { type: 'SET_SHOW_REVIEW_NOTICE' as const, show };
}

export function incrementAddFilterIndex() {
	return { type: 'INCREMENT_ADD_FILTER_INDEX' as const };
}

export function setError( error: string ) {
	return { type: 'SET_ERROR' as const, error };
}

export function setDirty( isDirty: boolean ) {
	return { type: 'SET_DIRTY' as const, isDirty };
}

export function setCurrentTab( currentTab: string ) {
	return { type: 'SET_CURRENT_TAB' as const, currentTab };
}

interface ThunkArgs {
	select: {
		isDirty: () => boolean;
		getError: () => string;
		getFilters: () => FormFilter[];
		getAddFilterIndex: () => number;
	};

	dispatch: {
		setFilters: ( filters: FormFilter[] ) => void;
		setFilterKeys: ( filterKeys: FilterKey[] ) => void;
		setFormSettings: ( settings: FormSettings ) => void;
		setFilterState: (
			id: string | number,
			partial: Partial< FilterState >,
		) => void;
		setShowReviewNotice: ( show: boolean ) => void;
		setDirty: ( isDirty: boolean ) => void;
		setError: ( error: string ) => void;
		removeFilter: ( index: number ) => void;
		incrementAddFilterIndex: () => void;
		markDirty: () => void;
	};
}

interface SaveData {
	title: string;
	filters: FormFilter[];
	settings: FormSettings;
}

interface SaveResult {
	filter_keys: FilterKey[];
	filters: FormFilter[];
	settings: FormSettings;
	show_review_notice: boolean;
}

// Marks the form dirty (once) and keeps the external admin's dirty global in
// sync. Shared by the edit hooks and the filter thunks below.
export const markDirty =
	() =>
	( { select, dispatch }: ThunkArgs ) => {
		if ( ! select.isDirty() ) {
			dispatch.setDirty( true );
			wcapf_admin_params.dirty = true;
		}

		if ( select.getError() ) {
			dispatch.setError( '' );
		}
	};

// Appends a new filter (auto-picked available type), expands it, and bumps the
// new-filter index counter.
export const addFilter =
	() =>
	( { select, dispatch }: ThunkArgs ) => {
		const filters = select.getFilters();
		const addFilterIndex = select.getAddFilterIndex();
		const filter = newFilterData( addFilterIndex, filters );

		dispatch.setFilterState( addFilterIndex, {
			accordionStatus: true,
			currentTab: 'general',
		} );
		dispatch.setFilters( [ ...filters, filter ] );
		dispatch.incrementAddFilterIndex();
		dispatch.markDirty();
	};

// Deletes a filter. A saved filter (has an id) is removed server-side first;
// throws on failure so the component can show a notice and reset its busy state.
export const deleteFilter =
	( index: number ) =>
	async ( { select, dispatch }: ThunkArgs ): Promise< void > => {
		const filter = select.getFilters()[ index ];

		if ( filter.id ) {
			await apiFetch( {
				path: `/wcapf/v1/filters/${ filter.id }`,
				method: 'DELETE',
			} );
		}

		dispatch.removeFilter( index );
		dispatch.markDirty();
	};

// Saves the form. On success applies the server's canonical data; on failure it
// throws so the component can map per-filter errors and expand them.
export const saveForm =
	( data: SaveData ) =>
	async ( { dispatch }: ThunkArgs ): Promise< SaveResult > => {
		const result = await apiFetch< SaveResult >( {
			path: `/wcapf/v1/forms/${ wcapf_admin_params.form_data.post_id }`,
			method: 'POST',
			data,
		} );

		dispatch.setFilterKeys( result.filter_keys );
		dispatch.setFilters( result.filters );
		dispatch.setFormSettings( result.settings );
		dispatch.setShowReviewNotice( result.show_review_notice );
		dispatch.setDirty( false );

		return result;
	};
