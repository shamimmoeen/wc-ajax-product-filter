import { Button, Icon, Spinner } from '@wordpress/components';
import { __, sprintf, _n } from '@wordpress/i18n';
import { useListFilters } from './ListFilters/ListFiltersContext';

function slugify(key) {
	return '__' + key.replace(/ /g, '_');
}

const PostTable = ({ title, addBtnTitle, handleAddFilter, headers, tbody }) => {
	const {
		state: { isLoading, filters },
	} = useListFilters();

	const filtersFound = filters.length;

	let html;

	if (isLoading) {
		html = <Spinner />;
	} else if (filtersFound) {
		html = (
			<div className='__list_table_responsive_wrapper'>
				<table>
					<thead>
						<tr>
							{headers.map((item) => {
								return (
									<th
										className={slugify(item)}
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
			</div>
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

	const tableSummary = () => {
		if (isLoading) {
			return;
		}

		if (filtersFound) {
			const countResults = sprintf(
				_n(
					'Showing <b>%d</b> result',
					'Showing <b>%d</b> results',
					filtersFound,
					'wc-ajax-product-filter'
				),
				filtersFound
			);

			return (
				<div className='__list_table_summary'>
					<span dangerouslySetInnerHTML={{ __html: countResults }} />
				</div>
			);
		}
	};

	return (
		<>
			<div className='__list_table_wrapper'>
				<div className='__list_table_header'>
					<h2>{title}</h2>
					<Button variant='primary' onClick={handleAddFilter}>
						{addBtnTitle}
					</Button>
				</div>

				<div className='__list_table_inner'>{html}</div>

				{tableSummary()}
			</div>
		</>
	);
};

export default PostTable;
