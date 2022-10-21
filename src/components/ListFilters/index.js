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
import axios from 'axios';
import {
	filterDeletedErrorNotice,
	filterDeletedSuccessNotice,
	filterDuplicatedErrorNotice,
	filterDuplicatedSuccessNotice,
	removeCopiedToClipboardNotice,
	removeFilterDeletedNotices,
	removeFilterDuplicatedNotices,
} from '../notices';

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

	const handleOpenAddNewModal = () => {
		removeFilterDeletedNotices();
		removeFilterDuplicatedNotices();

		setAddNewModalOpen(true);
	};

	const handleOpenDeleteModal = (id) => {
		removeFilterDeletedNotices();
		removeFilterDuplicatedNotices();

		setDeleteModalId(id);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalId(null);
	};

	const handleDeleteFilter = () => {
		const id = deleteModalId;

		handleCloseDeleteModal();

		setDeletingItemId(id);

		const formData = new FormData();

		formData.append('action', 'wcapf_delete_filter');
		formData.append('filter_id', id);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setDeletingItemId(null);

				const {
					data: { data: message, success },
				} = res;

				if (success) {
					filterDeletedSuccessNotice(message);

					const _filters = filters.filter(
						(filter) => filter.id !== id
					);

					dispatch({ type: 'SET_FILTERS', payload: _filters });
				} else {
					filterDeletedErrorNotice(message);
				}
			})
			.catch((err) => {
				setDeletingItemId(null);

				filterDeletedErrorNotice(err.message);
			});
	};

	const handleOpenDuplicateModal = (id) => {
		removeFilterDeletedNotices();
		removeFilterDuplicatedNotices();

		setDuplicateModalId(id);
	};

	const handleCloseDuplicateModal = () => {
		setDuplicateModalId(null);
	};

	const handleDuplicateFilter = () => {
		const id = duplicateModalId;

		handleCloseDuplicateModal();

		setDuplicatingItemId(id);

		const formData = new FormData();

		formData.append('action', 'wcapf_duplicate_filter');
		formData.append('filter_id', id);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setDuplicatingItemId(null);

				const {
					data: { data, success },
				} = res;

				if (success) {
					const { message, filter_data: newFilterData } = data;

					filterDuplicatedSuccessNotice(message);

					const _filters = [newFilterData, ...filters];

					dispatch({ type: 'SET_FILTERS', payload: _filters });
				} else {
					filterDuplicatedErrorNotice(data);
				}
			})
			.catch((err) => {
				setDuplicatingItemId(null);

				filterDuplicatedErrorNotice(err.message);
			});
	};

	const handleOpenPublishModal = (id) => {
		removeFilterDeletedNotices();
		removeFilterDuplicatedNotices();

		setPublishModalId(id);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

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
