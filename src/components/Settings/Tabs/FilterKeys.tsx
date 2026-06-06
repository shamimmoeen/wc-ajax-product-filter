import { Icon, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dragHandle } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { ReactSortable } from 'react-sortablejs';
import { useSelect, useDispatch } from '@wordpress/data';
import store from '../../../store/settings';
import useSettingsData from '../useSettingsData';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import Text from '../../Field/Text';
import type { FilterKey } from '../../../store/settings/types';

const sectionDescription = __(
	'Here you can edit the filter keys globally and change the order of those in the URL.',
	'wc-ajax-product-filter',
);

const FilterKey = ( { data, index }: { data: FilterKey; index: number } ) => {
	const { setDirty } = useSettingsData();

	const globalFilterKeys = useSelect(
		( select ) => select( store ).getGlobalFilterKeys(),
		[],
	);

	const { setGlobalFilterKeys, setFilterKeysChanged } = useDispatch( store );

	const {
		secondary_type: type,
		label,
		field_key,
		_field_key: placeholder,
		field_key_error,
		field_key_error_,
	} = data;

	const error = field_key_error ? field_key_error : field_key_error_;

	const handleFilterKeyChange = ( value: string, index: number ) => {
		const filterKey = value;

		const prevData = globalFilterKeys[ index ];

		if ( filterKey === prevData.field_key ) {
			return;
		}

		const _filterKeys = globalFilterKeys.map( ( filterKeyData, _index ) => {
			if ( _index === index ) {
				// Remove both client and server side errors when changed.
				return {
					...filterKeyData,
					field_key: filterKey,
					field_key_error: '',
					field_key_error_: '',
				};
			}

			return filterKeyData;
		} );

		setGlobalFilterKeys( _filterKeys );
		setFilterKeysChanged( true );

		setDirty();
	};

	let inputClasses = 'components-text-control__input';

	if ( error ) {
		inputClasses += ' __has_error';
	}

	return (
		<div className='__filter_key_wrapper' key={ type }>
			{ error && (
				<Notice status='error' isDismissible={ false }>
					{ error }
				</Notice>
			) }

			<div className='__filter_key'>
				<span className='__index'>{ index + 1 }</span>

				<label className='__label' htmlFor={ type }>
					{ label }
				</label>

				<div className='__value'>
					<Text
						id={ type }
						value={ field_key }
						placeholder={ placeholder }
						onChange={ ( value: string ) =>
							handleFilterKeyChange( value, index )
						}
						renderAsFormField={ false }
						customClass={ inputClasses }
						isFilterKey
					/>
				</div>

				<div className='__drag_handle_wrapper'>
					<Icon className='__drag_handler' icon={ dragHandle } />
				</div>
			</div>
		</div>
	);
};

const FilterKeys = () => {
	const { setDirty } = useSettingsData();
	const { setGlobalFilterKeys, setFilterKeysChanged } = useDispatch( store );

	const globalFilterKeys = useSelect(
		( select ) => select( store ).getGlobalFilterKeys(),
		[],
	);
	const saveError = useSelect( ( select ) => select( store ).getError(), [] );

	const setFilterKeys = (
		_filterKeys: FilterKey[],
		sortable: any,
		dragStore: any,
	) => {
		if ( ! WCAPF_PRO ) {
			return;
		}

		if ( ! sortable ) {
			return;
		}

		if ( ! dragStore.dragging ) {
			return;
		}

		setGlobalFilterKeys( _filterKeys );
		setFilterKeysChanged( true );
	};

	const handleSort = () => {
		if ( ! WCAPF_PRO ) {
			return;
		}

		setDirty();
	};

	return (
		<>
			{ ! isEmpty( globalFilterKeys ) && (
				<ProFeaturesNotice
					message={ __(
						'Changing the order of filter keys is a Pro feature.',
						'wc-ajax-product-filter',
					) }
				/>
			) }

			{ saveError && (
				<Notice status='error' isDismissible={ false }>
					{ saveError }
				</Notice>
			) }

			<h4 className='__section_heading'>
				{ __(
					'Global filter keys and order',
					'wc-ajax-product-filter',
				) }
			</h4>

			{ isEmpty( globalFilterKeys ) ? (
				<p className='__description'>
					{ __(
						'Please create some filters first then come back here.',
						'wc-ajax-product-filter',
					) }
				</p>
			) : (
				<>
					<p className='__description'>{ sectionDescription }</p>

					<ReactSortable< any >
						list={ globalFilterKeys }
						setList={ setFilterKeys }
						direction={ 'vertical' }
						handle='.__drag_handler'
						onSort={ handleSort }
						className='__global_filter_keys'
					>
						{ globalFilterKeys.map( ( filterKey, index ) => {
							const { secondary_type } = filterKey;

							return (
								<FilterKey
									data={ filterKey }
									index={ index }
									key={ secondary_type }
								/>
							);
						} ) }
					</ReactSortable>
				</>
			) }
		</>
	);
};

export default FilterKeys;
