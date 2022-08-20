import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import PostTable from '../PostTable';
import { useEffect } from '@wordpress/element';
import { useListFilters } from './ListFiltersContext';
import axios from 'axios';
import { prepareFilterData } from '../utils';

const ListFilters = () => {
	const {
		state: { isLoading, filters },
		dispatch,
	} = useListFilters();

	const getFilters = () => {
		const data = {
			action: 'get_filters',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	useEffect(() => {
		getFilters()
			.then((res) => {
				const {
					data: { data: _filters },
				} = res;

				const newFilters = [];

				_filters.forEach((filter) => {
					newFilters.push(prepareFilterData(filter));
				});

				dispatch({ type: 'SET_FILTERS', payload: newFilters });

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => console.log(err));
	}, []);

	const getTableData = () => {
		return !isLoading && filters.length ? (
			filters.map((filter) => (
				<tr key={filter.id}>
					<td>
						<a href={filter.permalink} className='row-title'>
							{filter.title}
						</a>
						<div className='__post_id'>
							{__('ID', 'wc-ajax-product-filter')}:{` `}
							{filter.id}
						</div>
					</td>
					<td>{filter.filter_key}</td>
					<td>
						{filter.component}
						{filter.componentExtra && (
							<span className='__component_extra'>
								{` `}
								{filter.componentExtra}
							</span>
						)}
					</td>
					<td>{`[wcapf_filter id="${filter.id}"]`}</td>
					<td>
						<div className='form-buttons'>
							<Button variant='secondary' href={filter.permalink}>
								{__('Edit', 'wc-ajax-product-filter')}
							</Button>
							{` `}
							<Button variant='secondary' isDestructive>
								{__('Delete', 'wc-ajax-product-filter')}
							</Button>
						</div>
					</td>
				</tr>
			))
		) : (
			<tr>
				<td colSpan={5}>
					<p>
						{__(
							'No matching results found.',
							'wc-ajax-product-filter'
						)}
					</p>
				</td>
			</tr>
		);
	};

	return (
		<PostTable
			title={__('List of Filters', 'wc-ajax-product-filter')}
			addBtnTitle={__('Add New Filter', 'wc-ajax-product-filter')}
			headers={[
				__('Title', 'wc-ajax-product-filter'),
				__('Filter Key', 'wc-ajax-product-filter'),
				__('Component', 'wc-ajax-product-filter'),
				__('Shortcode', 'wc-ajax-product-filter'),
				__('Actions', 'wc-ajax-product-filter'),
			]}
			tbody={getTableData}
		/>
	);
};

export default ListFilters;
