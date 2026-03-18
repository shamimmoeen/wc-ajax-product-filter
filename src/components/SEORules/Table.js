import { Button, Icon } from '@wordpress/components';
import { __, sprintf, _n } from '@wordpress/i18n';
import ProFeaturesNotice from '../ProFeaturesNotice';
import { DeleteIcon, EditIcon, PlusIcon } from '../SVGIcons';
import { slugify } from '../utils';
import { useSEORules } from './SEORulesContext';

const headers = [
	__('Title', 'wc-ajax-product-filter'),
	__('Actions', 'wc-ajax-product-filter'),
];

const Table = ({
	openAddNewModal,
	openDeleteModal,
	openPublishModal,
	deletingItemId,
}) => {
	const {
		state: { rules },
	} = useSEORules();

	const rulesFound = rules.length;

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

			const formId = form.id;
			const formTitle = form.title
				? form.title
				: __('(no title)', 'wc-ajax-product-filter');

			const isDeleting = formId === deletingItemId;

			return (
				<tr key={formId}>
					<td className='__Title'>
						<a href={form.editLink} className='__post_title'>
							{formTitle}
						</a>
					</td>
					<td className='__Actions'>
						<Button
							icon={DeleteIcon}
							onClick={() => openDeleteModal(formId)}
							isBusy={isDeleting}
							disabled={isDeleting}
							isSmall
						/>
						<Button
							icon={CodeIcon}
							onClick={openPublishModal}
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
		if (rulesFound) {
			const countResults = sprintf(
				/* translators: %d: number of results found. */
				_n(
					'Showing <b>%d</b> result',
					'Showing <b>%d</b> results',
					rulesFound,
					'wc-ajax-product-filter'
				),
				rulesFound
			);

			return (
				<div className='__list_table_summary'>
					<span dangerouslySetInnerHTML={{ __html: countResults }} />
				</div>
			);
		}
	};

	let content;

	if (rulesFound) {
		content = listTable();
	} else {
		content = <p style={{ margin: 24 }}>Create your first seo rule</p>;
	}

	content = (
		<div style={{ margin: '16px 24px' }}>
			<ProFeaturesNotice
				message={__(
					'SEO Rules are available only at the Pro version.',
					'wc-ajax-product-filter'
				)}
			/>
		</div>
	);

	return (
		<div className='__content'>
			<div className='__list_table_wrapper'>
				<div className='__list_table_header'>
					<h2>{__('List of SEO Rules', 'wc-ajax-product-filter')}</h2>

					<Button
						variant='primary'
						onClick={openAddNewModal}
						disabled={!WCAPF_PRO}
					>
						<Icon icon={PlusIcon} size={14} />
						{__('Add New', 'wc-ajax-product-filter')}
					</Button>
				</div>

				<div className='__list_table_inner __seo_rules_table'>
					{content}
				</div>

				{listSummary()}
			</div>
		</div>
	);
};

export default Table;
