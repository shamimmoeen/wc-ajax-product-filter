import { createReduxStore, register, dispatch } from '@wordpress/data';
import reducer from './reducer';
import * as selectors from './selectors';
import {
	setForms,
	addForm,
	removeForm,
	createForm,
	createSampleForm,
	deleteForm,
	duplicateForm,
} from './actions';

export const STORE_KEY = 'wcapf/forms';

const actions = {
	setForms,
	addForm,
	removeForm,
	createForm,
	createSampleForm,
	deleteForm,
	duplicateForm,
};

const store = createReduxStore( STORE_KEY, {
	reducer,
	actions,
	selectors,
} );

register( store );

// Seed from the data PHP localizes onto the page (no extra round-trip).
if (
	typeof wcapf_admin_params !== 'undefined' &&
	Array.isArray( wcapf_admin_params.forms )
) {
	dispatch( store ).setForms( wcapf_admin_params.forms );
}

export default store;
