import apiFetch from '@wordpress/api-fetch';
import type { Settings, FilterKey } from './types';

export function updateSettings( settings: Settings ) {
	return { type: 'UPDATE_SETTINGS' as const, settings };
}

export function mergeSettings( partial: Settings ) {
	return { type: 'MERGE_SETTINGS' as const, partial };
}

export function setGlobalFilterKeys( filterKeys: FilterKey[] ) {
	return { type: 'SET_GLOBAL_FILTER_KEYS' as const, filterKeys };
}

export function setFilterKeysChanged( changed: boolean ) {
	return { type: 'SET_FILTER_KEYS_CHANGED' as const, changed };
}

export function setDirty( isDirty: boolean ) {
	return { type: 'SET_DIRTY' as const, isDirty };
}

export function setError( error: string ) {
	return { type: 'SET_ERROR' as const, error };
}

interface SaveData {
	settings: Settings;
	filter_keys: FilterKey[];
	update_filter_keys: string;
}

interface SaveResult {
	settings: Settings;
	global_filter_keys: FilterKey[];
}

interface ThunkContext {
	dispatch: {
		updateSettings: ( settings: Settings ) => void;
		setGlobalFilterKeys: ( filterKeys: FilterKey[] ) => void;
		setFilterKeysChanged: ( changed: boolean ) => void;
		setDirty: ( isDirty: boolean ) => void;
	};
}

// On success, applies the server's canonical settings + keys. On failure it
// throws, so the component can map inline filter-key errors + show a notice.
export const saveSettings =
	( data: SaveData ) =>
	async ( { dispatch }: ThunkContext ): Promise< SaveResult > => {
		const result = await apiFetch< SaveResult >( {
			path: '/wcapf/v1/settings',
			method: 'POST',
			data,
		} );

		dispatch.updateSettings( result.settings );
		dispatch.setGlobalFilterKeys( result.global_filter_keys );
		dispatch.setFilterKeysChanged( false );
		dispatch.setDirty( false );

		return result;
	};
