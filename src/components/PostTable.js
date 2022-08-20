import { useState } from '@wordpress/element';
import { Button, SearchControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useListFilters } from './ListFilters/ListFiltersContext';

const PostTable = ({ title, addBtnTitle, headers, tbody }) => {
	const {
		state: { isLoading },
	} = useListFilters();
	const [searchInput, setSearchInput] = useState('');

	return (
		<div className='wrap'>
			<h1>{title}</h1>

			{isLoading ? (
				<div className='__list_table_loading'>
					<Spinner />
				</div>
			) : (
				<>
					<div className='__list_table_search'>
						<div className='__search_box'>
							<SearchControl
								value={searchInput}
								onChange={setSearchInput}
							/>
						</div>
						<div className=''>
							<Button variant='primary'>{addBtnTitle}</Button>
						</div>
					</div>
					<table className='wp-list-table widefat fixed striped __list_table'>
						<thead>
							<tr>
								{headers.map((item) => (
									<th
										className={`__${item}`}
										key={`posts-table-${item}`}
									>
										{item}
									</th>
								))}
							</tr>
						</thead>
						<tbody>{tbody()}</tbody>
					</table>
					<p className='description __list_table_results_count'>
						{__('Showing 5 of 5 results', 'wc-ajax-product-filter')}
					</p>
				</>
			)}
		</div>
	);
};

export default PostTable;
