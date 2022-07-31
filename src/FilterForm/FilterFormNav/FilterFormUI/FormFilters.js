import { useState, useEffect } from '@wordpress/element';
import { ReactSortable } from 'react-sortablejs';
import FormFilter from './FormFilter';
import AvailableFilters from './AvailableFilters';
import FormFiltersTitle from './FormFiltersTitle';

export const FormFilters = ({ availableFilters, setAvailableFilters }) => {
	const [searchFilterActive, setSearchFilterActive] = useState(true);
	const [filtersState, setFiltersState] = useState([
		{
			id: '1',
			title: 'Weight',
			filterKey: '_weight',
			editLink: '#',
		},
		{
			id: '2',
			title: 'Reset Filters',
			filterKey: '',
			editLink: '#',
		},
		{
			id: '3',
			title: 'Active Filters',
			filterKey: '',
			editLink: '#',
		},
	]);

	useEffect(() => {
		const _filters = [];

		// const _filters = availableFilters.map((_filter) => {});

		console.log('added');
	}, [availableFilters]);

	return (
		<div className={'__filters_drop_zone'}>
			<FormFiltersTitle
				searchFilterActive={searchFilterActive}
				setSearchFilterActive={setSearchFilterActive}
			/>

			{searchFilterActive ? (
				<AvailableFilters
					availableFilters={availableFilters}
					setAvailableFilters={setAvailableFilters}
				/>
			) : (
				''
			)}

			<ReactSortable
				list={filtersState}
				setList={setFiltersState}
				direction={'vertical'}
				handle='.__fz_drag_handler'
			>
				{filtersState.map((item, key) => (
					<FormFilter key={key} data={item} />
				))}
			</ReactSortable>
		</div>
	);
};

export default FormFilters;
