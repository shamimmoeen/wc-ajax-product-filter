import { createReduxStore, register, dispatch } from '@wordpress/data';
import { merge } from 'lodash';
import reducer from './reducer';
import * as selectors from './selectors';
import {
	updateSettings,
	mergeSettings,
	setGlobalFilterKeys,
	setFilterKeysChanged,
	setDirty,
	setError,
	saveSettings,
} from './actions';

export const STORE_KEY = 'wcapf/settings';

const actions = {
	updateSettings,
	mergeSettings,
	setGlobalFilterKeys,
	setFilterKeysChanged,
	setDirty,
	setError,
	saveSettings,
};

const store = createReduxStore( STORE_KEY, { reducer, actions, selectors } );

register( store );

// Seed from the localized settings: merge over defaults, and keep only valid
// {label,value} author-role options.
if ( typeof wcapf_admin_params !== 'undefined' ) {
	const settings = merge(
		{},
		wcapf_admin_params.default_settings,
		wcapf_admin_params.settings,
	);

	const roles = Array.isArray( settings.author_roles )
		? settings.author_roles.filter(
				( role: any ) => role && 'label' in role && 'value' in role,
		  )
		: [];

	dispatch( store ).updateSettings( { ...settings, author_roles: roles } );
	dispatch( store ).setGlobalFilterKeys(
		wcapf_admin_params.global_filter_keys || [],
	);
}

export default store;
