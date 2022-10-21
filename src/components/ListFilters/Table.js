import { Button, Icon } from '@wordpress/components';
import { __, sprintf, _n } from '@wordpress/i18n';
import { CodeIcon, DeleteIcon, DuplicateIcon, EditIcon } from '../SVGIcons';
import { prepareFilterData } from '../utils';
import { useListFilters } from './ListFiltersContext';

function slugify(key) {
	return '__' + key.replace(/ /g, '_');
}

const headers = [
	__('Title', 'wc-ajax-product-filter'),
	__('Filter Key', 'wc-ajax-product-filter'),
	__('Filter Type', 'wc-ajax-product-filter'),
	__('Actions', 'wc-ajax-product-filter'),
];

const Table = ({
	openAddNewModal,
	openDeleteModal,
	openDuplicateModal,
	openPublishModal,
	deletingItemId,
	duplicatingItemId,
}) => {
	const {
		state: { filters },
	} = useListFilters();

	const filtersFound = filters.length;

	const tableHeader = () => {
		return (
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
		);
	};

	const tableBody = () =>
		filters.map((_filter) => {
			const filter = prepareFilterData(_filter);

			const filterId = filter.id;
			const filterTitle = filter.title
				? filter.title
				: __('(no title)', 'wc-ajax-product-filter');

			const isDeleting = filterId === deletingItemId;
			const isDuplicating = filterId === duplicatingItemId;

			return (
				<tr key={filterId}>
					<td className='__Title'>
						<a href={filter.permalink} className='__post_title'>
							{filterTitle}
						</a>
						<span className='__post_id'>
							{__('ID', 'wc-ajax-product-filter')}:{` `}
							{filterId}
						</span>
					</td>
					<td className='__Filter_Key'>{filter.filter_key}</td>
					<td className='__Filter_Type'>
						{filter.component}
						{filter.componentExtra && (
							<span className='__component_extra'>
								{` `}
								{filter.componentExtra}
							</span>
						)}
					</td>
					<td className='__Actions'>
						<Button
							icon={DeleteIcon}
							onClick={() => openDeleteModal(filterId)}
							isBusy={isDeleting}
							disabled={isDeleting}
							isSmall
						/>
						<Button
							icon={DuplicateIcon}
							onClick={() => openDuplicateModal(filterId)}
							isBusy={isDuplicating}
							disabled={isDuplicating}
							isSmall
						/>
						<Button
							icon={CodeIcon}
							onClick={() => openPublishModal(filterId)}
							isSmall
						/>
						<Button
							icon={EditIcon}
							href={filter.permalink}
							className='__edit_btn'
							isSmall
						/>
					</td>
				</tr>
			);
		});

	const listTable = () => {
		return (
			<div className='__list_table_responsive_wrapper'>
				<table>
					<thead>{tableHeader()}</thead>
					<tbody>{tableBody()}</tbody>
				</table>
			</div>
		);
	};

	const importContent = () => {
		return (
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
	};

	const listSummary = () => {
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
		<div className='__content'>
			<div className='__list_table_wrapper'>
				<div className='__list_table_header'>
					<h2>{__('List of Filters', 'wc-ajax-product-filter')}</h2>
					<Button variant='primary' onClick={openAddNewModal}>
						{__('Add Filter', 'wc-ajax-product-filter')}
					</Button>
				</div>

				<div className='__list_table_inner'>
					{filtersFound ? listTable() : importContent()}
				</div>

				{listSummary()}
			</div>
		</div>
	);
};

export default Table;
