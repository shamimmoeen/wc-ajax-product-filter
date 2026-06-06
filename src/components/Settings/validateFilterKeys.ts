import { omit, find } from 'lodash';
import { FILTER_KEY_IN_USE_MESSAGE } from '../utils';
import type { FilterKey } from '../../store/settings/types';

export default function validateFilterKeys( globalFilterKeys: FilterKey[] ): {
	isValid: boolean;
	validatedFilterKeys: FilterKey[];
} {
	const validatedFilterKeys: FilterKey[] = [];
	let isValid = true;

	globalFilterKeys.forEach( ( _filterKeyData, index ) => {
		const otherKeys = globalFilterKeys.filter(
			( _data, _index ) => index !== _index,
		);

		const filterKeyData = omit( _filterKeyData, [
			'field_key_error',
			'field_key_error_',
		] ) as FilterKey;

		const { field_key: filterKey } = filterKeyData;

		if ( filterKey && find( otherKeys, { field_key: filterKey } ) ) {
			filterKeyData.field_key_error = FILTER_KEY_IN_USE_MESSAGE;
			isValid = false;
		}

		validatedFilterKeys.push( filterKeyData );
	} );

	return { isValid, validatedFilterKeys };
}
