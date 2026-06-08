import { createReduxStore, register, dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
import transformFormData from './transformFormData';
import { getFormFiltersErrorNotice } from '../../components/notices';

export const STORE_KEY = 'wcapf/form';

const resolvers = {
	// Hydrate the editor: fetch the form, transform it, and seed the data
	// slices. Hosted on getFilters, so the load state is this resolver's
	// resolution status (hasFinishedResolution( 'getFilters' )).
	getFilters:
		() =>
		async ( { dispatch: storeDispatch }: any ) => {
			try {
				const id = wcapf_admin_params.form_data.post_id;
				const data = await apiFetch< any >( {
					path: `/wcapf/v1/forms/${ id }`,
				} );

				const { filterKeys, filters, filterStates, formSettings } =
					transformFormData( data );

				storeDispatch.setFilterKeys( filterKeys );
				storeDispatch.setFilterStates( filterStates );
				storeDispatch.setFilters( filters );
				storeDispatch.setFormSettings( formSettings );
			} catch ( err ) {
				getFormFiltersErrorNotice( ( err as Error ).message );
			}
		},
};

const store = createReduxStore( STORE_KEY, {
	reducer,
	actions,
	selectors,
	resolvers,
} );

register( store );

// Seed the synchronously-available localized data (the GET provides the rest
// via the resolver above).
if ( typeof wcapf_admin_params !== 'undefined' ) {
	dispatch( store ).setTitle( wcapf_admin_params.form_data.post_title );
	dispatch( store ).setShowReviewNotice(
		!! wcapf_admin_params.show_review_notice_for_milestone_achieved,
	);
}

export default store;
