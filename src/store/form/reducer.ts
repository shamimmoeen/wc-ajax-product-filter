import { omit } from 'lodash';
import { State, Action } from './types';

const DEFAULT_STATE: State = {
	formFilters: [],
	formSettings: {},
	filterKeys: [],
	filterStates: {},
	title: '',
	addFilterIndex: 1,
	showReviewNotice: false,
	saveError: '',
	isDirty: false,
	currentTab: 'filters',
};

export default function reducer(
	state: State = DEFAULT_STATE,
	action: Action,
): State {
	switch ( action.type ) {
		case 'SET_FILTERS':
			return { ...state, formFilters: action.filters };

		case 'UPDATE_FILTER':
			return {
				...state,
				formFilters: state.formFilters.map( ( f, i ) =>
					i === action.index ? { ...f, ...action.partial } : f,
				),
			};

		case 'REMOVE_FILTER': {
			const filter = state.formFilters[ action.index ];
			const filterId = String(
				filter.isNew ? filter.uniqueIndex : filter.id,
			);
			return {
				...state,
				formFilters: state.formFilters.filter(
					( _, i ) => i !== action.index,
				),
				filterStates: omit( state.filterStates, filterId ),
				filterKeys: filter.id
					? state.filterKeys.filter( ( k ) => k.id !== filter.id )
					: state.filterKeys,
			};
		}

		case 'SET_FORM_SETTINGS':
			return { ...state, formSettings: action.settings };

		case 'MERGE_FORM_SETTINGS':
			return {
				...state,
				formSettings: { ...state.formSettings, ...action.partial },
			};

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.filterKeys };

		case 'SET_FILTER_STATES':
			return { ...state, filterStates: action.filterStates };

		case 'SET_FILTER_STATE':
			return {
				...state,
				filterStates: {
					...state.filterStates,
					[ action.id ]: {
						...state.filterStates[ action.id ],
						...action.partial,
					},
				},
			};

		case 'SET_TITLE':
			return { ...state, title: action.title };

		case 'SET_SHOW_REVIEW_NOTICE':
			return { ...state, showReviewNotice: action.show };

		case 'INCREMENT_ADD_FILTER_INDEX':
			return { ...state, addFilterIndex: state.addFilterIndex + 1 };

		case 'SET_ERROR':
			return { ...state, saveError: action.error };

		case 'SET_DIRTY':
			return { ...state, isDirty: action.isDirty };

		case 'SET_CURRENT_TAB':
			return { ...state, currentTab: action.currentTab };

		default:
			return state;
	}
}
