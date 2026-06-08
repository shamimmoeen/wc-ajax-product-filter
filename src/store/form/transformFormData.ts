import { merge } from 'lodash';
import {
	filterDefaultData,
	proFilterTypes,
	proFilterComponents,
} from '../../components/Form/utils';
import { defaultFormSettings } from '../../components/utilsForForm';
import type { FilterKey, FilterState, FormFilter, FormSettings } from './types';

interface FormData {
	filter_keys?: FilterKey[];
	filters?: FormFilter[];
	settings?: FormSettings;
}

interface TransformedForm {
	filterKeys: FilterKey[];
	filters: FormFilter[];
	filterStates: Record< string, FilterState >;
	formSettings: FormSettings;
}

/**
 * Turns the GET /forms/{id} response into the store's slices: pro-gates filters
 * in free, merges each filter over the field defaults, builds the initial
 * (collapsed, general-tab) filter UI states, and merges settings over defaults.
 */
export default function transformFormData( data: FormData ): TransformedForm {
	const proTypes = proFilterTypes();
	const proComponents = proFilterComponents();

	const filters: FormFilter[] = [];

	for ( const filter of data.filters || [] ) {
		const isPro =
			proTypes.includes( filter.type ) ||
			proComponents.includes( filter.component );

		if ( ! WCAPF_PRO && isPro ) {
			continue;
		}

		filters.push( { ...filterDefaultData(), ...filter } );
	}

	const filterStates: Record< string, FilterState > = {};

	for ( const filter of filters ) {
		filterStates[ filter.id ] = {
			accordionStatus: false,
			currentTab: 'general',
		};
	}

	return {
		filterKeys: data.filter_keys || [],
		filters,
		filterStates,
		formSettings: merge( {}, defaultFormSettings(), data.settings ),
	};
}
