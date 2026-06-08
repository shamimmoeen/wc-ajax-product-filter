import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import store from '../../../store/form';
import { Button, Flex, Icon, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { ReactSortable } from 'react-sortablejs';
import { isEmpty } from 'lodash';
import Filter from './Filter';
import NoFiltersFound from './NoFiltersFound';
import V4ReviewFiltersNotice from '../../V4ReviewFiltersNotice';

const FormFilters = () => {
	const formFilters = useSelect(
		( select ) => select( store ).getFilters(),
		[],
	);
	const saveError = useSelect( ( select ) => select( store ).getError(), [] );
	const { addFilter, setFilters, markDirty } = useDispatch( store );

	const setFormFilters = (
		_formFilters: any,
		sortable: any,
		dragStore: any,
	) => {
		if ( ! sortable ) {
			return;
		}

		if ( ! dragStore.dragging ) {
			return;
		}

		setFilters( _formFilters );
	};

	return (
		<div className='__filters_drop_zone' id='__filters_drop_zone'>
			{ isEmpty( formFilters ) ? (
				<NoFiltersFound />
			) : (
				<>
					<V4ReviewFiltersNotice />

					{ saveError && (
						<Notice status='error' isDismissible={ false }>
							{ saveError }
						</Notice>
					) }

					<div className='__filters_list_header'>
						<div className='__title'>
							{ __( 'Title', 'wc-ajax-product-filter' ) }
						</div>
						<div className='__type'>
							{ __( 'Type', 'wc-ajax-product-filter' ) }
						</div>
						<div className='__key'>
							{ __( 'Key', 'wc-ajax-product-filter' ) }
						</div>
						<div className='__display'>
							{ __( 'Display', 'wc-ajax-product-filter' ) }
						</div>
					</div>

					<ReactSortable< any >
						list={ formFilters }
						setList={ setFormFilters }
						direction={ 'vertical' }
						handle='.__drag_handler'
						onSort={ markDirty }
						className='__form_filters'
					>
						{ formFilters.map( ( filter: any, index: number ) => {
							const filterId = filter.isNew
								? filter.uniqueIndex
								: filter.id;

							return <Filter key={ filterId } index={ index } />;
						} ) }
					</ReactSortable>

					<Flex justify={ 'flex-end' }>
						<Button
							variant='secondary'
							className='__add_filter_btn'
							onClick={ addFilter }
						>
							<Icon icon={ plus } />
							{ __( 'Add Filter' ) }
						</Button>
					</Flex>
				</>
			) }
		</div>
	);
};

export default FormFilters;
