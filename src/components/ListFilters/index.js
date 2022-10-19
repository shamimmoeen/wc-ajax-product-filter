import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
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

	const [addNewModalOpen, setAddNewModalOpen] = useState(false);
	const [deleteModalId, setDeleteModalId] = useState(null);
	const [duplicateModalId, setDuplicateModalId] = useState(null);
	const [publishModalId, setPublishModalId] = useState(null);
	const [deletingItemId, setDeletingItemId] = useState(null);
	const [duplicatingItemId, setDuplicatingItemId] = useState(null);

	const { createSuccessNotice } = useDispatch(noticesStore);

	const handleOpenAddNewModal = () => setAddNewModalOpen(true);

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
					isOpen={addNewModalOpen}
					setAddNewModalOpen={setAddNewModalOpen}
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
