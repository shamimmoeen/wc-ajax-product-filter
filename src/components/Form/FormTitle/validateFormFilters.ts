import { has, isEmpty, omit } from 'lodash';
import {
	getFilterKeyError,
	proFilterComponents,
	proFilterTypes,
} from '../utils';
import { __ } from '@wordpress/i18n';

export default function validateFormFilters(
	formFilters: any[],
	filterKeys: any[],
): {
	isValid: boolean;
	validatedFormFilters: any[];
	invalidFormFilters: any[];
} {
	const validatedFormFilters = [];
	const invalidFormFilters = [];
	let isValid = true;

	const proTypes = proFilterTypes();
	const proComponents = proFilterComponents();

	for ( let index = 0; index < formFilters.length; index++ ) {
		const formFilter = formFilters[ index ];

		const isPro =
			proTypes.includes( formFilter[ 'type' ] ) ||
			proComponents.includes( formFilter[ 'component' ] );

		if ( isPro && ! WCAPF_PRO ) {
			continue;
		}

		const _formFilter = omit( formFilter, [
			'type_error',
			'meta_key_error',
			'field_key_error',
			'field_key_error_',
		] );

		let dataRequired = false;

		if ( isEmpty( _formFilter[ 'type' ] ) ) {
			dataRequired = true;

			_formFilter[ 'type_error' ] = __(
				'Filter type is required.',
				'wc-ajax-product-filter',
			);
		}

		if (
			'post-meta' === _formFilter[ 'type' ] &&
			isEmpty( _formFilter[ 'meta_key' ] )
		) {
			dataRequired = true;

			_formFilter[ 'meta_key_error' ] = __(
				'Meta key is required.',
				'wc-ajax-product-filter',
			);
		}

		const filterKeyError = getFilterKeyError(
			filterKeys,
			formFilter,
			formFilters,
			index,
		);

		if ( filterKeyError ) {
			dataRequired = true;

			_formFilter[ 'field_key_error' ] = filterKeyError;
		}

		if ( dataRequired ) {
			if ( has( _formFilter, 'isNew' ) ) {
				invalidFormFilters.push( _formFilter[ 'uniqueIndex' ] );
			} else {
				invalidFormFilters.push( _formFilter[ 'id' ] );
			}

			isValid = false;
		}

		validatedFormFilters.push( _formFilter );
	}

	return { isValid, validatedFormFilters, invalidFormFilters };
}
