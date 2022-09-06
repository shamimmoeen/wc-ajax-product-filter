import { useState } from '@wordpress/element';
import {
	Button,
	Flex,
	FlexItem,
	Icon,
	SearchControl,
	Spinner,
} from '@wordpress/components';
import { __, sprintf, _n } from '@wordpress/i18n';
import { useListFilters } from './ListFilters/ListFiltersContext';

const PostTable = ({ title, addBtnTitle, handleAddFilter, headers, tbody }) => {
	const {
		state: { isLoading, filters },
	} = useListFilters();
	const [searchInput, setSearchInput] = useState('');

	const filtersFound = filters.length;

	let html;

	if (isLoading) {
		html = <Spinner />;
	} else if (filtersFound) {
		html = (
			<>
				<table className='wp-list-table widefat fixed striped __list_table'>
					<thead>
						<tr>
							{headers.map((item, index) => {
								let _classes = `__${item}`;

								if (0 === index) {
									_classes = 'column-title column-primary';
								}

								return (
									<th
										className={_classes}
										key={`posts-table-${item}`}
									>
										{item}
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>{tbody()}</tbody>
				</table>

				<Flex className='__list_table_footer'>
					<FlexItem>
						<p className='description'>
							{sprintf(
								_n(
									'Showing %d result',
									'Showing %d results',
									filtersFound,
									'wc-ajax-product-filter'
								),
								filtersFound
							)}
						</p>
					</FlexItem>
				</Flex>
			</>
		);
	} else {
		html = (
			<div className='__import_data'>
				<Icon icon={'filter'} />
				<h3>
					{__(
						"You don't have any filters yet.",
						'wc-ajax-product-filter'
					)}
				</h3>
				<p className='description'>
					{__(
						'Do you want to import sample filters? Click on the button below.',
						'wc-ajax-product-filter'
					)}
				</p>
				<Button variant='primary'>
					{__('Import Sample Filters', 'wc-ajax-product-filter')}
				</Button>
			</div>
		);
	}

	return (
		<div className='wrap'>
			<h1>{title}</h1>

			<div className='__list_table_search'>
				<div className='__search_box'>
					<SearchControl
						value={searchInput}
						onChange={setSearchInput}
					/>
				</div>
				<div className=''>
					<Button variant='primary' onClick={handleAddFilter}>
						{addBtnTitle}
					</Button>
				</div>
			</div>

			{html}
		</div>
	);
};

export default PostTable;
