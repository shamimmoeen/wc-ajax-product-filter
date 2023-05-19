import { __ } from '@wordpress/i18n';
import { Button, Flex, Icon, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { ReactSortable } from 'react-sortablejs';
import { isEmpty } from 'lodash';
import { useForm } from '../FormContext';
import useFormData from '../useFormData';
import Filter from './Filter';
import NoFiltersFound from './NoFiltersFound';
import { newFilterData } from '../utils';
import V4ReviewFiltersNotice from '../../V4ReviewFiltersNotice';

const FormFilters = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const { addFilterIndex, filterStates, formFilters, saveError } = state;

	const setFormFilters = (_formFilters, sortable, store) => {
		if (!sortable) {
			return;
		}

		if (!store.dragging) {
			return;
		}

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});
	};

	const addFilter = () => {
		const newStates = {
			...filterStates,
			[addFilterIndex]: {
				accordionStatus: true,
				currentTab: 'general',
			},
		};

		dispatch({ type: 'SET_FILTER_STATES', payload: newStates });

		const newFilter = newFilterData(addFilterIndex, formFilters);
		const _formFilters = [...formFilters, newFilter];

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();

		dispatch({ type: 'INCREMENT_ADD_FILTER_INDEX' });
	};

	return (
		<div className='__filters_drop_zone'>
			{isEmpty(formFilters) ? (
				<NoFiltersFound addFilter={addFilter} />
			) : (
				<>
					<V4ReviewFiltersNotice />

					{saveError && (
						<Notice status='error' isDismissible={false}>
							{saveError}
						</Notice>
					)}

					<div className='__filters_list_header'>
						<div className='__title'>
							{__('Title', 'wc-ajax-product-filter')}
						</div>
						<div className='__type'>
							{__('Type', 'wc-ajax-product-filter')}
						</div>
						<div className='__key'>
							{__('Key', 'wc-ajax-product-filter')}
						</div>
						<div className='__display'>
							{__('Display', 'wc-ajax-product-filter')}
						</div>
					</div>

					<ReactSortable
						list={formFilters}
						setList={setFormFilters}
						direction={'vertical'}
						handle='.__drag_handler'
						onSort={setDirty}
						className='__form_filters'
					>
						{formFilters.map((filter, index) => {
							if (filter.isNew) {
								return (
									<Filter
										key={filter.uniqueIndex}
										index={index}
										filter={filter}
									/>
								);
							} else {
								return (
									<Filter
										key={filter.id}
										index={index}
										filter={filter}
									/>
								);
							}
						})}
					</ReactSortable>

					<Flex justify={'flex-end'}>
						<Button
							variant='secondary'
							className='__add_filter_btn'
							onClick={addFilter}
						>
							<Icon icon={plus} />
							{__('Add Filter')}
						</Button>
					</Flex>
				</>
			)}
		</div>
	);
};

export default FormFilters;
