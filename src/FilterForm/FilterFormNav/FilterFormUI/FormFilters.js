import { useState, useEffect } from '@wordpress/element';
import { ReactSortable } from 'react-sortablejs';
import FormFilter from './FormFilter';
import AvailableFilters from './AvailableFilters';
import FormFiltersTitle from './FormFiltersTitle';
import { useFilterForm } from '../../FilterFormContext';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

export const FormFilters = () => {
	const {
		state: { formFilters, _availableFilters },
		dispatch,
	} = useFilterForm();

	const [searchFilterActive, setSearchFilterActive] = useState(false);
	const [filtersState, setFiltersState] = useState(formFilters);

	useEffect(() => {
		if (!searchFilterActive) {
			dispatch({
				type: 'SET_AVAILABLE_FILTERS',
				payload: _availableFilters,
			});
		}
	}, [searchFilterActive]);

	useEffect(() => {
		setFiltersState(formFilters);
	}, [formFilters]);

	const handleSort = () => {
		dispatch({ type: 'UPDATE_FORM_FILTERS', payload: filtersState });
		dispatch({ type: 'SET_DIRTY' });
	};

	return !_availableFilters.length ? (
		<p className='description'>
			{__(
				'No filters found, create some filters before starting the filter form.',
				'wc-ajax-product-filter'
			)}
		</p>
	) : (
		<div className={'__filters_drop_zone'}>
			<FormFiltersTitle
				searchFilterActive={searchFilterActive}
				setSearchFilterActive={setSearchFilterActive}
			/>

			{searchFilterActive ? <AvailableFilters /> : ''}

			{!formFilters.length ? (
				<p className='description'>
					{__('The filter form is empty.', 'wc-ajax-product-filter')}
				</p>
			) : (
				''
			)}

			<ReactSortable
				list={filtersState}
				setList={setFiltersState}
				direction={'vertical'}
				handle='.__fz_drag_handler'
				onSort={handleSort}
			>
				{filtersState.map((item) => (
					<FormFilter key={item.id} data={item} />
				))}
			</ReactSortable>
		</div>
	);
};

export default FormFilters;
