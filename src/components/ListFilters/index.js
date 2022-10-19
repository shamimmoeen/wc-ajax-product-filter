import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { useListFilters } from './ListFiltersContext';
import TopBar from '../TopBar';
import Table from './Table';
import Sidebar from '../Sidebar';
import AddNewModal from './AddNewModal';
import DeleteModal from './DeleteModal';
import DuplicateModal from './DuplicateModal';
import PublishModal from './PublishModal';
import Notifications from '../Notifications';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const ListFilters = () => {
	const {
		state: { filters },
		dispatch,
	} = useListFilters();

	const { createSuccessNotice } = useDispatch(noticesStore);

	const [deleteModalId, setDeleteModalId] = useState(null);
	const [duplicateModalId, setDuplicateModalId] = useState(null);
	const [publishModalId, setPublishModalId] = useState(null);
	const [deletingItemId, setDeletingItemId] = useState(null);
	const [duplicatingItemId, setDuplicatingItemId] = useState(null);

	// TODO: The default number of steps will be 3.
	const [addPostModalOpen, setAddPostModalOpen] = useState(false);
	const [addPostModalStep, setAddPostModalStep] = useState(1);
	const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(2);

	// const [addPostModalOpen, setAddPostModalOpen] = useState(true);
	// const [addPostModalStep, setAddPostModalStep] = useState(3);
	// const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(3);

	const [addPostModalLoading, setAddPostModalLoading] = useState(true);
	const [addPostModalContent, setAddPostModalContent] = useState('');

	const handleOpenAddNewModal = () => setAddPostModalOpen(true);
	const handleCloseAddNewModal = () => setAddPostModalOpen(false);

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

	const handleOpenDeleteModal = (id) => {
		setDeleteModalId(id);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalId(null);
	};

	const handleDeleteFilter = () => {
		const id = deleteModalId;

		handleCloseDeleteModal();

		setDeletingItemId(id);

		setTimeout(() => {
			setDeletingItemId(null);

			const _filters = filters.filter((filter) => filter.id !== id);
			dispatch({ type: 'SET_FILTERS', payload: _filters });

			createSuccessNotice('Filter deleted successfully', {
				type: 'snackbar',
				icon: '😵',
				id: 'filter-deleted',
			});
		}, 1000);
	};

	const handleOpenDuplicateModal = (id) => {
		setDuplicateModalId(id);
	};

	const handleCloseDuplicateModal = () => {
		setDuplicateModalId(null);
	};

	const handleDuplicateFilter = () => {
		const id = duplicateModalId;

		handleCloseDuplicateModal();

		setDuplicatingItemId(id);

		setTimeout(() => {
			setDuplicatingItemId(null);

			const _filter = filters.find((filter) => filter.id === id);
			const _filters = [_filter, ...filters];

			dispatch({ type: 'SET_FILTERS', payload: _filters });

			createSuccessNotice('Filter duplicated successfully', {
				type: 'snackbar',
				icon: '🙌',
				id: 'filter-duplicated',
			});
		}, 1000);
	};

	const handleOpenPublishModal = (id) => {
		setPublishModalId(id);
	};

	const handleClosePublishModal = () => {
		setPublishModalId(null);
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
				<Button variant='secondary' onClick={handleCloseAddNewModal}>
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
					<Table
						openAddNewModal={handleOpenAddNewModal}
						openDeleteModal={handleOpenDeleteModal}
						openDuplicateModal={handleOpenDuplicateModal}
						openPublishModal={handleOpenPublishModal}
						deletingItemId={deletingItemId}
						duplicatingItemId={duplicatingItemId}
					/>

					<Sidebar />
				</div>

				<AddNewModal
					isOpen={addPostModalOpen}
					closeModal={handleCloseAddNewModal}
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
					isOpen={deleteModalId}
					closeModal={handleCloseDeleteModal}
					deleteFilter={handleDeleteFilter}
				/>

				<DuplicateModal
					isOpen={duplicateModalId}
					closeModal={handleCloseDuplicateModal}
					duplicateFilter={handleDuplicateFilter}
				/>

				<PublishModal
					isOpen={publishModalId}
					closeModal={handleClosePublishModal}
				/>

				<Notifications />
			</div>
		</div>
	);
};

export default ListFilters;
