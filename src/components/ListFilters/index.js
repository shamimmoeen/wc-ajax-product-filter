import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import PostTable from '../PostTable';
import { useEffect, useState } from '@wordpress/element';
import { useListFilters } from './ListFiltersContext';
import axios from 'axios';
import { prepareFilterData } from '../utils';
import DeleteModal from './DeleteModal';
import AddNewModal from './AddNewModal';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import Notifications from '../Notifications';
import { DeleteIcon, DuplicateIcon, EditIcon, CodeIcon } from '../SVGIcons';
import TopBar from '../TopBar';
import Sidebar from '../Sidebar';
import DuplicateModal from './DuplicateModal';
import PublishModal from './PublishModal';

const ListFilters = () => {
	const {
		state: { filters },
		dispatch,
	} = useListFilters();

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
	const [publishModalOpen, setPublishModalOpen] = useState(false);

	// TODO: The default number of steps will be 3.
	const [addPostModalOpen, setAddPostModalOpen] = useState(false);
	const [addPostModalStep, setAddPostModalStep] = useState(1);
	const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(2);

	// const [addPostModalOpen, setAddPostModalOpen] = useState(true);
	// const [addPostModalStep, setAddPostModalStep] = useState(3);
	// const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(3);

	const [addPostModalLoading, setAddPostModalLoading] = useState(true);
	const [addPostModalContent, setAddPostModalContent] = useState('');

	const openDeleteModal = () => setDeleteModalOpen(true);
	const closeDeleteModal = () => setDeleteModalOpen(false);

	const openDuplicateModal = () => setDuplicateModalOpen(true);
	const closeDuplicateModal = () => setDuplicateModalOpen(false);

	const openPublishModal = () => setPublishModalOpen(true);
	const closePublishModal = () => setPublishModalOpen(false);

	const openAddPostModal = () => setAddPostModalOpen(true);
	const closeAddPostModal = () => setAddPostModalOpen(false);

	const { createErrorNotice } = useDispatch(noticesStore);

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

	// Reset the add filter modal when closing the modal.
	useEffect(() => {
		if (addPostModalOpen) {
			return;
		}

		setAddPostModalStep(1);
		setAddPostModalTotalSteps(2);
		setAddPostModalLoading(true);
		setAddPostModalContent('');

		dispatch({ type: 'SET_TITLE', payload: '' });
		dispatch({ type: 'SET_FILTER_TYPE', payload: '' });
		dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: {} });
		dispatch({ type: 'SET_FILTER_KEYS', payload: {} });
	}, [addPostModalOpen]);

	const handleAddFilter = () => {
		openAddPostModal();
	};

	const handleOpenDeleteModal = (filter) => {
		openDeleteModal();
		console.log(filter);
	};

	const handleOpenDuplicateModal = (filter) => {
		openDuplicateModal();
	};

	const handleOpenPublishModal = (filter) => {
		openPublishModal();
	};

	const handleCopyShortcode = (filterId) => {
		navigator.clipboard.writeText(`[wcapf_filter id="${filterId}"]`);

		createErrorNotice(
			__('Shortcode copied to clipboard', 'wc-ajax-product-filter'),
			{
				type: 'snackbar',
			}
		);
	};

	const getTableData = () => {
		let html;

		if (filters.length) {
			html = filters.map((filter) => (
				<tr key={filter.id}>
					<td className='__Title'>
						<a href={filter.permalink} className='__post_title'>
							{filter.title}
						</a>
						<span className='__post_id'>
							{__('ID', 'wc-ajax-product-filter')}:{` `}
							{filter.id}
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
							onClick={() => handleOpenDeleteModal(filter)}
						/>
						<Button
							icon={DuplicateIcon}
							onClick={() => handleOpenDuplicateModal(filter)}
						/>
						<Button
							icon={CodeIcon}
							onClick={() => handleOpenPublishModal(filter)}
						/>
						<Button
							icon={EditIcon}
							href={filter.permalink}
							className='__edit_btn'
						/>
					</td>
				</tr>
			));
		} else {
			html = (
				<tr className='__no_results'>
					<td colSpan={5}>
						<p className='description'>
							{__(
								'No matching results found.',
								'wc-ajax-product-filter'
							)}
						</p>
					</td>
				</tr>
			);
		}

		return html;
	};

	const content = (
		<div className='__filter_response'>
			<Icon
				icon={
					<svg viewBox='0 0 24 24'>
						<polyline points='20 6 9 17 4 12'></polyline>
					</svg>
				}
			/>
			<h4>{__('Filter was created', 'wc-ajax-product-filter')}</h4>
			<p className='description'>
				{__(
					'Now you can edit all the settings of this filter.',
					'wc-ajax-product-filter'
				)}
			</p>
			<div className='_buttons'>
				<Button variant='secondary' onClick={closeAddPostModal}>
					{__('Maybe Later', 'wc-ajax-product-filter')}
				</Button>
				<Button variant='primary'>
					{__('Edit Filter', 'wc-ajax-product-filter')}
				</Button>
			</div>
		</div>
	);

	const handleFilterSubmit = () => {
		console.log('submit filter');
		setAddPostModalLoading(true);

		setTimeout(() => {
			setAddPostModalContent(content);
			setAddPostModalLoading(false);
			setAddPostModalStep(addPostModalStep + 1);
		}, 500);
	};

	return (
		<div className='__wcapf_admin'>
			<TopBar view={'filters'} />

			<div className='__wcapf_layout'>
				<div className='__main'>
					<div className='__content'>
						<PostTable
							title={__(
								'List of Filters',
								'wc-ajax-product-filter'
							)}
							addBtnTitle={__(
								'Add Filter',
								'wc-ajax-product-filter'
							)}
							handleAddFilter={handleAddFilter}
							headers={[
								__('Title', 'wc-ajax-product-filter'),
								__('Filter Key', 'wc-ajax-product-filter'),
								__('Filter Type', 'wc-ajax-product-filter'),
								__('Actions', 'wc-ajax-product-filter'),
							]}
							tbody={getTableData}
						/>
					</div>

					<Sidebar />
				</div>

				<AddNewModal
					isOpen={addPostModalOpen}
					closeModal={closeAddPostModal}
					step={addPostModalStep}
					setStep={setAddPostModalStep}
					totalSteps={addPostModalTotalSteps}
					setTotalSteps={setAddPostModalTotalSteps}
					loading={addPostModalLoading}
					setLoading={setAddPostModalLoading}
					handleFilterSubmit={handleFilterSubmit}
					addPostModalContent={addPostModalContent}
				/>

				<DeleteModal
					isOpen={deleteModalOpen}
					closeModal={closeDeleteModal}
				/>

				<DuplicateModal
					isOpen={duplicateModalOpen}
					closeModal={closeDuplicateModal}
				/>

				<PublishModal
					isOpen={publishModalOpen}
					closeModal={closePublishModal}
				/>

				<Notifications />
			</div>
		</div>
	);
};

export default ListFilters;
