import { Button, Icon } from '@wordpress/components';
import { __, sprintf, _n } from '@wordpress/i18n';
import NoFormsFound from './NoFormsFound';
import {
	CodeIcon,
	DeleteIcon,
	DuplicateIcon,
	EditIcon,
	PlusIcon,
} from '../SVGIcons';
import { slugify } from '../utils';
import { useListForms } from './ListFormsContext';
import { prepareFormData } from './utils';

const headers = [
	__('Title', 'wc-ajax-product-filter'),
	__('Available on', 'wc-ajax-product-filter'),
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
		state: { forms },
	} = useListForms();

	const formsFound = forms.length;

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
		forms.map((_form) => {
			const form = prepareFormData(_form);

			const filterId = form.id;
			const filterTitle = form.title
				? form.title
				: __('(no title)', 'wc-ajax-product-filter');

			const isDeleting = filterId === deletingItemId;
			const isDuplicating = filterId === duplicatingItemId;
			const availableOn = __(
				'All product archive pages',
				'wc-ajax-product-filter'
			);

			return (
				<tr key={filterId}>
					<td className='__Title'>
						<a href={form.editLink} className='__post_title'>
							{filterTitle}
						</a>
						<span className='__post_id'>
							{__('ID', 'wc-ajax-product-filter')}:{` `}
							{filterId}
						</span>
					</td>
					<td className='__Available_on'>{availableOn}</td>
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
							href={form.editLink}
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

	const listSummary = () => {
		if (formsFound) {
			const countResults = sprintf(
				_n(
					'Showing <b>%d</b> result',
					'Showing <b>%d</b> results',
					formsFound,
					'wc-ajax-product-filter'
				),
				formsFound
			);

			return (
				<div className='__list_table_summary'>
					<span dangerouslySetInnerHTML={{ __html: countResults }} />
				</div>
			);
		}
	};

	let content;

	if (formsFound) {
		content = listTable();
	} else {
		content = <NoFormsFound />;
	}

	return (
		<div className='__content'>
			<div className='__list_table_wrapper'>
				<div className='__list_table_header'>
					<h2>{__('List of Forms', 'wc-ajax-product-filter')}</h2>

					<Button variant='primary' onClick={openAddNewModal}>
						<Icon icon={PlusIcon} size={14} />
						{__('Add New', 'wc-ajax-product-filter')}
					</Button>
				</div>

				<div className='__list_table_inner __forms_table'>
					{content}
				</div>

				{listSummary()}
			</div>
		</div>
	);
};

export default Table;
